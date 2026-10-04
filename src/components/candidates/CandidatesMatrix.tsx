"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CandidateMaterial, EvaluationResult, EvaluationCheckStatus } from "@/types";
import {
  ArrowUpDown,
  Search,
  CheckSquare,
  Square,
  ArrowRight,
  Layers,
  Filter,
} from "lucide-react";

interface CandidatesMatrixProps {
  materials: CandidateMaterial[];
  evaluations?: EvaluationResult[];
  title?: string;
  subtitle?: string;
  allowSelection?: boolean;
}

export default function CandidatesMatrix({
  materials,
  evaluations = [],
  title = "Candidate Materials Matrix",
  subtitle = "Screened against Materials Project database records via MatSearch backend",
  allowSelection = true,
}: CandidatesMatrixProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterText, setFilterText] = useState("");
  const [sortField, setSortField] = useState<"density" | "band_gap" | "energy_above_hull">("density");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<string>("All");

  const evalMap = useMemo(() => {
    const map = new Map<string, EvaluationResult>();
    for (const e of evaluations) {
      map.set(e.material_id, e);
    }
    return map;
  }, [evaluations]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === materials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(materials.map((m) => m.material_id));
    }
  };

  const handleSort = (field: "density" | "band_gap" | "energy_above_hull") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filtered = useMemo(() => {
    return materials
      .filter((m) => {
        const formula = m.formula?.toLowerCase() || "";
        const id = m.material_id?.toLowerCase() || "";
        const q = filterText.toLowerCase();
        const matchQuery = formula.includes(q) || id.includes(q);

        const system = m.crystal_system?.value || "Unknown";
        const matchSystem =
          selectedSystem === "All" || system.toLowerCase() === selectedSystem.toLowerCase();

        return matchQuery && matchSystem;
      })
      .sort((a, b) => {
        const valA = a[sortField]?.value;
        const valB = b[sortField]?.value;
        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [materials, filterText, selectedSystem, sortField, sortAsc]);

  const handleCompare = () => {
    const idsToCompare =
      selectedIds.length > 0 ? selectedIds : materials.slice(0, 3).map((m) => m.material_id);
    router.push(`/compare?ids=${encodeURIComponent(idsToCompare.join(","))}`);
  };

  const getStatusBadge = (status: EvaluationCheckStatus | string | undefined) => {
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
      {/* Header Bar */}
      <div className="px-4 py-3 bg-[#18222C] border-b border-[#1F2D3A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00E5FF]"></span>
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
              {title}
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1F2D3A] text-[#00E5FF] border border-[#2A3C4D]">
              {filtered.length} Phases Identified
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">{subtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {allowSelection && (
            <button
              onClick={handleCompare}
              disabled={selectedIds.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedIds.length > 0
                  ? "bg-[#00E5FF] text-[#0B0F12] hover:bg-[#4CD6FB]"
                  : "bg-[#1F2D3A] text-[#475569] cursor-not-allowed"
              }`}
              type="button"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#0E141B] border-b border-[#1F2D3A] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter formula or MP-ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#12181F] border border-[#1F2D3A] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] font-mono text-[#94A3B8] flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#00E5FF]" /> System:
          </span>
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="px-2 py-1 bg-[#12181F] border border-[#1F2D3A] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="All">All Systems</option>
            <option value="Cubic">Cubic</option>
            <option value="Orthorhombic">Orthorhombic</option>
            <option value="Hexagonal">Hexagonal</option>
            <option value="Tetragonal">Tetragonal</option>
            <option value="Monoclinic">Monoclinic</option>
            <option value="Trigonal">Trigonal</option>
            <option value="Triclinic">Triclinic</option>
          </select>
        </div>
      </div>

      {/* Candidates Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#090F15] text-[#94A3B8] border-b border-[#1F2D3A] font-mono text-[11px] uppercase tracking-wider select-none">
            <tr>
              {allowSelection && (
                <th className="py-2.5 px-3 w-8">
                  <button
                    onClick={selectAll}
                    className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
                    type="button"
                  >
                    {selectedIds.length === materials.length && materials.length > 0 ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#00E5FF]" />
                    ) : (
                      <Square className="w-3.5 h-3.5" />
                    )}
                  </button>
                </th>
              )}
              <th className="py-2.5 px-3">Formula</th>
              <th className="py-2.5 px-3">Materials Project ID</th>
              <th className="py-2.5 px-3">Symmetry</th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-[#00E5FF]"
                onClick={() => handleSort("density")}
              >
                <div className="flex items-center gap-1">
                  <span>Density (g/cm³)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-[#00E5FF]"
                onClick={() => handleSort("band_gap")}
              >
                <div className="flex items-center gap-1">
                  <span>Band Gap (eV)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-[#00E5FF]"
                onClick={() => handleSort("energy_above_hull")}
              >
                <div className="flex items-center gap-1">
                  <span>Stability (E_hull)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3">Evaluation Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2D3A]/60 font-mono">
            {filtered.map((material) => {
              const isSelected = selectedIds.includes(material.material_id);
              const evaluation = evalMap.get(material.material_id);
              const matchStatus = evaluation?.result || "INCOMPLETE";

              const densityVal = material.density?.value;
              const bandGapVal = material.band_gap?.value;
              const hullVal = material.energy_above_hull?.value;
              const systemVal = material.crystal_system?.value || "N/A";

              return (
                <tr
                  key={material.material_id}
                  className={`hover:bg-[#18222C] transition-colors ${
                    isSelected ? "bg-[#18222C]/70" : ""
                  }`}
                >
                  {allowSelection && (
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => toggleSelect(material.material_id)}
                        className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
                        type="button"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#00E5FF]" />
                        ) : (
                          <Square className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  )}

                  {/* Formula */}
                  <td className="py-2.5 px-3">
                    <Link
                      href={`/materials/${material.material_id}`}
                      className="font-mono text-xs font-bold text-[#F1F5F9] hover:text-[#00E5FF] transition-colors"
                    >
                      {material.formula}
                    </Link>
                  </td>

                  {/* Materials Project ID */}
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 bg-[#090F15] border border-[#1F2D3A] text-[#00E5FF]">
                      {material.material_id}
                    </span>
                  </td>

                  {/* Symmetry */}
                  <td className="py-2.5 px-3 text-[11px] text-[#94A3B8]">
                    {systemVal}
                  </td>

                  {/* Density */}
                  <td className="py-2.5 px-3 text-[11px] text-[#F1F5F9]">
                    {typeof densityVal === "number" ? densityVal.toFixed(3) : "Unavailable"}
                  </td>

                  {/* Band Gap */}
                  <td className="py-2.5 px-3 text-[11px] text-[#F1F5F9]">
                    {typeof bandGapVal === "number" ? bandGapVal.toFixed(3) : "Unavailable"}
                  </td>

                  {/* Energy Above Hull */}
                  <td className="py-2.5 px-3 text-[11px]">
                    {typeof hullVal === "number" ? (
                      <span className={hullVal === 0 ? "text-[#10B981]" : "text-[#F59E0B]"}>
                        {hullVal.toFixed(4)} eV/atom
                      </span>
                    ) : (
                      <span className="text-[#94A3B8]">Unavailable</span>
                    )}
                  </td>

                  {/* Requirement Match Tag */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 border ${getStatusBadge(
                        matchStatus
                      )}`}
                    >
                      {matchStatus}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      href={`/materials/${material.material_id}`}
                      className="inline-flex items-center gap-1 text-[11px] text-[#00E5FF] hover:text-[#4CD6FB] transition-colors"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
