"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Users,
  Package,
  Search,
  Settings,
  Bike,
  Clock,
  Radio,
  Store,
  MapPinned,
  LifeBuoy,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/cn";

const sections = [
  {
    title: "Command",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboard },
      { href: "/live-map", label: "Live Map", icon: Map },
      { href: "/dispatch", label: "Dispatch", icon: Radio, badge: 2 },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/deliveries", label: "Orders", icon: Package, badge: 5 },
      { href: "/deliveries/new", label: "New order", icon: Plus },
      { href: "/riders", label: "Riders", icon: Users },
      { href: "/merchants", label: "Merchants", icon: Store },
      { href: "/zones", label: "Zones & hubs", icon: MapPinned },
    ],
  },
  {
    title: "Care & insights",
    items: [
      { href: "/issues", label: "Issues", icon: LifeBuoy, badge: 4 },
      { href: "/sla", label: "Performance", icon: Clock },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-bg">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
          <Bike className="h-5 w-5" strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-wide text-text">
            HAULA
          </div>
          <div className="text-[11px] text-text-muted">Last-mile delivery</div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <Link
          href="/deliveries"
          className="flex w-full items-center gap-2 border border-border px-3 py-2.5 text-left text-sm text-text-muted transition hover:border-accent/40 hover:text-text"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1">Search orders…</span>
          <kbd className="border border-border bg-bg px-1.5 py-0.5 text-[10px] text-text-dim">
            ⌘K
          </kbd>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/deliveries"
                      ? pathname === "/deliveries" ||
                        (pathname.startsWith("/deliveries/") &&
                          !pathname.startsWith("/deliveries/new"))
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition",
                        active
                          ? "bg-accent text-white"
                          : "text-text-muted hover:bg-bg-hover hover:text-text",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active
                            ? "text-white"
                            : "text-text-dim group-hover:text-text-muted",
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {"badge" in item && item.badge != null && (
                        <span
                          className={cn(
                            "min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-red text-white",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-text">
              admin@haula.local
            </div>
            <div className="text-[10px] text-text-muted">Dispatcher</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
