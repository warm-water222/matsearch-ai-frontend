"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkstationShell from "@/components/layout/WorkstationShell";
import CrystalViewer from "@/components/materials/CrystalViewer";
import QueryFailedState from "@/components/search/QueryFailedState";
import { useMaterialQuery } from "@/lib/hooks";
import {
  Layers,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Database,
  FileText,
  ShieldCheck,
} from "lucide-react";

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ materialId: string }>;
}) {
  const { materialId } = use(params);
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const { data, isLoading, isError, error, refetch } = useMaterialQuery(materialId);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("matsearch_saved");
      if (stored) {
        const savedList = JSON.parse(stored);
        setIsSaved(savedList.some((item: { id: string }) => item.id === materialId));
      }
    } catch {
      // Ignore
    }
  }, [materialId]);

  const handleSaveToggle = () => {
    try {
      const stored = localStorage.getItem("matsearch_saved");
      const savedList = stored ? JSON.parse(stored) : [];
      let updated;
      if (isSaved) {
        updated = savedList.filter((item: { id: string }) => item.id !== materialId);
        setIsSaved(false);
      } else {
        const item = {
          id: materialId,
          formula: data?.material.formula || materialId,
          savedAt: new Date().toISOString(),
          density: data?.material.density?.value,
          bandGap: data?.material.band_gap?.value,
          crystalSystem: data?.material.crystal_system?.value,
        };
        updated = [item, ...savedList];
        setIsSaved(true);
      }
      localStorage.setItem("matsearch_saved", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCompareClick = () => {
    router.push(`/compare?ids=${encodeURIComponent(materialId)}`);
  };

  if (isLoading) {
    return (
      <WorkstationShell>
        <div className="flex-1 flex items-center justify-center p-8 font-mono text-xs text-[#00E5FF]">
          Retrieving real material record for {materialId} from Materials Project via backend...
        </div>
      </WorkstationShell>
    );
  }

  if (isError || !data?.material) {
    return (
      <WorkstationShell>
        <QueryFailedState
          message={`Unable to load material record for identifier ${materialId} from Materials Project.`}
          error={error instanceof Error ? error : new Error(String(error))}
          reset={() => refetch()}
        />
      </WorkstationShell>
    );
  }

  const { material } = data;
  const isStable =
    typeof material.is_stable?.value === "boolean"
      ? material.is_stable.value
      : material.is_stable?.value === 1.0;

  return (
    <WorkstationShell>
      <div className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <Link href="/search" className="hover:text-[#00E5FF] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Search</span>
          </Link>
          <span>/</span>
          <span className="text-[#00E5FF]">{material.formula} ({material.material_id})</span>
        </div>

        {/* Material Header Dossier Bar */}
        <div className="bg-[#12181F] border border-[#1F2D3A] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xl sm:text-2xl font-bold text-[#F1F5F9]">
                {material.formula}
              </span>
              <span className="text-xs px-2 py-0.5 bg-[#090F15] border border-[#1F2D3A] text-[#00E5FF]">
                {material.material_id}
              </span>
              <span className="text-xs px-2 py-0.5 bg-[#18222C] text-[#94A3B8] border border-[#1F2D3A]">
                {material.crystal_system?.value || "Unknown System"}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Source: Materials Project (Computational DFT Record)</span>
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCompareClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] text-xs font-mono text-[#F1F5F9] hover:text-[#00E5FF] transition-colors"
              type="button"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Add to Compare</span>
            </button>

            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono transition-colors ${
                isSaved
                  ? "bg-[#00363D] text-[#00E5FF] border-[#00E5FF]"
                  : "bg-[#18222C] text-[#F1F5F9] border-[#1F2D3A] hover:border-[#00E5FF]"
              }`}
              type="button"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? "Saved in Library" : "Save Material"}</span>
            </button>

            <Link
              href="/reports"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Reports</span>
            </Link>
          </div>
        </div>

        {/* Main Workstation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Crystal Lattice Visualizer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <CrystalViewer
              formula={material.formula}
              materialId={material.material_id}
              crystalSystem={material.crystal_system?.value}
              volume={material.volume?.value}
            />

            {/* Provenance Box */}
            <div className="bg-[#12181F] border border-[#1F2D3A] p-4 flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#00E5FF] font-semibold text-xs uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Scientific Provenance Verification</span>
              </div>
              <p className="text-[#94A3B8] leading-relaxed text-[11px]">
                All displayed numerical properties for {material.formula} are sourced directly from the Materials Project database (`SOURCE_VALUE`). No values are synthetically estimated by the frontend.
              </p>
            </div>
          </div>

          {/* Right Column: Physical & Electronic Properties (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
              <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase text-[#F1F5F9]">
                  Physical & Electronic Readouts
                </span>
                <span className="text-[10px] font-mono text-[#00E5FF]">
                  Materials Project SOURCE_VALUE
                </span>
              </div>

              <div className="p-4 grid grid-cols-2 gap-3 font-mono text-xs">
                {/* Density */}
                <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Density</span>
                  <span className="text-base font-bold text-[#F1F5F9] mt-1">
                    {typeof material.density?.value === "number"
                      ? `${material.density.value.toFixed(3)} g/cm³`
                      : "Unavailable"}
                  </span>
                </div>

                {/* Band Gap */}
                <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Band Gap</span>
                  <span className="text-base font-bold text-[#00E5FF] mt-1">
                    {typeof material.band_gap?.value === "number"
                      ? `${material.band_gap.value.toFixed(3)} eV`
                      : "Unavailable"}
                  </span>
                </div>

                {/* Energy Above Hull */}
                <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Energy Above Hull</span>
                  <span
                    className={`text-base font-bold mt-1 ${
                      material.energy_above_hull?.value === 0
                        ? "text-[#10B981]"
                        : "text-[#F59E0B]"
                    }`}
                  >
                    {typeof material.energy_above_hull?.value === "number"
                      ? `${material.energy_above_hull.value.toFixed(4)} eV/atom`
                      : "Unavailable"}
                  </span>
                </div>

                {/* Formation Energy */}
                <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Formation Energy</span>
                  <span className="text-base font-bold text-[#F1F5F9] mt-1">
                    {typeof material.formation_energy_per_atom?.value === "number"
                      ? `${material.formation_energy_per_atom.value.toFixed(3)} eV/atom`
                      : "Unavailable"}
                  </span>
                </div>

                {/* Unit Cell Volume */}
                <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Unit Cell Volume</span>
                  <span className="text-base font-bold text-[#F1F5F9] mt-1">
                    {typeof material.volume?.value === "number"
                      ? `${material.volume.value.toFixed(2)} Å³`
                      : "Unavailable"}
                  </span>
                </div>

                {/* Thermodynamic Stability Flag */}
                <div className="p-3 bg-[#090F15] border border-[#1F2D3A] flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Convex Hull State</span>
                  <span className="text-xs font-bold mt-2 flex items-center gap-1">
                    {isStable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]">Ground State (is_stable)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span className="text-[#F59E0B]">Above Convex Hull</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkstationShell>
  );
}
