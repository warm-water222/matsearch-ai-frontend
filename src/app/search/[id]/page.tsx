"use client";

import React, { use } from "react";
import Link from "next/link";
import WorkstationShell from "@/components/layout/WorkstationShell";
import AgentTimeline from "@/components/timeline/AgentTimeline";
import CandidatesMatrix from "@/components/candidates/CandidatesMatrix";
import AgentExplanationPanel from "@/components/materials/AgentExplanationPanel";
import CriticValidationPanel from "@/components/materials/CriticValidationPanel";
import RequirementMatchPanel from "@/components/materials/RequirementMatchPanel";
import ZeroCandidatesState from "@/components/search/ZeroCandidatesState";
import SearchQueryingState from "@/components/search/SearchQueryingState";
import QueryFailedState from "@/components/search/QueryFailedState";
import { useSearchQuery, useSearchEvents } from "@/lib/hooks";
import { deriveTimelineSteps } from "@/lib/timeline";
import {
  FileText,
  Radio,
  Download,
  Info,
} from "lucide-react";

export default function SearchExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // TanStack Query for GET /api/search/{id}
  const { data: searchData, isLoading, isError, error, refetch } = useSearchQuery(id);

  // Native EventSource on /api/search/{id}/events
  const { isConnected } = useSearchEvents(id, searchData?.status);

  if (isLoading) {
    return (
      <WorkstationShell>
        <div className="flex-1 flex items-center justify-center p-8">
          <SearchQueryingState query={`Loading persisted state for search ID ${id}...`} />
        </div>
      </WorkstationShell>
    );
  }

  if (isError || !searchData) {
    return (
      <WorkstationShell>
        <QueryFailedState
          message={`Failed to retrieve workflow state for search identifier ${id}.`}
          error={error instanceof Error ? error : new Error(String(error))}
          reset={() => refetch()}
        />
      </WorkstationShell>
    );
  }

  const { query, status, state } = searchData;
  const isRunning = status === "running" || status === "pending";
  const isCompleted = status === "completed";
  const isFailed = status === "failed";

  // Derive 6-step agent timeline directly from backend workflow state
  const timelineSteps = deriveTimelineSteps(state, status);

  // If still actively querying or early in workflow and no candidates yet
  if (isRunning && (!state?.candidates || state.candidates.length === 0)) {
    return (
      <WorkstationShell>
        <div className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col gap-6">
          {/* Active Banner */}
          <div className="bg-[#12181F] border border-[#1F2D3A] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#00363D] text-[#00E5FF] border border-[#00E5FF]/40 font-bold uppercase">
                  WORKFLOW RUNNING // {id}
                </span>
                {isConnected && (
                  <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Real-Time SSE Stream Active</span>
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-mono font-bold text-[#F1F5F9]">
                &ldquo;{query}&rdquo;
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <AgentTimeline steps={timelineSteps} />
            </div>
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <SearchQueryingState query={`Autonomous agent is executing: ${state?.current_step || "Searching Materials Project database..."}`} />
            </div>
          </div>
        </div>
      </WorkstationShell>
    );
  }

  return (
    <WorkstationShell>
      <div className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Requirement Banner & Status */}
        <div className="bg-[#12181F] border border-[#1F2D3A] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 border font-bold uppercase ${
                  isCompleted
                    ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/40"
                    : isFailed
                    ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40"
                    : "bg-[#00363D] text-[#00E5FF] border-[#00E5FF]/40"
                }`}
              >
                STATUS: {status.toUpperCase()} // {id}
              </span>
              {isConnected && isRunning && (
                <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>SSE Connected</span>
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-mono font-bold text-[#F1F5F9]">
              &ldquo;{query}&rdquo;
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Challenge Button - As specified in BACKEND_SPEC.md lines 1661-1662: disabled / coming soon if not in OpenAPI */}
            <button
              disabled
              title="Challenge endpoint POST /api/search/{id}/challenge is not exposed in the current deployed backend OpenAPI schema."
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18222C] border border-[#1F2D3A] text-xs font-mono text-[#475569] cursor-not-allowed"
              type="button"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Challenge (Coming Soon)</span>
            </button>

            <Link
              href={`/reports?searchId=${encodeURIComponent(id)}`}
              aria-disabled={!state?.report} tabIndex={state?.report ? 0 : -1} title={state?.report ? undefined : "No report is available for this search"} className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors ${state?.report ? "" : "pointer-events-none opacity-40"}`}
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Engineering Dossier</span>
            </Link>
          </div>
        </div>

        {/* Telemetry Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#12181F] border border-[#1F2D3A] flex flex-col">
            <span className="text-[10px] text-[#94A3B8] uppercase">Candidates Analyzed</span>
            <span className="text-base font-bold text-[#00E5FF] mt-1">
              {state?.candidates?.length ?? 0}
            </span>
          </div>

          <div className="p-3 bg-[#12181F] border border-[#1F2D3A] flex flex-col">
            <span className="text-[10px] text-[#94A3B8] uppercase">Evaluations Completed</span>
            <span className="text-base font-bold text-[#10B981] mt-1">
              {state?.evaluations?.length ?? 0}
            </span>
          </div>

          <div className="p-3 bg-[#12181F] border border-[#1F2D3A] flex flex-col">
            <span className="text-[10px] text-[#94A3B8] uppercase">Critic Validation</span>
            <span className="text-[11px] font-bold text-[#F59E0B] mt-1">
              {state?.critic_result || (isFailed ? "Not run" : "PENDING")}
            </span>
          </div>

          <div className="p-3 bg-[#12181F] border border-[#1F2D3A] flex flex-col">
            <span className="text-[10px] text-[#94A3B8] uppercase">Engineering Report</span>
            <span className="text-[11px] font-bold text-[#10B981] mt-1">
              {state?.report ? "Available" : isFailed ? "Not generated" : isCompleted ? "Not available" : "In progress"}
            </span>
          </div>
        </div>

        {/* Two-Column Workstation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Real Backend Agent Timeline (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AgentTimeline steps={timelineSteps} />

            {/* Requirement Match / Qualitative Ambiguity Panel */}
            <RequirementMatchPanel
              requirements={state?.requirements}
              checks={state?.evaluations?.[0]?.checks || []}
              overallStatus={state?.evaluations?.[0]?.result || "INCOMPLETE"}
            />
          </div>

          {/* Right Column: Candidates Matrix & Validation Panels (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {!state?.candidates || state.candidates.length === 0 ? (
              <ZeroCandidatesState prompt={query} searchId={id} failed={isFailed} completed={isCompleted} failedStep={state?.current_step} errors={state?.errors} onRefresh={() => refetch()} />
            ) : (
              <CandidatesMatrix
                materials={state.candidates}
                evaluations={state.evaluations}
                title="Screened Candidate Phases"
                subtitle="Retrieved from Materials Project and evaluated deterministically"
              />
            )}

            {/* Agent Explanation */}
            <AgentExplanationPanel
              requirements={state?.requirements}
              plan={state?.plan}
              criticResult={state?.critic_result}
            />

            {/* Critic Validation */}
            <CriticValidationPanel
              criticResult={state?.critic_result}
              ambiguousTerms={state?.requirements?.ambiguous_terms}
              errors={state?.errors}
            />

            {/* Inlined Dossier Preview if report available */}
            {state?.report && (
              <div className="bg-[#12181F] border border-[#1F2D3A] p-4 flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#1F2D3A] pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00E5FF]" />
                    <span className="text-xs font-semibold uppercase text-[#F1F5F9]">
                      Engineering Dossier Preview
                    </span>
                  </div>
                  <Link
                    href={`/reports?searchId=${encodeURIComponent(id)}`}
                    className="text-[11px] text-[#00E5FF] hover:underline"
                  >
                    Open Full Report →
                  </Link>
                </div>
                <div className="max-h-60 overflow-y-auto whitespace-pre-wrap font-sans text-[#94A3B8] p-3 bg-[#090F15] border border-[#1F2D3A] text-xs">
                  {state.report}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WorkstationShell>
  );
}
