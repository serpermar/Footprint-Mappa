import { NextResponse } from 'next/server';

// Endpoint POST que genera recomendaciones estratégicas de descarbonización basadas en los datos de huella de carbono (OCF o PCF)
export async function POST(request: Request) {
  try {
    const { type, data, customNotes } = await request.json();

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Delay controlado para mostrar el spinner de carga
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Generar recomendación 
    let recommendation = '';

    // CASO(OCF)
    if (type === 'OCF') {
      const total = Number(data.total_emissions || 0).toLocaleString('de-DE');
      const s2 = Number(data.total_scope_2 || 0).toLocaleString('de-DE');
      const s3 = Number(data.total_scope_3 || 0).toLocaleString('de-DE');
      const mat = Number(data.scope_3_1_1_raw_materials_or_auxiliary_materials || 0).toLocaleString('de-DE');

      recommendation = `Strategic decarbonization roadmap for Relats S.A.U. (Perimeter: Planta Barcelona): Value chain Scope 3 emissions represent the primary driver of environmental impact at ${s3} tCO2e, concentrated within technical yarn procurement and polymers (${mat} tCO2e). It is highly recommended to establish local European supply structures to mitigate upstream logistics and execute product lifecycle optimizations. Concurrently, expanding the 100% renewable electricity framework successfully deployed in Caldes and China to all manufacturing lines will drastically isolate and eliminate Scope 2 exposure (${s2} tCO2e).`;
    } else {

      // CASO (PCF)
      const product = data.product || 'Technical Product Family';
      const total = Number(data.total_emissions || 0).toLocaleString('de-DE');
      const mat = Number(data.total_materials || 0).toLocaleString('de-DE');
      const transport = Number(data.total_transport || 0).toLocaleString('de-DE');

      recommendation = `Lifecycle Eco-Design recommendation for ${product}: Comprehensive cradle-to-gate analysis reveals that the carbon core is heavily weighted toward the raw materials phase (${mat} gCO2e). Technical R&D should focus on prototyping alternative glass fibers, recycled polyester, or low-carbon silicones as soon as commercial and industrial validation permit. Additionally, optimizing container load factors and shipping routes could alleviate the material transportation logistical footprint, currently emitting ${transport} gCO2e.`;
    }

    // Si el auditor incluyó notas personalizadas, se concatenan al final de la recomendación
    if (customNotes && customNotes.trim() !== '') {
      recommendation += ` Auditor Operational Directive: ${customNotes.trim()}`;
    }

    return NextResponse.json({ recommendation }, { status: 200 });
  } catch (error) {

    console.error('[AI ROUTE ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}