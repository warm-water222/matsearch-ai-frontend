"use client";

import React, { useEffect, useRef, useState } from "react";
import { Atom, Box, Download, Eye, RotateCcw, Info } from "lucide-react";

interface CrystalViewerProps {
  formula: string;
  materialId: string;
  crystalSystem?: string;
  volume?: number;
  cifString?: string;
}

export default function CrystalViewer({
  formula,
  materialId,
  crystalSystem = "Unknown",
  volume,
  cifString,
}: CrystalViewerProps) {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showUnitCell, setShowUnitCell] = useState(true);
  const [perspective, setPerspective] = useState(true);
  const [viewerInstance, setViewerInstance] = useState<unknown>(null);

  useEffect(() => {
    let viewer: {
      clear: () => void;
      addModel: (data: string, format: string) => void;
      setStyle: (sel: unknown, style: unknown) => void;
      addUnitCell?: () => void;
      zoomTo: () => void;
      render: () => void;
      setCameraParameters?: (params: unknown) => void;
    } | null = null;
    let isMounted = true;

    async function init3Dmol() {
      if (!cifString || !viewerContainerRef.current) return;

      try {
        const molModule = await import("3dmol");
        const $3Dmol = (molModule as unknown as { default?: unknown }).default || (window as unknown as { $3Dmol?: unknown }).$3Dmol;

        if (!$3Dmol || !viewerContainerRef.current || !isMounted) return;

        viewerContainerRef.current.innerHTML = "";

        const createViewer = (
          $3Dmol as {
            createViewer: (
              el: HTMLElement,
              opts: unknown
            ) => typeof viewer;
            elementColors?: { rasmol?: unknown };
          }
        ).createViewer;

        viewer = createViewer(viewerContainerRef.current, {
          backgroundColor: "#0B0F12",
        });

        if (viewer) {
          viewer.addModel(cifString, "cif");
          viewer.setStyle(
            {},
            { sphere: { scale: 0.35, colorscheme: "Jmol" }, stick: { radius: 0.12, color: "#3B494C" } }
          );

          if (showUnitCell && viewer.addUnitCell) {
            viewer.addUnitCell();
          }

          viewer.zoomTo();
          viewer.render();

          if (isMounted) {
            setViewerInstance(viewer);
            setIsInitialized(true);
          }
        }
      } catch (err) {
        console.warn("3Dmol initialization note:", err);
        if (isMounted) setIsInitialized(false);
      }
    }

    if (cifString) {
      init3Dmol();
    }

    return () => {
      isMounted = false;
      if (viewer && viewer.clear) {
        viewer.clear();
      }
    };
  }, [cifString, showUnitCell]);

  const resetCamera = () => {
    if (viewerInstance && typeof (viewerInstance as { zoomTo?: () => void; render?: () => void }).zoomTo === "function") {
      (viewerInstance as { zoomTo: () => void; render: () => void }).zoomTo();
      (viewerInstance as { zoomTo: () => void; render: () => void }).render();
    }
  };

  const toggleBoundingBox = () => {
    setShowUnitCell(!showUnitCell);
  };

  const toggleProjection = () => {
    setPerspective(!perspective);
    if (
      viewerInstance &&
      typeof (viewerInstance as { setCameraParameters?: (p: unknown) => void; render?: () => void }).setCameraParameters === "function"
    ) {
      (viewerInstance as { setCameraParameters: (p: unknown) => void; render: () => void }).setCameraParameters({
        orthographic: !perspective,
      });
      (viewerInstance as { setCameraParameters: (p: unknown) => void; render: () => void }).render();
    }
  };

  const downloadCif = () => {
    if (!cifString) return;
    const blob = new Blob([cifString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formula}_${materialId}.cif`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#12181F] border border-[#1F2D3A] flex flex-col">
      {/* Header Controls */}
      <div className="px-4 py-2.5 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
            3D Crystal Structure
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            ({formula} • {crystalSystem})
          </span>
        </div>

        {cifString && (
          <div className="flex items-center gap-1">
            <button
              onClick={resetCamera}
              className="p-1.5 hover:bg-[#1F2D3A] text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              title="Reset Camera"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleBoundingBox}
              className={`p-1.5 hover:bg-[#1F2D3A] transition-colors ${
                showUnitCell ? "text-[#00E5FF]" : "text-[#94A3B8]"
              }`}
              title="Toggle Unit Cell Box"
              type="button"
            >
              <Box className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleProjection}
              className={`p-1.5 hover:bg-[#1F2D3A] transition-colors ${
                perspective ? "text-[#00E5FF]" : "text-[#94A3B8]"
              }`}
              title="Toggle Perspective / Orthographic"
              type="button"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={downloadCif}
              className="p-1.5 hover:bg-[#1F2D3A] text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              title="Download CIF"
              type="button"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3D Canvas or Empty Structure Notice */}
      <div className="relative w-full h-72 sm:h-80 bg-[#0B0F12] overflow-hidden select-none flex items-center justify-center p-6 text-center">
        {cifString ? (
          <div
            ref={viewerContainerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ position: "relative" }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 max-w-md font-mono">
            <div className="w-12 h-12 bg-[#18222C] border border-[#1F2D3A] flex items-center justify-center text-[#00E5FF]">
              <Atom className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F1F5F9] mb-1">
                Crystal structure visualization unavailable for this material.
              </p>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                The Materials Project backend endpoint provides validated thermodynamic and electronic scalar properties for {formula} ({materialId}), but raw crystallographic CIF/atomic coordinate arrays are not supplied in this API response.
              </p>
            </div>
            {typeof volume === "number" && (
              <div className="px-2.5 py-1 bg-[#12181F] border border-[#1F2D3A] text-[10px] text-[#94A3B8]">
                Unit Cell Volume: <span className="text-[#00E5FF] font-bold">{volume.toFixed(2)} Å³</span> • System: <span className="text-[#F1F5F9]">{crystalSystem}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
