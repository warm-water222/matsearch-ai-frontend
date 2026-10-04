"use client";

import React, { useEffect, useState, Suspense, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import WorkstationShell from "@/components/layout/WorkstationShell";
import ComparisonCharts from "@/components/compare/ComparisonCharts";
import { CompareMaterialItem } from "@/types";
import { useCompareMaterialsMutation } from "@/lib/hooks";
import {
  ArrowLeftRight,
  Plus,
  Trash2,
  Download,
  AlertOctagon,
  Database,
  ArrowRight,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawIds = searchParams.get("ids");

  const [materialIds, setMaterialIds] = useState<string[]>(() => {
    if (rawIds) {
      const parsed = rawIds.split(",").map((s) => s.trim()).filter(Boolean);
      if (parsed.length >= 2) return parsed.slice(0, 10);
      if (parsed.length === 1) return [parsed[0], "mp-149"];
    }
    return ["mp-149", "mp-13"];
  });

  const [newMaterialInput, setNewMaterialInput] = useState("");
  const [comparedData, setComparedData] = useState<CompareMaterialItem[]>([]);
  const compareMutation = useCompareMaterialsMutation();

  useEffect(() => {
    if (materialIds.length >= 2) {
      compareMutation.mutate(
        { material_ids: materialIds },
        {
          onSuccess: (data) => {
            setComparedData(data.materials || []);
          },
        }
      );
    }
  }, [materialIds]);

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = newMaterialInput.trim().toLowerCase();
    if (!cleanId) return;

    if (!cleanId.startsWith("mp-")) {
      alert("Please enter a valid Materials Project ID starting with 'mp-', e.g. 'mp-560328'.");
      return;
    }

    if (materialIds.includes(cleanId)) {
      alert("Material is already in comparison list.");
      return;
    }

    if (materialIds.length >= 10) {
      alert("Maximum of 10 materials can be compared simultaneously (backend limit).");
      return;
    }

    const updated = [...materialIds, cleanId];
    setMaterialIds(updated);
    setNewMaterialInput("");
    router.replace(`/compare?ids=${encodeURIComponent(updated.join(","))}`);
  };

  const removeMaterial = (id: string) => {
    if (materialIds.length <= 2) {
      alert("Comparison requires at least 2 materials.");
      return;
    }
    const updated = materialIds.filter((item) => item !== id);
    setMaterialIds(updated);
    router.replace(`/compare?ids=${encodeURIComponent(updated.join(","))}`);
  };

  return (
    <div className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00E5FF]"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
              Multi-Candidate Trade-Off Matrix
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#F1F5F9] mt-1">
            Compare Materials & Physical Envelopes
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Side-by-side crystallographic, electronic, and thermodynamic comparison from Materials Project records via POST /api/compare/.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Add Material ID Input */}
          <form onSubmit={handleAddMaterial} className="flex items-center gap-1 font-mono text-xs">
            <input
              type="text"
              value={newMaterialInput}
              onChange={(e) => setNewMaterialInput(e.target.value)}
              placeholder="e.g. mp-560328"
              className="px-2.5 py-1.5 bg-[#12181F] border border-[#1F2D3A] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] w-32"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 bg-[#18222C] border border-[#1F2D3A] text-xs font-mono text-[#F1F5F9] hover:border-[#00E5FF] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Add</span>
            </button>
          </form>

          <Link
            href="/reports"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Reports</span>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {compareMutation.isError && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{compareMutation.error?.message || "Failed to compare materials."}</span>
        </div>
      )}

      {compareMutation.isPending ? (
        <div className="p-12 text-center font-mono text-xs text-[#00E5FF]">
          Loading comparative matrices from Materials Project backend...
        </div>
      ) : comparedData.length === 0 ? (
        <div className="p-12 bg-[#12181F] border border-[#1F2D3A] text-center font-mono">
          <p className="text-xs text-[#94A3B8] mb-4">No material records returned for comparison.</p>
          <button
            onClick={() => setMaterialIds(["mp-149", "mp-13"])}
            className="px-4 py-2 bg-[#00E5FF] text-[#0B0F12] text-xs font-bold"
          >
            Load Benchmark Pair (Si vs Fe)
          </button>
        </div>
      ) : (
        <>
          {/* Visual Comparison Charts */}
          <ComparisonCharts materials={comparedData} />

          {/* Side-by-Side Comparison Matrix Table */}
          <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col overflow-hidden">
            <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-mono font-semibold uppercase text-[#F1F5F9]">
                  Comparative Property Matrix
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">
                {comparedData.length} Materials Screened (Materials Project SOURCE_VALUE)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#090F15] border-b border-[#1F2D3A]">
                    <th className="p-3 w-56 text-[#94A3B8] text-[11px] uppercase">
                      Physical Attribute
                    </th>
                    {comparedData.map((m) => (
                      <th key={m.material_id} className="p-3 text-[#F1F5F9] min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/materials/${m.material_id}`}
                            className="font-bold text-sm text-[#00E5FF] hover:underline"
                          >
                            {m.formula}
                          </Link>
                          {comparedData.length > 2 && (
                            <button
                              onClick={() => removeMaterial(m.material_id)}
                              className="text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                              title="Remove from comparison"
                              type="button"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="text-[10px] text-[#475569]">{m.material_id}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1F2D3A]/60">
                  {/* Density */}
                  <tr className="hover:bg-[#18222C]/40">
                    <td className="p-3 text-[#94A3B8]">Density (g/cm³)</td>
                    {comparedData.map((m) => (
                      <td key={m.material_id} className="p-3 text-[#F1F5F9] font-bold">
                        {typeof m.density === "number" ? m.density.toFixed(3) : "Unavailable"}
                      </td>
                    ))}
                  </tr>

                  {/* Band Gap */}
                  <tr className="hover:bg-[#18222C]/40">
                    <td className="p-3 text-[#94A3B8]">Band Gap (eV)</td>
                    {comparedData.map((m) => (
                      <td key={m.material_id} className="p-3 text-[#00E5FF] font-bold">
                        {typeof m.band_gap === "number" ? `${m.band_gap.toFixed(3)} eV` : "Unavailable"}
                      </td>
                    ))}
                  </tr>

                  {/* Stability / Hull */}
                  <tr className="hover:bg-[#18222C]/40">
                    <td className="p-3 text-[#94A3B8]">Thermodynamic State</td>
                    {comparedData.map((m) => (
                      <td key={m.material_id} className="p-3">
                        {typeof m.energy_above_hull === "number" ? (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 border ${
                              m.energy_above_hull === 0
                                ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                                : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                            }`}
                          >
                            {m.energy_above_hull.toFixed(4)} eV/atom (Hull)
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">Unavailable</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Formation Energy */}
                  <tr className="hover:bg-[#18222C]/40">
                    <td className="p-3 text-[#94A3B8]">Formation Energy</td>
                    {comparedData.map((m) => (
                      <td key={m.material_id} className="p-3 text-[#F1F5F9]">
                        {typeof m.formation_energy_per_atom === "number"
                          ? `${m.formation_energy_per_atom.toFixed(3)} eV/atom`
                          : "Unavailable"}
                      </td>
                    ))}
                  </tr>

                  {/* Unit Cell Volume */}
                  <tr className="hover:bg-[#18222C]/40">
                    <td className="p-3 text-[#94A3B8]">Unit Cell Volume</td>
                    {comparedData.map((m) => (
                      <td key={m.material_id} className="p-3 text-[#F1F5F9]">
                        {typeof m.volume === "number" ? `${m.volume.toFixed(2)} Å³` : "Unavailable"}
                      </td>
                    ))}
                  </tr>

                  {/* Crystal System */}
                  <tr className="hover:bg-[#18222C]/40">
                    <td className="p-3 text-[#94A3B8]">Crystal Symmetry</td>
                    {comparedData.map((m) => (
                      <td key={m.material_id} className="p-3 text-[#94A3B8]">
                        {m.crystal_system || "Unknown"}
                      </td>
                    ))}
                  </tr>

                  {/* Provenance */}
                  <tr className="hover:bg-[#18222C]/40">
                    <td className="p-3 text-[#94A3B8]">Data Provenance</td>
                    {comparedData.map((m) => (
                      <td key={m.material_id} className="p-3 text-[#475569] text-[10px]">
                        {m.provenance?.source || "Materials Project"} ({m.provenance?.values || "SOURCE_VALUE"})
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <WorkstationShell>
      <Suspense fallback={<div className="p-8 text-xs font-mono text-[#00E5FF]">Loading comparison parameters...</div>}>
        <CompareContent />
      </Suspense>
    </WorkstationShell>
  );
}
