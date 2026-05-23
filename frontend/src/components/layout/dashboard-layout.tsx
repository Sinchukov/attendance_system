"use client";

import { ReactNode } from "react";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}