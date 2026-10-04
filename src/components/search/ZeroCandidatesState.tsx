"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, Sliders, RefreshCw, MessageSquareReply, ArrowLeft } from "lucide-react";

interface ZeroCandidatesStateProps {
  prompt?: string;
  onRelaxConstraints?: () => void;
  onOpenChallenge?: () => void;
}

export default function ZeroCandidatesState({
  prompt = "Current engineering requirement",
  onRelaxConstraints,
  onOpenChallenge,
}: ZeroCandidatesStateProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col items-center justify-center">
      <div className="w-full bg-[#12181F] border border-[#1F2D3A] p-8 flex flex-col items-center text-center">
        {/* Warning Icon Box */}
        <div className="w-14 h-14 bg-[#18222C] border border-[#F59E0B]/40 flex items-center justify-center mb-4 text-[#F59E0B]">
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 mb-2 uppercase">
          Query Screening Resolution
        </span>

        <h3 className="text-base font-semibold text-[#F1F5F9] font-mono mb-2">
          0 Candidate Materials Satisfied Hard Constraints
        </h3>

        <p className="text-xs text-[#94A3B8] max-w-lg mb-6 leading-relaxed">
          The autonomous agent searched the Materials Project database but found no crystalline structures simultaneously meeting all specified constraints for:
          <span className="block mt-2 font-mono text-[#F1F5F9] p-2 bg-[#090F15] border border-[#1F2D3A]">
            &ldquo;{prompt}&rdquo;
          </span>
        </p>

        {/* Diagnosis Matrix */}
        <div className="w-full bg-[#0B0F12] border border-[#1F2D3A] p-4 text-left font-mono text-xs mb-6 space-y-2">
          <div className="text-[10px] uppercase text-[#94A3B8] font-bold">
            Agent Diagnostic Observations:
          </div>
          <div className="flex items-start gap-2 text-[11px] text-[#F59E0B]">
            <span className="text-[#94A3B8]">•</span>
            <span>Requested band gap and ultra-low density parameters may be mutually exclusive in stable thermodynamic ground states.</span>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-[#94A3B8]">
            <span>•</span>
            <span>Relaxing the density bound by +0.8 g/cm³ expands the candidate field to 14 candidate phases.</span>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-[#94A3B8]">
            <span>•</span>
            <span>Allowing metastable phases with E_hull ≤ 0.05 eV/atom brings additional polymorphs into consideration.</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] text-xs text-[#F1F5F9] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Constraints</span>
          </Link>

          {onOpenChallenge && (
            <button
              onClick={onOpenChallenge}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
              type="button"
            >
              <MessageSquareReply className="w-3.5 h-3.5" />
              <span>Challenge & Relax Criteria</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
