"use client";

import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import {
  DataTable,
  IdPill,
  PriorityBars,
  StatusCell,
  type DataTableColumn,
} from "@/components/DataTable";
import { zones } from "@/lib/data";
import type { Zone } from "@/lib/types";

const columns: DataTableColumn<Zone>[] = [
  {
    key: "id",
    header: "Zone ID",
    sortable: true,
    sortValue: (z) => z.name,
    render: (z) => <IdPill>{z.name.toUpperCase()}</IdPill>,
  },
  {
    key: "hubs",
    header: "Subject",
    render: (z) => (
      <div className="max-w-[240px]">
        <div className="truncate text-xs text-text">{z.hubs[0]}</div>
        {z.hubs[1] && (
          <div className="truncate text-[11px] text-text-dim">{z.hubs[1]}</div>
        )}
      </div>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    render: (z) => (
      <PriorityBars
        level={
          z.coverage === "critical"
            ? "high"
            : z.coverage === "tight"
              ? "medium"
              : "low"
        }
      />
    ),
  },
  {
    key: "riders",
    header: "Assigned to",
    render: (z) => (
      <span className="text-xs text-text-muted">
        {z.ridersOnline} riders online
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortValue: (z) => z.coverage,
    render: (z) => (
      <StatusCell
        label={z.coverage}
        tone={
          z.coverage === "healthy"
            ? "green"
            : z.coverage === "tight"
              ? "accent"
              : "red"
        }
      />
    ),
  },
  {
    key: "orders",
    header: "Created date",
    render: (z) => (
      <span className="text-xs text-text-muted">{z.openOrders} open orders</span>
    ),
  },
  {
    key: "sla",
    header: "SLA due",
    render: (z) => (
      <span
        className={
          z.coverage === "critical"
            ? "text-xs font-medium text-red"
            : "text-xs text-text-muted"
        }
      >
        ETA {z.avgEtaMins}m · surge {z.surge.toFixed(2)}×
      </span>
    ),
  },
];

export default function ZonesPage() {
  return (
    <AdminShell crumbs={[{ label: "Operations" }, { label: "Zones & hubs" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Zones & hubs
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Coverage, capacity, and surge by delivery zone
          </p>
        </div>
        <Link
          href="/dispatch"
          className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm font-medium text-text hover:border-accent/40"
        >
          Open dispatch
        </Link>
      </div>

      <DataTable
        title="Coverage board"
        rows={zones}
        columns={columns}
        searchPlaceholder="Zone"
        searchKeys={[(z) => z.name, (z) => z.hubs.join(" ")]}
        typeOptions={[
          { label: "All coverage", value: "all" },
          { label: "Healthy", value: "healthy" },
          { label: "Tight", value: "tight" },
          { label: "Critical", value: "critical" },
        ]}
        typeFilter={(z, type) => type === "all" || z.coverage === type}
        pageSize={10}
      />
    </AdminShell>
  );
}
