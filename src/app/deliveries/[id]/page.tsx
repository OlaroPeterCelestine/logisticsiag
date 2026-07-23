"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import {
  buildTimeline,
  failReasonLabel,
  formatTime,
  formatUgx,
  getDelivery,
  getPodAttempts,
  riders,
} from "@/lib/data";
import { DeliveryStatusBadge } from "@/components/StatusBadge";
import {
  ExternalLink,
  MapPin,
  Phone,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const d = getDelivery(params.id);
  const [riderId, setRiderId] = useState(d?.riderId ?? "");
  const [toast, setToast] = useState<string | null>(null);
  const timeline = useMemo(() => (d ? buildTimeline(d) : []), [d]);

  if (!d) {
    return (
      <AdminShell
        crumbs={[
          { label: "Orders", href: "/deliveries" },
          { label: "Not found" },
        ]}
      >
        <div className="border-y border-border bg-bg p-10 text-center">
          <p className="text-text-muted">Order not found.</p>
          <Link
            href="/deliveries"
            className="mt-3 inline-block text-sm text-accent"
          >
            Back to orders
          </Link>
        </div>
      </AdminShell>
    );
  }

  const available = riders.filter((r) =>
    ["online", "on_delivery", "break"].includes(r.status),
  );
  const trackingCode = d.trackingCode;

  function reassign() {
    const r = riders.find((x) => x.id === riderId);
    if (!r) return;
    setToast(`Reassigned ${trackingCode} → ${r.name}`);
    setTimeout(() => setToast(null), 2500);
  }

  function reattempt() {
    setToast(`Reattempt created from ${trackingCode} · sent to dispatch`);
    setTimeout(() => router.push("/dispatch"), 900);
  }

  return (
    <AdminShell
      crumbs={[
        { label: "Operations", href: "/deliveries" },
        { label: "Orders", href: "/deliveries" },
        { label: d.trackingCode },
      ]}
    >
      {toast && (
        <div className="mb-4 rounded-xl border border-green/30 bg-green-muted px-4 py-2.5 text-sm text-green">
          {toast}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-accent">
              {d.trackingCode}
            </h1>
            <DeliveryStatusBadge status={d.status} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] capitalize text-text-muted">
              {d.priority.replace("_", " ")}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            {d.merchantName} → {d.customer} · {d.zone} zone
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/track/${d.trackingCode}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-bg px-3.5 py-2 text-sm text-text-muted hover:text-text"
          >
            Customer track <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          {d.status === "failed" && (
            <button
              onClick={reattempt}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Create reattempt
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card title="Route & contact">
            <div className="space-y-3 text-sm">
              <div className="flex gap-2 text-text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                <div>
                  <div className="text-[11px] uppercase text-text-dim">
                    Pickup
                  </div>
                  {d.pickup}
                </div>
              </div>
              <div className="flex gap-2 text-text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <div className="text-[11px] uppercase text-text-dim">
                    Dropoff
                  </div>
                  {d.dropoff}
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border pt-3 text-text-muted">
                <Phone className="h-4 w-4 text-text-dim" />
                {d.customerPhone}
              </div>
              {d.notes && (
                <div className="rounded-xl bg-bg px-3 py-2 text-xs text-text-muted">
                  Note: {d.notes}
                </div>
              )}
            </div>
          </Card>

          <Card title="Timeline">
            <ol>
              {timeline.map((step, i) => (
                <li key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                        step.done || step.current
                          ? "bg-accent text-white"
                          : "bg-bg-hover text-text-dim",
                      )}
                    >
                      {i + 1}
                    </div>
                    {i < timeline.length - 1 && (
                      <div
                        className={cn(
                          "my-1 w-0.5 min-h-6 flex-1",
                          step.done ? "bg-accent/40" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        step.done || step.current
                          ? "text-text"
                          : "text-text-dim",
                      )}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-text-dim">
                      {formatTime(step.at)}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {d.status === "failed" && (
              <div className="mt-2 rounded-xl border border-red/30 bg-red-muted px-3 py-2 text-xs text-red">
                Fail reason: {failReasonLabel(d.failReason)}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="POD evidence">
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-bg px-2.5 py-0.5 text-text-muted">
                Method · {d.podMethod?.replace("_", " + ") ?? "n/a"}
              </span>
              <span
                className={
                  d.podVerified
                    ? "rounded-full bg-green-muted px-2.5 py-0.5 text-green"
                    : "rounded-full bg-bg-hover px-2.5 py-0.5 text-text-dim"
                }
              >
                {d.podVerified ? "Verified" : "Pending"}
              </span>
            </div>
            {getPodAttempts(d.id).length === 0 ? (
              <p className="text-xs text-text-dim">
                No POD attempts yet for this order.
              </p>
            ) : (
              <ul className="space-y-2">
                {getPodAttempts(d.id).map((a, i) => (
                  <li
                    key={`${a.at}-${i}`}
                    className="flex gap-3 rounded-xl border border-border bg-bg/50 px-3 py-2.5"
                  >
                    <div
                      className={
                        a.result === "success"
                          ? "mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green"
                          : "mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red"
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium capitalize text-text">
                        {a.method} · {a.result}
                      </div>
                      <div className="mt-0.5 text-[11px] text-text-muted">
                        {a.detail}
                      </div>
                      <div className="mt-1 text-[10px] text-text-dim">
                        {formatTime(a.at)}
                      </div>
                    </div>
                    {a.method === "photo" && a.result === "success" && (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-hover text-[10px] text-text-dim">
                        IMG
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Money & proof">
            <dl className="text-sm">
              <Row k="Delivery fee" v={formatUgx(d.fee)} />
              <Row
                k="COD to collect"
                v={d.codAmount ? formatUgx(d.codAmount) : "None"}
              />
              <Row k="OTP" v={d.otp} mono />
              <Row
                k="POD required"
                v={
                  d.podRequired
                    ? d.podMethod?.replace("_", " + ") ?? "Yes"
                    : "No"
                }
              />
              <Row
                k="POD verified"
                v={d.podVerified ? "Yes" : "Not yet"}
                accent={d.podVerified}
              />
              <Row
                k="ETA"
                v={
                  d.etaMins != null && d.etaMins > 0 ? `${d.etaMins} min` : "—"
                }
              />
              <Row k="Distance" v={`${d.distanceKm} km`} />
            </dl>
          </Card>

          <Card title="Rider">
            {d.riderName ? (
              <div className="mb-3 text-sm text-text">
                Current:{" "}
                <Link
                  href={`/riders/${d.riderId}`}
                  className="font-medium text-accent hover:underline"
                >
                  {d.riderName}
                </Link>
              </div>
            ) : (
              <div className="mb-3 text-sm text-red">Unassigned</div>
            )}
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-dim">
              Reassign
            </label>
            <select
              value={riderId}
              onChange={(e) => setRiderId(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-text outline-none focus:border-accent/50"
            >
              <option value="">Select rider…</option>
              {available.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.zone} · {r.activeJobs}/{r.maxJobs} jobs
                </option>
              ))}
            </select>
            <button
              onClick={reassign}
              disabled={!riderId}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-40"
            >
              <UserPlus className="h-4 w-4" />
              Assign / reassign
            </button>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-y border-border bg-bg p-5">
      <h3 className="mb-4 text-sm font-semibold text-text">{title}</h3>
      {children}
    </div>
  );
}

function Row({
  k,
  v,
  mono,
  accent,
}: {
  k: string;
  v: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 border-b border-border-subtle py-2 last:border-0">
      <dt className="text-text-muted">{k}</dt>
      <dd
        className={cn(
          "text-right font-medium capitalize",
          mono && "font-mono text-accent",
          accent ? "text-green" : "text-text",
        )}
      >
        {v}
      </dd>
    </div>
  );
}
