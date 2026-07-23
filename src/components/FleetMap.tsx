"use client";

import { Fragment, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Delivery, Rider } from "@/lib/types";

const KAMPALA: [number, number] = [0.3476, 32.5825];

function riderIcon(color: string) {
  return L.divIcon({
    className: "haula-map-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="
      width:28px;height:28px;border-radius:999px;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
    "></div>`,
  });
}

function pinIcon(color: string) {
  return L.divIcon({
    className: "haula-map-marker",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="
      width:16px;height:16px;border-radius:999px;
      background:${color};border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,.3);
    "></div>`,
  });
}

function FitBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) {
      map.setView(KAMPALA, 13);
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export function FleetMap({
  riders,
  deliveries = [],
  className,
  height = "100%",
}: {
  riders: Rider[];
  deliveries?: Delivery[];
  className?: string;
  height?: string | number;
}) {
  const activeRiders = riders.filter((r) =>
    ["online", "on_delivery"].includes(r.status),
  );

  const liveDeliveries = deliveries.filter((d) =>
    ["assigned", "picked_up", "in_transit"].includes(d.status),
  );

  const points = useMemo(() => {
    const pts: Array<[number, number]> = activeRiders.map((r) => [
      r.lat,
      r.lng,
    ]);
    for (const d of liveDeliveries) {
      pts.push([d.dropoffLat, d.dropoffLng]);
      pts.push([d.pickupLat, d.pickupLng]);
    }
    return pts;
  }, [activeRiders, liveDeliveries]);

  return (
    <div
      className={className}
      style={{ height, minHeight: 320, width: "100%" }}
    >
      <MapContainer
        center={KAMPALA}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", background: "var(--bg-hover)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />

        {activeRiders.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={riderIcon(r.avatarColor)}
          >
            <Popup>
              <strong>{r.name}</strong>
              <br />
              {r.plate} · {r.status.replace("_", " ")}
              <br />
              {r.zone} zone
            </Popup>
          </Marker>
        ))}

        {liveDeliveries.map((d) => {
          const rider = riders.find((r) => r.id === d.riderId);
          const line: Array<[number, number]> = rider
            ? [
                [rider.lat, rider.lng],
                [d.dropoffLat, d.dropoffLng],
              ]
            : [
                [d.pickupLat, d.pickupLng],
                [d.dropoffLat, d.dropoffLng],
              ];
          return (
            <Fragment key={d.id}>
              <Marker
                position={[d.dropoffLat, d.dropoffLng]}
                icon={pinIcon("#f97316")}
              >
                <Popup>
                  <strong>{d.trackingCode}</strong>
                  <br />
                  {d.dropoff}
                  <br />
                  ETA {d.etaMins ?? "—"} min
                </Popup>
              </Marker>
              <Polyline
                positions={line}
                pathOptions={{
                  color: "#f97316",
                  weight: 3,
                  opacity: 0.75,
                  dashArray: "8 6",
                }}
              />
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}

export function TrackMap({
  riderLat,
  riderLng,
  dropoffLat,
  dropoffLng,
  riderName,
  dropoffLabel,
  height = 220,
}: {
  riderLat?: number | null;
  riderLng?: number | null;
  dropoffLat: number;
  dropoffLng: number;
  riderName?: string | null;
  dropoffLabel: string;
  height?: number;
}) {
  const points: Array<[number, number]> = [[dropoffLat, dropoffLng]];
  if (riderLat != null && riderLng != null) {
    points.unshift([riderLat, riderLng]);
  }

  return (
    <div
      style={{ height, width: "100%" }}
      className="overflow-hidden border border-border"
    >
      <MapContainer
        center={[dropoffLat, dropoffLng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {riderLat != null && riderLng != null && (
          <Marker position={[riderLat, riderLng]} icon={riderIcon("#f97316")}>
            <Popup>{riderName ?? "Rider"}</Popup>
          </Marker>
        )}
        <Marker position={[dropoffLat, dropoffLng]} icon={pinIcon("#22c55e")}>
          <Popup>{dropoffLabel}</Popup>
        </Marker>
        {riderLat != null && riderLng != null && (
          <Polyline
            positions={[
              [riderLat, riderLng],
              [dropoffLat, dropoffLng],
            ]}
            pathOptions={{ color: "#f97316", weight: 3, opacity: 0.8 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
