"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { issues as seed } from "@/lib/data";
import type { Issue } from "@/lib/types";

export default function IssuesPage() {
  const [items, setItems] = useState<Issue[]>(seed.map((i) => ({ ...i })));

  const columns: DataTableColumn<Issue>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Ticket ID",
        sortable: true,
        sortValue: (i) => i.id,
        render: (i) => (
          <IdPill
            href={
              i.deliveryId ? `/deliveries/${i.deliveryId}` : undefined
            }
          >
            {i.trackingCode ?? i.id.toUpperCase()}
          </IdPill>
        ),
      },
      {
        key: "subject",
        header: "Subject",
        sortable: true,
        sortValue: (i) => i.title,
        render: (i) => (
          <div className="max-w-[260px]">
            <div className="truncate text-xs font-medium text-text">
              {i.title}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-text-dim">
              {i.detail}
            </div>
          </div>
        ),
      },
      {
        key: "priority",
        header: "Priority",
        sortable: true,
        sortValue: (i) =>
          i.priority === "high" ? 3 : i.priority === "medium" ? 2 : 1,
        render: (i) => <PriorityBars level={i.priority} />,
      },
      {
        key: "assigned",
        header: "Assigned to",
        render: (i) => <AssigneeCell name={i.riderName ?? null} />,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        sortValue: (i) => i.status,
        render: (i) => (
          <StatusCell
            label={i.status.replace("_", " ")}
            tone={
              i.status === "resolved"
                ? "green"
                : i.status === "in_progress"
                  ? "accent"
                  : "red"
            }
          />
        ),
      },
      {
        key: "created",
        header: "Created date",
        sortable: true,
        sortValue: (i) => i.createdAt,
        render: (i) => (
          <span className="text-xs text-text-muted">
            {formatTableDate(i.createdAt)}
          </span>
        ),
      },
      {
        key: "sla",
        header: "SLA due",
        render: (i) => {
          if (i.status === "resolved") {
            return <span className="text-xs text-green">Closed</span>;
          }
          if (i.priority === "high") {
            return (
              <span className="text-xs font-medium text-red">Overdue</span>
            );
          }
          if (i.priority === "medium") {
            return (
              <span className="text-xs font-medium text-red">1h left</span>
            );
          }
          return <span className="text-xs text-text-muted">4h left</span>;
        },
      },
      {
        key: "action",
        header: "Action",
        render: (i) =>
          i.status === "resolved" ? (
            <span className="text-xs text-text-dim">—</span>
          ) : (
            <button
              type="button"
              onClick={() =>
                setItems((prev) =>
                  prev.map((x) => {
                    if (x.id !== i.id) return x;
                    if (x.status === "open")
                      return { ...x, status: "in_progress" };
                    return { ...x, status: "resolved" };
                  }),
                )
              }
              className="rounded-lg border border-border bg-bg px-2.5 py-1 text-[11px] font-medium text-text-muted hover:text-text"
            >
              {i.status === "open" ? "Start triage" : "Resolve"}
            </button>
          ),
      },
    ],
    [],
  );

  return (
    <AdminShell crumbs={[{ label: "Care & insights" }, { label: "Issues" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Issues
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Failed deliveries, COD mismatches, damage, and rider complaints
        </p>
      </div>

      <DataTable
        title="Open tickets"
        rows={items}
        columns={columns}
        searchPlaceholder="Ticket"
        searchKeys={[
          (i) => i.title,
          (i) => i.detail,
          (i) => i.trackingCode ?? "",
          (i) => i.riderName ?? "",
          (i) => i.type,
        ]}
        typeOptions={[
          { label: "All types", value: "all" },
          { label: "Failed delivery", value: "failed_delivery" },
          { label: "Payment", value: "payment" },
          { label: "Wrong address", value: "wrong_address" },
          { label: "Damage", value: "damage" },
          { label: "Rider conduct", value: "rider_conduct" },
        ]}
        typeFilter={(i, type) => type === "all" || i.type === type}
        pageSize={10}
      />

      <p className="mt-3 text-xs text-text-dim">
        Tip: open a ticket ID to jump to the related order when linked.{" "}
        <Link href="/deliveries/d8" className="text-accent hover:underline">
          Example failed order
        </Link>
      </p>
    </AdminShell>
  );
}
