"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: { amount: number; sales: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const { amount, sales } = payload[0].payload;
  return (
    <div className="rounded-md border border-border/60 bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">
        {new Intl.NumberFormat("fr-FR").format(amount)} FCFA ({sales} vente{sales > 1 ? "s" : ""})
      </p>
    </div>
  );
}

export function RevenueChart({
  data,
}: {
  data: { date: string; amount: number; sales: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id="revenueTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          width={44}
          tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#revenueTrend)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
