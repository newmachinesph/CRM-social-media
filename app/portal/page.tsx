"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, MessageSquare, PartyPopper, Receipt, Sparkles } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ContentThumb } from "@/components/shared/content-thumb";
import { PlatformIcon } from "@/components/shared/platform-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { PortalStatusChip } from "@/components/portal/core-status";
import { client } from "@/data/clients";
import { projects } from "@/data/projects";
import { reportByClientId } from "@/data/reports";
import { member } from "@/data/users";
import { audExact, compact, fmtDate, fmtDayDate } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";

const TODAY = "2026-08-26";

export default function PortalHomePage() {
  const { content, invoices, workspace } = useStore();
  const portalClient = client(workspaceClientId(workspace));
  const contact = portalClient.contacts[0];
  const firstName = contact.name.split(" ")[0];

  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  const mine = content.filter((c) => c.clientId === portalClient.id);
  const needsApproval = mine
    .filter((c) => c.status === "Client Review")
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  const publishedThisMonth = mine.filter((c) => c.publishedDate?.startsWith("2026-08"));
  const scheduledItems = mine.filter((c) => c.status === "Approved" || c.status === "Scheduled");
  const upcoming = scheduledItems
    .filter((c) => c.scheduledDate >= TODAY)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 4);

  const report = reportByClientId[portalClient.id];
  const latest = report?.monthly[report.monthly.length - 1];
  const prev = report?.monthly[report.monthly.length - 2];
  const reachDelta =
    latest && prev ? (((latest.reach - prev.reach) / prev.reach) * 100).toFixed(1) : null;
  const engagementDelta = latest && prev ? (latest.engagement - prev.engagement).toFixed(1) : null;

  const project = projects
    .filter((p) => p.clientId === portalClient.id)
    .sort((a, b) => {
      if ((a.status === "Active") !== (b.status === "Active")) return a.status === "Active" ? -1 : 1;
      return b.progress - a.progress;
    })[0];
  const nextMilestone = project?.milestones.find((m) => !m.done);

  const am = member(portalClient.accountManagerId);
  const teamCard = [am, member("james"), member("mia")].filter(
    (m, i, arr) => arr.findIndex((x) => x.id === m.id) === i
  );

  const nextInvoice = invoices.find(
    (inv) => inv.clientId === portalClient.id && (inv.status === "Sent" || inv.status === "Due")
  );

  const sendMessage = () => {
    setMessageOpen(false);
    setMessage("");
    toast.success(`Message sent to ${am.name.split(" ")[0]}`, {
      description: "They'll get back to you shortly — demo only",
    });
  };

  return (
    <div className="space-y-8 pt-2">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Good afternoon, {firstName} 👋</h1>
        <p className="mt-1.5 text-muted-foreground">
          Here&apos;s what&apos;s happening with {portalClient.name}.
        </p>
      </div>

      {/* Attention hero */}
      {needsApproval.length > 0 ? (
        <Card className="border-l-4 border-l-primary bg-primary/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-primary" />
              {needsApproval.length} {needsApproval.length === 1 ? "piece needs" : "pieces need"} your
              approval
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsApproval.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border bg-background p-3 shadow-xs"
              >
                <div className="group w-10 shrink-0">
                  <ContentThumb item={item} rounded="rounded-md" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.type}</span>
                    <PortalStatusChip status={item.status} />
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/portal/content/${item.id}`}>Review →</Link>
                </Button>
              </div>
            ))}
            {needsApproval.length > 2 && (
              <Link
                href="/portal/content"
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                View all {needsApproval.length} awaiting approval →
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <PartyPopper className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium">You&apos;re all caught up 🎉</p>
              <p className="text-sm text-muted-foreground">Nothing needs your approval right now.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* This month */}
      <Card>
        <CardContent className="grid grid-cols-2 gap-y-6 py-2 md:grid-cols-4 md:divide-x md:divide-border">
          {[
            { label: "Published this month", value: String(publishedThisMonth.length) },
            { label: "Scheduled", value: String(scheduledItems.length) },
            { label: "Awaiting your approval", value: String(needsApproval.length) },
            { label: "Reach in August", value: latest ? compact(latest.reach) : "—" },
          ].map((stat) => (
            <div key={stat.label} className="px-4 text-center md:px-6">
              <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4 text-muted-foreground" /> Coming up
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length > 0 ? (
            <div className="divide-y">
              {upcoming.map((item) => (
                <Link
                  key={item.id}
                  href={`/portal/content/${item.id}`}
                  className="flex items-center gap-4 py-3 transition-colors first:pt-0 last:pb-0 hover:text-primary"
                >
                  <span className="w-24 shrink-0 text-sm font-medium text-muted-foreground">
                    {fmtDayDate(item.scheduledDate)}
                  </span>
                  <PlatformIcon platform={item.platform} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing locked in yet — new content lands here as soon as it&apos;s approved.
            </p>
          )}
          <Link
            href="/portal/calendar"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            View calendar →
          </Link>
        </CardContent>
      </Card>

      {/* Project + performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        {project && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.deliverablesDone} of {project.deliverablesTotal} deliverables completed
                </p>
              </div>
              <Progress value={project.progress} aria-label={`${project.progress}% complete`} />
              {nextMilestone && (
                <p className="text-sm text-muted-foreground">
                  Next up: <span className="font-medium text-foreground">{nextMilestone.name}</span> ·{" "}
                  {fmtDate(nextMilestone.date)}
                </p>
              )}
              <Link
                href="/portal/projects"
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                View project →
              </Link>
            </CardContent>
          </Card>
        )}

        {report && latest && prev && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Latest performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">{compact(latest.reach)}</p>
                  <p className="text-xs text-muted-foreground">
                    Reach ·{" "}
                    <span className="font-medium text-emerald-600">+{reachDelta}% vs July</span>
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight">{latest.engagement}%</p>
                  <p className="text-xs text-muted-foreground">
                    Engagement ·{" "}
                    <span className="font-medium text-emerald-600">+{engagementDelta} pts</span>
                  </p>
                </div>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.monthly} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                    <Line
                      type="monotone"
                      dataKey="reach"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Link
                href="/portal/reports"
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                View report →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Team + invoice */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Northstar team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {teamCard.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <UserAvatar member={m} size="lg" />
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.id === am.id ? `${m.role} · Your account manager` : m.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setMessageOpen(true)}>
              <MessageSquare className="size-4" /> Message Account Manager
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="size-4 text-muted-foreground" /> Next invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextInvoice ? (
              <>
                <div>
                  <p className="text-sm font-medium">{nextInvoice.number}</p>
                  <p className="text-xs text-muted-foreground">{nextInvoice.periodLabel}</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight">{audExact(nextInvoice.total)}</p>
                <p className="text-sm text-muted-foreground">Due {fmtDate(nextInvoice.dueDate)}</p>
                <Link
                  href="/portal/invoices"
                  className="inline-block text-sm font-medium text-primary hover:underline"
                >
                  View invoices →
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No payments due 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message dialog */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message {am.name}</DialogTitle>
            <DialogDescription>
              Your account manager will get back to you — usually within a few hours.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${am.name.split(" ")[0]}, quick question about…`}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendMessage} disabled={!message.trim()}>
              Send message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
