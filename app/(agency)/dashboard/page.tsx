"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Timer,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ClientLogo } from "@/components/shared/client-logo";
import { ContentThumb } from "@/components/shared/content-thumb";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { useStore } from "@/lib/store";
import { clients, clientById } from "@/data/clients";
import { member } from "@/data/users";
import { activities } from "@/data/activities";
import { aud, fmtDateShort, fmtDayDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/types";

// Monthly recurring revenue ramp, ending at the current retainer sum ($52,400).
const REVENUE = [
  { month: "Mar", value: 44100 },
  { month: "Apr", value: 46900 },
  { month: "May", value: 46900 },
  { month: "Jun", value: 48200 },
  { month: "Jul", value: 52400 },
  { month: "Aug", value: 52400 },
];

const TODAY = "2026-08-26";
const WEEK_END = "2026-09-01";

const WORKFLOW_STATUSES: { status: ContentStatus; bar: string }[] = [
  { status: "Draft", bar: "bg-neutral-300 dark:bg-neutral-600" },
  { status: "Internal Review", bar: "bg-amber-400" },
  { status: "Client Review", bar: "bg-amber-500" },
  { status: "Changes Requested", bar: "bg-orange-500" },
  { status: "Approved", bar: "bg-emerald-500" },
  { status: "Scheduled", bar: "bg-blue-500" },
  { status: "Published", bar: "bg-violet-500" },
];

function ViewAll({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <ArrowUpRight className="size-3" />
    </Link>
  );
}

export default function DashboardPage() {
  const { content, tasks, setTaskStatus } = useStore();

  // KPIs
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const monthlyRevenue = clients
    .filter((c) => c.status !== "Paused")
    .reduce((sum, c) => sum + c.retainer, 0);
  const awaitingApproval = content.filter((c) => c.status === "Client Review");
  const awaitingClients = new Set(awaitingApproval.map((c) => c.clientId)).size;
  const dueThisWeek = tasks.filter(
    (t) => t.status !== "Done" && t.dueDate <= WEEK_END
  );
  const overdue = tasks.filter(
    (t) => t.status !== "Done" && t.dueDate < TODAY
  ).length;

  // Content workflow breakdown
  const workflowCounts = WORKFLOW_STATUSES.map((s) => ({
    ...s,
    count: content.filter((c) => c.status === s.status).length,
  }));
  const workflowTotal = workflowCounts.reduce((sum, s) => sum + s.count, 0);

  // Today's priorities
  const priorities = tasks
    .filter(
      (t) =>
        t.status !== "Done" && (t.priority === "Urgent" || t.priority === "High")
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  // Upcoming schedule: 26–28 Aug, scheduled or approved
  const upcoming = content
    .filter(
      (c) =>
        (c.status === "Scheduled" || c.status === "Approved") &&
        c.scheduledDate >= "2026-08-26" &&
        c.scheduledDate < "2026-08-29"
    )
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  // Recent clients: newest start dates first
  const recentClients = [...clients]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .slice(0, 5);

  const completeTask = (id: string, title: string) => {
    setTaskStatus(id, "Done");
    toast.success("Task completed", { description: title });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Good morning, Olivia
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across Northstar Social today.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active Clients"
          value={activeClients}
          hint="+1 this month"
          icon={<Users className="size-4" />}
        />
        <KpiCard
          label="Monthly Revenue"
          value={aud(monthlyRevenue)}
          delta="+8.4%"
          hint="vs July"
          icon={<CircleDollarSign className="size-4" />}
        />
        <KpiCard
          label="Awaiting Approval"
          value={awaitingApproval.length}
          hint={`Across ${awaitingClients} clients`}
          icon={<CheckCircle2 className="size-4" />}
        />
        <KpiCard
          label="Tasks Due This Week"
          value={dueThisWeek.length}
          hint={`${overdue} overdue`}
          icon={<Timer className="size-4" />}
        />
      </div>

      {/* Revenue + content workflow */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="transition-shadow hover:shadow-sm xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue overview</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Monthly recurring retainers, Mar – Aug 2026
              </p>
            </div>
            <ViewAll href="/invoices" label="View invoices" />
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--color-border)"
                  />
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
                    width={44}
                    stroke="var(--color-muted-foreground)"
                    tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--color-border)" }}
                    formatter={(value) => [aud(Number(value)), "Revenue"]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#revFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Content workflow</CardTitle>
            <ViewAll href="/content" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              {workflowCounts
                .filter((s) => s.count > 0)
                .map((s) => (
                  <div
                    key={s.status}
                    className={s.bar}
                    style={{ width: `${(s.count / workflowTotal) * 100}%` }}
                    title={`${s.status}: ${s.count}`}
                  />
                ))}
            </div>
            <ul className="space-y-1">
              {workflowCounts.map((s) => (
                <li key={s.status}>
                  <Link
                    href="/content"
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", s.bar)} />
                      {s.status}
                    </span>
                    <span className="font-medium tabular-nums">{s.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Priorities + activity */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="transition-shadow hover:shadow-sm xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s priorities</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Urgent and high-priority tasks across the team
              </p>
            </div>
            <ViewAll href="/tasks" />
          </CardHeader>
          <CardContent>
            {priorities.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                All caught up — no urgent tasks outstanding.
              </p>
            ) : (
              <ul className="divide-y">
                {priorities.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-2.5">
                    <button
                      type="button"
                      aria-label={`Mark "${t.title}" as done`}
                      onClick={() => completeTask(t.id, t.title)}
                      className="group flex size-5 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 transition-colors hover:border-emerald-500 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-emerald-950"
                    >
                      <Check className="size-3 text-transparent transition-colors group-hover:text-emerald-600" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      {t.clientId ? (
                        <p className="text-xs text-muted-foreground">
                          {clientById[t.clientId]?.name}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={t.priority} />
                    <span
                      className={cn(
                        "w-14 text-right text-xs tabular-nums",
                        t.dueDate < TODAY
                          ? "font-medium text-red-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {fmtDateShort(t.dueDate)}
                    </span>
                    <UserAvatar member={member(t.assigneeId)} size="sm" />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Client activity</CardTitle>
            <ViewAll href="/inbox" />
          </CardHeader>
          <CardContent>
            <ActivityFeed items={activities} limit={6} />
          </CardContent>
        </Card>
      </div>

      {/* Recent clients + upcoming schedule */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="transition-shadow hover:shadow-sm xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent clients</CardTitle>
            <ViewAll href="/clients" />
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {recentClients.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/clients/${c.id}`}
                    className="flex items-center gap-3 rounded-md py-2.5 transition-colors hover:bg-muted/60 sm:px-2"
                  >
                    <ClientLogo client={c} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.package}
                      </p>
                    </div>
                    <UserAvatar
                      member={member(c.accountManagerId)}
                      size="sm"
                      className="hidden sm:inline-flex"
                    />
                    <StatusBadge status={c.status} className="hidden sm:inline-flex" />
                    <span className="w-16 text-right text-sm font-medium tabular-nums">
                      {aud(c.retainer)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming schedule</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Next 3 days</p>
            </div>
            <ViewAll href="/calendar" />
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                <CalendarDays className="size-4" /> Nothing scheduled for the next
                3 days.
              </p>
            ) : (
              <ul className="space-y-1">
                {upcoming.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/content/${c.id}`}
                      className="group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/60"
                    >
                      <div className="w-9 shrink-0">
                        <ContentThumb item={c} aspect="aspect-square" rounded="rounded-md" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {clientById[c.clientId]?.name}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {fmtDayDate(c.scheduledDate)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
