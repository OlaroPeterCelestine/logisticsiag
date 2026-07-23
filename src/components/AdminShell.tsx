"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CommandPalette } from "./CommandPalette";

export function AdminShell({
  children,
  crumbs,
}: {
  children: React.ReactNode;
  crumbs: Array<{ label: string; href?: string }>;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <CommandPalette />
      <Sidebar />
      <div className="pl-[260px]">
        <Header crumbs={crumbs} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
