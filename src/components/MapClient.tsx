"use client";

import dynamic from "next/dynamic";
import type { Delivery, Rider } from "@/lib/types";

const FleetMapInner = dynamic(
  () => import("@/components/FleetMap").then((m) => m.FleetMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center border border-border bg-bg-hover text-sm text-text-dim">
        Loading map…
      </div>
    ),
  },
);

const TrackMapInner = dynamic(
  () => import("@/components/FleetMap").then((m) => m.TrackMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[220px] items-center justify-center border border-border bg-bg-hover text-sm text-text-dim">
        Loading map…
      </div>
    ),
  },
);

export function FleetMapClient(props: {
  riders: Rider[];
  deliveries?: Delivery[];
  className?: string;
  height?: string | number;
}) {
  return <FleetMapInner {...props} />;
}

export function TrackMapClient(props: {
  riderLat?: number | null;
  riderLng?: number | null;
  dropoffLat: number;
  dropoffLng: number;
  riderName?: string | null;
  dropoffLabel: string;
  height?: number;
}) {
  return <TrackMapInner {...props} />;
}
