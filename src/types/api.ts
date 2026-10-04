export type ProvenanceType =
  | "SOURCE_VALUE"
  | "DERIVED_VALUE"
  | "AI_INTERPRETATION"
  | "UNAVAILABLE";

export interface PropertyWithProvenance<T = number | string | boolean> {
  value: T;
  unit?: string | null;
  source_type?: ProvenanceType;
  provenance?: ProvenanceType;
  source?: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface ApiStatusResponse {
  status: string;
  api: string;
  materials_project: boolean;
  llm_provider: string;
  llm_model: string;
}

export interface HealthResponse {
  status: string;
}
