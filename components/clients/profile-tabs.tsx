"use client";

import Link from "next/link";
import {
  BarChart3,
  FileText,
  Film,
  Folder,
  FolderOpen,
  History,
  Image as ImageIcon,
  Kanban,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ActivityItem,
  ClientReport,
  ContentItem,
  Contract,
  FileItem,
  Invoice,
  Project,
  Task,
} from "@/lib/types";
import { member } from "@/data/users";
import { aud, audExact, compact, fmtDate, fmtDateShort } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { ContentThumb } from "@/components/shared/content-thumb";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { UserAvatar, AvatarGroup } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { KpiCard } from "@/components/shared/kpi-card";
import { Progress } from "@/components/ui/progress";

/* ── Projects ─────────────────────────────────────────────── */

export function ProjectsTab({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <EmptyState icon={<Kanban className="size-5" />} title="No projects yet" description="Projects for this client will appear here." />;
  }
  return (
    <div className="space-y-3">
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          className="block rounded-xl border bg-card p-4 shadow-xs transition-colors hover:bg-muted/40"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium leading-tight">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {fmtDateShort(p.startDate)} – {fmtDate(p.dueDate)} · {p.deliverablesDone}/{p.deliverablesTotal} deliverables
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={p.priority} />
              <StatusBadge status={p.status} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={p.progress} className="h-1.5 flex-1" />
            <span className="text-xs font-medium tabular-nums text-muted-foreground">{p.progress}%</span>
            <AvatarGroup members={p.teamIds.map(member)} max={3} />
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Content ──────────────────────────────────────────────── */

export function ContentTab({ content }: { content: ContentItem[] }) {
  if (content.length === 0) {
    return <EmptyState icon={<Sparkles className="size-5" />} title="No content yet" description="Content created for this client will appear here." />;
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <ul className="divide-y">
        {content.map((item) => (
          <li key={item.id}>
            <Link
              href={`/content/${item.id}`}
              className="group flex items-center gap-3 p-3 transition-colors hover:bg-muted/40"
            >
              <div className="w-12 shrink-0">
                <ContentThumb item={item} aspect="aspect-square" rounded="rounded-md" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <PlatformBadge platform={item.platform} label={item.type} />
                  <span>· v{item.version}</span>
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-muted-foreground">{fmtDate(item.scheduledDate)}</p>
              </div>
              <StatusBadge status={item.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Tasks ────────────────────────────────────────────────── */

export function TasksTab({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <EmptyState icon={<Kanban className="size-5" />} title="No tasks" description="Tasks for this client will appear here." />;
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <ul className="divide-y">
        {tasks.map((t) => {
          const assignee = member(t.assigneeId);
          return (
            <li key={t.id} className="flex items-center gap-3 p-3">
              <UserAvatar member={assignee} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Due {fmtDate(t.dueDate)} · {assignee.name}
                </p>
              </div>
              <StatusBadge status={t.priority} />
              <StatusBadge status={t.status} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Files ────────────────────────────────────────────────── */

function FileKindIcon({ kind }: { kind: FileItem["kind"] }) {
  const cls = "size-4";
  if (kind === "mp4" || kind === "mov") return <Film className={cls} />;
  if (kind === "png" || kind === "jpg" || kind === "svg") return <ImageIcon className={cls} />;
  if (kind === "zip") return <Folder className={cls} />;
  return <FileText className={cls} />;
}

export function FilesTab({ files }: { files: FileItem[] }) {
  if (files.length === 0) {
    return <EmptyState icon={<FolderOpen className="size-5" />} title="No files" description="Files shared with this client will appear here." />;
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <ul className="divide-y">
        {files.map((f) => (
          <li key={f.id} className="flex items-center gap-3 p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <FileKindIcon kind={f.kind} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{f.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {f.folder} · {f.size} · {f.uploadedBy}
                {f.fromClient ? " (client)" : ""}
              </p>
            </div>
            <span className="whitespace-nowrap text-xs text-muted-foreground">{fmtDate(f.uploadedAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Invoices ─────────────────────────────────────────────── */

export function InvoicesTab({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return <EmptyState icon={<Receipt className="size-5" />} title="No invoices" description="Invoices issued to this client will appear here." />;
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <ul className="divide-y">
        {invoices.map((inv) => (
          <li key={inv.id}>
            <Link
              href={`/invoices/${inv.id}`}
              className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Receipt className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{inv.number}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {inv.periodLabel} · Due {fmtDate(inv.dueDate)}
                </p>
              </div>
              <span className="whitespace-nowrap text-sm font-medium tabular-nums">{audExact(inv.total)}</span>
              <StatusBadge status={inv.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Contracts ────────────────────────────────────────────── */

export function ContractsTab({ contracts }: { contracts: Contract[] }) {
  if (contracts.length === 0) {
    return <EmptyState icon={<ShieldCheck className="size-5" />} title="No contracts" description="Agreements with this client will appear here." />;
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <ul className="divide-y">
        {contracts.map((c) => (
          <li key={c.id} className="flex items-center gap-3 p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ShieldCheck className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{c.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {aud(c.value)}/month · {c.termMonths}-month term
                {c.signedDate ? ` · Signed ${fmtDate(c.signedDate)} by ${c.signerName}` : ""}
              </p>
            </div>
            <StatusBadge status={c.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Reports ──────────────────────────────────────────────── */

export function ReportsTab({ report }: { report?: ClientReport }) {
  if (!report) {
    return (
      <EmptyState
        icon={<BarChart3 className="size-5" />}
        title="No report data yet"
        description="Monthly performance reporting starts after the first full month."
      />
    );
  }
  const latest = report.monthly[report.monthly.length - 1];
  const prev = report.monthly[report.monthly.length - 2];
  const delta = (curr: number, before: number) => {
    const pct = ((curr - before) / before) * 100;
    return `${pct >= 0 ? "+" : "-"}${Math.abs(pct).toFixed(1)}%`;
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Reach" value={compact(latest.reach)} delta={delta(latest.reach, prev.reach)} hint="vs July" />
        <KpiCard label="Engagement" value={`${latest.engagement}%`} delta={delta(latest.engagement, prev.engagement)} hint="vs July" />
        <KpiCard label="Followers" value={compact(latest.followers)} delta={delta(latest.followers, prev.followers)} hint="vs July" />
        <KpiCard label="Link clicks" value={compact(latest.linkClicks)} delta={delta(latest.linkClicks, prev.linkClicks)} hint="vs July" />
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <p className="text-sm font-medium">Reach by month</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                stroke="var(--color-muted-foreground)"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                stroke="var(--color-muted-foreground)"
                tickFormatter={(v: number) => compact(v)}
                width={44}
              />
              <Tooltip
                formatter={(value) => [compact(Number(value)), "Reach"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="reach"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ── Activity ─────────────────────────────────────────────── */

export function ActivityTab({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return <EmptyState icon={<History className="size-5" />} title="No activity yet" description="Client activity will appear here." />;
  }
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs">
      <ActivityFeed items={activities} />
    </div>
  );
}
