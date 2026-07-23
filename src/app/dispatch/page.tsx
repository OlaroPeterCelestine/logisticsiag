"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { deliveries as seedDeliveries, riders, formatUgx, statusLabel } from "@/lib/data";
import type { Delivery, Rider } from "@/lib/types";
import { MapPin, UserPlus } from "lucide-react";
import { cn } from "@/lib/cn";
import { DeliveryStatusBadge } from "@/components/StatusBadge";
import {
  AssigneeCell,
  DataTable,
  IdPill,
  PriorityBars,
  StatusCell,
  type DataTableColumn,
} from "@/components/DataTable";

export default function DispatchPage() {
  const [jobs, setJobs] = useState<Delivery[]>(
    seedDeliveries.map((d) => ({ ...d })),
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    seedDeliveries.find((d) => d.status === "pending")?.id ?? null,
  );
  const [toast, setToast] = useState<string | null>(null);

  const queue = useMemo(
    () => jobs.filter((d) => d.status === "pending"),
    [jobs],
  );
  const selected = jobs.find((d) => d.id === selectedId) ?? null;
  const available = useMemo(() => {
    if (!selected) return [];
    return riders
      .filter((r) => ["online", "on_delivery"].includes(r.status))
      .map((r) => {
        const zoneMatch = r.zone === selected.zone ? 40 : 0;
        const capacity = Math.max(0, r.maxJobs - r.activeJobs) * 12;
        const rating = r.rating * 8;
        const loadPenalty = r.activeJobs * 6;
        const score = zoneMatch + capacity + rating - loadPenalty;
        return { rider: r, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [selected]);

  function assign(rider: Rider) {
    if (!selected) return;
    setJobs((prev) =>
      prev.map((d) =>
        d.id === selected.id
          ? {
              ...d,
              status: "assigned",
              riderId: rider.id,
              riderName: rider.name,
              etaMins: Math.max(15, Math.round(d.distanceKm * 3.2)),
            }
          : d,
      ),
    );
    setToast(`Assigned ${selected.trackingCode} → ${rider.name}`);
    setTimeout(() => setToast(null), 2500);
    const next = jobs.find(
      (d) => d.status === "pending" && d.id !== selected.id,
    );
    setSelectedId(next?.id ?? null);
  }

  function unassign(id: string) {
    setJobs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "pending",
              riderId: null,
              riderName: null,
              etaMins: null,
            }
          : d,
      ),
    );
    setToast("Order returned to unassigned queue");
    setTimeout(() => setToast(null), 2200);
  }

  const liveColumns: DataTableColumn<Delivery>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Order ID",
        sortable: true,
        sortValue: (d) => d.trackingCode,
        render: (d) => (
          <IdPill href={`/deliveries/${d.id}`}>{d.trackingCode}</IdPill>
        ),
      },
      {
        key: "customer",
        header: "Customer",
        render: (d) => (
          <span className="text-xs text-text">{d.customer}</span>
        ),
      },
      {
        key: "priority",
        header: "Priority",
        render: (d) => <PriorityBars level={d.priority} />,
      },
      {
        key: "rider",
        header: "Assigned to",
        render: (d) => (
          <AssigneeCell
            name={d.riderName}
            color={riders.find((r) => r.id === d.riderId)?.avatarColor}
          />
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (d) => (
          <StatusCell
            label={statusLabel(d.status)}
            tone={
              d.status === "in_transit" || d.status === "picked_up"
                ? "accent"
                : "blue"
            }
          />
        ),
      },
      {
        key: "eta",
        header: "ETA / SLA",
        render: (d) => (
          <div className="flex flex-col gap-1">
            <span
              className={
                (d.etaMins ?? 0) > 30
                  ? "text-xs font-medium text-red"
                  : "text-xs text-text-muted"
              }
            >
              {d.etaMins != null ? `${d.etaMins}m left` : "—"}
            </span>
            <button
              type="button"
              onClick={() => unassign(d.id)}
              className="w-fit text-[10px] font-medium text-text-dim hover:text-accent"
            >
              Unassign
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs],
  );

  return (
    <AdminShell crumbs={[{ label: "Command" }, { label: "Dispatch" }]}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Dispatch
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Assign unassigned orders to online riders
          </p>
        </div>
        <div className="rounded-full border border-border bg-bg px-3 py-1.5 text-xs text-text-muted">
          {queue.length} in queue · {available.length} riders available
        </div>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl border border-green/30 bg-green-muted px-4 py-2.5 text-sm text-green">
          {toast}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_280px]">
        <Panel title="Unassigned queue" count={queue.length}>
          {queue.length === 0 ? (
            <Empty text="Queue clear — all orders assigned" />
          ) : (
            <ul className="space-y-2">
              {queue.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => setSelectedId(d.id)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition",
                      selectedId === d.id
                        ? "border-accent bg-accent-muted"
                        : "border-border bg-bg/40 hover:border-accent/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-accent">
                        {d.trackingCode}
                      </span>
                      <span className="text-[10px] font-semibold uppercase text-text-dim">
                        {d.priority.replace("_", " ")}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-text">{d.customer}</div>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-text-muted">
                      <span>{d.distanceKm} km</span>
                      <span>{formatUgx(d.fee)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Order detail" count={selected ? 1 : 0}>
          {!selected ? (
            <Empty text="Select an order from the queue" />
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-mono text-sm font-semibold text-accent">
                  {selected.trackingCode}
                </div>
                <div className="mt-1 text-lg font-semibold text-text">
                  {selected.customer}
                </div>
                <div className="mt-1 text-xs text-text-muted">
                  {selected.merchantName} · {selected.customerPhone}
                </div>
              </div>
              <div className="space-y-2 text-xs text-text-muted">
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />
                  {selected.pickup}
                </div>
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  {selected.dropoff}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <DeliveryStatusBadge status={selected.status} />
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-[11px] text-text-muted">
                  OTP {selected.otp}
                </span>
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-[11px] text-text-muted">
                  POD {selected.podRequired ? "required" : "optional"}
                </span>
              </div>
              <a
                href={`/track/${selected.trackingCode}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-medium text-accent hover:underline"
              >
                Open customer track link →
              </a>
            </div>
          )}
        </Panel>

        <Panel title="Suggested riders" count={available.length}>
          {!selected ? (
            <Empty text="Pick an order first" />
          ) : (
            <ul className="space-y-2">
              {available.map(({ rider: r, score }, idx) => (
                <li key={r.id}>
                  <button
                    onClick={() => assign(r)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition",
                      idx === 0
                        ? "border-accent bg-accent-muted/50 hover:bg-accent-muted"
                        : "border-border bg-bg/40 hover:border-accent/50 hover:bg-accent-muted/40",
                    )}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: r.avatarColor }}
                    >
                      {r.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-semibold text-text">
                          {r.name}
                        </span>
                        {idx === 0 && (
                          <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="truncate text-[10px] text-text-dim">
                        {r.zone} · {r.activeJobs}/{r.maxJobs} jobs · score{" "}
                        {Math.round(score)}
                      </div>
                    </div>
                    <UserPlus className="h-4 w-4 shrink-0 text-accent" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-5">
        <DataTable
          title="Live jobs"
          rows={jobs.filter((d) =>
            ["assigned", "picked_up", "in_transit"].includes(d.status),
          )}
          columns={liveColumns}
          searchPlaceholder="Job"
          searchKeys={[
            (d) => d.trackingCode,
            (d) => d.riderName ?? "",
            (d) => d.customer,
          ]}
          typeOptions={[
            { label: "All live", value: "all" },
            { label: "In transit", value: "in_transit" },
            { label: "Picked up", value: "picked_up" },
            { label: "Assigned", value: "assigned" },
          ]}
          typeFilter={(d, type) => type === "all" || d.status === type}
          pageSize={10}
        />
      </div>
    </AdminShell>
  );
}

function Panel({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border-y border-border bg-bg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] text-text-dim">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-center text-xs text-text-dim">
      {text}
    </div>
  );
}
