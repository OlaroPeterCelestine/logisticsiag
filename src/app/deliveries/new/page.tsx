"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { merchants, zones, formatUgx } from "@/lib/data";

const inputClass =
  "w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-text outline-none focus:border-accent/50";

export default function NewOrderPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    merchantId: merchants[0]?.id ?? "",
    customer: "",
    customerPhone: "",
    pickup: merchants[0]?.address ?? "",
    dropoff: "",
    zone: merchants[0]?.zone ?? "Central",
    priority: "standard",
    fee: "15000",
    codAmount: "0",
    podRequired: true,
    notes: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = `HAU-${Math.floor(88000 + Math.random() * 1000)}`;
    setToast(`Order ${code} created · sent to dispatch queue`);
    setTimeout(() => router.push("/dispatch"), 900);
  }

  const merchant = merchants.find((m) => m.id === form.merchantId);

  return (
    <AdminShell
      crumbs={[
        { label: "Operations", href: "/deliveries" },
        { label: "New order" },
      ]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          New order
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Create a delivery job for dispatch — OTP & track link generated on save
        </p>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl border border-green/30 bg-green-muted px-4 py-2.5 text-sm text-green">
          {toast}
        </div>
      )}

      <form
        onSubmit={submit}
        className="grid max-w-3xl gap-5 lg:grid-cols-[1fr_280px]"
      >
        <div className="space-y-4 border-y border-border bg-bg p-5">
          <Field label="Merchant">
            <select
              className={inputClass}
              value={form.merchantId}
              onChange={(e) => {
                const m = merchants.find((x) => x.id === e.target.value);
                set("merchantId", e.target.value);
                if (m) {
                  set("pickup", m.address);
                  set("zone", m.zone);
                }
              }}
            >
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer name">
              <input
                className={inputClass}
                required
                value={form.customer}
                onChange={(e) => set("customer", e.target.value)}
                placeholder="Recipient name"
              />
            </Field>
            <Field label="Customer phone">
              <input
                className={inputClass}
                required
                value={form.customerPhone}
                onChange={(e) => set("customerPhone", e.target.value)}
                placeholder="+256 …"
              />
            </Field>
          </div>

          <Field label="Pickup">
            <input
              className={inputClass}
              required
              value={form.pickup}
              onChange={(e) => set("pickup", e.target.value)}
            />
          </Field>

          <Field label="Dropoff">
            <input
              className={inputClass}
              required
              value={form.dropoff}
              onChange={(e) => set("dropoff", e.target.value)}
              placeholder="Delivery address"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Zone">
              <select
                className={inputClass}
                value={form.zone}
                onChange={(e) => set("zone", e.target.value)}
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="same_day">Same day</option>
              </select>
            </Field>
            <Field label="Fee (UGX)">
              <input
                className={inputClass}
                type="number"
                value={form.fee}
                onChange={(e) => set("fee", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="COD (UGX)">
              <input
                className={inputClass}
                type="number"
                value={form.codAmount}
                onChange={(e) => set("codAmount", e.target.value)}
              />
            </Field>
            <Field label="Proof of delivery">
              <label className="flex h-[42px] items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={form.podRequired}
                  onChange={(e) => set("podRequired", e.target.checked)}
                  className="accent-orange-500"
                />
                Require OTP + photo
              </label>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Gate code, fragile, leave with reception…"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <div className="border-y border-border bg-bg p-5">
            <h3 className="text-sm font-semibold text-text">Summary</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <Row k="Merchant" v={merchant?.name ?? "—"} />
              <Row k="Zone" v={form.zone} />
              <Row k="Priority" v={form.priority.replace("_", " ")} />
              <Row k="Fee" v={formatUgx(Number(form.fee) || 0)} />
              <Row
                k="COD"
                v={
                  Number(form.codAmount)
                    ? formatUgx(Number(form.codAmount))
                    : "None"
                }
              />
              <Row
                k="POD"
                v={form.podRequired ? "OTP + photo" : "Not required"}
              />
            </dl>
            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Create & send to dispatch
            </button>
            <button
              type="button"
              onClick={() => router.push("/deliveries")}
              className="mt-2 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-text-muted hover:text-text"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-dim">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-text-muted">{k}</dt>
      <dd className="text-right font-medium capitalize text-text">{v}</dd>
    </div>
  );
}
