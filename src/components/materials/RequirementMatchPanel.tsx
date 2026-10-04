"use client";

import React from "react";
import { EvaluationCheck, EvaluationCheckStatus, RequirementsState } from "@/types";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Sliders, AlertCircle } from "lucide-react";

interface RequirementMatchPanelProps {
  requirements?: RequirementsState;
  checks?: EvaluationCheck[];
  overallStatus?: EvaluationCheckStatus | string;
}

export default function RequirementMatchPanel({
  requirements,
  checks = [],
  overallStatus = "INCOMPLETE",
}: RequirementMatchPanelProps) {
  const getStatusIcon = (status: EvaluationCheckStatus | string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />;
      case "FAIL":
        return <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />;
      case "AMBIGUOUS":
        return <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case "INCOMPLETE":
        return <AlertCircle className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case "UNAVAILABLE":
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-[#94A3B8]" />;
    }
  };

  const getStatusBadge = (status: EvaluationCheckStatus | string) => {
    switch (status) {
      case "PASS":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30";
      case "FAIL":
        return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30";
      case "AMBIGUOUS":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
      case "INCOMPLETE":
        return "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30";
      case "UNAVAILABLE":
      default:
        return "bg-[#475569]/20 text-[#94A3B8] border-[#475569]/40";
    }
  };

  return (
    <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
            Requirement Verification Audit
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-[#94A3B8]">Overall Determination:</span>
          <span
            className={`px-2 py-0.5 border font-semibold ${getStatusBadge(overallStatus)}`}
          >
            {overallStatus}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Ambiguous Terms Section */}
        {requirements?.ambiguous_terms && requirements.ambiguous_terms.length > 0 && (
          <div className="p-3 bg-[#090F15] border border-[#F59E0B]/40 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F59E0B]">
              <AlertTriangle className="w-4 h-4" />
              <span>Flagged Qualitative / Ambiguous Terms:</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              The backend does not invent arbitrary numerical thresholds for qualitative descriptors. The following terms require user-supplied quantitative boundaries:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {requirements.ambiguous_terms.map((term, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#18222C] border border-[#F59E0B]/50 text-[#F59E0B] font-mono text-[11px]"
                >
                  &ldquo;{term}&rdquo; (No threshold assumed)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Checks Grid */}
        {checks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checks.map((item, index) => {
              return (
                <div
                  key={index}
                  className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-[#F1F5F9] font-mono">
                        {item.property.replace(/_/g, " ").toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.result)}
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${getStatusBadge(
                            item.result
                          )}`}
                        >
                          {item.result}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 font-mono text-[11px]">
                      {item.operator && (
                        <div className="flex items-center justify-between text-[#94A3B8]">
                          <span>Constraint:</span>
                          <span className="text-[#F1F5F9]">
                            {item.operator === "between"
                              ? `${item.min} - ${item.max} ${item.unit || ""}`
                              : `${item.operator} ${item.max ?? item.min ?? ""} ${item.unit || ""}`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[#94A3B8]">
                        <span>Evaluated Value:</span>
                        <span className="text-[#00E5FF] font-semibold">
                          {item.value !== null && item.value !== undefined
                            ? typeof item.value === "number"
                              ? `${item.value.toFixed(4)} ${item.unit || ""}`
                              : `${String(item.value)} ${item.unit || ""}`
                            : "Unavailable"}
                        </span>
                      </div>
                      {item.source_type && (
                        <div className="flex items-center justify-between text-[#475569] text-[10px]">
                          <span>Provenance:</span>
                          <span>{item.source_type}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.reason && (
                    <div className="mt-2 pt-2 border-t border-[#1F2D3A] text-[10px] text-[#F59E0B] font-mono leading-tight">
                      Reason: {item.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
