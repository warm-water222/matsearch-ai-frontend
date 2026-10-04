"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

interface ZeroCandidatesStateProps {
  prompt?: string;
  searchId?: string;
  failed?: boolean;
  completed?: boolean;
  failedStep?: unknown;
  errors?: unknown;
  onRefresh?: () => void;
}

function toMessages(errors: unknown): string[] {
  if (!errors) return [];
  const list = Array.isArray(errors) ? errors : [errors];
  const out: string[] = [];
  for (const item of list) {
    let text = "";
    if (typeof item === "string") {
      text = item;
    } else if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const m = o.message ?? o.detail ?? o.error;
      if (typeof m === "string") text = m;
    }
    text = text.split("\n")[0].trim();
    if (!text || text.includes("Traceback")) continue;
    out.push(text.length > 200 ? text.slice(0, 200) + "..." : text);
  }
  return out.slice(0, 3);
}

export default function ZeroCandidatesState({
  prompt = "Current engineering requirement",
  searchId,
  failed = false,
  completed = false,
  failedStep,
  errors,
  onRefresh,
}: ZeroCandidatesStateProps) {
  const messages = toMessages(errors);
  const step =
    typeof failedStep === "string" && failedStep.trim() ? failedStep.trim() : null;

  const tone = failed
    ? { text: "text-[#EF4444]", border: "border-[#EF4444]/40", bg: "bg-[#EF4444]/10" }
    : { text: "text-[#F59E0B]", border: "border-[#F59E0B]/40", bg: "bg-[#F59E0B]/10" };

  const label = failed
    ? "Search failed"
    : completed
    ? "No matching candidates"
    : "No candidate data yet";

  const title = failed
    ? "The search could not be completed"
    : completed
    ? "No materials matched the supplied quantitative constraints."
    : "No candidate materials are available for this search yet";

  const description = failed
    ? "The MatSearch AI backend reported that this search failed before results could be produced. No candidate data is available for:"
    : completed
    ? "The search finished, but the backend returned no candidate materials for:"
    : "The backend has not returned candidate materials for:";

  const showDetails = failed && (step || messages.length > 0 || searchId);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col items-center justify-center">
      <div className="w-full bg-[#12181F] border border-[#1F2D3A] p-8 flex flex-col items-center text-center">
        <div
          className={`w-14 h-14 bg-[#18222C] border ${tone.border} flex items-center justify-center mb-4 ${tone.text}`}
        >
          <AlertCircle className="w-7 h-7" />
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-0.5 ${tone.bg} ${tone.text} border ${tone.border} mb-2 uppercase`}
        >
          {label}
        </span>

        <h3 className="text-base font-semibold text-[#F1F5F9] font-mono mb-2">{title}</h3>

        <p className="text-xs text-[#94A3B8] max-w-lg mb-6 leading-relaxed">
          {description}
          <span className="block mt-2 font-mono text-[#F1F5F9] p-2 bg-[#090F15] border border-[#1F2D3A]">
            &ldquo;{prompt}&rdquo;
          </span>
        </p>

        {showDetails && (
          <div className="w-full bg-[#0B0F12] border border-[#1F2D3A] p-4 text-left font-mono text-xs mb-6 space-y-2">
            <div className="text-[10px] uppercase text-[#94A3B8] font-bold">
              Details reported by the backend
            </div>
            {step && (
              <div className="text-[11px] text-[#F1F5F9]">Failed step: {step}</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className="text-[11px] text-[#F59E0B] break-words">
                Backend message: {m}
              </div>
            ))}
            {searchId && (
              <div className="text-[11px] text-[#94A3B8] break-all">Search ID: {searchId}</div>
            )}
            <div className="text-[11px] text-[#94A3B8]">
              If this keeps happening, share the search ID with the backend team.
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
              type="button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh status</span>
            </button>
          )}
          <Link
            href="/search"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] text-xs text-[#F1F5F9] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Start a new search</span>
          </Link>
        </div>
      </div>
    </div>
  );
}