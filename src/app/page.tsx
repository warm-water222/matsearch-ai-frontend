"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WorkstationShell from "@/components/layout/WorkstationShell";
import {
  Terminal,
  Zap,
  Sliders,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  AlertOctagon,
  Clock,
} from "lucide-react";
import { useCreateSearchMutation } from "@/lib/hooks";

interface LocalSearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [recentSearches, setRecentSearches] = useState<LocalSearchHistoryItem[]>([]);
  const createSearchMutation = useCreateSearchMutation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("matsearch_history");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || createSearchMutation.isPending) return;

    try {
      const data = await createSearchMutation.mutateAsync({ query: prompt.trim() });
      
      // Save to localStorage history
      try {
        const item: LocalSearchHistoryItem = {
          id: data.search_id,
          query: prompt.trim(),
          createdAt: new Date().toISOString(),
        };
        const updated = [item, ...recentSearches.filter((s) => s.id !== data.search_id)].slice(0, 10);
        localStorage.setItem("matsearch_history", JSON.stringify(updated));
        setRecentSearches(updated);
      } catch {
        // Ignore
      }

      router.push(`/search/${data.search_id}`);
    } catch (err) {
      console.error("Failed to initialize search:", err);
    }
  };

  const insertToken = (tokenText: string) => {
    setPrompt((prev) => (prev ? `${prev.trim()} ${tokenText}` : tokenText));
  };

  return (
    <WorkstationShell>
      <div className="w-full max-w-[1560px] mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Section 1: Workstation Header & Overview */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#18222C] border border-[#1F2D3A]">
              <span className="w-1.5 h-1.5 bg-[#00E5FF]"></span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
                Autonomous Materials Discovery Platform
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#475569]">
              LIVE BACKEND
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
            <div className="max-w-4xl flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F1F5F9] font-mono">
                Autonomous Materials Discovery & Metallurgical Engineering
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
                Direct your autonomous materials research agent to interpret engineering directives, query Materials Project crystallographic records via backend services, screen multi-property trade-offs, and generate comprehensive validation dossiers.
              </p>
            </div>

            {/* Stat Counters */}
            <div className="flex items-center gap-3 self-start lg:self-end">
              <div className="px-3.5 py-2 bg-[#12181F] border border-[#1F2D3A] flex flex-col">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">
                  Target Database
                </span>
                <span className="text-sm font-mono font-bold text-[#00E5FF]">
                  Materials Project
                </span>
              </div>
              <div className="px-3.5 py-2 bg-[#12181F] border border-[#1F2D3A] flex flex-col">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">
                  Evaluation Logic
                </span>
                <span className="text-sm font-mono font-bold text-[#10B981]">
                  Deterministic + Critic
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Section 2: Agent Directive Workstation Search Box */}
        <section className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
          {/* Directive Box Header */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#F1F5F9] font-semibold">
                Agent Directive Input
              </span>
              <span className="text-[#475569] text-[11px] font-mono">
                
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2 py-0.5 bg-[#090F15] text-[#94A3B8] border border-[#1F2D3A]">
                POST /api/search/
              </span>
              <span className="px-2 py-0.5 bg-[#090F15] text-[#00E5FF] border border-[#1F2D3A]">
                Materials Project
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleStartSearch} className="p-4 bg-[#090F15] flex flex-col gap-3">
            <label className="sr-only" htmlFor="agent-directive">
              Natural language materials specification directive
            </label>
            <textarea
              id="agent-directive"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your engineering requirement in natural language, e.g. 'Find stable lightweight semiconductor materials with density below 5 g/cm3 and band gap between 1 and 2 eV'..."
              rows={3}
              className="w-full bg-[#0B0F12] border border-[#1F2D3A] p-3 text-xs sm:text-sm text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] resize-none leading-relaxed font-mono"
            />

            {/* Error Message if mutation fails */}
            {createSearchMutation.isError && (
              <div className="p-2.5 bg-[#EF4444]/10 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>{createSearchMutation.error?.message || "Failed to create search on backend."}</span>
              </div>
            )}

            {/* Parameter / Directive Action Bar */}
            <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Quick Filter Insertion Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider mr-1">
                  Directives:
                </span>
                <button
                  type="button"
                  onClick={() => insertToken("with band gap between 1 and 2 eV")}
                  className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-[10px] font-mono border border-[#1F2D3A]"
                >
                  + Band Gap 1-2 eV
                </button>
                <button
                  type="button"
                  onClick={() => insertToken("with density below 5 g/cm3")}
                  className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-[10px] font-mono border border-[#1F2D3A]"
                >
                  + Density &lt; 5 g/cm³
                </button>
                <button
                  type="button"
                  onClick={() => insertToken("with high stability")}
                  className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-[10px] font-mono border border-[#1F2D3A]"
                >
                  + Stable
                </button>
                <button
                  type="button"
                  onClick={() => insertToken("lightweight semiconductor")}
                  className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-[10px] font-mono border border-[#1F2D3A]"
                >
                  + Lightweight Semiconductor
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/search"
                  className="px-3.5 py-2 bg-[#18222C] border border-[#1F2D3A] text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF] transition-colors text-xs font-medium flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Specification Console</span>
                </Link>

                <button
                  type="submit"
                  disabled={createSearchMutation.isPending || !prompt.trim()}
                  className="px-4 py-2 bg-[#00E5FF] hover:bg-[#4CD6FB] text-[#0B0F12] font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{createSearchMutation.isPending ? "Connecting to Backend..." : "Initialize Agent Search"}</span>
                  <span className="text-[10px] font-mono bg-[#0B0F12]/20 px-1 py-0.5">
                    ⌘↵
                  </span>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Section 3: 6-Step Agent Pipeline Preview */}
        <section className="bg-[#12181F] border border-[#1F2D3A] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#1F2D3A] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs font-mono font-semibold uppercase text-[#F1F5F9]">
                Autonomous Multi-Tier Agent Workflow
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Automated Parity & Criticism
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 font-mono text-[11px]">
            {[
              { step: 1, title: "Requirement Parsing", desc: "Deconstructs prompt into physics constraints" },
              { step: 2, title: "Research Plan", desc: "Formulates screening pipeline & bounds" },
              { step: 3, title: "Materials Project", desc: "Queries live scientific database" },
              { step: 4, title: "Candidate Evaluation", desc: "Deterministic multi-property screening" },
              { step: 5, title: "Critic Validation", desc: "Flags qualitative ambiguity & hull stability" },
              { step: 6, title: "Dossier Generation", desc: "Builds comprehensive engineering report" },
            ].map((st) => (
              <div key={st.step} className="p-2.5 bg-[#090F15] border border-[#1F2D3A] flex flex-col gap-1">
                <span className="text-[10px] text-[#00E5FF] font-bold">
                  STAGE 0{st.step}
                </span>
                <span className="text-xs text-[#F1F5F9] font-semibold">{st.title}</span>
                <span className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">
                  {st.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Recent Search Sessions & Benchmark Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Searches */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-[#F1F5F9] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#00E5FF]" />
                Recent Search Executions
              </span>
              <Link href="/history" className="text-[11px] font-mono text-[#00E5FF] hover:underline">
                View All History →
              </Link>
            </div>

            <div className="space-y-2">
              {recentSearches.length > 0 ? (
                recentSearches.map((sess) => (
                  <Link
                    key={sess.id}
                    href={`/search/${sess.id}`}
                    className="p-3 bg-[#12181F] hover:bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] transition-all flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#00E5FF] font-semibold">{sess.id}</span>
                      <span className="text-[#94A3B8]">
                        {new Date(sess.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#F1F5F9] group-hover:text-[#00E5FF] transition-colors line-clamp-1">
                      &ldquo;{sess.query}&rdquo;
                    </p>
                  </Link>
                ))
              ) : (
                <div className="p-4 bg-[#12181F] border border-[#1F2D3A] flex flex-col gap-2">
                  <span className="text-xs text-[#94A3B8]">No recent searches yet in this browser.</span>
                  <Link
                    href="/search/9732bb74-6eac-4fab-9549-7fdf116823db"
                    className="p-2.5 bg-[#090F15] border border-[#1F2D3A] hover:border-[#00E5FF] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-[10px] font-mono text-[#00E5FF]">EXAMPLE SEARCH</div>
                      <div className="text-xs text-[#F1F5F9] font-mono">9732bb74-6eac-4fab-9549-7fdf116823db</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00E5FF]" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Featured Material Quick Links */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-[#F1F5F9] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00E5FF]" />
                Materials Project Benchmarks
              </span>
              <Link href="/saved" className="text-[11px] font-mono text-[#00E5FF] hover:underline">
                Saved Materials →
              </Link>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                { id: "mp-149", formula: "Si", system: "Cubic", bandGap: "0.61 eV", density: "2.31 g/cm³" },
                { id: "mp-13", formula: "Fe", system: "Cubic", bandGap: "0.00 eV", density: "7.87 g/cm³" },
                { id: "mp-560328", formula: "Ag15P4S16Cl3", system: "Cubic", bandGap: "1.23 eV", density: "4.59 g/cm³" },
                { id: "mp-1190325", formula: "Ag2P2PdO7", system: "Monoclinic", bandGap: "1.17 eV", density: "4.76 g/cm³" },
              ].map((m) => (
                <Link
                  key={m.id}
                  href={`/materials/${m.id}`}
                  className="p-3 bg-[#12181F] hover:bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] transition-all flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F1F5F9] group-hover:text-[#00E5FF]">
                        {m.formula}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#475569]">
                      {m.id} • {m.system}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-[#F1F5F9]">
                      Eg: {m.bandGap}
                    </div>
                    <div className="text-[10px] text-[#94A3B8]">
                      ρ: {m.density}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WorkstationShell>
  );
}
