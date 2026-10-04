"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Cpu, Database, Filter, ShieldCheck, ListChecks } from "lucide-react";
import { PlanState, RequirementsState } from "@/types";

interface AgentExplanationProps {
  requirements?: RequirementsState;
  plan?: PlanState;
  criticResult?: string;
  databaseQueried?: string;
}

export default function AgentExplanationPanel({
  requirements,
  plan,
  criticResult,
  databaseQueried = "Materials Project (computational DFT records)",
}: AgentExplanationProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
      {/* Collapsible Trigger Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[#18222C] hover:bg-[#1F2D3A] transition-colors flex items-center justify-between text-left"
        type="button"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
            How MatSearch AI Reached This Result
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#090F15] text-[#00E5FF] border border-[#1F2D3A]">
            Backend Research Plan & Evidence
          </span>
        </div>
        <div className="text-[#94A3B8] hover:text-[#00E5FF]">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="p-4 flex flex-col gap-4 text-xs divide-y divide-[#1F2D3A]">
          {/* Research Plan Steps */}
          {plan?.steps && plan.steps.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#00E5FF] uppercase font-semibold">
                <ListChecks className="w-3.5 h-3.5" />
                <span>Agent Research Plan Execution</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 font-mono text-[11px] text-[#94A3B8] pl-1">
                {plan.steps.map((st, i) => (
                  <li key={i} className="text-[#F1F5F9]">
                    <span className="text-[#94A3B8]">{st}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Database Provenance */}
          <div className="pt-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#00E5FF] uppercase font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Scientific Data Source</span>
            </div>
            <div className="p-2.5 bg-[#090F15] border border-[#1F2D3A] font-mono text-[11px] text-[#F1F5F9]">
              Source Database: <span className="text-[#00E5FF]">{databaseQueried}</span>
            </div>
          </div>

          {/* Explicit Constraints */}
          {requirements?.constraints && requirements.constraints.length > 0 && (
            <div className="pt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#00E5FF] uppercase font-semibold">
                <Filter className="w-3.5 h-3.5" />
                <span>Extracted Physical Constraints</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirements.constraints.map((c, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1.5 bg-[#090F15] border border-[#1F2D3A] font-mono text-[11px] text-[#94A3B8] flex items-center justify-between"
                  >
                    <span className="text-[#F1F5F9] font-semibold">{c.property}</span>
                    <span className="text-[#00E5FF]">
                      {c.operator === "between"
                        ? `${c.min} - ${c.max} ${c.unit || ""}`
                        : `${c.operator} ${c.max ?? c.min ?? ""} ${c.unit || ""}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Status */}
          {criticResult && (
            <div className="pt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#10B981] uppercase font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Critic Audit Result</span>
              </div>
              <div className="p-2.5 bg-[#090F15] border border-[#1F2D3A] font-mono text-[11px]">
                Validation Status:{" "}
                <span className="text-[#10B981] font-bold">{criticResult}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
