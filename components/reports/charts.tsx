"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyReportPoint, Platform } from "@/lib/types";
import { compact } from "@/lib/format";

const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
} as const;

const AXIS = {
  tickLine: false,
  axisLine: false,
  fontSize: 11,
  stroke: "var(--color-muted-foreground)",
} as const;

export function AudienceChart({ data }: { data: MonthlyReportPoint[] }) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} width={44} tickFormatter={(v: number) => compact(v)} />
          <Tooltip
            cursor={{ stroke: "var(--color-border)" }}
            formatter={(value) => [compact(Number(value)), "Followers"]}
            contentStyle={TOOLTIP_STYLE}
          />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReachChart({ data }: { data: MonthlyReportPoint[] }) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="reportReachFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} width={44} tickFormatter={(v: number) => compact(v)} />
          <Tooltip
            cursor={{ stroke: "var(--color-border)" }}
            formatter={(value) => [compact(Number(value)), "Reach"]}
            contentStyle={TOOLTIP_STYLE}
          />
          <Area
            type="monotone"
            dataKey="reach"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#reportReachFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EngagementChart({ data }: { data: MonthlyReportPoint[] }) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} width={36} tickFormatter={(v: number) => `${v}%`} />
          <Tooltip
            cursor={{ fill: "var(--color-muted)" }}
            formatter={(value) => [`${value}%`, "Engagement"]}
            contentStyle={TOOLTIP_STYLE}
          />
          <Bar dataKey="engagement" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const DONUT_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

export function PlatformDonut({
  split,
  centerValue,
  centerLabel,
}: {
  split: { platform: Platform; value: number }[];
  centerValue: string;
  centerLabel: string;
}) {
  return (
    <div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={split}
              dataKey="value"
              nameKey="platform"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={2}
              strokeWidth={0}
            >
              {split.map((s, i) => (
                <Cell key={s.platform} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, String(name)]}
              contentStyle={TOOLTIP_STYLE}
            />
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              className="fill-foreground text-lg font-semibold"
            >
              {centerValue}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {centerLabel}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {split.map((s, i) => (
          <span key={s.platform} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="size-2 rounded-full"
              style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            {s.platform}
            <span className="font-medium tabular-nums text-foreground">{s.value}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
