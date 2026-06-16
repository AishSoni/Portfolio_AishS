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
import { Column, Heading } from "@once-ui-system/core";
import type { SiteTimeseriesPoint } from "@/lib/dashboard/types";
import { EmptyState } from "../EmptyState";

interface SiteTimeseriesChartProps {
  points: SiteTimeseriesPoint[];
}

export function SiteTimeseriesChart({ points }: SiteTimeseriesChartProps) {
  return (
    <Column gap="12" fillWidth>
      <Heading variant="heading-strong-s">Daily traffic</Heading>
      {points.length === 0 ? (
        <EmptyState message="No time-series data yet." />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={points}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="pageViews" name="Page views" fill="var(--brand-solid-strong)" />
            <Bar dataKey="uniqueSessions" name="Sessions" fill="var(--neutral-solid-medium)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Column>
  );
}
