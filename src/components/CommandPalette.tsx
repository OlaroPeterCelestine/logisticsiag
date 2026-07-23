"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deliveries,
  riders,
  merchants,
  issues,
  formatUgx,
} from "@/lib/data";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Hit = {
  id: string;
  label: string;
  meta: string;
  href: string;
  group: string;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("iag-open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("iag-open-search", onOpen);
    };
  }, []);

  const hits = useMemo(() => {
    const query = q.trim().toLowerCase();
    const all: Hit[] = [
      ...deliveries.map((d) => ({
        id: d.id,
        label: d.trackingCode,
        meta: `${d.customer} · ${d.status} · ${formatUgx(d.fee)}`,
        href: `/deliveries/${d.id}`,
        group: "Orders",
      })),
      ...riders.map((r) => ({
        id: r.id,
        label: r.name,
        meta: `${r.zone} · ${r.status} · ★${r.rating}`,
        href: `/riders/${r.id}`,
        group: "Riders",
      })),
      ...merchants.map((m) => ({
        id: m.id,
        label: m.name,
        meta: `${m.zone} · ${m.openOrders} open`,
        href: `/merchants`,
        group: "Merchants",
      })),
      ...issues.map((i) => ({
        id: i.id,
        label: i.title,
        meta: `${i.type} · ${i.status}`,
        href: `/issues`,
        group: "Issues",
      })),
      {
        id: "nav-cod",
        label: "COD desk",
        meta: "Cash collection & remittance",
        href: "/cod",
        group: "Pages",
      },
      {
        id: "nav-settle",
        label: "Settlements",
        meta: "Merchant payouts",
        href: "/settlements",
        group: "Pages",
      },
      {
        id: "nav-dispatch",
        label: "Dispatch",
        meta: "Assign unassigned orders",
        href: "/dispatch",
        group: "Pages",
      },
      {
        id: "nav-map",
        label: "Live Map",
        meta: "Rider GPS & dropoffs",
        href: "/live-map",
        group: "Pages",
      },
    ];
    if (!query) return all.slice(0, 12);
    return all
      .filter(
        (h) =>
          h.label.toLowerCase().includes(query) ||
          h.meta.toLowerCase().includes(query),
      )
      .slice(0, 16);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close search"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden border border-border bg-bg shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 text-text-dim" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders, riders, merchants, pages…"
            className="h-12 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-dim"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded p-1 text-text-dim hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[360px] overflow-y-auto py-2">
          {hits.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-text-dim">
              No matches
            </li>
          ) : (
            hits.map((h) => (
              <li key={`${h.group}-${h.id}`}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                    router.push(h.href);
                  }}
                  className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-bg-hover"
                >
                  <span className="mt-0.5 w-16 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-text-dim">
                    {h.group}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-text">
                      {h.label}
                    </span>
                    <span className="block truncate text-xs text-text-muted">
                      {h.meta}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-border px-4 py-2 text-[10px] text-text-dim">
          <kbd className="rounded border border-border px-1">⌘K</kbd> to toggle
          · <kbd className="rounded border border-border px-1">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("iag-open-search"))}
      className={cn(
        "flex w-full items-center gap-2 border border-border px-3 py-2.5 text-left text-sm text-text-muted transition hover:border-accent/40 hover:text-text",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1">Search orders…</span>
      <kbd className="border border-border bg-bg px-1.5 py-0.5 text-[10px] text-text-dim">
        ⌘K
      </kbd>
    </button>
  );
}
