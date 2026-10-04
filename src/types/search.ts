import { PropertyWithProvenance, ProvenanceType } from "./api";

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  search_id: string;
  status: string;
}

export interface RequirementConstraint {
  property: string;
  operator: string;
  min?: number | null;
  max?: number | null;
  unit?: string | null;
  priority?: string;
}

export interface RequirementsState {
  application?: string | null;
  constraints?: RequirementConstraint[];
  ambiguous_terms?: string[];
  parsing_status?: string;
  raw?: string;
}

export interface PlanState {
  steps?: string[];
  explicit_constraints?: RequirementConstraint[];
  ambiguous_requirements?: string[];
  planning_status?: string;
}

export interface CandidateMaterial {
  material_id: string;
  formula: string;
  density?: PropertyWithProvenance<number>;
  band_gap?: PropertyWithProvenance<number>;
  energy_above_hull?: PropertyWithProvenance<number>;
  formation_energy_per_atom?: PropertyWithProvenance<number>;
  crystal_system?: PropertyWithProvenance<string>;
  is_stable?: PropertyWithProvenance<number | boolean>;
}

export type EvaluationCheckStatus =
  | "PASS"
  | "FAIL"
  | "AMBIGUOUS"
  | "UNAVAILABLE"
  | "INCOMPLETE";

export interface EvaluationCheck {
  property: string;
  result: EvaluationCheckStatus;
  value?: number | string | boolean | null;
  unit?: string | null;
  operator?: string;
  min?: number | null;
  max?: number | null;
  source_type?: ProvenanceType;
  reason?: string;
}

export interface EvaluationResult {
  material_id: string;
  result: EvaluationCheckStatus;
  checks: EvaluationCheck[];
  reason?: string;
}

export type WorkflowStatus = "pending" | "running" | "completed" | "failed" | string;

export interface WorkflowState {
  job_id?: string;
  query?: string;
  requirements?: RequirementsState;
  plan?: PlanState;
  candidates?: CandidateMaterial[];
  evaluations?: EvaluationResult[];
  critic_result?: string;
  iterations?: number;
  report?: string;
  errors?: string[];
  status?: WorkflowStatus;
  current_step?: string;
}

export interface SearchDetailResponse {
  id: string;
  query: string;
  status: WorkflowStatus;
  state: WorkflowState;
}

export interface SearchEventData {
  query?: string;
  search_id?: string;
  state: WorkflowState;
}
