"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TRIGGER_OPTIONS } from "../triggers";

export function AnxietyTrendChart({
  data,
}: {
  data: { date: string; niveau: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="anxietyTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="niveau"
          stroke="#d97706"
          strokeWidth={2}
          fill="url(#anxietyTrend)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TriggerFrequencyChart({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const data = TRIGGER_OPTIONS.map((t) => ({
    label: t.label,
    count: counts[t.key] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
