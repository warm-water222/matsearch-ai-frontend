"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Search,
  Activity,
  TableProperties,
  ArrowLeftRight,
  History,
  Bookmark,
  FileText,
  Settings,
  User,
  LogOut,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/", icon: FlaskConical },
  { name: "New Search", href: "/search", icon: Search },
  { name: "Active Search", href: "/search/9732bb74-6eac-4fab-9549-7fdf116823db", icon: Activity, badge: "PROD" },
  { name: "Compare", href: "/compare", icon: ArrowLeftRight },
  { name: "History", href: "/history", icon: History },
  { name: "Saved", href: "/saved", icon: Bookmark },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#090F15] border-r border-[#1F2D3A] z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center gap-2 border-b border-[#1F2D3A]">
          <div className="w-6 h-6 bg-[#00E5FF] flex items-center justify-center text-[#0B0F12]">
            <FlaskConical className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-wider uppercase text-[#F1F5F9]">
              MatSearch
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#1F2D3A] text-[#00E5FF] border border-[#2A3C4D]">
              AI
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 py-3">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-widest">
            ENGINEERING WORKSTATION
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col px-2 gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-xs transition-colors border-l-2 ${
                  isActive
                    ? "bg-[#1A2027] text-[#00E5FF] font-medium border-[#00E5FF]"
                    : "text-[#94A3B8] hover:bg-[#12181F] hover:text-[#F1F5F9] border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#00E5FF]" : "text-[#94A3B8]"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1 bg-[#00363D] text-[#00E5FF] border border-[#00E5FF]/40 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Status Footer */}
      <div className="p-3 border-t border-[#1F2D3A] flex items-center justify-between bg-[#0B0F12]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1F2D3A] border border-[#2A3C4D] flex items-center justify-center text-[#00E5FF]">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-[#F1F5F9] font-medium">
              Dr. V. Rao
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Materials Lead
            </span>
          </div>
        </div>
        <button
          className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors p-1"
          title="Sign Out"
          type="button"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
