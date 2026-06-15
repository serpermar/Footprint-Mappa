import Papa from 'papaparse';
import { OcfData, PcfData } from '../types/carbon';

// Procesa un archivo CSV (ocf)
export const parseOcfCsv = (file: File): Promise<OcfData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        // Mapeamos los resultados
        const validatedData = results.data.map((row: any) => ({
          entity: row.entity || 'Entidad Desconocida',
          total_emissions: Number(row.total_emissions) || 0,
          total_scope_1: Number(row.total_scope_1) || 0,
          total_scope_2: Number(row.total_scope_2) || 0,
          total_scope_3: Number(row.total_scope_3) || 0,
          scope_1_1_stationary_combustion: Number(row.scope_1_1_stationary_combustion) || 0,
          scope_1_2_mobile_combustion: Number(row.scope_1_2_mobile_combustion) || 0,
          scope_1_3_process_emissions: Number(row.scope_1_3_process_emissions) || 0,
          scope_1_4_1_refrigerant_gases: Number(row.scope_1_4_1_refrigerant_gases) || 0,
          scope_1_4_2_fire_extinguishers: Number(row.scope_1_4_2_fire_extinguishers) || 0,
          scope_2_1_1_purchased_electricity: Number(row.scope_2_1_1_purchased_electricity) || 0,
          scope_2_1_2_purchased_heat_or_steam: Number(row.scope_2_1_2_purchased_heat_or_steam) || 0,
          scope_3_1_1_raw_materials_or_auxiliary_materials: Number(row.scope_3_1_1_raw_materials_or_auxiliary_materials) || 0,
          scope_3_1_2_water_consumption: Number(row.scope_3_1_2_water_consumption) || 0,
          scope_3_1_3_services: Number(row.scope_3_1_3_services) || 0,
          scope_3_2_capital_fixed_assets: Number(row.scope_3_2_capital_fixed_assets) || 0,
          scope_3_3_fuel_and_energy_related_activities: Number(row.scope_3_3_fuel_and_energy_related_activities) || 0,
          scope_3_4_upstream_transport_and_distribution: Number(row.scope_3_4_upstream_transport_and_distribution) || 0,
          scope_3_5_waste_generated_in_operations: Number(row.scope_3_5_waste_generated_in_operations) || 0,
          scope_3_6_business_travel: Number(row.scope_3_6_business_travel) || 0,
          scope_3_7_employee_commuting: Number(row.scope_3_7_employee_commuting) || 0,
        }));
        resolve(validatedData);
      },
      error: (error) => reject(error),
    });
  });
};

// Procesa un archivo CSV (pcf)
export const parsePcfCsv = (file: File): Promise<PcfData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const validatedData = results.data.map((row: any) => ({
          product: row.product || 'Producto Desconocido',
          functional_unit: row.functional_unit || '1 unidad',
          total_emissions: Number(row.total_emissions) || 0,
          total_materials: Number(row.total_materials) || 0,
          total_manufacturing: Number(row.total_manufacturing) || 0,
          total_transport: Number(row.total_transport) || 0,
          total_distribution: Number(row.total_distribution) || 0,
          total_use: Number(row.total_use) || 0,
          total_end_of_life: Number(row.total_end_of_life) || 0,
          "1_1_raw_materials": Number(row["1_1_raw_materials"]) || 0,
          "2_1_electricity_use_in_manufacturing": Number(row["2_1_electricity_use_in_manufacturing"]) || 0,
          "3_1_transport_of_materials": Number(row["3_1_transport_of_materials"]) || 0,
          "4_1_product_distribution": Number(row["4_1_product_distribution"]) || 0,
          "5_1_product_use": Number(row["5_1_product_use"]) || 0,
          "6_2_end_of_life_treatment": Number(row["6_2_end_of_life_treatment"]) || 0,
        }));
        resolve(validatedData);
      },
      error: (error) => reject(error),
    });
  });
};