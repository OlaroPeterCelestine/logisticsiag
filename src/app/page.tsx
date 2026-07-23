"use client";

import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { KpiCard } from "@/components/KpiCard";
import { TrendCard } from "@/components/TrendCard";
import { FleetChart } from "@/components/FleetChart";
import { ActivityFeed } from "@/components/ActivityFeed";
import {
  AssigneeCell,
  DataTable,
  IdPill,
  PriorityBars,
  StatusCell,
  type DataTableColumn,
} from "@/components/DataTable";
import {
  dashboardStats,
  deliveries,
  formatUgx,
  riders,
  statusLabel,
} from "@/lib/data";
import type { Delivery } from "@/lib/types";
import { ExternalLink } from "lucide-react";

const live = deliveries.filter((d) =>
  ["assigned", "picked_up", "in_transit"].includes(d.status),
);

const columns: DataTableColumn<Delivery>[] = [
  {
    key: "tracking",
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
      <span className="text-xs font-medium text-text">{d.customer}</span>
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
    header: "ETA",
    render: (d) => (
      <span
        className={
          (d.etaMins ?? 0) > 30
            ? "text-xs font-medium text-red"
            : "text-xs text-text-muted"
        }
      >
        {d.etaMins != null ? `${d.etaMins}m left` : "—"}
      </span>
    ),
  },
  {
    key: "fee",
    header: "Fee",
    render: (d) => (
      <span className="text-xs text-text-muted">{formatUgx(d.fee)}</span>
    ),
  },
  {
    key: "track",
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

export default function DashboardPage() {
  return (
    <AdminShell crumbs={[{ label: "Command" }, { label: "Overview" }]}>
      <div className="space-y-5">
        <WelcomeBanner />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            label="Live deliveries"
            value={dashboardStats.liveDeliveries}
          />
          <KpiCard label="Unassigned" value={dashboardStats.unassigned} />
          <KpiCard label="Open issues" value={dashboardStats.openIssues} />
          <KpiCard
            label="COD outstanding"
            value={`${Math.round(dashboardStats.codOutstanding / 1000)}K`}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <TrendCard
            label="Active riders"
            value={dashboardStats.activeRiders}
            delta="12%"
            positive
            data={[2, 3, 2, 4, 3, 5, 4]}
          />
          <TrendCard
            label="Delivered today"
            value={dashboardStats.deliveredToday}
            delta="8%"
            positive
            data={[1, 2, 1, 3, 2, 2, 2]}
          />
          <TrendCard
            label="Failed / reattempt"
            value={dashboardStats.failedToday}
            delta="1 job"
            positive={false}
            data={[0, 1, 0, 0, 1, 0, 1]}
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <FleetChart />
          <ActivityFeed />
        </div>

        <DataTable
          title="Live deliveries & ETA"
          rows={live}
          columns={columns}
          searchPlaceholder="Order"
          searchKeys={[
            (d) => d.trackingCode,
            (d) => d.customer,
            (d) => d.riderName ?? "",
          ]}
          typeOptions={[
            { label: "All live", value: "all" },
            { label: "In transit", value: "in_transit" },
            { label: "Picked up", value: "picked_up" },
            { label: "Assigned", value: "assigned" },
          ]}
          typeFilter={(d, type) => type === "all" || d.status === type}
          pageSize={5}
          toolbarExtra={
            <Link
              href="/deliveries"
              className="text-xs font-medium text-accent hover:text-accent-hover"
            >
              View all →
            </Link>
          }
        />
      </div>
    </AdminShell>
  );
}
