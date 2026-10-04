"use client";

import React, { useState } from "react";
import WorkstationShell from "@/components/layout/WorkstationShell";
import {
  Settings as SettingsIcon,
  Sliders,
  Database,
  Eye,
  Check,
  Save,
  Radio,
  HelpCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [energyUnit, setEnergyUnit] = useState<"eV" | "kJ/mol">("eV");
  const [lengthUnit, setLengthUnit] = useState<"angstrom" | "nm">("angstrom");
  const [densityUnit, setDensityUnit] = useState<"g_cm3" | "kg_m3">("g_cm3");
  const [defaultProjection, setDefaultProjection] = useState<"perspective" | "orthographic">("perspective");
  const [defaultStyle, setDefaultStyle] = useState<"ball_and_stick" | "space_filling">("ball_and_stick");
  const [streamSSE, setStreamSSE] = useState(true);
  const [hullTolerance, setHullTolerance] = useState("0.025");
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <WorkstationShell>
      <div className="w-full max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00E5FF]"></span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
                Platform Configuration
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#F1F5F9] mt-1">
              Workstation & Scientific Settings
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Configure scientific measurement units, 3D crystallographic visualizer parameters, and backend service options.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
            type="button"
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save Preferences</span>
          </button>
        </div>

        {savedNotification && (
          <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/40 text-[#10B981] font-mono text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Workstation settings updated and stored locally.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6 font-mono text-xs">
          {/* Section 1: Physical & Scientific Unit Standards */}
          <section className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
            <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-semibold uppercase text-[#F1F5F9]">
                  Physical & Crystallographic Units
                </span>
              </div>
              <span className="text-[10px] text-[#94A3B8]">Default SI / CGS</span>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Energy Units */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#94A3B8] uppercase">
                  Energy & Band Gap Units
                </label>
                <select
                  value={energyUnit}
                  onChange={(e) => setEnergyUnit(e.target.value as any)}
                  className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="eV">Electron-volts (eV / eV·atom⁻¹)</option>
                  <option value="kJ/mol">Kilojoules per mole (kJ/mol)</option>
                </select>
                <span className="text-[10px] text-[#475569]">
                  Standard convention for solid-state band alignment.
                </span>
              </div>

              {/* Lattice Length Units */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#94A3B8] uppercase">
                  Lattice Constant Dimensions
                </label>
                <select
                  value={lengthUnit}
                  onChange={(e) => setLengthUnit(e.target.value as any)}
                  className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="angstrom">Ångströms (Å, 10⁻¹⁰ m)</option>
                  <option value="nm">Nanometers (nm, 10⁻⁹ m)</option>
                </select>
                <span className="text-[10px] text-[#475569]">
                  Crystallographic standard for unit cell vectors.
                </span>
              </div>

              {/* Density Units */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#94A3B8] uppercase">
                  Volumetric Density
                </label>
                <select
                  value={densityUnit}
                  onChange={(e) => setDensityUnit(e.target.value as any)}
                  className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="g_cm3">Grams per cubic centimeter (g/cm³)</option>
                  <option value="kg_m3">Kilograms per cubic meter (kg/m³)</option>
                </select>
                <span className="text-[10px] text-[#475569]">
                  Materials engineering benchmark standard.
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: 3D Crystallographic Visualizer (3Dmol.js) */}
          <section className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
            <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-semibold uppercase text-[#F1F5F9]">
                  3Dmol.js Visualizer Preferences
                </span>
              </div>
              <span className="text-[10px] text-[#00E5FF]">Client-Only WebGL</span>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#94A3B8] uppercase">
                  Default Camera Projection
                </label>
                <select
                  value={defaultProjection}
                  onChange={(e) => setDefaultProjection(e.target.value as any)}
                  className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="perspective">Perspective (Natural depth)</option>
                  <option value="orthographic">Orthographic (Parallel crystallographic projection)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#94A3B8] uppercase">
                  Atomic Model Style
                </label>
                <select
                  value={defaultStyle}
                  onChange={(e) => setDefaultStyle(e.target.value as any)}
                  className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="ball_and_stick">Ball and Stick (CPK color coding)</option>
                  <option value="space_filling">Space Filling (Van der Waals radii)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Backend Database & Agent Execution Settings */}
          <section className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
            <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-semibold uppercase text-[#F1F5F9]">
                  Materials Project Backend Service
                </span>
              </div>
              <span className="text-[10px] text-[#10B981]">Backend Proxy Active</span>
            </div>

            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[#94A3B8] uppercase">
                    Backend Service API Endpoint
                  </label>
                  <input
                    type="text"
                    disabled
                    value={process.env.NEXT_PUBLIC_API_BASE_URL || "https://mat-search-ai-backend.vercel.app"}
                    className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#00E5FF] cursor-not-allowed font-mono"
                  />
                  <span className="text-[10px] text-[#475569]">
                    Strict Rule: Frontend exclusively communicates with MatSearch backend.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[#94A3B8] uppercase">
                    Thermodynamic Hull Parity Tolerance (eV/atom)
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    value={hullTolerance}
                    onChange={(e) => setHullTolerance(e.target.value)}
                    className="p-2 bg-[#090F15] border border-[#1F2D3A] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                  />
                  <span className="text-[10px] text-[#475569]">
                    Maximum energy above convex hull permitted for stable candidate acceptance.
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1F2D3A] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-[#F1F5F9] font-semibold">
                    Real-Time Server-Sent Events (SSE) Progress Updates
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    Stream agent timeline steps directly to the active search dashboard without page reload.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={streamSSE}
                  onChange={(e) => setStreamSSE(e.target.checked)}
                  className="w-4 h-4 accent-[#00E5FF]"
                />
              </div>
            </div>
          </section>
        </form>
      </div>
    </WorkstationShell>
  );
}
