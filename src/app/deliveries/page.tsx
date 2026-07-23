"use client";

import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import {
  AssigneeCell,
  DataTable,
  IdPill,
  PriorityBars,
  StatusCell,
  formatTableDate,
  type DataTableColumn,
} from "@/components/DataTable";
import {
  deliveries,
  failReasonLabel,
  formatUgx,
  riders,
  statusLabel,
} from "@/lib/data";
import type { Delivery } from "@/lib/types";
import { ExternalLink } from "lucide-react";

const statusTone = (
  s: Delivery["status"],
): "muted" | "accent" | "green" | "red" | "blue" => {
  if (s === "delivered") return "green";
  if (s === "failed" || s === "cancelled") return "red";
  if (s === "in_transit" || s === "picked_up") return "accent";
  if (s === "assigned") return "blue";
  return "muted";
};

const columns: DataTableColumn<Delivery>[] = [
  {
    key: "tracking",
    header: "Order ID",
    sortable: true,
    sortValue: (d) => d.trackingCode,
    render: (d) => (
      <div>
        <IdPill href={`/deliveries/${d.id}`}>{d.trackingCode}</IdPill>
        <div className="mt-1 text-[11px] text-text-dim">{d.zone}</div>
      </div>
    ),
  },
  {
    key: "subject",
    header: "Route",
    sortable: true,
    sortValue: (d) => d.customer,
    render: (d) => (
      <div className="max-w-[220px]">
        <div className="truncate text-xs font-medium text-text">{d.customer}</div>
        <div className="mt-0.5 truncate text-[11px] text-text-dim">
          {d.merchantName} · {d.dropoff}
        </div>
      </div>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    sortValue: (d) =>
      d.priority === "express" ? 3 : d.priority === "same_day" ? 2 : 1,
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
    sortable: true,
    sortValue: (d) => d.status,
    render: (d) => (
      <div>
        <StatusCell label={statusLabel(d.status)} tone={statusTone(d.status)} />
        {d.status === "failed" && (
          <div className="mt-0.5 text-[10px] text-red">
            {failReasonLabel(d.failReason)}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "created",
    header: "Created date",
    sortable: true,
    sortValue: (d) => d.createdAt,
    render: (d) => (
      <span className="text-xs text-text-muted">
        {formatTableDate(d.createdAt)}
      </span>
    ),
  },
  {
    key: "eta",
    header: "ETA / SLA",
    render: (d) => {
      if (d.status === "delivered") {
        return <span className="text-xs text-green">Done</span>;
      }
      if (d.status === "failed") {
        return <span className="text-xs font-medium text-red">Reattempt</span>;
      }
      if (d.etaMins != null && d.etaMins > 0) {
        const overdue = d.etaMins > 40;
        return (
          <span
            className={
              overdue
                ? "text-xs font-medium text-red"
                : "text-xs text-text-muted"
            }
          >
            {d.etaMins}m left
          </span>
        );
      }
      return <span className="text-xs text-text-dim">Awaiting</span>;
    },
  },
  {
    key: "fee",
    header: "Fee",
    sortable: true,
    sortValue: (d) => d.fee,
    render: (d) => (
      <span className="text-xs text-text-muted">{formatUgx(d.fee)}</span>
    ),
  },
  {
    key: "links",
    header: "Track",
    render: (d) => (
      <Link
        href={`/track/${d.trackingCode}`}
        target="_blank"
        className="inline-flex items-center gap-1 text-xs text-text-dim hover:text-accent"
      >
        Link <ExternalLink className="h-3 w-3" />
      </Link>
    ),
  },
];

export default function DeliveriesPage() {
  return (
    <AdminShell crumbs={[{ label: "Operations" }, { label: "Orders" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Orders
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Delivery jobs with ETA, COD, POD, and track links
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dispatch"
            className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm font-medium text-text transition hover:border-accent/40"
          >
            Dispatch
          </Link>
          <Link
            href="/deliveries/new"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            New order
          </Link>
        </div>
      </div>

      <DataTable
        title="All orders"
        rows={deliveries}
        columns={columns}
        searchPlaceholder="Order"
        searchKeys={[
          (d) => d.trackingCode,
          (d) => d.customer,
          (d) => d.merchantName,
          (d) => d.riderName ?? "",
          (d) => d.status,
        ]}
        typeOptions={[
          { label: "All statuses", value: "all" },
          { label: "Live", value: "live" },
          { label: "Pending", value: "pending" },
          { label: "Delivered", value: "delivered" },
          { label: "Failed", value: "failed" },
        ]}
        typeFilter={(d, type) => {
          if (type === "live") {
            return ["assigned", "picked_up", "in_transit"].includes(d.status);
          }
          return d.status === type;
        }}
        pageSize={10}
      />
    </AdminShell>
  );
}
