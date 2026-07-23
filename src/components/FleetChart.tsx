"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { name: "Morning", units: 12 },
  { name: "Midday", units: 18 },
  { name: "Evening", units: 8 },
];

export function FleetChart() {
  return (
    <div className="border-t border-border py-5 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">Orders by window</h3>
          <p className="mt-1 text-xs text-text-muted">
            38 deliveries scheduled today
          </p>
        </div>
        <span className="rounded-full bg-green-muted px-2.5 py-1 text-[11px] font-semibold text-green">
          2 need dispatch
        </span>
      </div>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={36}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-dim)", fontSize: 11 }}
              ticks={[0, 10, 20]}
            />
            <Tooltip
              cursor={{ fill: "var(--bg-hover)" }}
              contentStyle={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text)",
              }}
            />
            <Bar dataKey="units" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.name === "Midday"
                      ? "#f97316"
                      : entry.name === "Morning"
                        ? "#fb923c"
                        : "#9a3412"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
