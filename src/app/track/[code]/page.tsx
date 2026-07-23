import Link from "next/link";
import { notFound } from "next/navigation";
import {
  failReasonLabel,
  formatUgx,
  getDeliveryByTrack,
  getRider,
  statusLabel,
} from "@/lib/data";
import { TrackMapClient } from "@/components/MapClient";
import { Bike, Clock, MapPin, Phone } from "lucide-react";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const d = getDeliveryByTrack(code);
  if (!d) notFound();

  const rider = d.riderId ? getRider(d.riderId) : undefined;

  const steps = [
    { key: "assigned", label: "Assigned" },
    { key: "picked_up", label: "Picked up" },
    { key: "in_transit", label: "On the way" },
    { key: "delivered", label: "Delivered" },
  ] as const;

  const order = [
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "delivered",
  ];
  const currentIdx = order.indexOf(d.status);

  return (
    <div className="min-h-screen bg-bg px-4 py-8 text-text">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide">IAG</div>
            <div className="text-xs text-text-muted">Track your delivery</div>
          </div>
        </div>

        <div className="border-b border-border pb-6">
          <div className="font-mono text-xs font-semibold text-accent">
            {d.trackingCode}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {statusLabel(d.status)}
          </h1>
          {d.status === "failed" ? (
            <p className="mt-2 text-sm text-red">
              {failReasonLabel(d.failReason)} — we&apos;ll help reattempt.
            </p>
          ) : d.etaMins != null && d.etaMins > 0 ? (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-text-muted">
              <Clock className="h-4 w-4 text-accent" />
              Arriving in about <strong className="text-text">{d.etaMins} min</strong>
            </p>
          ) : d.status === "delivered" ? (
            <p className="mt-2 text-sm text-green">Package delivered successfully.</p>
          ) : (
            <p className="mt-2 text-sm text-text-muted">
              Waiting for a rider to be assigned.
            </p>
          )}

          {d.riderName && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-bg/50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                {d.riderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{d.riderName}</div>
                <div className="text-xs text-text-muted">Your rider</div>
              </div>
              <a
                href={`tel:${d.customerPhone}`}
                className="rounded-lg border border-border p-2 text-text-muted hover:text-accent"
                aria-label="Call"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        <div className="mt-4 border-y border-border bg-bg p-5">
          <h2 className="text-sm font-semibold">Progress</h2>
          <ol className="mt-4 space-y-0">
            {steps.map((step, i) => {
              const stepIdx = order.indexOf(step.key);
              const done =
                d.status === "delivered" ||
                (currentIdx >= 0 && stepIdx <= currentIdx && d.status !== "failed" && d.status !== "cancelled");
              const active = step.key === d.status;
              return (
                <li key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        done || active
                          ? "bg-accent text-white"
                          : "bg-bg-hover text-text-dim"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`my-1 w-0.5 flex-1 min-h-6 ${
                          done ? "bg-accent/50" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-4 text-sm">
                    <div
                      className={
                        done || active ? "font-medium text-text" : "text-text-dim"
                      }
                    >
                      {step.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-4 space-y-2 border-y border-border bg-bg p-5 text-sm">
          <Row
            icon={<MapPin className="h-4 w-4 text-green" />}
            label="Pickup"
            value={d.pickup}
          />
          <Row
            icon={<MapPin className="h-4 w-4 text-accent" />}
            label="Dropoff"
            value={d.dropoff}
          />
          <Row label="Merchant" value={d.merchantName} />
          <Row label="Distance" value={`${d.distanceKm} km`} />
          <Row label="Delivery fee" value={formatUgx(d.fee)} />
        </div>

        <div className="mt-4">
          <TrackMapClient
            riderLat={rider?.lat}
            riderLng={rider?.lng}
            dropoffLat={d.dropoffLat}
            dropoffLng={d.dropoffLng}
            riderName={d.riderName}
            dropoffLabel={d.dropoff}
            height={240}
          />
        </div>

        <p className="mt-6 text-center text-xs text-text-dim">
          Powered by IAG ·{" "}
          <Link href="/" className="text-text-muted hover:text-accent">
            Ops login
          </Link>
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border-subtle py-2.5 last:border-0">
      <span className="flex items-center gap-2 text-text-muted">
        {icon}
        {label}
      </span>
      <span className="max-w-[60%] text-right font-medium text-text">{value}</span>
    </div>
  );
}
