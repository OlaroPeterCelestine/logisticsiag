"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownUp,
  ChevronDown,
  Clock3,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

type Props<T extends { id: string }> = {
  title: string;
  rows: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  searchKeys?: Array<(row: T) => string>;
  typeOptions?: Array<{ label: string; value: string }>;
  typeFilter?: (row: T, type: string) => boolean;
  pageSize?: number;
  emptyMessage?: string;
  toolbarExtra?: React.ReactNode;
  onSelectionChange?: (ids: string[]) => void;
};

export function DataTable<T extends { id: string }>({
  title,
  rows,
  columns,
  searchPlaceholder = "Search",
  searchKeys,
  typeOptions,
  typeFilter,
  pageSize = 10,
  emptyMessage = "No rows found",
  toolbarExtra,
  onSelectionChange,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(typeOptions?.[0]?.value ?? "all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSelectionChange?.(Array.from(selected));
  }, [selected, onSelectionChange]);

  const defaultType = typeOptions?.[0]?.value ?? "all";
  const filtersActive = query.trim().length > 0 || type !== defaultType;

  const filtered = useMemo(() => {
    let list = [...rows];
    if (type !== "all" && typeFilter) {
      list = list.filter((r) => typeFilter(r, type));
    }
    const q = query.trim().toLowerCase();
    if (q && searchKeys?.length) {
      list = list.filter((r) =>
        searchKeys.some((fn) => fn(r).toLowerCase().includes(q)),
      );
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        list.sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          if (av < bv) return sortDir === "asc" ? -1 : 1;
          if (av > bv) return sortDir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }
    return list;
  }, [rows, type, typeFilter, query, searchKeys, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageRows.forEach((r) => next.delete(r.id));
      } else {
        pageRows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="overflow-hidden border-y border-border bg-bg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-0 py-4 sm:px-1">
        <h3 className="text-base font-semibold tracking-tight text-text">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {toolbarExtra}
          {typeOptions && typeOptions.length > 0 && (
            <div className="relative">
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="appearance-none rounded-full border border-border bg-bg py-2 pl-3.5 pr-8 text-xs font-medium text-text-muted outline-none hover:text-text"
              >
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
            </div>
          )}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-40 rounded-full border border-border bg-bg py-2 pl-9 pr-3 text-xs text-text outline-none placeholder:text-text-dim focus:border-accent/40 sm:w-48"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (filtersActive) {
                setQuery("");
                setType(defaultType);
                setPage(1);
              } else {
                searchInputRef.current?.focus();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3.5 py-2 text-xs font-medium text-text-muted transition hover:text-text"
          >
            <Filter className="h-3.5 w-3.5" />
            {filtersActive ? "Clear" : "Filter"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-12 px-2 py-3 sm:px-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 rounded border-border accent-orange-500"
                  aria-label="Select all"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-dim",
                    col.className,
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1.5 transition hover:text-text-muted"
                    >
                      {col.header}
                      <ArrowDownUp
                        className={cn(
                          "h-3 w-3",
                          sortKey === col.key ? "text-accent" : "text-text-dim",
                        )}
                      />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-5 py-16 text-center text-sm text-text-dim"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border-subtle transition last:border-0",
                    selected.has(row.id)
                      ? "bg-bg-hover/70"
                      : "hover:bg-bg-hover/40",
                  )}
                >
                  <td className="px-2 py-3.5 sm:px-3">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleOne(row.id)}
                      className="h-3.5 w-3.5 rounded border-border accent-orange-500"
                      aria-label={`Select ${row.id}`}
                    />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3.5 align-middle", col.className)}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-1 py-3.5">
        <div className="text-xs text-text-dim">
          Showing {filtered.length === 0 ? 0 : start + 1}–
          {Math.min(start + pageSize, filtered.length)} of {filtered.length} ·{" "}
          {pageSize} per page
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-muted transition hover:text-text disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 text-xs text-text-dim">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-muted transition hover:text-text disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/** Blue/indigo ID pill like the ticket screenshot */
export function IdPill({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const className =
    "inline-flex rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide";
  const style = {
    backgroundColor: "var(--id-pill-bg)",
    borderColor: "var(--id-pill-border)",
    color: "var(--id-pill-text)",
  } as const;
  if (href) {
    return (
      <Link
        href={href}
        className={cn(className, "hover:opacity-80")}
        style={style}
      >
        {children}
      </Link>
    );
  }
  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}

export function PriorityBars({
  level,
}: {
  level: "low" | "medium" | "high" | "standard" | "express" | "same_day";
}) {
  const rank =
    level === "high" || level === "express"
      ? 3
      : level === "medium" || level === "same_day"
        ? 2
        : 1;
  const color =
    rank === 3 ? "#ef4444" : rank === 2 ? "#f59e0b" : "#eab308";

  return (
    <div className="flex items-end gap-0.5" title={level.replace("_", " ")}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-1 rounded-sm"
          style={{
            height: 4 + i * 4,
            backgroundColor: i <= rank ? color : "#2a2f3a",
          }}
        />
      ))}
    </div>
  );
}

export function StatusCell({
  label,
  tone = "muted",
}: {
  label: string;
  tone?: "muted" | "accent" | "green" | "red" | "blue";
}) {
  const color =
    tone === "green"
      ? "text-green"
      : tone === "red"
        ? "text-red"
        : tone === "accent"
          ? "text-accent"
          : tone === "blue"
            ? "text-blue"
            : "text-text-muted";

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", color)}>
      <Clock3 className="h-3.5 w-3.5 shrink-0 opacity-80" />
      {label}
    </span>
  );
}

export function AssigneeCell({
  name,
  color,
}: {
  name: string | null;
  color?: string;
}) {
  if (!name) {
    return <span className="text-xs text-text-dim">Unassigned</span>;
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <span className="inline-flex items-center gap-2 text-xs text-text">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: color ?? "#f97316" }}
      >
        {initials}
      </span>
      {name.split(" ")[0]}
    </span>
  );
}

export function formatTableDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
