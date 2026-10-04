"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WorkstationShell from "@/components/layout/WorkstationShell";
import {
  Terminal,
  Zap,
  Sliders,
  Sparkles,
  ArrowRight,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
} from "lucide-react";
import { useCreateSearchMutation } from "@/lib/hooks";

export default function NewSearchPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [showConstraints, setShowConstraints] = useState(false);

  // Optional structured constraints
  const [elements, setElements] = useState("");
  const [minDensity, setMinDensity] = useState("");
  const [maxDensity, setMaxDensity] = useState("");
  const [minBandGap, setMinBandGap] = useState("");
  const [maxBandGap, setMaxBandGap] = useState("");
  const [crystalSystem, setCrystalSystem] = useState("All");

  const createSearchMutation = useCreateSearchMutation();

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || createSearchMutation.isPending) return;

    // Combine prompt with any optional structured constraints if they aren't already mentioned
    let finalQuery = prompt.trim();
    const additions: string[] = [];

    if (elements.trim()) additions.push(`composed of ${elements.trim()}`);
    if (minDensity.trim() && maxDensity.trim()) additions.push(`density between ${minDensity} and ${maxDensity} g/cm3`);
    else if (maxDensity.trim()) additions.push(`density below ${maxDensity} g/cm3`);
    else if (minDensity.trim()) additions.push(`density above ${minDensity} g/cm3`);

    if (minBandGap.trim() && maxBandGap.trim()) additions.push(`band gap between ${minBandGap} and ${maxBandGap} eV`);
    else if (maxBandGap.trim()) additions.push(`band gap below ${maxBandGap} eV`);
    else if (minBandGap.trim()) additions.push(`band gap above ${minBandGap} eV`);

    if (crystalSystem !== "All") additions.push(`in ${crystalSystem} crystal system`);

    if (additions.length > 0) {
      finalQuery += ` (${additions.join(", ")})`;
    }

    try {
      const data = await createSearchMutation.mutateAsync({ query: finalQuery });

      // Save to localStorage history
      try {
        const stored = localStorage.getItem("matsearch_history");
        const list = stored ? JSON.parse(stored) : [];
        const item = {
          id: data.search_id,
          query: finalQuery,
          createdAt: new Date().toISOString(),
        };
        const updated = [item, ...list.filter((s: { id: string }) => s.id !== data.search_id)].slice(0, 15);
        localStorage.setItem("matsearch_history", JSON.stringify(updated));
      } catch {
        // Ignore
      }

      router.push(`/search/${data.search_id}`);
    } catch (err) {
      console.error("Failed to start search:", err);
    }
  };

  const applyExemplar = (
    text: string,
    params?: {
      elements?: string;
      density?: string;
      bandgapMin?: string;
      bandgapMax?: string;
      system?: string;
    }
  ) => {
    setPrompt(text);
    if (params) {
      if (params.elements) setElements(params.elements);
      if (params.density) setMaxDensity(params.density);
      if (params.bandgapMin) setMinBandGap(params.bandgapMin);
      if (params.bandgapMax) setMaxBandGap(params.bandgapMax);
      if (params.system) setCrystalSystem(params.system);
      setShowConstraints(true);
    }
  };

  const insertToken = (token: string) => {
    setPrompt((prev) => (prev ? `${prev.trim()} ${token}` : token));
  };

  return (
    <WorkstationShell>
      <div className="w-full max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00E5FF]"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
              Parametric & Natural-Language Specification
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9] font-mono">
            New Materials Engineering Search Directive
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-3xl leading-relaxed">
            Specify your technical performance requirements in natural language. The autonomous agent will deconstruct the directive, query the Materials Project repository, filter candidates, and construct a comparative dossier.
          </p>
        </div>

        {/* Primary Search Console */}
        <section className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
          <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs font-mono font-semibold uppercase text-[#F1F5F9]">
                Requirement Directive Console
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Target: Materials Project Database (Backend Service)
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="p-4 bg-[#090F15] flex flex-col gap-4">
            {/* Natural Language Directive Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nl-prompt" className="text-[11px] font-mono text-[#00E5FF] uppercase font-semibold">
                Natural Language Requirement (Primary Input)
              </label>
              <textarea
                id="nl-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe engineering requirements, e.g. 'Find stable lightweight semiconductor materials with density below 5 g/cm3 and band gap between 1 and 2 eV'..."
                rows={3}
                className="w-full p-3 bg-[#0B0F12] border border-[#1F2D3A] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] resize-none font-mono leading-relaxed"
                required
              />
            </div>

            {/* Error banner */}
            {createSearchMutation.isError && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>{createSearchMutation.error?.message || "Failed to create search on backend."}</span>
              </div>
            )}

            {/* Quick Directive Modifiers */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase mr-1">
                Quick Modifiers:
              </span>
              <button
                type="button"
                onClick={() => insertToken("with band gap between 1.0 and 2.0 eV")}
                className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] border border-[#1F2D3A] text-[10px] font-mono transition-colors"
              >
                + Band Gap 1-2 eV
              </button>
              <button
                type="button"
                onClick={() => insertToken("with density below 5 g/cm3")}
                className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] border border-[#1F2D3A] text-[10px] font-mono transition-colors"
              >
                + Density &lt; 5 g/cm³
              </button>
              <button
                type="button"
                onClick={() => insertToken("with thermodynamic stability")}
                className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] border border-[#1F2D3A] text-[10px] font-mono transition-colors"
              >
                + Stable
              </button>
              <button
                type="button"
                onClick={() => insertToken("in cubic crystal system")}
                className="px-2 py-1 bg-[#12181F] hover:bg-[#18222C] text-[#94A3B8] hover:text-[#00E5FF] border border-[#1F2D3A] text-[10px] font-mono transition-colors"
              >
                + Cubic Symmetry
              </button>
            </div>

            {/* Optional Structured Constraints Toggle */}
            <div className="pt-2 border-t border-[#1F2D3A]">
              <button
                type="button"
                onClick={() => setShowConstraints(!showConstraints)}
                className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>
                  {showConstraints
                    ? "Hide Structured Constraints (Optional)"
                    : "Add Structured Constraints (Optional — non-blocking)"}
                </span>
                {showConstraints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showConstraints && (
                <div className="mt-3 p-4 bg-[#12181F] border border-[#1F2D3A] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                  {/* Elements */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#94A3B8] uppercase">Elements (Comma-separated)</label>
                    <input
                      type="text"
                      value={elements}
                      onChange={(e) => setElements(e.target.value)}
                      placeholder="e.g. Si, Ga, As, P"
                      className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  {/* Density Max */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#94A3B8] uppercase">Max Density (g/cm³)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={maxDensity}
                      onChange={(e) => setMaxDensity(e.target.value)}
                      placeholder="5.0"
                      className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  {/* Band Gap Range */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#94A3B8] uppercase">Band Gap (Min - Max eV)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        value={minBandGap}
                        onChange={(e) => setMinBandGap(e.target.value)}
                        placeholder="1.0"
                        className="w-1/2 p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                      />
                      <span className="text-[#475569]">-</span>
                      <input
                        type="number"
                        step="0.1"
                        value={maxBandGap}
                        onChange={(e) => setMaxBandGap(e.target.value)}
                        placeholder="2.0"
                        className="w-1/2 p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  {/* Crystal System */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#94A3B8] uppercase">Crystal System</label>
                    <select
                      value={crystalSystem}
                      onChange={(e) => setCrystalSystem(e.target.value)}
                      className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="All">All Systems</option>
                      <option value="Cubic">Cubic</option>
                      <option value="Hexagonal">Hexagonal</option>
                      <option value="Orthorhombic">Orthorhombic</option>
                      <option value="Tetragonal">Tetragonal</option>
                      <option value="Monoclinic">Monoclinic</option>
                      <option value="Trigonal">Trigonal</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#475569]">
                POST /api/search/ • Real-time SSE Stream
              </span>

              <button
                type="submit"
                disabled={createSearchMutation.isPending || !prompt.trim()}
                className="px-5 py-2.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-[#0B0F12] font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{createSearchMutation.isPending ? "Starting Autonomous Agent..." : "Start Agent Search"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </section>

        {/* Section: Exemplar Research Directives */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#1F2D3A] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs font-mono font-semibold uppercase text-[#F1F5F9]">
                Exemplar Engineering Directives
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Select any exemplar to populate the pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Exemplar 1: Production Verified Benchmark */}
            <div
              onClick={() =>
                applyExemplar(
                  "Find stable lightweight semiconductor materials with density below 5 g/cm3 and band gap between 1 and 2 eV",
                  { density: "5.0", bandgapMin: "1.0", bandgapMax: "2.0" }
                )
              }
              className="p-4 bg-[#12181F] hover:bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#18222C] text-[#00E5FF] border border-[#1F2D3A]">
                    Production Benchmark
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#00E5FF] transition-colors" />
                </div>
                <p className="text-xs text-[#F1F5F9] group-hover:text-[#00E5FF] transition-colors leading-relaxed">
                  &ldquo;Find stable lightweight semiconductor materials with density below 5 g/cm3 and band gap between 1 and 2 eV&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#1F2D3A] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>Target: Semiconductors</span>
                <span className="text-[#00E5FF] font-semibold">Load Prompt ↵</span>
              </div>
            </div>

            {/* Exemplar 2 */}
            <div
              onClick={() =>
                applyExemplar(
                  "Find solid-state lithium battery electrolyte candidate materials with band gap > 3.0 eV",
                  { elements: "Li, O", bandgapMin: "3.0" }
                )
              }
              className="p-4 bg-[#12181F] hover:bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#18222C] text-[#4CD6FB] border border-[#1F2D3A]">
                    Solid Electrolytes
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#4CD6FB] transition-colors" />
                </div>
                <p className="text-xs text-[#F1F5F9] group-hover:text-[#4CD6FB] transition-colors leading-relaxed">
                  &ldquo;Find solid-state lithium battery electrolyte candidate materials with band gap &gt; 3.0 eV&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#1F2D3A] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>Target: Solid-State Storage</span>
                <span className="text-[#4CD6FB] font-semibold">Load Prompt ↵</span>
              </div>
            </div>

            {/* Exemplar 3 */}
            <div
              onClick={() =>
                applyExemplar(
                  "Identify wide bandgap power electronics materials with band gap between 3.0 and 6.0 eV",
                  { bandgapMin: "3.0", bandgapMax: "6.0" }
                )
              }
              className="p-4 bg-[#12181F] hover:bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#18222C] text-[#10B981] border border-[#1F2D3A]">
                    Power Semiconductors
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#10B981] transition-colors" />
                </div>
                <p className="text-xs text-[#F1F5F9] group-hover:text-[#10B981] transition-colors leading-relaxed">
                  &ldquo;Identify wide bandgap power electronics materials with band gap between 3.0 and 6.0 eV&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#1F2D3A] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>Target: High-Voltage Switching</span>
                <span className="text-[#10B981] font-semibold">Load Prompt ↵</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </WorkstationShell>
  );
}
