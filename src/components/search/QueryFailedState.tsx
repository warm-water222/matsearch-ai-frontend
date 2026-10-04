"use client";

import React from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, Terminal } from "lucide-react";

interface QueryFailedStateProps {
  error?: Error;
  reset?: () => void;
  message?: string;
}

export default function QueryFailedState({
  error,
  reset,
  message = "Backend query execution interrupted while retrieving Materials Project records.",
}: QueryFailedStateProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col items-center justify-center">
      <div className="w-full bg-[#12181F] border border-[#EF4444]/40 p-8 flex flex-col items-center text-center">
        {/* Error Icon */}
        <div className="w-14 h-14 bg-[#18222C] border border-[#EF4444]/50 flex items-center justify-center mb-4 text-[#EF4444]">
          <AlertOctagon className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 mb-2 uppercase">
          Agent Execution Failed
        </span>

        <h3 className="text-base font-semibold text-[#F1F5F9] font-mono mb-2">
          Materials Project Query Interrupted
        </h3>

        <p className="text-xs text-[#94A3B8] max-w-lg mb-6 leading-relaxed">
          {message}
        </p>

        {/* Technical Error Trace Box */}
        <div className="w-full bg-[#0B0F12] border border-[#1F2D3A] p-4 text-left font-mono text-[11px] mb-6">
          <div className="flex items-center gap-1.5 text-[#94A3B8] mb-2 text-[10px] uppercase">
            <Terminal className="w-3.5 h-3.5 text-[#EF4444]" />
            <span>Diagnostics Trace</span>
          </div>
          <div className="text-[#EF4444] break-all">
            {error?.message || "ERR_BACKEND_TIMEOUT: Upstream service did not return response within parity window."}
          </div>
          <div className="text-[#475569] mt-2 text-[10px]">
            Endpoint: /api/search • Target: Materials Project DB Service • Status: 504 Gateway
          </div>
        </div>

        {/* Recovery Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          {reset && (
            <button
              onClick={() => reset()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00E5FF] hover:bg-[#4CD6FB] text-xs font-semibold text-[#0B0F12] transition-colors"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Execution</span>
            </button>
          )}

          <Link
            href="/search"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] text-xs text-[#F1F5F9] transition-colors"
          >
            <span>Return to Search</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#18222C] border border-[#1F2D3A] hover:border-[#00E5FF] text-xs text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
