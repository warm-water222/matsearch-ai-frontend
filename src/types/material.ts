import { PropertyWithProvenance } from "./api";

export interface MaterialDetail {
  material_id: string;
  formula: string;
  density?: PropertyWithProvenance<number>;
  volume?: PropertyWithProvenance<number>;
  band_gap?: PropertyWithProvenance<number>;
  formation_energy_per_atom?: PropertyWithProvenance<number>;
  energy_above_hull?: PropertyWithProvenance<number>;
  is_stable?: PropertyWithProvenance<boolean | number>;
  crystal_system?: PropertyWithProvenance<string>;
}

export interface MaterialDetailResponse {
  status: string;
  source: string;
  material: MaterialDetail;
}

export interface CompareRequest {
  material_ids: string[];
}

export interface CompareMaterialItem {
  material_id: string;
  formula: string;
  density?: number;
  volume?: number;
  band_gap?: number;
  formation_energy_per_atom?: number;
  energy_above_hull?: number;
  is_stable?: boolean;
  crystal_system?: string;
  provenance?: {
    source: string;
    values: string;
  };
}

export interface CompareResponse {
  status: string;
  source: string;
  requested_materials: string[];
  returned_count: number;
  missing_materials: string[];
  materials: CompareMaterialItem[];
}
