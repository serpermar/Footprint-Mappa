import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { OcfData, PcfData } from '../../types/carbon';
import relatsLogo from '../../img/relats.png';
import mappaLogo from '../../img/mappa.jpg';
import { pdfStyles } from './ReportDocument.styles';

// Props del componente
interface ReportDocumentProps {
  type: 'OCF' | 'PCF';
  data: OcfData | PcfData | null;
  config: {
    showCharts: boolean;
    showDetailedTable: boolean;
    showRecommendations: boolean;
  };
  aiRecommendation?: string;
  auditorName?: string;
  reportingYear?: string;
  customNotes?: string;
  chartImages?: {
    bar?: string;
    pie?: string;
  };
}

// Genera el documento PDF del reporte de huella de carbono
export default function ReportDocument({
  type,
  data,
  config,
  aiRecommendation,
  auditorName,
  reportingYear,
  customNotes,
  chartImages,
}: ReportDocumentProps) {
  const isOcf = type === 'OCF';
  const currentDate = new Date().toLocaleDateString('de-DE');

  const ocfData = isOcf ? (data as OcfData) : null;
  const pcfData = !isOcf ? (data as PcfData) : null;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* ========== HEADER========== */}
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerLeft}>
            <Text style={pdfStyles.title}>
              {isOcf ? 'Carbon Footprint Report' : 'Product Lifecycle LCA Report'}
            </Text>
            <Text style={pdfStyles.subtitle}>
              {isOcf
                ? `Perimeter: ${ocfData?.entity || 'All Sites'}`
                : `Product Family: ${pcfData?.product || 'Technical Solutions'}`}
            </Text>
          </View>
          <View style={pdfStyles.headerLogos}>
            <Image src={relatsLogo.src} style={pdfStyles.logoImg} />
            <Image src={mappaLogo.src} style={pdfStyles.logoImg} />
          </View>
        </View>

        {!data ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={pdfStyles.placeholderText}>
              No dataset loaded. Please upload a valid CSV template in the dashboard platform.
            </Text>
          </View>
        ) : isOcf ? (
          // ==========================================
          // ========== VISTA OCF ==========
          // ==========================================
          <>
            <View style={pdfStyles.gridContainer}>
              <View style={[pdfStyles.card, { borderLeftColor: '#0D2C54' }]}>
                <Text style={pdfStyles.cardLabel}>Scope 1 (Direct)</Text>
                <Text style={pdfStyles.cardValue}>
                  {(ocfData?.total_scope_1 ?? 0).toLocaleString('de-DE')} t
                </Text>
              </View>
              <View style={[pdfStyles.card, { borderLeftColor: '#475569' }]}>
                <Text style={pdfStyles.cardLabel}>Scope 2 (Indirect)</Text>
                <Text style={pdfStyles.cardValue}>
                  {(ocfData?.total_scope_2 ?? 0).toLocaleString('de-DE')} t
                </Text>
              </View>
              <View style={[pdfStyles.card, { borderLeftColor: '#C3002F' }]}>
                <Text style={pdfStyles.cardLabel}>Scope 3 (Value Chain)</Text>
                <Text style={pdfStyles.cardValue}>
                  {(ocfData?.total_scope_3 ?? 0).toLocaleString('de-DE')} t
                </Text>
              </View>
            </View>

            {config.showCharts && (
              <>
                <Text style={pdfStyles.sectionTitle}>Emissions Structure Baseline</Text>
                <View style={pdfStyles.chartsFlexRow}>
                  {chartImages?.bar ? (
                    <Image src={chartImages.bar} style={{ flex: 1, height: 100, objectFit: 'contain' }} />
                  ) : (
                    <View style={pdfStyles.chartPlaceholder}>
                      <Text style={pdfStyles.placeholderText}>
                        [ Recharts Distribution Equivalent: Total Sustainability Impact{' '}
                        {(ocfData?.total_emissions ?? 0).toLocaleString('de-DE')} tCO2e ]
                      </Text>
                    </View>
                  )}
                  {chartImages?.pie && (
                    <Image src={chartImages.pie} style={{ flex: 1, height: 100, objectFit: 'contain' }} />
                  )}
                </View>
              </>
            )}

            {config.showDetailedTable && (
              <>
                <Text style={pdfStyles.sectionTitle}>
                  ISO 14064-1 Emissions Inventory Breakdown
                </Text>
                <View style={pdfStyles.table}>
                  <View style={pdfStyles.tableHeader}>
                    <Text style={[pdfStyles.tableHeaderCell, pdfStyles.cellDescription]}>
                      Operational Category & Scope Sources
                    </Text>
                    <Text style={[pdfStyles.tableHeaderCell, pdfStyles.cellValue]}>
                      tCO2e
                    </Text>
                  </View>
                  <View style={pdfStyles.tableRow}>
                    <Text style={pdfStyles.cellDescription}>
                      Scope 1.1 Stationary Combustion (Boilers & Thermal Systems)
                    </Text>
                    <Text style={pdfStyles.cellValue}>
                      {(ocfData?.scope_1_1_stationary_combustion ?? 0).toLocaleString('de-DE')}
                    </Text>
                  </View>
                  <View style={pdfStyles.tableRow}>
                    <Text style={pdfStyles.cellDescription}>
                      Scope 1.3 Industrial Process & Fugitive Emissions
                    </Text>
                    <Text style={pdfStyles.cellValue}>
                      {(ocfData?.scope_1_3_process_emissions ?? 0).toLocaleString('de-DE')}
                    </Text>
                  </View>
                  <View style={pdfStyles.tableRow}>
                    <Text style={pdfStyles.cellDescription}>
                      Scope 2.1 Purchased Grid Electricity (High-Voltage Manufacturing)
                    </Text>
                    <Text style={pdfStyles.cellValue}>
                      {(ocfData?.scope_2_1_1_purchased_electricity ?? 0).toLocaleString('de-DE')}
                    </Text>
                  </View>
                  <View style={pdfStyles.tableRow}>
                    <Text style={pdfStyles.cellDescription}>
                      Scope 3.1 Procurement of Raw Materials & Technical Yarns
                    </Text>
                    <Text style={pdfStyles.cellValue}>
                      {(ocfData?.scope_3_1_1_raw_materials_or_auxiliary_materials ?? 0).toLocaleString('de-DE')}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {config.showRecommendations && (
              <View style={pdfStyles.recommendationBox}>
                <Text style={pdfStyles.recommendationTitle}>
                  Mappa AI-Advisor · Strategic Decarbonization Action Plan
                </Text>
                <Text style={pdfStyles.recommendationText}>
                  {aiRecommendation || "Scope 3 constitutes the absolute majority of environmental impact for Relats S.A.U., driven heavily by technical yarns and purchased polymers. Operational priority must center on accelerating the transition to 100% renewable electricity contracts (PPAs) across all industrial sites, replicating the successful models already implemented at the Caldes (Spain) and China facilities."}
                </Text>
              </View>
            )}
          </>
        ) : (
          // ==========================================
          // ========== VISTA PCF ==========
          // ==========================================
          <>
            <View style={pdfStyles.gridContainer}>
              <View style={[pdfStyles.card, { borderLeftColor: '#0D2C54' }]}>
                <Text style={pdfStyles.cardLabel}>Upstream Materials</Text>
                <Text style={pdfStyles.cardValue}>
                  {(pcfData?.total_materials ?? 0).toLocaleString('de-DE')} kg
                </Text>
              </View>
              <View style={[pdfStyles.card, { borderLeftColor: '#475569' }]}>
                <Text style={pdfStyles.cardLabel}>Plant Manufacturing</Text>
                <Text style={pdfStyles.cardValue}>
                  {(pcfData?.total_manufacturing ?? 0).toLocaleString('de-DE')} kg
                </Text>
              </View>
              <View style={[pdfStyles.card, { borderLeftColor: '#C3002F' }]}>
                <Text style={pdfStyles.cardLabel}>Logistics & Transport</Text>
                <Text style={pdfStyles.cardValue}>
                  {(pcfData?.total_transport ?? 0).toLocaleString('de-DE')} kg
                </Text>
              </View>
            </View>

            {config.showCharts && (
              <>
                <Text style={pdfStyles.sectionTitle}>Product Life Cycle Distribution</Text>
                <View style={pdfStyles.chartsFlexRow}>
                  {chartImages?.bar ? (
                    <Image src={chartImages.bar} style={{ flex: 1, height: 100, objectFit: 'contain' }} />
                  ) : (
                    <View style={pdfStyles.chartPlaceholder}>
                      <Text style={pdfStyles.placeholderText}>
                        [ Cradle-to-Gate Footprint: {(pcfData?.total_emissions ?? 0).toLocaleString('de-DE')} tCO2e per Functional Unit ]
                      </Text>
                    </View>
                  )}
                  {chartImages?.pie && (
                    <Image src={chartImages.pie} style={{ flex: 1, height: 100, objectFit: 'contain' }} />
                  )}
                </View>
              </>
            )}

            {config.showDetailedTable && (
              <>
                <Text style={pdfStyles.sectionTitle}>ISO 14067 LCA Carbon Intensities</Text>
                <View style={pdfStyles.table}>
                  <View style={pdfStyles.tableHeader}>
                    <Text style={[pdfStyles.tableHeaderCell, pdfStyles.cellDescription]}>
                      Lifecycle Assessment Stage (Cradle-to-Gate)
                    </Text>
                    <Text style={[pdfStyles.tableHeaderCell, pdfStyles.cellValue]}>
                      kg CO2e
                    </Text>
                  </View>
                  <View style={pdfStyles.tableRow}>
                    <Text style={pdfStyles.cellDescription}>
                      Phase 1: Raw Polymer & Base Fiber Extraction
                    </Text>
                    <Text style={pdfStyles.cellValue}>
                      {(pcfData?.['1_1_raw_materials'] ?? 0).toLocaleString('de-DE')}
                    </Text>
                  </View>
                  <View style={pdfStyles.tableRow}>
                    <Text style={pdfStyles.cellDescription}>
                      Phase 2: Manufacturing Electrical Loads & Thermal Processing
                    </Text>
                    <Text style={pdfStyles.cellValue}>
                      {(pcfData?.['2_1_electricity_use_in_manufacturing'] ?? 0).toLocaleString('de-DE')}
                    </Text>
                  </View>
                  <View style={pdfStyles.tableRow}>
                    <Text style={pdfStyles.cellDescription}>
                      Phase 3: Inbound Logistics & Material Transportation
                    </Text>
                    <Text style={pdfStyles.cellValue}>
                      {(pcfData?.total_transport ?? 0).toLocaleString('de-DE')}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {config.showRecommendations && (
              <View style={pdfStyles.recommendationBox}>
                <Text style={pdfStyles.recommendationTitle}>
                  Mappa AI-Advisor · Eco-Design & Product Optimization
                </Text>
                <Text style={pdfStyles.recommendationText}>
                  {aiRecommendation || "The carbon core of high-performance families like Shockshield and VSC25 is concentrated within the raw materials stage. It is recommended to establish local European or North American supply structures for key materials to cut down long-distance logistics emissions. Simultaneously, cooperate with R&D institutions to monitor and test recycled polyester, glass fibers, or recycled silicone alternatives as soon as they achieve commercial and technical maturity."}
                </Text>
              </View>
            )}
          </>
        )}

        {/* ========== FOOTER ========== */}
        <View style={pdfStyles.footer}>
          <Text>Powered by Footprint Mappa © 2026</Text>
          <Text>
            {isOcf ? 'ISO 14064-1 Organizational Report' : 'Technical Lifecycle Assessment Report'} — Issued: {currentDate}
          </Text>
        </View>
      </Page>
    </Document>
  );
}