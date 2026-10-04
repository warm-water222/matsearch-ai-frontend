"use client";

import React from "react";
import { ReportResponse } from "@/types";
import { FileText, Printer, Download, ShieldCheck, Database, Award } from "lucide-react";

interface ReportViewerProps {
  report: ReportResponse;
}

export default function ReportViewer({ report }: ReportViewerProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownload = () => {
    const textContent = `MATSEARCH AI — ENGINEERING REPORT
Search ID: ${report.search_id}
Query: ${report.query || "Materials Specification"}
Critic Result: ${report.critic_result || "N/A"}
Status: ${report.status}

============================================================
${report.report}
============================================================
`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MatSearch_Report_${report.search_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
      {/* Header Toolbar */}
      <div className="px-6 py-4 bg-[#18222C] border-b border-[#1F2D3A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#00363D] text-[#00E5FF] border border-[#00E5FF]/40 uppercase font-bold">
              {report.status} DOSSIER
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">
              SEARCH ID: {report.search_id}
            </span>
          </div>
          <h2 className="text-base font-bold text-[#F1F5F9] font-mono">
            {report.query ? `Report: ${report.query}` : "Autonomous Materials Engineering Report"}
          </h2>
          <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5 flex items-center gap-3">
            <span>Critic: <strong className="text-[#10B981]">{report.critic_result || "VERIFIED"}</strong></span>
            {report.candidates && (
              <span>• {report.candidates.length} Candidate Phases Analyzed</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12181F] border border-[#1F2D3A] text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#00E5FF] transition-colors"
            type="button"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-[#0B0F12] font-semibold text-xs transition-colors"
            type="button"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export Text</span>
          </button>
        </div>
      </div>

      {/* Report Markdown Content */}
      <div className="p-6 flex flex-col gap-6 text-xs font-mono">
        <div className="p-4 bg-[#090F15] border border-[#1F2D3A] text-[#94A3B8] text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00E5FF]" />
            <span>Target Database: <strong>Materials Project</strong> (computational DFT records)</span>
          </div>
          <div className="flex items-center gap-2 text-[#10B981]">
            <Award className="w-4 h-4" />
            <span>Verification: <strong>{report.critic_result || "COMPLETED"}</strong></span>
          </div>
        </div>

        {/* Formatted Markdown Body */}
        <article className="prose prose-invert max-w-none text-[#F1F5F9] text-xs leading-relaxed space-y-4">
          <div className="whitespace-pre-wrap font-sans bg-[#0B0F12] p-6 border border-[#1F2D3A] rounded-none overflow-x-auto text-xs leading-relaxed">
            {report.report}
          </div>
        </article>
      </div>
    </div>
  );
}
