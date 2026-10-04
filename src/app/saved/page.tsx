"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WorkstationShell from "@/components/layout/WorkstationShell";
import {
  Bookmark,
  Search,
  Trash2,
  Layers,
  ArrowRight,
} from "lucide-react";

interface SavedMaterialItem {
  id: string;
  formula: string;
  savedAt: string;
  density?: number;
  bandGap?: number;
  crystalSystem?: string;
  notes?: string;
}

export default function SavedMaterialsPage() {
  const [savedList, setSavedList] = useState<SavedMaterialItem[]>([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("matsearch_saved");
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => {
          setSavedList(parsed);
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  const removeSaved = (id: string) => {
    const updated = savedList.filter((item) => item.id !== id);
    setSavedList(updated);
    try {
      localStorage.setItem("matsearch_saved", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const filtered = savedList.filter(
    (item) =>
      item.formula.toLowerCase().includes(filterText.toLowerCase()) ||
      item.id.toLowerCase().includes(filterText.toLowerCase())
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
                Curated Materials Library (Client Storage)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#F1F5F9] mt-1">
              Saved Candidate Materials
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Pinned crystalline phases across research sessions for comparative evaluation and report compilation.
            </p>
          </div>

          {savedList.length >= 2 && (
            <Link
              href={`/compare?ids=${encodeURIComponent(savedList.map((s) => s.id).slice(0, 10).join(","))}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare All Saved ({savedList.length})</span>
            </Link>
          )}
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-[#12181F] border border-[#1F2D3A] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search formula or MP-ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] font-mono"
            />
          </div>

          <div className="text-[11px] font-mono text-[#94A3B8]">
            {filtered.length} Bookmarked Phases
          </div>
        </div>

        {/* Grid of Saved Materials */}
        {filtered.length === 0 ? (
          <div className="p-12 bg-[#12181F] border border-[#1F2D3A] text-center font-mono">
            <p className="text-xs text-[#94A3B8] mb-4">No saved materials in local storage.</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link href="/materials/mp-149" className="px-4 py-2 bg-[#18222C] border border-[#1F2D3A] text-[#00E5FF] text-xs font-bold inline-block hover:border-[#00E5FF]">
                View Silicon (mp-149)
              </Link>
              <Link href="/materials/mp-13" className="px-4 py-2 bg-[#18222C] border border-[#1F2D3A] text-[#00E5FF] text-xs font-bold inline-block hover:border-[#00E5FF]">
                View Iron (mp-13)
              </Link>
              <Link href="/search" className="px-4 py-2 bg-[#00E5FF] text-[#0B0F12] text-xs font-bold inline-block">
                Start New Search
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-[#12181F] border border-[#1F2D3A] p-4 flex flex-col justify-between hover:border-[#00E5FF]/60 transition-colors group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/materials/${item.id}`}
                          className="text-base font-bold font-mono text-[#F1F5F9] group-hover:text-[#00E5FF] transition-colors"
                        >
                          {item.formula}
                        </Link>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#090F15] text-[#00E5FF] border border-[#1F2D3A]">
                          {item.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">
                        {item.crystalSystem || "Materials Project record"}
                      </div>
                    </div>

                    <button
                      onClick={() => removeSaved(item.id)}
                      className="text-[#475569] hover:text-[#EF4444] transition-colors p-1"
                      title="Remove from saved library"
                      type="button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-[#090F15] border border-[#1F2D3A] font-mono text-center text-xs">
                    <div>
                      <div className="text-[10px] text-[#94A3B8]">ρ (g/cm³)</div>
                      <div className="font-semibold text-[#F1F5F9]">
                        {typeof item.density === "number" ? item.density.toFixed(2) : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#94A3B8]">Eg (eV)</div>
                      <div className="font-semibold text-[#00E5FF]">
                        {typeof item.bandGap === "number" ? item.bandGap.toFixed(2) : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1F2D3A] flex items-center justify-between font-mono text-xs">
                  <span className="text-[10px] text-[#475569]">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/materials/${item.id}`}
                    className="inline-flex items-center gap-1 text-[#00E5FF] hover:underline"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WorkstationShell>
  );
}
