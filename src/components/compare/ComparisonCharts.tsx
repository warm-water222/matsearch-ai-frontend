"use client";

import React, { useState } from "react";
import { CompareMaterialItem } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { BarChart3, Radar as RadarIcon } from "lucide-react";

interface ComparisonChartsProps {
  materials: CompareMaterialItem[];
}

export default function ComparisonCharts({ materials }: ComparisonChartsProps) {
  const [chartMode, setChartMode] = useState<"bar" | "radar">("bar");

  // Format data for bar chart
  const barData = materials.map((m) => ({
    name: m.formula,
    density: typeof m.density === "number" ? Number(m.density.toFixed(3)) : 0,
    bandGap: typeof m.band_gap === "number" ? Number(m.band_gap.toFixed(3)) : 0,
    formationEnergy:
      typeof m.formation_energy_per_atom === "number"
        ? Number(Math.abs(m.formation_energy_per_atom).toFixed(3))
        : 0,
  }));

  // Format data for radar trade-off comparison (normalized 0 - 100 for key metrics)
  const radarData = [
    {
      metric: "Lightness (Low Density)",
      ...Object.fromEntries(
        materials.map((m) => [
          m.formula,
          typeof m.density === "number"
            ? Math.max(10, Math.min(100, Math.round(100 - m.density * 12)))
            : 50,
        ])
      ),
    },
    {
      metric: "Band Gap Alignment (1-2 eV)",
      ...Object.fromEntries(
        materials.map((m) => [
          m.formula,
          typeof m.band_gap === "number"
            ? Math.max(15, Math.min(100, Math.round(100 - Math.abs(m.band_gap - 1.5) * 35)))
            : 50,
        ])
      ),
    },
    {
      metric: "Convex Hull Stability",
      ...Object.fromEntries(
        materials.map((m) => [
          m.formula,
          typeof m.energy_above_hull === "number"
            ? Math.max(20, Math.min(100, Math.round(100 - m.energy_above_hull * 500)))
            : 50,
        ])
      ),
    },
    {
      metric: "Cohesive Formation Energy",
      ...Object.fromEntries(
        materials.map((m) => [
          m.formula,
          typeof m.formation_energy_per_atom === "number"
            ? Math.min(100, Math.round(Math.abs(m.formation_energy_per_atom) * 40 + 20))
            : 50,
        ])
      ),
    },
    {
      metric: "Crystal Symmetry Order",
      ...Object.fromEntries(
        materials.map((m) => [
          m.formula,
          m.crystal_system === "Cubic"
            ? 95
            : m.crystal_system === "Hexagonal"
            ? 80
            : m.crystal_system === "Tetragonal"
            ? 70
            : 55,
        ])
      ),
    },
  ];

  const COLORS = ["#00E5FF", "#4CD6FB", "#10B981", "#F59E0B", "#A78BFA", "#F43F5E"];

  return (
    <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
      {/* Header with View Toggle */}
      <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
            Physical Property Distributions
          </span>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setChartMode("bar")}
            className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
              chartMode === "bar"
                ? "bg-[#00E5FF] text-[#0B0F12] font-semibold"
                : "bg-[#090F15] text-[#94A3B8] hover:text-[#F1F5F9]"
            }`}
            type="button"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar Chart</span>
          </button>
          <button
            onClick={() => setChartMode("radar")}
            className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
              chartMode === "radar"
                ? "bg-[#00E5FF] text-[#0B0F12] font-semibold"
                : "bg-[#090F15] text-[#94A3B8] hover:text-[#F1F5F9]"
            }`}
            type="button"
          >
            <RadarIcon className="w-3.5 h-3.5" />
            <span>Radar Trade-Off</span>
          </button>
        </div>
      </div>

      {/* Charts Area */}
      <div className="p-4 h-80 w-full">
        {chartMode === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2D3A" vertical={false} />
              <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0F12",
                  borderColor: "#1F2D3A",
                  borderRadius: "0px",
                  color: "#F1F5F9",
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="density" name="Density (g/cm³)" fill="#00E5FF" />
              <Bar dataKey="bandGap" name="Band Gap (eV)" fill="#4CD6FB" />
              <Bar dataKey="formationEnergy" name="|Formation Energy| (eV/atom)" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#1F2D3A" />
              <PolarAngleAxis dataKey="metric" stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <PolarRadiusAxis stroke="#1F2D3A" angle={30} domain={[0, 100]} />
              {materials.map((m, idx) => (
                <Radar
                  key={m.material_id}
                  name={m.formula}
                  dataKey={m.formula}
                  stroke={COLORS[idx % COLORS.length]}
                  fill={COLORS[idx % COLORS.length]}
                  fillOpacity={0.25}
                />
              ))}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0F12",
                  borderColor: "#1F2D3A",
                  borderRadius: "0px",
                  color: "#F1F5F9",
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "11px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Legend */}
      <div className="px-4 py-2 bg-[#090F15] border-t border-[#1F2D3A] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#94A3B8]">
        <div className="flex items-center gap-3">
          {materials.map((m, idx) => (
            <span key={m.material_id} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              ></span>
              <span className="text-[#F1F5F9] font-semibold">{m.formula}</span>
              <span className="text-[#475569]">({m.material_id})</span>
            </span>
          ))}
        </div>
        <span className="text-[#475569]">
          Source: Materials Project records via MatSearch backend
        </span>
      </div>
    </div>
  );
}
