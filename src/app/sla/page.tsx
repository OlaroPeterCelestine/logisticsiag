"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell } from "@/components/AdminShell";
import {
  DataTable,
  IdPill,
  PriorityBars,
  StatusCell,
  type DataTableColumn,
} from "@/components/DataTable";
import {
  dashboardStats,
  deliveries,
  hourlyOrders,
  riders,
  zones,
} from "@/lib/data";
import type { Rider, Zone } from "@/lib/types";

const riderColumns: DataTableColumn<Rider>[] = [
  {
    key: "rider",
    header: "Rider ID",
    sortable: true,
    sortValue: (r) => r.name,
    render: (r) => <IdPill href={`/riders/${r.id}`}>{r.plate}</IdPill>,
  },
  {
    key: "name",
    header: "Subject",
    render: (r) => (
      <div>
        <div className="text-xs font-medium text-text">{r.name}</div>
        <div className="text-[11px] text-text-dim">
          {r.zone} · {r.vehicle}
        </div>
      </div>
    ),
  },
  {
    key: "load",
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
    key: "status",
    header: "Status",
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
    key: "avg",
    header: "Created date",
    render: (r) => (
      <span className="text-xs text-text-muted">Avg {r.avgDeliveryMins}m</span>
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
        {r.onTimeRate}% on-time
      </span>
    ),
  },
];

const zoneColumns: DataTableColumn<Zone>[] = [
  {
    key: "zone",
    header: "Zone ID",
    sortable: true,
    sortValue: (z) => z.name,
    render: (z) => <IdPill href="/zones">{z.name.toUpperCase()}</IdPill>,
  },
  {
    key: "hubs",
    header: "Subject",
    render: (z) => (
      <span className="text-xs text-text-muted">{z.hubs[0]}</span>
    ),
  },
  {
    key: "coverage",
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
    key: "status",
    header: "Status",
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
    key: "riders",
    header: "Created date",
    render: (z) => (
      <span className="text-xs text-text-muted">
        {z.ridersOnline} riders · {z.openOrders} open
      </span>
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
        ETA {z.avgEtaMins}m · {z.surge.toFixed(2)}×
      </span>
    ),
  },
];

export default function PerformancePage() {
  const delivered = deliveries.filter((d) => d.status === "delivered");
  const failed = deliveries.filter((d) => d.status === "failed");
  const live = deliveries.filter((d) =>
    ["picked_up", "in_transit"].includes(d.status),
  );
  const podRate = Math.round(
    (delivered.filter((d) => d.podVerified).length /
      Math.max(delivered.length, 1)) *
      100,
  );

  const failBreakdown = [
    { name: "Unavailable", n: 1 },
    { name: "Wrong addr", n: 0 },
    { name: "Refused", n: 0 },
    { name: "Damage", n: 0 },
  ];

  return (
    <AdminShell crumbs={[{ label: "Care & insights" }, { label: "Performance" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Performance
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          SLA, ETA quality, POD compliance, and zone health
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: "On-time rate", value: `${dashboardStats.onTimeRate}%` },
          {
            label: "Avg live ETA",
            value: `${Math.round(
              live.reduce((s, d) => s + (d.etaMins ?? 0), 0) /
                Math.max(live.length, 1),
            )}m`,
          },
          { label: "POD verified", value: `${podRate}%` },
          { label: "Delivered", value: delivered.length },
          { label: "Failed", value: failed.length },
        ].map((k) => (
          <div
            key={k.label}
            className="border-y border-border bg-bg px-4 py-4"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
              {k.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-text">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="border-y border-border bg-bg p-5">
          <h3 className="text-sm font-semibold text-text">Orders by hour</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyOrders}>
                <defs>
                  <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2a2f3a" strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "#8b929e", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#5c6470", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#171a21",
                    border: "1px solid #2a2f3a",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#f97316"
                  fill="url(#ord)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border-y border-border bg-bg p-5">
          <h3 className="text-sm font-semibold text-text">
            Fail reasons (demo)
          </h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failBreakdown} barSize={28}>
                <CartesianGrid stroke="#2a2f3a" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8b929e", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#5c6470", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#171a21",
                    border: "1px solid #2a2f3a",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="n" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <DataTable
          title="Rider SLA board"
          rows={riders}
          columns={riderColumns}
          searchPlaceholder="Rider"
          searchKeys={[(r) => r.name, (r) => r.plate, (r) => r.zone]}
          typeOptions={[
            { label: "All riders", value: "all" },
            { label: "Online", value: "online" },
            { label: "On delivery", value: "on_delivery" },
            { label: "Offline", value: "offline" },
          ]}
          typeFilter={(r, type) => type === "all" || r.status === type}
          pageSize={10}
          toolbarExtra={
            <Link href="/riders" className="text-xs text-accent hover:underline">
              Riders →
            </Link>
          }
        />

        <DataTable
          title="Zone health"
          rows={zones}
          columns={zoneColumns}
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
          toolbarExtra={
            <Link href="/zones" className="text-xs text-accent hover:underline">
              Zones →
            </Link>
          }
        />
      </div>
    </AdminShell>
  );
}
