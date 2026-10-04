"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2, Download, Radio, ShieldCheck } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  // Generate breadcrumb title
  const getBreadcrumbs = () => {
    if (pathname === "/") return "Overview / Home";
    if (pathname.startsWith("/search/")) return "Workspace / Live Search Execution";
    if (pathname === "/search") return "Workspace / New Search Directive";
    if (pathname.startsWith("/materials/")) return "Database / Material Details";
    if (pathname === "/compare") return "Workbench / Comparative Matrix";
    if (pathname === "/history") return "Audit Log / Search History";
    if (pathname === "/saved") return "Library / Saved Materials";
    if (pathname === "/reports") return "Engineering Reports / Dossiers";
    if (pathname === "/settings") return "System / Preferences & Units";
    return "Workstation";
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-[#090F15]/95 backdrop-blur-md border-b border-[#1F2D3A] z-40 flex items-center justify-between px-6 select-none">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
        <Link href="/" className="hover:text-[#F1F5F9] transition-colors">
          MatSearch Workstation
        </Link>
        <span className="text-[#475569]">/</span>
        <span className="text-[#00E5FF] font-medium">{getBreadcrumbs()}</span>
      </div>

      {/* Action and Telemetry Bar */}
      <div className="flex items-center gap-4">
        {/* Live SSE / Backend Connection Status */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#12181F] border border-[#1F2D3A]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
            Materials Project Connected
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard");
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12181F] border border-[#1F2D3A] hover:border-[#00E5FF] text-[#F1F5F9] hover:text-[#00E5FF] transition-colors text-xs font-medium"
            type="button"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <Link
            href="/reports"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-[#0B0F12] font-semibold transition-colors text-xs"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export Report</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
