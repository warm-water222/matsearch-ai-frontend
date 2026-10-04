import { CandidateMaterial, EvaluationResult, PlanState, RequirementsState } from "./search";

export interface ReportResponse {
  status: string;
  search_id: string;
  query?: string;
  report: string;
  critic_result?: string;
  requirements?: RequirementsState;
  plan?: PlanState;
  candidates?: CandidateMaterial[];
  evaluations?: EvaluationResult[];
  errors?: string[];
  provenance?: Record<string, string>;
}
