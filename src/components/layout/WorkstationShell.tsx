"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function WorkstationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F12] text-[#F1F5F9]">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="pt-14 flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
