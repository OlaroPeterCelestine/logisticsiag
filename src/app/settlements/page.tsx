"use client";

import { useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { settlementRuns as seed, formatUgx } from "@/lib/data";
import type { SettlementRun, SettlementStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const labels: Record<SettlementStatus, string> = {
  draft: "Draft",
  ready: "Ready to pay",
  paid: "Paid",
};

export default function SettlementsPage() {
  const [rows, setRows] = useState(() => seed.map((r) => ({ ...r })));
  const [toast, setToast] = useState<string | null>(null);

  function pay(row: SettlementRun) {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "paid" } : r)),
    );
    setToast(`Paid ${formatUgx(row.payout)} → ${row.merchantName}`);
    setTimeout(() => setToast(null), 2200);
  }

  function finalize(row: SettlementRun) {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "ready" } : r)),
    );
    setToast(`Settlement ready · ${row.merchantName}`);
    setTimeout(() => setToast(null), 2200);
  }

  const readyTotal = rows
    .filter((r) => r.status === "ready")
    .reduce((s, r) => s + r.payout, 0);

  return (
    <AdminShell crumbs={[{ label: "Operations" }, { label: "Settlements" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Settlements
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Merchant payout runs, fees, and statements
          </p>
        </div>
        <div className="rounded-full border border-border px-3 py-1.5 text-xs text-text-muted">
          Ready to pay · {formatUgx(readyTotal)}
        </div>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl border border-green/30 bg-green-muted px-4 py-2.5 text-sm text-green">
          {toast}
        </div>
      )}

      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-4 border border-border bg-bg p-4"
          >
            <div>
              <div className="text-sm font-semibold text-text">
                {r.merchantName}
              </div>
              <div className="mt-1 text-xs text-text-muted">
                {r.period} · {r.orders} orders · due {r.dueAt}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <Metric label="GMV" value={formatUgx(r.gmv)} />
              <Metric label="Fees" value={formatUgx(r.fees)} />
              <Metric label="Payout" value={formatUgx(r.payout)} strong />
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                  r.status === "paid" && "bg-green-muted text-green",
                  r.status === "ready" && "bg-accent-muted text-accent",
                  r.status === "draft" && "bg-bg-hover text-text-muted",
                )}
              >
                {labels[r.status]}
              </span>
              {r.status === "draft" && (
                <button
                  type="button"
                  onClick={() => finalize(r)}
                  className="rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-text-muted hover:text-text"
                >
                  Finalize
                </button>
              )}
              {r.status === "ready" && (
                <button
                  type="button"
                  onClick={() => pay(r)}
                  className="rounded-lg bg-accent px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  Pay out
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function Metric({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-dim">
        {label}
      </div>
      <div
        className={cn(
          "mt-0.5 font-medium",
          strong ? "text-sm text-text" : "text-text-muted",
        )}
      >
        {value}
      </div>
    </div>
  );
}
