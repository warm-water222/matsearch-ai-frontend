"use client";

import React from "react";
import { TimelineStepItem } from "@/lib/timeline";
import { CheckCircle2, Circle, Loader2, XCircle, Terminal } from "lucide-react";

interface AgentTimelineProps {
  steps: TimelineStepItem[];
  currentStepName?: string;
}

export default function AgentTimeline({ steps }: AgentTimelineProps) {
  return (
    <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
            Agent Execution Pipeline
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            (Autonomous Workflow)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span>Backend Workflow State</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-4 flex flex-col divide-y divide-[#1F2D3A]/60">
        {steps.map((step) => {
          const isCompleted = step.status === "completed";
          const isRunning = step.status === "running";
          const isFailed = step.status === "failed";
          const isPending = step.status === "pending";

          return (
            <div
              key={step.step}
              className={`py-3 first:pt-0 last:pb-0 flex items-start gap-3 transition-colors ${
                isRunning ? "bg-[#18222C]/40 -mx-4 px-4" : ""
              }`}
            >
              {/* Status Icon */}
              <div className="mt-0.5 shrink-0">
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                )}
                {isRunning && (
                  <Loader2 className="w-4 h-4 text-[#00E5FF] animate-spin" />
                )}
                {isFailed && (
                  <XCircle className="w-4 h-4 text-[#EF4444]" />
                )}
                {isPending && (
                  <Circle className="w-4 h-4 text-[#475569]" />
                )}
              </div>

              {/* Step Details */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      isCompleted
                        ? "text-[#F1F5F9]"
                        : isRunning
                        ? "text-[#00E5FF]"
                        : isFailed
                        ? "text-[#EF4444]"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {step.step}. {step.title}
                  </span>
                  {step.timestamp && (
                    <span className="text-[10px] font-mono text-[#475569]">
                      {step.timestamp}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border ${
                    isCompleted
                      ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                      : isRunning
                      ? "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40 animate-pulse"
                      : isFailed
                      ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                      : "bg-[#1F2D3A] text-[#475569] border-[#2A3C4D]"
                  }`}
                >
                  {step.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
