"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Download, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { ContentThumb } from "@/components/shared/content-thumb";
import {
  AudienceChart,
  EngagementChart,
  PlatformDonut,
  ReachChart,
} from "@/components/reports/charts";
import { useStore } from "@/lib/store";
import { reports, reportByClientId } from "@/data/reports";
import { clientById } from "@/data/clients";
import { compact } from "@/lib/format";
import type { Platform } from "@/lib/types";

const DATE_RANGES = ["Last 3 months", "Last 6 months", "Year to date", "Last 12 months"];
const PLATFORMS: Platform[] = ["Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube"];

function pctDelta(curr: number, prev: number): string {
  const d = ((curr - prev) / prev) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(1)}%`;
}

export default function ReportsPage() {
  const { content } = useStore();
  const [clientId, setClientId] = useState("abc-fitness");
  const [dateRange, setDateRange] = useState("Last 6 months");
  const [platform, setPlatform] = useState("all");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareClientId, setShareClientId] = useState("abc-fitness");

  const report = reportByClientId[clientId] ?? reports[0];
  const monthly = report.monthly;
  const latest = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];
  const avgEngagement =
    monthly.reduce((sum, m) => sum + m.engagement, 0) / monthly.length;
  const clientName = clientById[clientId]?.name ?? "Client";

  const topContent = report.topContentIds
    .map((id) => content.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c) => platform === "all" || c.platform === platform);

  const copyShareLink = () => {
    toast.success("Share link copied", {
      description: `${clientById[shareClientId]?.name ?? "Client"} report — demo only`,
    });
    setShareOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Performance across every client and platform."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => toast.success("Report exported as PDF — demo only")}
            >
              <Download className="size-4" />
              Export Report
            </Button>
            <Button onClick={() => setShareOpen(true)}>
              <Share2 className="size-4" />
              Share with Client
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="w-48" aria-label="Client">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reports.map((r) => (
                <SelectItem key={r.clientId} value={r.clientId}>
                  {clientById[r.clientId]?.name ?? r.clientId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40" aria-label="Date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-40" aria-label="Platform">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* KPI row */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Reach" value={compact(latest.reach)} delta={pctDelta(latest.reach, prev.reach)} hint="vs July" />
        <KpiCard label="Impressions" value={compact(latest.impressions)} delta={pctDelta(latest.impressions, prev.impressions)} hint="vs July" />
        <KpiCard label="Engagement Rate" value={`${latest.engagement.toFixed(1)}%`} delta={pctDelta(latest.engagement, prev.engagement)} hint="vs July" />
        <KpiCard label="Followers" value={compact(latest.followers)} delta={pctDelta(latest.followers, prev.followers)} hint="vs July" />
        <KpiCard label="Posts Published" value={latest.posts} delta={pctDelta(latest.posts, prev.posts)} hint="vs July" />
        <KpiCard label="Link Clicks" value={compact(latest.linkClicks)} delta={pctDelta(latest.linkClicks, prev.linkClicks)} hint="vs July" />
        <KpiCard
          label="Leads"
          value={latest.leads}
          delta={prev.leads > 0 ? pctDelta(latest.leads, prev.leads) : undefined}
          hint={prev.leads > 0 ? "vs July" : "Not tracked"}
        />
        <KpiCard label="Avg Engagement" value={`${avgEngagement.toFixed(1)}%`} hint="6-month average" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="transition-shadow hover:shadow-sm">
          <CardHeader>
            <CardTitle>Audience growth</CardTitle>
            <p className="text-xs text-muted-foreground">
              Followers by month, Mar – Aug 2026
            </p>
          </CardHeader>
          <CardContent>
            <AudienceChart data={monthly} />
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-sm">
          <CardHeader>
            <CardTitle>Reach</CardTitle>
            <p className="text-xs text-muted-foreground">
              Accounts reached per month
            </p>
          </CardHeader>
          <CardContent>
            <ReachChart data={monthly} />
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-sm">
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <p className="text-xs text-muted-foreground">
              Engagement rate by month
            </p>
          </CardHeader>
          <CardContent>
            <EngagementChart data={monthly} />
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-sm">
          <CardHeader>
            <CardTitle>Platform distribution</CardTitle>
            <p className="text-xs text-muted-foreground">
              Share of reach by platform, August
            </p>
          </CardHeader>
          <CardContent>
            <PlatformDonut
              split={report.platformSplit}
              centerValue={compact(latest.reach)}
              centerLabel="Total reach"
            />
          </CardContent>
        </Card>
      </div>

      {/* Top performing content */}
      <Card className="transition-shadow hover:shadow-sm">
        <CardHeader>
          <CardTitle>Top performing content</CardTitle>
          <p className="text-xs text-muted-foreground">
            {clientName}&apos;s best posts this period
          </p>
        </CardHeader>
        <CardContent>
          {topContent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No top content for this platform — try &ldquo;All platforms&rdquo;.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {topContent.map((item) => (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="group rounded-xl border bg-card p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <ContentThumb item={item} aspect="aspect-[4/3]" />
                  <p className="mt-3 truncate text-sm font-medium">{item.title}</p>
                  <div className="mt-1.5">
                    <PlatformBadge platform={item.platform} label={item.type} />
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 border-t pt-3">
                    {(
                      [
                        ["Reach", item.metrics?.reach],
                        ["Likes", item.metrics?.likes],
                        ["Comments", item.metrics?.comments],
                        ["Shares", item.metrics?.shares],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <p className="text-sm font-semibold tabular-nums">
                          {value !== undefined ? compact(value) : "—"}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share report with client</DialogTitle>
            <DialogDescription>
              Generates a read-only link the client can open without logging in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="share-client">Client</Label>
            <Select value={shareClientId} onValueChange={setShareClientId}>
              <SelectTrigger id="share-client" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reports.map((r) => (
                  <SelectItem key={r.clientId} value={r.clientId}>
                    {clientById[r.clientId]?.name ?? r.clientId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={copyShareLink}>
              <Link2 className="size-4" />
              Copy share link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
