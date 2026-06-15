
/** Modelos de datos estandarizados para contabilidad de carbono en Mappa */

export interface OcfData {
  // ========== DATOS PRINCIPALES DE LA ENTIDAD ==========
  // Nombre del sitio industrial o perímetro institucional
  entity: string;

  // Suma de emisiones a través de Alcance 1, 2 y 3 en toneladas métricas (tCO2e)
  total_emissions: number;

  //Suma total de emisiones directas
  total_scope_1: number;

  //Suma total de emisiones indirectas por compra de energía
  total_scope_2: number;

  //Suma total de emisiones de la cadena de valor
  total_scope_3: number;
  
  // =========================================================================
  // CAMPOS DETALLADOS DEL ALCANCE 1
  // =========================================================================

  //Alcance 1.1: Combustión estacionaria de calderas, hornos y unidades térmicas
  scope_1_1_stationary_combustion: number;

  //Alcance 1.2: Combustión móvil interna de flotas logísticas propiedad de la empresa
  scope_1_2_mobile_combustion: number;

  //Alcance 1.3: Emisiones directas de procesos físicos/químicos de líneas de fabricación
  scope_1_3_process_emissions: number;

  //Alcance 1.4.1: Pérdidas fugitivas de gases refrigerantes de HVAC industrial
  scope_1_4_1_refrigerant_gases: number;

  //Alcance 1.4.2: Emisiones fugitivas menores de sistemas de supresión de incendios
  scope_1_4_2_fire_extinguishers: number;
  
  // =========================================================================
  // CAMPOS DETALLADOS DEL ALCANCE 2
  // =========================================================================

  //Alcance 2.1.1: Electricidad de alto voltaje para maquinaria pesada
  scope_2_1_1_purchased_electricity: number;

  //Alcance 2.1.2: Energía térmica comprada, vapor de distrito o líneas de agua caliente
  scope_2_1_2_purchased_heat_or_steam: number;
  
  // =========================================================================
  // CAMPOS DETALLADOS DEL ALCANCE 3 (Actividades upstream de la cadena de valor)
  // =========================================================================

  //Alcance 3.1.1: Carbono incorporado en hilos técnicos, polímeros y materias primas compradas
  scope_3_1_1_raw_materials_or_auxiliary_materials: number;

  //Alcance 3.1.2: Emisiones upstream por extracción y consumo de agua de red 
  scope_3_1_2_water_consumption: number;

  //Alcance 3.1.3: Servicios auxiliares externos, consultoría y subcontratación local
  scope_3_1_3_services: number;

  //Alcance 3.2: Producción y envío de maquinaria, herramientas industriales y activos fijos
  scope_3_2_capital_fixed_assets: number;

  //Alcance 3.3: Actividades relacionadas con combustible y energía no incluidas en Alcance 1 o 2
  scope_3_3_fuel_and_energy_related_activities: number;

  //Alcance 3.4: Logística de carga entrante de terceros y transporte de materiales 
  scope_3_4_upstream_transport_and_distribution: number;

  //Alcance 3.5: Procesamiento downstream o local de residuos industriales sólidos/líquidos 
  scope_3_5_waste_generated_in_operations: number;

  //Alcance 3.6: Viajes corporativos, vuelos y transporte de negocios de larga distancia 
  scope_3_6_business_travel: number;

  //Alcance 3.7: Patrones diarios de desplazamiento de empleados a sitios de fabricación
  scope_3_7_employee_commuting: number;
}

// ============================================
// 2. ESQUEMA DE HUELLA DE CARBONO DE PRODUCTO (PCF)
// ============================================

//Representa las emisiones asociadas a un producto específico desde la cuna hasta la puerta

export interface PcfData {
  // ========== IDENTIFICACIÓN DEL PRODUCTO ==========

  //Familia de identificación técnica del producto
  product: string;

  //Métricas de referencia de escala base cuantificada
  functional_unit: string;
  
  // ========== TOTALES POR FASE DEL CICLO DE VIDA ==========

  // Puntuación absoluta de intensidad del ciclo de vida Cuna-a-Puerta en gramos (gCO2e)
  total_emissions: number;

  // Fase 1: Carga de carbono ligada a extracción de materiales básicos y embalaje upstream
  total_materials: number;

  //Fase 2: Energía total, servicios públicos y procesos consumidos durante la ejecución en planta
  total_manufacturing: number;

  //Fase 3: Logística de polímeros crudos entrantes y líneas de transporte
  total_transport: number;

  //Fase 4: Mapeo de distribución de productos de red de salida
  total_distribution: number;

  // Fase 5: Emisiones teóricas de la fase de uso del producto durante su vida útil
  total_use: number;

  //Fase 6: Procesamiento de fin de vida, desmontaje mecánico y métricas de disposición final
  total_end_of_life: number;
  
  // =========================================================================
  // MATRIZ DE DESGLOSE ANALÍTICO DEL CICLO DE VIDA LCA
  // =========================================================================

  //Desglose analítico de materiales base primarios y polímeros
  "1_1_raw_materials": number;

  //Uso de carga eléctrica en fabricación bajo parámetros de producción
  "2_1_electricity_use_in_manufacturing": number;

  //Huella de peso puro del transporte de suministros originales
  "3_1_transport_of_materials": number;

  //Huella de carga de distribución de envío de productos terminados
  "4_1_product_distribution": number;

  //Huella de consumo de energía operativa durante el uso estándar del cliente
  "5_1_product_use": number;

  //Intensidad de la fase de reciclaje terminal, tratamiento o disposición estructural
  "6_2_end_of_life_treatment": number;
}