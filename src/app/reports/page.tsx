"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WorkstationShell from "@/components/layout/WorkstationShell";
import ReportViewer from "@/components/reports/ReportViewer";
import QueryFailedState from "@/components/search/QueryFailedState";
import { useReportQuery, useGenerateReportMutation } from "@/lib/hooks";
import {
  FileText,
  RotateCcw,
  Search,
  Download,
  AlertOctagon,
  Sparkles,
} from "lucide-react";

function ReportsContent() {
  const searchParams = useSearchParams();
  const urlSearchId = searchParams.get("searchId");

  const [activeSearchId, setActiveSearchId] = useState<string>(
    urlSearchId || "9732bb74-6eac-4fab-9549-7fdf116823db"
  );
  const [searchInput, setSearchInput] = useState("");
  const [localHistory, setLocalHistory] = useState<{ id: string; query: string }[]>([]);

  useEffect(() => {
    if (urlSearchId) {
      setActiveSearchId(urlSearchId);
    }
  }, [urlSearchId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("matsearch_history");
      if (stored) {
        setLocalHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const {
    data: reportData,
    isLoading,
    isError,
    error,
    refetch,
  } = useReportQuery(activeSearchId);

  const generateMutation = useGenerateReportMutation();

  const handleSelectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveSearchId(searchInput.trim());
    setSearchInput("");
  };

  const handleRegenerate = async () => {
    if (!activeSearchId || generateMutation.isPending) return;
    try {
      await generateMutation.mutateAsync(activeSearchId);
      refetch();
    } catch (err) {
      console.error("Regenerate error:", err);
    }
  };

  return (
    <div className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00E5FF]"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
              Formal Technical Documentation
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#F1F5F9] mt-1">
            Materials Engineering Reports & Dossiers
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Retrieve or generate evidence-based engineering reports compiled by the Report Agent via GET /api/reports/{activeSearchId}.
          </p>
        </div>

        {/* Search ID Selector */}
        <form onSubmit={handleSelectSearch} className="flex items-center gap-2 font-mono text-xs">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search UUID..."
              className="px-3 py-1.5 bg-[#12181F] border border-[#1F2D3A] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] w-48 sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18222C] border border-[#1F2D3A] text-xs text-[#00E5FF] hover:border-[#00E5FF] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Load</span>
          </button>
        </form>
      </div>

      {/* Quick History Switcher */}
      {localHistory.length > 0 && (
        <div className="p-3 bg-[#12181F] border border-[#1F2D3A] flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-[10px] text-[#94A3B8] uppercase mr-1">Previous Jobs:</span>
          {localHistory.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSearchId(item.id)}
              className={`px-2 py-1 text-[10px] border transition-colors ${
                item.id === activeSearchId
                  ? "bg-[#00363D] text-[#00E5FF] border-[#00E5FF]"
                  : "bg-[#090F15] text-[#94A3B8] border-[#1F2D3A] hover:border-[#00E5FF]"
              }`}
            >
              {item.id.slice(0, 8)}... ({item.query.slice(0, 20)}...)
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="p-16 text-center font-mono text-xs text-[#00E5FF]">
          Retrieving engineering report dossier for {activeSearchId}...
        </div>
      ) : isError || !reportData ? (
        <div className="flex flex-col gap-4">
          <QueryFailedState
            message={`No engineering report currently found for search ID: ${activeSearchId}.`}
            error={error instanceof Error ? error : new Error(String(error))}
            reset={() => refetch()}
          />
          <div className="text-center font-mono">
            <button
              onClick={handleRegenerate}
              disabled={generateMutation.isPending}
              className="px-4 py-2 bg-[#00E5FF] text-[#0B0F12] text-xs font-bold inline-flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{generateMutation.isPending ? "Generating Report..." : "Generate Report For This Search"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="text-[#94A3B8]">
              Active Dossier: <strong className="text-[#00E5FF]">{reportData.search_id}</strong>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={generateMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18222C] border border-[#1F2D3A] text-xs text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF] transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{generateMutation.isPending ? "Regenerating..." : "Regenerate Dossier"}</span>
            </button>
          </div>

          <ReportViewer report={reportData} />
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <WorkstationShell>
      <Suspense fallback={<div className="p-8 text-xs font-mono text-[#00E5FF]">Loading reports view...</div>}>
        <ReportsContent />
      </Suspense>
    </WorkstationShell>
  );
}
