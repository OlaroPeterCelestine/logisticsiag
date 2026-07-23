"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { codLedger as seed, formatUgx, formatTime } from "@/lib/data";
import type { CodLedgerEntry, CodLedgerStatus } from "@/lib/types";
import { Banknote, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

const statusLabel: Record<CodLedgerStatus, string> = {
  to_collect: "To collect",
  collected: "Collected",
  remitted: "Remitted",
  mismatch: "Mismatch",
  written_off: "Written off",
};

export default function CodDeskPage() {
  const [rows, setRows] = useState(() => seed.map((r) => ({ ...r })));
  const [toast, setToast] = useState<string | null>(null);

  const totals = useMemo(() => {
    const expected = rows.reduce((s, r) => s + r.expected, 0);
    const collected = rows.reduce((s, r) => s + (r.collected ?? 0), 0);
    const open = rows.filter((r) =>
      ["to_collect", "collected", "mismatch"].includes(r.status),
    ).length;
    const mismatch = rows.filter((r) => r.status === "mismatch").length;
    return { expected, collected, open, mismatch };
  }, [rows]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function markCollected(row: CodLedgerEntry) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              status: "collected",
              collected: r.expected,
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    flash(`COD marked collected · ${row.trackingCode}`);
  }

  function markRemitted(row: CodLedgerEntry) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? { ...r, status: "remitted", updatedAt: new Date().toISOString() }
          : r,
      ),
    );
    flash(`Remitted to till · ${row.trackingCode}`);
  }

  function resolveMismatch(row: CodLedgerEntry) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              status: "written_off",
              note: "Resolved in ops · shortfall written off",
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    flash(`Mismatch closed · ${row.trackingCode}`);
  }

  return (
    <AdminShell crumbs={[{ label: "Operations" }, { label: "COD desk" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          COD desk
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Collect, remit, and clear cash-on-delivery mismatches
        </p>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl border border-green/30 bg-green-muted px-4 py-2.5 text-sm text-green">
          {toast}
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Kpi
          label="Expected today"
          value={formatUgx(totals.expected)}
          icon={Banknote}
        />
        <Kpi
          label="Collected"
          value={formatUgx(totals.collected)}
          icon={CheckCircle2}
        />
        <Kpi label="Open tills" value={String(totals.open)} />
        <Kpi
          label="Mismatches"
          value={String(totals.mismatch)}
          danger={totals.mismatch > 0}
          icon={AlertTriangle}
        />
      </div>

      <div className="overflow-hidden border-y border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-dim">
              <th className="px-3 py-3 font-medium">Order</th>
              <th className="px-3 py-3 font-medium">Rider</th>
              <th className="px-3 py-3 font-medium">Expected</th>
              <th className="px-3 py-3 font-medium">Collected</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border-subtle">
                <td className="px-3 py-3">
                  <Link
                    href={`/deliveries/${r.deliveryId}`}
                    className="font-mono text-xs font-semibold text-accent hover:underline"
                  >
                    {r.trackingCode}
                  </Link>
                  <div className="mt-0.5 text-[11px] text-text-dim">
                    {r.merchantName}
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-text-muted">
                  {r.riderName}
                </td>
                <td className="px-3 py-3 text-xs font-medium text-text">
                  {formatUgx(r.expected)}
                </td>
                <td className="px-3 py-3 text-xs text-text-muted">
                  {r.collected != null ? formatUgx(r.collected) : "—"}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      r.status === "mismatch" && "bg-red-muted text-red",
                      r.status === "remitted" && "bg-green-muted text-green",
                      r.status === "collected" && "bg-accent-muted text-accent",
                      r.status === "to_collect" &&
                        "bg-bg-hover text-text-muted",
                      r.status === "written_off" && "bg-bg-hover text-text-dim",
                    )}
                  >
                    {statusLabel[r.status]}
                  </span>
                  {r.note && (
                    <div className="mt-1 max-w-[200px] text-[10px] text-text-dim">
                      {r.note}
                    </div>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {r.status === "to_collect" && (
                      <button
                        type="button"
                        onClick={() => markCollected(r)}
                        className="rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-text-muted hover:text-text"
                      >
                        Mark collected
                      </button>
                    )}
                    {r.status === "collected" && (
                      <button
                        type="button"
                        onClick={() => markRemitted(r)}
                        className="rounded-lg bg-accent px-2 py-1 text-[11px] font-semibold text-white"
                      >
                        Remit
                      </button>
                    )}
                    {r.status === "mismatch" && (
                      <button
                        type="button"
                        onClick={() => resolveMismatch(r)}
                        className="rounded-lg border border-red/40 px-2 py-1 text-[11px] font-medium text-red"
                      >
                        Resolve
                      </button>
                    )}
                    <span className="self-center text-[10px] text-text-dim">
                      {formatTime(r.updatedAt)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  danger,
}: {
  label: string;
  value: string;
  icon?: typeof Banknote;
  danger?: boolean;
}) {
  return (
    <div className="border border-border bg-bg p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wider text-text-dim">
          {label}
        </div>
        {Icon && (
          <Icon
            className={cn("h-4 w-4", danger ? "text-red" : "text-accent")}
          />
        )}
      </div>
      <div
        className={cn(
          "mt-2 text-xl font-semibold tracking-tight",
          danger ? "text-red" : "text-text",
        )}
      >
        {value}
      </div>
    </div>
  );
}
