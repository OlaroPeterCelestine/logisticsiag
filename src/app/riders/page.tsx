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
import { formatUgx, riders } from "@/lib/data";
import type { Rider } from "@/lib/types";

const columns: DataTableColumn<Rider>[] = [
  {
    key: "id",
    header: "Rider ID",
    sortable: true,
    sortValue: (r) => r.plate,
    render: (r) => <IdPill href={`/riders/${r.id}`}>{r.plate}</IdPill>,
  },
  {
    key: "name",
    header: "Subject",
    sortable: true,
    sortValue: (r) => r.name,
    render: (r) => (
      <AssigneeCell name={r.name} color={r.avatarColor} />
    ),
  },
  {
    key: "priority",
    header: "Priority",
    render: (r) => (
      <PriorityBars
        level={
          r.activeJobs >= 2 ? "high" : r.activeJobs === 1 ? "medium" : "low"
        }
      />
    ),
  },
  {
    key: "vehicle",
    header: "Assigned to",
    render: (r) => (
      <span className="text-xs text-text-muted">
        {r.vehicle} · {r.zone}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortValue: (r) => r.status,
    render: (r) => (
      <StatusCell
        label={r.status.replace("_", " ")}
        tone={
          r.status === "online"
            ? "green"
            : r.status === "on_delivery"
              ? "accent"
              : r.status === "offline"
                ? "red"
                : "blue"
        }
      />
    ),
  },
  {
    key: "docs",
    header: "Created date",
    render: (r) => (
      <span className="text-xs text-text-muted">
        Lic. {formatTableDate(r.licenseExpiry)}
      </span>
    ),
  },
  {
    key: "sla",
    header: "SLA due",
    sortable: true,
    sortValue: (r) => r.onTimeRate,
    render: (r) => (
      <span
        className={
          r.onTimeRate >= 90
            ? "text-xs text-green"
            : r.onTimeRate >= 85
              ? "text-xs text-accent"
              : "text-xs font-medium text-red"
        }
      >
        {r.onTimeRate}% · {r.deliveriesToday} today
      </span>
    ),
  },
  {
    key: "earn",
    header: "Week",
    render: (r) => (
      <span className="text-xs text-text-muted">
        {formatUgx(r.earningsWeek)}
      </span>
    ),
  },
];

export default function RidersPage() {
  return (
    <AdminShell crumbs={[{ label: "Operations" }, { label: "Riders" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Riders
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Capacity, documents, zone assignment, and on-time performance
          </p>
        </div>
        <button className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover">
          Invite rider
        </button>
      </div>

      <DataTable
        title="Rider roster"
        rows={riders}
        columns={columns}
        searchPlaceholder="Rider"
        searchKeys={[
          (r) => r.name,
          (r) => r.plate,
          (r) => r.zone,
          (r) => r.phone,
        ]}
        typeOptions={[
          { label: "All statuses", value: "all" },
          { label: "Online", value: "online" },
          { label: "On delivery", value: "on_delivery" },
          { label: "Break", value: "break" },
          { label: "Offline", value: "offline" },
        ]}
        typeFilter={(r, type) => type === "all" || r.status === type}
        pageSize={10}
      />
    </AdminShell>
  );
}
