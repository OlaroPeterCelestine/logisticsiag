"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Moon, Sun, ChevronRight, X } from "lucide-react";
import { notifications as seed } from "@/lib/data";
import { cn } from "@/lib/cn";
import { useTheme } from "@/components/ThemeProvider";

export function Header({
  crumbs,
}: {
  crumbs: Array<{ label: string; href?: string }>;
}) {
  const [open, setOpen] = useState(false);
  const unread = seed.filter((n) => !n.read).length;
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-6 backdrop-blur-xl">
      <nav className="flex items-center gap-1.5 text-sm text-text-muted">
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-dim" />}
            {c.href ? (
              <Link href={c.href} className="hover:text-text">
                {c.label}
              </Link>
            ) : (
              <span
                className={
                  i === crumbs.length - 1 ? "font-medium text-text" : undefined
                }
              >
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <div className="relative flex items-center gap-2">
        <div className="mr-2 flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          Ops online
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative rounded-lg p-2 text-text-muted transition hover:bg-bg-hover hover:text-text"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 rounded-full bg-red px-1 text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-text-muted transition hover:bg-bg-hover hover:text-text"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-orange-700 text-[11px] font-bold text-white">
          AD
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-96 overflow-hidden border border-border bg-bg shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="text-sm font-semibold text-text">Notifications</div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-text-dim hover:bg-bg-hover hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-96 overflow-y-auto">
              {seed.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href ?? "/"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block border-b border-border-subtle px-4 py-3 transition hover:bg-bg-hover/60",
                      !n.read && "bg-accent-muted/20",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          n.level === "critical"
                            ? "bg-red"
                            : n.level === "warn"
                              ? "bg-accent"
                              : "bg-blue",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-text">
                          {n.title}
                        </div>
                        <div className="mt-0.5 text-xs text-text-muted">
                          {n.body}
                        </div>
                        <div className="mt-1 text-[10px] text-text-dim">
                          {n.time}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
