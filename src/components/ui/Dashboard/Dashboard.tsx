'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Package, Sparkles, FileText, AlertCircle, Eye, EyeOff, CloudLightning, Loader2, User, Calendar, FileEdit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { OcfData, PcfData } from '../../../types/carbon';
import { parseOcfCsv, parsePcfCsv } from '../../../lib/csvParser';
import FileUploader from '../FileUploader/FileUploader';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportDocument from '../../pdf/ReportDocument';
import { toPng } from 'html-to-image';
import mappaLogo from '../../../img/mappa.jpg';

import styles from './Dashboard.module.css';

export default function Dashboard() {
  // Pestaña activada: OCF o PCF
  const [activeTab, setActiveTab] = useState<'OCF' | 'PCF'>('OCF');

  // Datos cargados desde CSV y nombres de archivo
  const [ocfData, setOcfData] = useState<OcfData[] | null>(null);
  const [pcfData, setPcfData] = useState<PcfData[] | null>(null);
  const [ocfFileName, setOcfFileName] = useState<string>('');
  const [pcfFileName, setPcfFileName] = useState<string>('');

  // Configuración de visibilidad de secciones
  const [showCharts, setShowCharts] = useState<boolean>(true);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(true);
  const [showDetailedTable, setShowDetailedTable] = useState<boolean>(true);

  // Datos del formulario lateral
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [auditorName, setAuditorName] = useState<string>('Sergi Pérez Marí');
  const [reportingYear, setReportingYear] = useState<string>('2026');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Referencias para capturar gráficos PDF
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const [chartImages, setChartImages] = useState<{ bar?: string; pie?: string }>({});

  // Obtener el primer registro del dataset cargado
  const currentOcf = ocfData && ocfData.length > 0 ? ocfData[0] : null;
  const currentPcf = pcfData && pcfData.length > 0 ? pcfData[0] : null;
  const hasActiveData = activeTab === 'OCF' ? !!currentOcf : !!currentPcf;

  // Función para capturar los gráficos como imágenes
  const captureCharts = async () => {
    if (!showCharts) return;
    try {
      const [barImage, pieImage] = await Promise.all([
        barChartRef.current ? toPng(barChartRef.current, { quality: 0.95, pixelRatio: 2 }) : Promise.resolve(undefined),
        pieChartRef.current ? toPng(pieChartRef.current, { quality: 0.95, pixelRatio: 2 }) : Promise.resolve(undefined)
      ]);
      setChartImages({
        bar: barImage,
        pie: pieImage
      });
    } catch (err) {
      console.error('Error capturing charts:', err);
    }
  };

  // Capturar gráficos cuando los datos o la visibilidad de gráficos cambie
  useEffect(() => {
    if (hasActiveData && showCharts) {
      // Pequeño delay para asegurar que los gráficos se han renderizado
      const timer = setTimeout(() => {
        captureCharts();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasActiveData, showCharts, activeTab, currentOcf, currentPcf]);

  // Limpiar recomendación de IA previa si cambiamos de módulo o de archivo para no mezclar contextos
  useEffect(() => {
    setAiRecommendation('');
  }, [activeTab, ocfFileName, pcfFileName]);

  const handleGenerateAIRecommendation = async () => {
    if (!hasActiveData) return;

    setIsGeneratingAI(true);
    try {
      const activePayload = activeTab === 'OCF' ? currentOcf : currentPcf;

      const response = await fetch('/api/ai-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          data: activePayload,
          customNotes: customNotes
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiRecommendation(result.recommendation);
      } else {
        console.error('Error retrieving structured insights from server.');
      }
    } catch (err) {
      console.error('Network failure connecting to Mappa AI Core:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Estado para manejar el feedback visual
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveReport = async () => {
    setIsSaving(true);

    const isOCF = activeTab === 'OCF';

    const baseUrl = process.env.NEXT_PUBLIC_XANO_API_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:uK5pIZol';

    // Endpoints Xano parametrizados
    const endpoint = isOCF
      ? `${baseUrl}/save_report`
      : `${baseUrl}/save_report_pcf`;

    let entityOrProductVal = "Unspecified";
    if (isOCF && ocfData && ocfData.length > 0) {
      entityOrProductVal = ocfData[0].entity;
    } else if (!isOCF && pcfData && pcfData.length > 0) {
      entityOrProductVal = pcfData[0].product;
    }

    // Payload Xano
    const payload = {
      type: activeTab,
      entityOrProduct: entityOrProductVal,
      configuration: {
        showCharts: showCharts,
        showRecommendations: showRecommendations,
        showDetailedTable: showDetailedTable
      },
      data: isOCF ? (ocfData ? ocfData[0] : {}) : (pcfData ? pcfData[0] : {}),
      updatedBy: auditorName || "Auditor Mappa"
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const textData = await response.text();
      let responseData: any = null;

      if (textData) {
        try {
          responseData = JSON.parse(textData);
        } catch (e) {
          console.log("Response was not valid JSON:", textData);
        }
      }

      if (response.ok) {
        alert(`Report ${activeTab} successfully synchronized with Mappa cloud!`);
      } else {
        console.error("Error returned by Xano:", responseData);
        alert(`Xano rejected data: ${responseData?.message || '400/500 validation error'}`);
      }
    } catch (error: any) {
      console.error("Critical error in request:", error);
      alert(`Process error: ${error.message || error}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className="space-y-5">
          <div className={styles.brandHeader}>
            <div>
              <img
                src={mappaLogo.src} 
                alt="Mappa Corporate Logo" 
                className={styles.mappaLogoSidebar}
              />
            </div>
          </div>

          <div className={styles.tabContainer}>
            <button
              onClick={() => setActiveTab('OCF')}
              className={activeTab === 'OCF' ? styles.tabButtonActive : styles.tabButtonInactive}
            >
              <Building2 className="w-10 h-10" />
              <span>Organisational CF (ISO 14064-1)</span>
            </button>
            <button
              onClick={() => setActiveTab('PCF')}
              className={activeTab === 'PCF' ? styles.tabButtonActive : styles.tabButtonInactive}
            >
              <Package className="w-10 h-10" />
              <span>Product CF (ISO 14067 LCA)</span>
            </button>
          </div>

          <div className="space-y-2">
            {activeTab === 'OCF' ? (
              <FileUploader
                label="Load OCF Inventory (.csv)"
                accept=".csv"
                selectedFileName={ocfFileName}
                onFileSelect={async (file) => {
                  try {
                    const parsed = await parseOcfCsv(file);
                    setOcfData(parsed);
                    setOcfFileName(file.name);
                  } catch (e) {
                    alert('Error parsing ISO 14064-1 structure');
                  }
                }}
              />
            ) : (
              <FileUploader
                label="Load PCF Life Cycle (.csv)"
                accept=".csv"
                selectedFileName={pcfFileName}
                onFileSelect={async (file) => {
                  try {
                    const parsed = await parsePcfCsv(file);
                    setPcfData(parsed);
                    setPcfFileName(file.name);
                  } catch (e) {
                    alert('Error parsing ISO 14067 LCA structure');
                  }
                }}
              />
            )}
          </div>

          <div className="space-y-2.5">
            <h3 className={styles.sectionTitle}><strong>Layout Parameters</strong></h3>
            <div className={styles.configCard}>
              <div className={styles.interactiveRow}>
                <span className="text-xs font-medium text-zinc-300">Distribution Charts</span>
                <button onClick={() => setShowCharts(!showCharts)} className="p-1 rounded">
                  {showCharts ? <Eye className="w-4 h-4 text-[#fca65e]" /> : <EyeOff className="w-4 h-4 text-zinc-600" />}
                </button>
              </div>
              <div className={styles.interactiveRow}>
                <span className="text-xs font-medium text-zinc-300">Mappa AI-Advisor Block</span>
                <button onClick={() => setShowRecommendations(!showRecommendations)} className="p-1 rounded">
                  {showRecommendations ? <Eye className="w-4 h-4 text-[#fca65e]" /> : <EyeOff className="w-4 h-4 text-zinc-600" />}
                </button>
              </div>
              <div className={styles.interactiveRow}>
                <span className="text-xs font-medium text-zinc-300">Inventory Table</span>
                <button onClick={() => setShowDetailedTable(!showDetailedTable)} className="p-1 rounded">
                  {showDetailedTable ? <Eye className="w-4 h-4 text-[#fca65e]" /> : <EyeOff className="w-4 h-4 text-zinc-600" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className={styles.sectionTitle}><strong>AI Coprocessor</strong></h3>
            <div className={styles.configCard}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}><User className="w-3 h-3" /> Lead Environmental Auditor</label>
                <input type="text" value={auditorName} onChange={(e) => setAuditorName(e.target.value)} className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}><Calendar className="w-3 h-3" /> Reporting Fiscal Year</label>
                <input type="text" value={reportingYear} onChange={(e) => setReportingYear(e.target.value)} className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}><FileEdit className="w-3 h-3" /> Context Directives (Optional)</label>
                <textarea placeholder="E.g., Note: As per guidelines, Romania (RLEE) site is excluded..." value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} rows={2} className={styles.formTextArea} />
              </div>
              <button onClick={handleGenerateAIRecommendation} disabled={!hasActiveData || isGeneratingAI} className={styles.btnAiAdvisor}>
                {isGeneratingAI ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Footprint...</> : aiRecommendation ? <><Sparkles className="w-3.5 h-3.5" /> Insight Generated</> : <><Sparkles className="w-3.5 h-3.5" /> Run Mappa AI-Advisor</>}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          {hasActiveData ? (
            <>
              <PDFDownloadLink
                document={
                  <ReportDocument
                    type={activeTab}
                    data={activeTab === 'OCF' ? (ocfData ? ocfData[0] : null) : (pcfData ? pcfData[0] : null)}
                    config={{ showCharts, showDetailedTable, showRecommendations }}
                    aiRecommendation={aiRecommendation}
                    auditorName={auditorName}
                    reportingYear={reportingYear}
                    customNotes={customNotes}
                    chartImages={chartImages}
                  />
                }
                fileName={`Mappa_Report_${activeTab}_Relats_${reportingYear}.pdf`}
              >
                {({ loading }) => (
                  <button className={styles.btnPdfExport}>
                    <FileText className="w-4 h-4" />
                    {loading ? 'Compiling PDF Schema...' : 'Export Verified PDF Report'}
                  </button>
                )}
              </PDFDownloadLink>
              <button onClick={handleSaveReport} disabled={isSaving} className={styles.btnXanoSync}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudLightning className="w-4 h-4" />}
                {isSaving ? 'Syncing with Backend...' : 'Sync Data to Cloud'}
              </button>
            </>
          ) : (
            <button disabled className={styles.waitingDatasetBox}>
              <FileText className="w-4 h-4" /> Awaiting Source CSV Ingestion
            </button>
          )}
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className={styles.mainLayout}>
        <div className={styles.contentViewport}>
          <div className={styles.paperSheet}>
            {!hasActiveData ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-800">No Industrial Dataset Mounted</h4>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">Please ingest an official carbon ledger using the sidebar configuration menu to populate the preview canvas.</p>
              </div>
            ) : (
              <>
                <div className={styles.reportHeaderBlock}>
                  <div>
                    <h2 className={styles.reportTitleText}>{activeTab === 'OCF' ? 'ORGANISATIONAL CARBON REPORT' : 'PRODUCT CARBON FOOTPRINT REPORT'}</h2>
                    <p className={styles.reportSubText}>{activeTab === 'OCF' ? `ISO 14064-1 · ${currentOcf?.entity}` : `ISO 14067 LCA · ${currentPcf?.product}`}</p>
                    <p className="text-[8px] text-zinc-500 mt-1">Reporting Period: <span className="font-bold text-zinc-800">{reportingYear}</span> | Lead Auditor: <span className="font-bold text-zinc-800">{auditorName}</span></p>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded px-2.5 py-1 text-[8px] font-bold text-zinc-400">
                    <span>RELATS S.A.U.</span>
                    <div className="w-px h-3 bg-zinc-300"></div>
                    <span>MAPPA INSIGHTS</span>
                  </div>
                </div>

                <div className={styles.kpiGrid}>
                  {activeTab === 'OCF' && currentOcf && (
                    <>
                      <div className={styles.kpiCardDark}><span className={styles.kpiLabelDark}>Total Carbon</span><span className={styles.kpiValueDark}>{currentOcf.total_emissions.toLocaleString('de-DE')} t</span></div>
                      <div className={styles.kpiCardLight}><span className={styles.kpiLabel}>Scope 1 (Direct)</span><span className={styles.kpiValue}>{currentOcf.total_scope_1.toLocaleString('de-DE')} t</span></div>
                      <div className={styles.kpiCardLight}><span className={styles.kpiLabel}>Scope 2 (Indirect)</span><span className={styles.kpiValue}>{currentOcf.total_scope_2.toLocaleString('de-DE')} t</span></div>
                      <div className={styles.kpiCardLight}><span className={styles.kpiLabel}>Scope 3 (Chain)</span><span className={styles.kpiValue}>{currentOcf.total_scope_3.toLocaleString('de-DE')} t</span></div>
                    </>
                  )}
                  {activeTab === 'PCF' && currentPcf && (
                    <>
                      <div className={styles.kpiCardDark}><span className={styles.kpiLabelDark}>LCA Intensity</span><span className={styles.kpiValueDark}>{currentPcf.total_emissions.toLocaleString('de-DE')} g</span></div>
                      <div className={styles.kpiCardLight}><span className={styles.kpiLabel}>Materials Stage</span><span className={styles.kpiValue}>{currentPcf.total_materials.toLocaleString('de-DE')} g</span></div>
                      <div className={styles.kpiCardLight}><span className={styles.kpiLabel}>Manufacturing Load</span><span className={styles.kpiValue}>{currentPcf.total_manufacturing.toLocaleString('de-DE')} g</span></div>
                      <div className={styles.kpiCardLight}><span className={styles.kpiLabel}>Logistics Line</span><span className={styles.kpiValue}>{currentPcf.total_transport.toLocaleString('de-DE')} g</span></div>
                    </>
                  )}
                </div>

                {showCharts && (
                  <div className="grid grid-cols-2 gap-4 border border-zinc-100 rounded-xl p-4 bg-zinc-50/50 mb-6">
                    <div>
                      <h4 className="text-[9px] font-bold text-zinc-800 uppercase tracking-wide mb-2">Primary Emissions Inventory</h4>
                      <div ref={barChartRef} className="h-40 text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={activeTab === 'OCF' && currentOcf ? [{ name: 'Scope 1', value: currentOcf.total_scope_1 }, { name: 'Scope 2', value: currentOcf.total_scope_2 }, { name: 'Scope 3', value: currentOcf.total_scope_3 }] : currentPcf ? [{ name: 'Materials', value: currentPcf.total_materials }, { name: 'Mfg', value: currentPcf.total_manufacturing }, { name: 'Logistics', value: currentPcf.total_transport }] : []}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={9} tickLine={false} width={30} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              <Cell fill="#0D2C54" /><Cell fill="#C3002F" /><Cell fill="#64748B" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[9px] font-bold text-zinc-800 uppercase tracking-wide mb-2">Proportional Share Matrix</h4>
                      <div ref={pieChartRef} className="h-40 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={activeTab === 'OCF' && currentOcf ? [{ name: 'Scope 1', value: currentOcf.total_scope_1 }, { name: 'Scope 2', value: currentOcf.total_scope_2 }, { name: 'Scope 3', value: currentOcf.total_scope_3 }] : currentPcf ? [{ name: 'Materials', value: currentPcf.total_materials }, { name: 'Mfg', value: currentPcf.total_manufacturing }, { name: 'Logistics', value: currentPcf.total_transport }] : []} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                              <Cell fill="#0D2C54" /><Cell fill="#C3002F" /><Cell fill="#E2E8F0" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {showDetailedTable && (
                  <div className="mb-6">
                    <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0D2C54] mb-2">Emissions Inventory Breakdown</h4>
                    <table className={styles.tableIndustrial}>
                      <thead>
                        <tr className="bg-[#0D2C54] text-white font-bold">
                          <th className="p-1.5 rounded-l">Operational Category & Scope Sources</th>
                          <th className="p-1.5 text-right rounded-r">{activeTab === 'OCF' ? 'tCO2e' : 'gCO2e'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {activeTab === 'OCF' && currentOcf ? (
                          <>
                            <tr><td className="p-1.5 text-zinc-600 font-medium">Scope 1.1 Stationary Combustion (Boilers & Thermal Systems)</td><td className="p-1.5 text-right font-bold text-zinc-900">{currentOcf.scope_1_1_stationary_combustion.toLocaleString('de-DE')}</td></tr>
                            <tr><td className="p-1.5 text-zinc-600 font-medium">Scope 1.3 Industrial Process & Fugitive Emissions</td><td className="p-1.5 text-right font-bold text-zinc-900">{currentOcf.scope_1_3_process_emissions.toLocaleString('de-DE')}</td></tr>
                            <tr><td className="p-1.5 text-zinc-600 font-medium">Scope 2.1 Purchased Grid Electricity (High-Voltage Manufacturing)</td><td className="p-1.5 text-right font-bold text-zinc-900">{currentOcf.scope_2_1_1_purchased_electricity.toLocaleString('de-DE')}</td></tr>
                            <tr><td className="p-1.5 text-zinc-600 font-medium">Scope 3.1 Procurement of Raw Materials & Technical Yarns</td><td className="p-1.5 text-right font-bold text-zinc-900">{currentOcf.scope_3_1_1_raw_materials_or_auxiliary_materials.toLocaleString('de-DE')}</td></tr>
                          </>
                        ) : currentPcf && (
                          <>
                            <tr><td className="p-1.5 text-zinc-600 font-medium">Phase 1.1 Direct Baseline Raw Materials Extraction</td><td className="p-1.5 text-right font-bold text-zinc-900">{currentPcf['1_1_raw_materials'].toLocaleString('de-DE')}</td></tr>
                            <tr><td className="p-1.5 text-zinc-600 font-medium">Phase 2.1 Manufacturing Plant Electrical Grid Infrastructure</td><td className="p-1.5 text-right font-bold text-zinc-900">{currentPcf['2_1_electricity_use_in_manufacturing'].toLocaleString('de-DE')}</td></tr>
                            <tr><td className="p-1.5 text-zinc-600 font-medium">Phase 3.1 Inbound Sourcing Logistics & Material Transportation</td><td className="p-1.5 text-right font-bold text-zinc-900">{currentPcf['3_1_transport_of_materials'].toLocaleString('de-DE')}</td></tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {showRecommendations && (
                  <div className={styles.aiAdvisorBox}>
                    <div className={styles.aiAdvisorTitle}><Sparkles className="w-3.5 h-3.5" /> MAPPA AI-ADVISOR · STRATEGIC RECOMMENDATION</div>
                    <p className={styles.aiAdvisorText}>{aiRecommendation || (activeTab === 'OCF' ? "Scope 3 constitutes the absolute majority of environmental impact for Relats S.A.U., driven heavily by technical yarns and purchased polymers. Operational priority must center on accelerating the transition to 100% renewable electricity contracts (PPAs) across all industrial sites." : "The carbon core of high-performance families like Shockshield and VSC25 is concentrated within the raw materials stage. It is recommended to establish local European or North American supply structures for key materials to cut down long-distance logistics emissions.")}</p>
                  </div>
                )}
              </>
            )}

            <div className={styles.reportFooterBlock}>
              <span>Powered by Footprint Mappa © 2026</span>
              <span className={styles.confidentialText}>Documento Confidencial Industrial</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}