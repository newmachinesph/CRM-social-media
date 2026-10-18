"use client";

import Link from "next/link";
import { BarChart3, Eye, Sparkles, ThumbsUp, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { KpiCard } from "@/components/shared/kpi-card";
import { ContentThumb } from "@/components/shared/content-thumb";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { client } from "@/data/clients";
import { member } from "@/data/users";
import { reportByClientId } from "@/data/reports";
import { compact } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  fontSize: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const AXIS = {
  tickLine: false,
  axisLine: false,
  fontSize: 11,
  stroke: "var(--color-muted-foreground)",
} as const;

function pct(now: number, prev: number): number {
  return Math.round(((now - prev) / prev) * 1000) / 10;
}

export default function PortalReportsPage() {
  const store = useStore();
  const clientId = workspaceClientId(store.workspace);
  const portalClient = client(clientId);
  const report = reportByClientId[clientId];

  if (!report) {
    return (
      <div>
        <PageHeader title="Performance" description="How your channels are tracking." />
        <EmptyState
          icon={<BarChart3 className="size-5" />}
          title="Your first report is on its way"
          description="We're gathering your first month of results — your report will appear here soon."
        />
      </div>
    );
  }

  const monthly = report.monthly;
  const aug = monthly[monthly.length - 1];
  const jul = monthly[monthly.length - 2];

  const reachDelta = pct(aug.reach, jul.reach);
  const engDelta = pct(aug.engagement, jul.engagement);
  const newFollowers = aug.followers - jul.followers;
  const postsDiff = aug.posts - jul.posts;

  const narrative =
    reachDelta >= 0
      ? `A strong month for ${portalClient.name}. Reach ${
          reachDelta >= 0 ? "increased" : "dipped"
        } ${Math.abs(reachDelta)}% while engagement ${
          engDelta >= 0 ? "increased" : "eased"
        } ${Math.abs(engDelta)}%.`
      : `Reach dipped ${Math.abs(reachDelta)}% — here's what we're doing about it. We're refreshing formats and doubling down on what's resonating.`;

  const topContent = report.topContentIds
    .map((id) => store.content.find((c) => c.id === id))
    .filter((c) => c !== undefined)
    .slice(0, 3);

  const am = member(portalClient.accountManagerId);

  return (
    <div>
      <PageHeader
        title="Performance"
        description="Your August results, explained without the jargon."
      />

      {/* Narrative hero */}
      <div className="mb-6 rounded-xl border bg-card p-6 shadow-xs">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" /> August Performance
        </p>
        <p className="mt-2 max-w-2xl text-lg font-medium leading-relaxed">{narrative}</p>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Reach"
          value={compact(aug.reach)}
          delta={`${reachDelta >= 0 ? "+" : "-"}${Math.abs(reachDelta)}%`}
          hint="vs July"
          icon={<Eye className="size-4" />}
        />
        <KpiCard
          label="Engagement rate"
          value={`${aug.engagement}%`}
          delta={`${engDelta >= 0 ? "+" : "-"}${Math.abs(engDelta)}%`}
          hint="vs July"
          icon={<ThumbsUp className="size-4" />}
        />
        <KpiCard
          label="New followers"
          value={`+${compact(newFollowers)}`}
          hint="gained in August"
          icon={<Users className="size-4" />}
        />
        <KpiCard
          label="Posts published"
          value={aug.posts}
          delta={postsDiff !== 0 ? `${postsDiff > 0 ? "+" : "-"}${Math.abs(postsDiff)}` : undefined}
          hint={`${jul.posts} in July`}
          icon={<TrendingUp className="size-4" />}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-medium">Reach — last 6 months</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" {...AXIS} />
                <YAxis {...AXIS} tickFormatter={(v: number) => compact(v)} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value) => [compact(Number(value)), "Reach"]}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="var(--chart-1)"
                  fillOpacity={0.12}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-medium">Engagement rate — last 6 months</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" {...AXIS} />
                <YAxis {...AXIS} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value) => [`${value}%`, "Engagement"]}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top performing content */}
      {topContent.length > 0 ? (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-medium">Top performing content</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topContent.map((item) => (
              <Link
                key={item.id}
                href={`/portal/content/${item.id}`}
                className="group rounded-xl border bg-card p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
              >
                <ContentThumb item={item} aspect="aspect-video" />
                <div className="mt-3 space-y-1.5 px-1 pb-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <div className="flex items-center justify-between">
                    <PlatformBadge platform={item.platform} />
                    {item.metrics ? (
                      <p className="text-xs text-muted-foreground">
                        {compact(item.metrics.reach)} reach · {compact(item.metrics.likes)} likes
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Prepared by {am.name}, Northstar Social · August 2026
      </p>
    </div>
  );
}
