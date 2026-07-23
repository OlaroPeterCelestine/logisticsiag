"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { activities } from "@/lib/data";
import { cn } from "@/lib/cn";

const tabs = ["Today", "Yesterday", "This week"] as const;

export function ActivityFeed() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Today");
  const [q, setQ] = useState("");

  const filtered =
    tab === "Today"
      ? activities.filter((a) =>
          a.message.toLowerCase().includes(q.toLowerCase()),
        )
      : [];

  return (
    <div className="flex h-full flex-col border-t border-border py-5 animate-fade-up">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text">Latest Updates</h3>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium transition",
                tab === t
                  ? "text-text underline underline-offset-4"
                  : "text-text-dim hover:text-text-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4">
        <Search className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search activities…"
          className="w-full border-b border-border bg-transparent py-2 pl-6 pr-3 text-xs text-text outline-none placeholder:text-text-dim focus:border-accent/50"
        />
      </div>

      <div className="mt-4 flex-1 space-y-0 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-text-dim">
            No updates for this period.
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className="flex gap-3 border-b border-border-subtle px-0 py-3"
            >
              <div
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  a.type === "alert"
                    ? "bg-red"
                    : a.type === "delivery"
                      ? "bg-accent"
                      : a.type === "rider"
                        ? "bg-green"
                        : "bg-blue",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text">{a.message}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-text-dim">
                  <span>{a.time}</span>
                  {a.meta && (
                    <>
                      <span>·</span>
                      <span className="text-text-muted">{a.meta}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
