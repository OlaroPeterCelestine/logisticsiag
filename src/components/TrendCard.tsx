"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/cn";

export function TrendCard({
  label,
  value,
  delta,
  positive,
  data,
  suffix,
}: {
  label: string;
  value: string | number;
  delta: string;
  positive: boolean;
  data: number[];
  suffix?: string;
}) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? "#22c55e" : "#ef4444";

  return (
    <div className="border-t border-border py-5 animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-text-muted">{label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight text-text">
              {value}
            </span>
            {suffix && (
              <span className="text-sm text-text-muted">{suffix}</span>
            )}
          </div>
          <div
            className={cn(
              "mt-2 text-xs font-medium",
              positive ? "text-green" : "text-red",
            )}
          >
            {positive ? "↗" : "↘"} {delta} vs last period
          </div>
        </div>
        <div className="h-14 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2}
                fill={`url(#g-${label})`}
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
