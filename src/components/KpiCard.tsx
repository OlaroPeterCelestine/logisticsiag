import { cn } from "@/lib/cn";

export function KpiCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={cn("px-1 py-2 animate-fade-up", className)}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-text">
        {value}
      </div>
    </div>
  );
}
