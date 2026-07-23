import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import {
  deliveries,
  formatUgx,
  getRider,
} from "@/lib/data";
import { RiderStatusBadge } from "@/components/StatusBadge";
import { notFound } from "next/navigation";

export default async function RiderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = getRider(id);
  if (!r) notFound();

  const jobs = deliveries.filter((d) => d.riderId === r.id);

  return (
    <AdminShell
      crumbs={[
        { label: "Operations", href: "/riders" },
        { label: "Riders", href: "/riders" },
        { label: r.name },
      ]}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white"
            style={{ backgroundColor: r.avatarColor }}
          >
            {r.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text">
                {r.name}
              </h1>
              <RiderStatusBadge status={r.status} />
            </div>
            <p className="mt-1 text-sm text-text-muted">
              {r.vehicle} · {r.plate} · {r.zone} · ★ {r.rating}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: "Today", value: r.deliveriesToday },
          { label: "On-time", value: `${r.onTimeRate}%` },
          { label: "Avg time", value: `${r.avgDeliveryMins}m` },
          { label: "Active / max", value: `${r.activeJobs}/${r.maxJobs}` },
          { label: "Week earnings", value: formatUgx(r.earningsWeek) },
        ].map((k) => (
          <div
            key={k.label}
            className="border-y border-border bg-bg px-4 py-3"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
              {k.label}
            </div>
            <div className="mt-1 text-lg font-semibold text-text">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-y border-border bg-bg p-5">
          <h3 className="text-sm font-semibold text-text">Documents</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between border-b border-border-subtle py-2">
              <dt className="text-text-muted">License expiry</dt>
              <dd className="text-text">{r.licenseExpiry}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-text-muted">Verification</dt>
              <dd className={r.documentsOk ? "text-green" : "text-red"}>
                {r.documentsOk ? "Verified" : "Incomplete / expired"}
              </dd>
            </div>
          </dl>
          <div className="mt-3 text-xs text-text-muted">
            Phone {r.phone} · {r.email}
          </div>
        </div>

        <div className="border-y border-border bg-bg p-5">
          <h3 className="text-sm font-semibold text-text">Jobs (today)</h3>
          <ul className="mt-3 space-y-2">
            {jobs.length === 0 && (
              <li className="text-xs text-text-dim">No jobs linked</li>
            )}
            {jobs.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/deliveries/${d.id}`}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg/40 px-3 py-2 text-xs hover:border-accent/40"
                >
                  <span className="font-mono text-accent">{d.trackingCode}</span>
                  <span className="text-text-muted capitalize">
                    {d.status.replace("_", " ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
