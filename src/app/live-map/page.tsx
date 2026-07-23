"use client";

import { AdminShell } from "@/components/AdminShell";
import { riders, deliveries } from "@/lib/data";
import { RiderStatusBadge, DeliveryStatusBadge } from "@/components/StatusBadge";
import { FleetMapClient } from "@/components/MapClient";
import { Clock } from "lucide-react";

export default function LiveMapPage() {
  const active = riders.filter((r) =>
    ["online", "on_delivery"].includes(r.status),
  );
  const liveJobs = deliveries.filter((d) =>
    ["assigned", "picked_up", "in_transit"].includes(d.status),
  );

  return (
    <AdminShell crumbs={[{ label: "Command" }, { label: "Live Map" }]}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Live Map
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            OpenStreetMap · rider GPS and active delivery dropoffs in Kampala
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          {active.length} riders broadcasting
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="relative min-h-[520px] overflow-hidden border border-border">
          <FleetMapClient
            riders={riders}
            deliveries={liveJobs}
            height={520}
          />
          <div className="pointer-events-none absolute bottom-3 left-3 border border-border bg-bg/90 px-3 py-2 text-[11px] text-text-muted backdrop-blur">
            OpenStreetMap · live demo positions
          </div>
        </div>

        <div className="space-y-3">
          <div className="border-y border-border bg-bg p-4">
            <h3 className="text-sm font-semibold text-text">Active riders</h3>
            <ul className="mt-3 space-y-3">
              {active.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: r.avatarColor }}
                    >
                      {r.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-text">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-text-dim">
                        {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <RiderStatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          </div>

          <div className="border-y border-border bg-bg p-4">
            <h3 className="text-sm font-semibold text-text">Live ETAs</h3>
            <ul className="mt-3 space-y-3">
              {liveJobs.map((d) => (
                <li
                  key={d.id}
                  className="border border-border-subtle bg-bg/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-accent">
                      {d.trackingCode}
                    </span>
                    <DeliveryStatusBadge status={d.status} />
                  </div>
                  <div className="mt-1.5 text-xs text-text-muted">
                    {d.riderName}
                  </div>
                  {d.etaMins != null && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-text">
                      <Clock className="h-3.5 w-3.5 text-accent" />
                      ETA {d.etaMins} min
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
