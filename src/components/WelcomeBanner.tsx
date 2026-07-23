import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { dashboardStats, riders, formatUgx } from "@/lib/data";

export function WelcomeBanner() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const teammates = riders.filter((r) =>
    ["online", "on_delivery"].includes(r.status),
  );

  return (
    <div className="border-b border-border pb-6 animate-fade-up">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              {greeting}, dispatcher
            </h1>
            <span className="rounded-full bg-accent-muted px-2.5 py-0.5 text-[11px] font-semibold text-accent">
              Live ops
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            {dashboardStats.unassigned} unassigned ·{" "}
            {dashboardStats.liveDeliveries} live · {dashboardStats.openIssues}{" "}
            open issues · COD {formatUgx(dashboardStats.codOutstanding)}{" "}
            outstanding
          </p>

          <div className="mt-4 flex items-center">
            <div className="flex -space-x-2">
              {teammates.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  title={r.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-bg text-[10px] font-bold text-white"
                  style={{ backgroundColor: r.avatarColor }}
                >
                  {r.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              ))}
            </div>
            <span className="ml-3 text-xs text-text-dim">
              {teammates.length} riders online
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/dispatch"
            className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium text-text transition hover:border-accent/40"
          >
            <Radio className="h-4 w-4 text-accent" />
            Open dispatch
          </Link>
          <Link
            href="/live-map"
            className="inline-flex items-center gap-2 bg-text px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
          >
            Live map
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
