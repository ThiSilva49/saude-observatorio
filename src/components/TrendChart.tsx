"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export type TrendPoint = {
  label: string;
  value: number;
  tooltipLabel: string;
};

function ChartTooltip({
  active,
  payload,
  valueLabel,
}: {
  active?: boolean;
  payload?: { payload: TrendPoint }[];
  valueLabel: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs shadow-sm">
      <p className="text-[var(--text-muted)]">{point.tooltipLabel}</p>
      <p className="mt-0.5 font-semibold text-[var(--text-primary)]">
        {valueLabel}: {new Intl.NumberFormat("pt-BR").format(point.value)}
      </p>
    </div>
  );
}

export function TrendChart({
  title,
  data,
  color = "var(--series-1)",
  valueLabel,
}: {
  title: string;
  data: TrendPoint[];
  color?: "var(--series-1)" | "var(--series-2)";
  valueLabel: string;
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Sem dados disponíveis no momento.
        </p>
      </div>
    );
  }

  const gradientId = `trend-fill-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <h3 className="text-sm font-medium text-[var(--text-primary)]">
        {title}
      </h3>
      <div className="mt-2 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--gridline)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={{ stroke: "var(--baseline)" }}
              tickLine={false}
              minTickGap={32}
            />
            <Tooltip content={<ChartTooltip valueLabel={valueLabel} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface-2)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
