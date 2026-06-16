"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FunnelStats } from "@/lib/dashboard/types";
import { funnelPercent } from "@/utils/format";

interface FunnelChartProps {
  funnel: FunnelStats;
}

const STAGES = ["applied", "emailed", "viewed", "responded"] as const;

export function FunnelChart({ funnel }: FunnelChartProps) {
  const chartData = STAGES.map((stage) => ({
    stage,
    count: funnel[stage],
    pct: funnelPercent(funnel[stage], funnel.applied),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} width={90} />
        <Tooltip
          formatter={(value, _name, item) => {
            const n = typeof value === "number" ? value : 0;
            const pct = item && "payload" in item && item.payload && typeof item.payload === "object" && "pct" in item.payload
              ? item.payload.pct
              : 0;
            return [`${n} (${pct}%)`, "count"];
          }}
        />
        <Bar dataKey="count" fill="var(--accent-solid-strong)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
