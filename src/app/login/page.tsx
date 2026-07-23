import type { Metadata } from "next";
import Link from "next/link";
import {
  Bike,
  MapPinned,
  Radio,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — IAG Logistics",
  description: "Sign in to the IAG last-mile operations console",
};

const highlights = [
  {
    icon: Radio,
    title: "Live dispatch",
    body: "Assign unassigned orders to riders in one board.",
  },
  {
    icon: Timer,
    title: "ETA confidence",
    body: "Track on-time performance and exceptions as they happen.",
  },
  {
    icon: MapPinned,
    title: "Zone coverage",
    body: "See hubs, riders, and delivery density across the city.",
  },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand & details */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#0a0a0a] px-8 py-10 text-white sm:px-12 lg:px-14 lg:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(249,115,22,0.28), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(30,58,95,0.45), transparent 50%), linear-gradient(165deg, #0a0a0a 0%, #121212 55%, #0a0a0a 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10">
          <Link href="/login" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent shadow-[0_12px_40px_rgba(249,115,22,0.35)]">
              <Bike className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-wide">
                IAG
              </span>
              <span className="block text-xs text-white/55">
                Last-mile logistics
              </span>
            </span>
          </Link>

          <div className="mt-14 max-w-md lg:mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Operations console
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Run every delivery from one calm command center.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Dispatch riders, clear issues, and watch live ETAs across your
              zones — built for last-mile teams that move fast.
            </p>
          </div>

          <ul className="mt-12 max-w-md space-y-5">
            {highlights.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <item.icon className="h-4 w-4 text-accent" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-white/55">
                    {item.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-8 lg:mt-10">
          {[
            { value: "2.4k", label: "Orders / day" },
            { value: "96%", label: "On-time" },
            { value: "<8m", label: "Avg ETA" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-8 flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck className="h-3.5 w-3.5" />
          SSO-ready · Role-based access · Audit trail
        </div>
      </section>

      {/* Right — form */}
      <section className="flex items-center justify-center bg-bg px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-text">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Enter your ops credentials to open the IAG console.
            </p>
          </div>

          <LoginForm />

          <p className="mt-10 text-center text-xs text-text-dim">
            Need access? Ask your workspace admin, or{" "}
            <Link href="/track/HAU-88421" className="text-accent hover:underline">
              track a delivery
            </Link>{" "}
            without signing in.
          </p>
        </div>
      </section>
    </div>
  );
}
