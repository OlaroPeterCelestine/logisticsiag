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
import { merchants } from "@/lib/data";
import type { Merchant } from "@/lib/types";

const columns: DataTableColumn<Merchant>[] = [
  {
    key: "id",
    header: "Merchant ID",
    sortable: true,
    sortValue: (m) => m.id,
    render: (m) => <IdPill>{m.id.toUpperCase()}</IdPill>,
  },
  {
    key: "name",
    header: "Subject",
    sortable: true,
    sortValue: (m) => m.name,
    render: (m) => (
      <div>
        <div className="text-xs font-medium text-text">{m.name}</div>
        <div className="text-[11px] text-text-dim">
          {m.contact} · {m.address}
        </div>
      </div>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    render: (m) => (
      <PriorityBars
        level={m.openOrders >= 2 ? "high" : m.openOrders === 1 ? "medium" : "low"}
      />
    ),
  },
  {
    key: "zone",
    header: "Assigned to",
    render: (m) => (
      <span className="text-xs text-text-muted">{m.zone} zone</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (m) => (
      <StatusCell
        label={m.openOrders > 0 ? `${m.openOrders} open` : "Clear"}
        tone={m.openOrders > 0 ? "accent" : "green"}
      />
    ),
  },
  {
    key: "orders",
    header: "Created date",
    sortable: true,
    sortValue: (m) => m.ordersToday,
    render: (m) => (
      <span className="text-xs text-text-muted">{m.ordersToday} today</span>
    ),
  },
  {
    key: "sla",
    header: "SLA due",
    render: (m) => (
      <span className="text-xs text-text-muted">
        Prep {m.avgPrepMins}m · {m.settlement}
      </span>
    ),
  },
];

export default function MerchantsPage() {
  return (
    <AdminShell crumbs={[{ label: "Operations" }, { label: "Merchants" }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Merchants
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Senders placing orders — zones, prep time, settlement
          </p>
        </div>
        <Link
          href="/deliveries/new"
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Create order
        </Link>
      </div>

      <DataTable
        title="Merchant directory"
        rows={merchants}
        columns={columns}
        searchPlaceholder="Merchant"
        searchKeys={[(m) => m.name, (m) => m.contact, (m) => m.zone, (m) => m.phone]}
        typeOptions={[
          { label: "All zones", value: "all" },
          { label: "Central", value: "Central" },
          { label: "East", value: "East" },
          { label: "North", value: "North" },
          { label: "South", value: "South" },
        ]}
        typeFilter={(m, type) => type === "all" || m.zone === type}
        pageSize={10}
      />
    </AdminShell>
  );
}
