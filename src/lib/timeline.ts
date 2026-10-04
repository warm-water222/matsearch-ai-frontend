import { WorkflowState, WorkflowStatus } from "@/types";

export interface TimelineStepItem {
  step: number;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp?: string;
}

export function deriveTimelineSteps(
  state?: WorkflowState,
  overallStatus?: WorkflowStatus
): TimelineStepItem[] {
  const isFailed = overallStatus === "failed";
  const isCompleted = overallStatus === "completed";

  const hasReqs = Boolean(state?.requirements);
  const hasPlan = Boolean(state?.plan);
  const hasCandidates = Boolean(state?.candidates && state.candidates.length > 0);
  const hasEvaluations = Boolean(state?.evaluations && state.evaluations.length > 0);
  const hasCritic = Boolean(state?.critic_result);
  const hasReport = Boolean(state?.report);

  // Step 1: Requirement Parsing
  let step1Status: TimelineStepItem["status"] = "pending";
  if (hasReqs) step1Status = "completed";
  else if (overallStatus === "running" || overallStatus === "pending") step1Status = "running";
  if (isFailed && !hasReqs) step1Status = "failed";

  // Step 2: Research Planning
  let step2Status: TimelineStepItem["status"] = "pending";
  if (hasPlan) step2Status = "completed";
  else if (hasReqs && overallStatus === "running") step2Status = "running";
  if (isFailed && hasReqs && !hasPlan) step2Status = "failed";

  // Step 3: Materials Project Retrieval
  let step3Status: TimelineStepItem["status"] = "pending";
  if (hasCandidates) step3Status = "completed";
  else if (hasPlan && overallStatus === "running") step3Status = "running";
  if (isFailed && hasPlan && !hasCandidates) step3Status = "failed";

  // Step 4: Candidate Evaluation
  let step4Status: TimelineStepItem["status"] = "pending";
  if (hasEvaluations) step4Status = "completed";
  else if (hasCandidates && overallStatus === "running") step4Status = "running";
  if (isFailed && hasCandidates && !hasEvaluations) step4Status = "failed";

  // Step 5: Critic Validation
  let step5Status: TimelineStepItem["status"] = "pending";
  if (hasCritic) step5Status = "completed";
  else if (hasEvaluations && overallStatus === "running") step5Status = "running";
  if (isFailed && hasEvaluations && !hasCritic) step5Status = "failed";

  // Step 6: Engineering Report
  let step6Status: TimelineStepItem["status"] = "pending";
  if (hasReport) step6Status = "completed";
  else if (hasCritic && overallStatus === "running") step6Status = "running";
  if (isFailed && hasCritic && !hasReport) step6Status = "failed";

  if (isCompleted) {
    if (hasReqs) step1Status = "completed";
    if (hasPlan) step2Status = "completed";
    if (hasCandidates) step3Status = "completed";
    if (hasEvaluations) step4Status = "completed";
    if (hasCritic) step5Status = "completed";
    if (hasReport) step6Status = "completed";
  }

  return [
    {
      step: 1,
      title: "Requirement Interpretation",
      description: hasReqs
        ? `Identified ${state?.requirements?.constraints?.length ?? 0} constraints (${state?.requirements?.ambiguous_terms?.length ?? 0} ambiguous terms flagged)`
        : "Deconstructing natural-language directive into physics constraints",
      status: step1Status,
    },
    {
      step: 2,
      title: "Research Plan Formulation",
      description: hasPlan
        ? `Formulated strategy (${state?.plan?.planning_status || "COMPLETE"})`
        : "Formulating deterministic screening bounds & query filters",
      status: step2Status,
    },
    {
      step: 3,
      title: "Materials Project Query",
      description: hasCandidates
        ? `Retrieved ${state?.candidates?.length ?? 0} candidate phases from Materials Project`
        : "Querying Materials Project computational database via backend",
      status: step3Status,
    },
    {
      step: 4,
      title: "Deterministic Candidate Evaluation",
      description: hasEvaluations
        ? `Screened ${state?.evaluations?.length ?? 0} candidates through physics checks`
        : "Executing deterministic evaluations (density, band gap, stability)",
      status: step4Status,
    },
    {
      step: 5,
      title: "Critic Validation Audit",
      description: hasCritic
        ? `Critic verdict: ${state?.critic_result}`
        : "Auditing candidates against convex hull and flagging ambiguities",
      status: step5Status,
    },
    {
      step: 6,
      title: "Engineering Report Generation",
      description: hasReport
        ? "Engineering dossier synthesized from evidence"
        : "Synthesizing comprehensive engineering documentation",
      status: step6Status,
    },
  ];
}
