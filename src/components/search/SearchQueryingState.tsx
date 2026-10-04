"use client";

import React from "react";
import { Loader2, Database, Search, Cpu, ArrowRight } from "lucide-react";

export default function SearchQueryingState({
  query = "Querying Materials Project via backend services...",
}: {
  query?: string;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 flex flex-col items-center justify-center min-h-[500px]">
      <div className="w-full bg-[#12181F] border border-[#1F2D3A] p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle top pulsing bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#00E5FF] animate-pulse"></div>

        {/* Central Spinning Graphic */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-[#1F2D3A] rounded-none"></div>
          <div className="absolute inset-0 border-2 border-[#00E5FF] border-t-transparent animate-spin"></div>
          <Database className="w-8 h-8 text-[#00E5FF]" />
        </div>

        {/* Status Headings */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#18222C] border border-[#1F2D3A] mb-3">
          <span className="w-1.5 h-1.5 bg-[#00E5FF] animate-ping"></span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF]">
            Autonomous Research Agent Active
          </span>
        </div>

        <h2 className="text-lg font-semibold text-[#F1F5F9] mb-2 font-mono">
          Querying Materials Project Database
        </h2>
        <p className="text-xs text-[#94A3B8] max-w-lg mb-6 leading-relaxed">
          {query}
        </p>

        {/* Live Step Progress Skeleton */}
        <div className="w-full max-w-md bg-[#0B0F12] border border-[#1F2D3A] p-4 flex flex-col gap-3 font-mono text-[11px] text-left">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#10B981]"></span>
              1. Understanding engineering requirement
            </span>
            <span className="text-[#10B981]">DONE</span>
          </div>

          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#10B981]"></span>
              2. Creating research plan
            </span>
            <span className="text-[#10B981]">DONE</span>
          </div>

          <div className="flex items-center justify-between text-[#00E5FF]">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              3. Querying Materials Project
            </span>
            <span className="animate-pulse">FETCHING...</span>
          </div>

          <div className="flex items-center justify-between text-[#475569]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#475569]"></span>
              4. Evaluating candidates
            </span>
            <span>PENDING</span>
          </div>

          <div className="flex items-center justify-between text-[#475569]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#475569]"></span>
              5. Validating results
            </span>
            <span>PENDING</span>
          </div>

          <div className="flex items-center justify-between text-[#475569]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#475569]"></span>
              6. Generating report
            </span>
            <span>PENDING</span>
          </div>
        </div>

        <div className="mt-6 text-[10px] font-mono text-[#475569]">
          Live updates from the MatSearch AI backend
        </div>
      </div>
    </div>
  );
}
