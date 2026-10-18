"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import type { ActivityItem, Client, ContentItem, Invoice, Task } from "@/lib/types";
import { member } from "@/data/users";
import { audExact, fmtDate, fmtDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformIcon } from "@/components/shared/platform-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { HealthMeter } from "@/components/clients/health-meter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewTabProps {
  client: Client;
  awaitingApproval: ContentItem[];
  recentInvoices: Invoice[];
  openTasks: Task[];
  activities: ActivityItem[];
}

export function OverviewTab({
  client,
  awaitingApproval,
  recentInvoices,
  openTasks,
  activities,
}: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Client details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{client.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="size-4 shrink-0 text-muted-foreground" />
                <a
                  href={`https://${client.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {client.website}
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {client.socials.map((s) => (
                  <span key={s.platform} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <PlatformIcon platform={s.platform} className="size-5 rounded" />
                    {s.handle}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2.5 border-t pt-3 text-muted-foreground">
                <CalendarDays className="size-4 shrink-0" />
                <span>Client since {fmtDate(client.startDate)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.contacts.map((contact) => (
                <div key={contact.email} className="flex items-start gap-3">
                  <UserAvatar name={contact.name} size="md" />
                  <div className="min-w-0 text-sm">
                    <p className="font-medium leading-tight">
                      {contact.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">{contact.role}</span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {contact.email}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {contact.phone}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Account health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{client.healthScore}</p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={client.status} />
                  <HealthMeter score={client.healthScore} showValue={false} />
                </div>
              </div>
            </CardContent>
          </Card>

          {client.nextMeeting ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Upcoming meeting</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3 text-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950">
                  <CalendarDays className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{client.nextMeeting.title}</p>
                  <p className="text-xs text-muted-foreground">{fmtDateTime(client.nextMeeting.date)}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Awaiting approval</CardTitle>
            </CardHeader>
            <CardContent>
              {awaitingApproval.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing waiting on the client right now.</p>
              ) : (
                <ul className="space-y-2">
                  {awaitingApproval.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/content/${item.id}`}
                        className="group flex items-center justify-between gap-2 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted/40"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <PlatformIcon platform={item.platform} className="size-5 rounded" />
                          <span className="truncate font-medium group-hover:text-primary">{item.title}</span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {recentInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No invoices yet.</p>
              ) : (
                <ul className="space-y-2">
                  {recentInvoices.map((inv) => (
                    <li key={inv.id}>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted/40"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{inv.number}</span>
                          <span className="block truncate text-xs text-muted-foreground">{inv.periodLabel}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="font-medium tabular-nums">{audExact(inv.total)}</span>
                          <StatusBadge status={inv.status} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Open tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {openTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No open tasks for this client.</p>
              ) : (
                <ul className="space-y-2">
                  {openTasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 rounded-lg border p-2.5 text-sm">
                      <UserAvatar member={member(t.assigneeId)} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{t.title}</span>
                        <span className="block text-xs text-muted-foreground">Due {fmtDate(t.dueDate)}</span>
                      </span>
                      <StatusBadge status={t.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ActivityFeed items={activities} limit={8} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
