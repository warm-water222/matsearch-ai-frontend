"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import WorkstationShell from "@/components/layout/WorkstationShell";
import {
  History,
  Search,
  CheckCircle2,
  ArrowRight,
  Database,
  Trash2,
} from "lucide-react";

interface LocalSearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<LocalSearchHistoryItem[]>([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("matsearch_history");
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Clear local search history?")) {
      localStorage.removeItem("matsearch_history");
      setSessions([]);
    }
  };

  const filtered = sessions.filter(
    (s) =>
      s.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.id.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <WorkstationShell>
      <div className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00E5FF]"></span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
                Audit Log & Execution History
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#F1F5F9] mt-1">
              Search Execution Records
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Review previous autonomous research pipelines and reload persisted backend states.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18222C] border border-[#1F2D3A] text-xs font-mono text-[#EF4444] hover:border-[#EF4444] transition-colors"
                type="button"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}

            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Launch New Search</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-[#12181F] border border-[#1F2D3A] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search historical query prompt or ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] font-mono"
            />
          </div>

          <div className="text-[11px] font-mono text-[#94A3B8]">
            {filtered.length} Recorded Executions
          </div>
        </div>

        {/* History Table */}
        <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#090F15] border-b border-[#1F2D3A] text-[#94A3B8] text-[11px] uppercase">
                <tr>
                  <th className="p-3">Search Identifier</th>
                  <th className="p-3">Execution Directive</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2D3A]/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#94A3B8]">
                      <div className="flex flex-col items-center gap-3">
                        <span>No historical search sessions found in browser storage.</span>
                        <Link
                          href="/search/9732bb74-6eac-4fab-9549-7fdf116823db"
                          className="px-3.5 py-1.5 bg-[#090F15] border border-[#00E5FF] text-[#00E5FF] text-xs font-mono inline-flex items-center gap-1.5"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>Load Benchmark Search (9732bb74...)</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-[#18222C]/40">
                      <td className="p-3">
                        <span className="text-[#00E5FF] font-semibold">{s.id}</span>
                      </td>
                      <td className="p-3 font-sans max-w-md">
                        <Link
                          href={`/search/${s.id}`}
                          className="text-[#F1F5F9] hover:text-[#00E5FF] transition-colors line-clamp-1"
                        >
                          &ldquo;{s.query}&rdquo;
                        </Link>
                      </td>
                      <td className="p-3 text-[#94A3B8] text-[11px]">
                        {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/search/${s.id}`}
                          className="inline-flex items-center gap-1 text-[#00E5FF] hover:underline"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WorkstationShell>
  );
}
