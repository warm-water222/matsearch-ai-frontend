"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Award, ShieldAlert, Database, Info } from "lucide-react";

interface CriticValidationPanelProps {
  criticResult?: string;
  ambiguousTerms?: string[];
  databaseProvenance?: string;
  hardConstraintsSatisfied?: boolean;
  errors?: string[];
}

export default function CriticValidationPanel({
  criticResult = "PENDING",
  ambiguousTerms = [],
  databaseProvenance = "Materials Project (SOURCE_VALUE)",
  hardConstraintsSatisfied = true,
  errors = [],
}: CriticValidationPanelProps) {
  const isPassWithAmbiguity = criticResult === "PASS_WITH_AMBIGUITY";
  const isPass = criticResult === "PASS";
  const isFail = criticResult === "FAIL";

  return (
    <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
            Critic & Verification Audit
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-[#94A3B8]">Critic Status:</span>
          <span
            className={`px-2 py-0.5 border font-bold ${
              isPass
                ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                : isPassWithAmbiguity
                ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                : isFail
                ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                : "bg-[#1F2D3A] text-[#94A3B8] border-[#2A3C4D]"
            }`}
          >
            {criticResult}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 text-xs divide-y divide-[#1F2D3A]">
        {/* Core Metric Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Hard Constraints */}
          <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col justify-between">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
              Quantitative Constraints
            </span>
            <div className="flex items-center gap-2 mt-2">
              {hardConstraintsSatisfied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="font-mono text-xs font-bold text-[#10B981]">
                    SATISFIED
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <span className="font-mono text-xs font-bold text-[#F59E0B]">
                    UNMET
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Database Provenance */}
          <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col justify-between">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
              Database Provenance
            </span>
            <div className="mt-2 font-mono text-[11px] text-[#00E5FF]">
              {databaseProvenance}
            </div>
          </div>

          {/* Ambiguity Count */}
          <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col justify-between">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
              Qualitative Ambiguities
            </span>
            <div className="mt-2 font-mono text-xs font-bold text-[#F59E0B]">
              {ambiguousTerms.length > 0 ? `${ambiguousTerms.length} Flagged` : "None"}
            </div>
          </div>
        </div>

        {/* Ambiguous Requirements Notice */}
        {ambiguousTerms.length > 0 && (
          <div className="pt-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#F59E0B] uppercase font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Ambiguous Qualitative Requirements</span>
            </div>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed">
              No numerical cutoff was supplied for the following terms. The backend deterministically logged them as ambiguous without inventing arbitrary assumptions:
            </p>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-[#F1F5F9] font-mono">
              {ambiguousTerms.map((term, i) => (
                <li key={i}>
                  <span className="text-[#F59E0B]">{term}</span>: No independent numerical threshold provided in user prompt.
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Errors if any */}
        {errors.length > 0 && (
          <div className="pt-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#EF4444] uppercase font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Workflow Errors & Warnings</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-[#EF4444] font-mono">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Experimental Validation Notice */}
        <div className="pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#F1F5F9] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Experimental Laboratory Status</span>
            </span>
            <span className="text-[11px] text-[#94A3B8]">
              All properties are computational DFT predictions from Materials Project. Physical synthesis and experimental validation are recommended where applicable.
            </span>
          </div>
          <span className="px-2.5 py-1 font-mono text-[10px] uppercase font-bold border bg-[#18222C] text-[#94A3B8] border-[#1F2D3A]">
            DFT Predicted
          </span>
        </div>
      </div>
    </div>
  );
}
