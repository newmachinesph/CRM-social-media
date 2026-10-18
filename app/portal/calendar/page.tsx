"use client";

import { useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformIcon } from "@/components/shared/platform-badge";
import { portalStatusDotClass, portalStatusLabel } from "@/components/portal/core-status";
import { client } from "@/data/clients";
import { fmtDayDate } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";
import type { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";

// The demo universe's fixed "today": Wed 26 Aug 2026.
const TODAY = new Date(2026, 7, 26);
const MIN_MONTH = "2026-08";
const MAX_MONTH = "2026-09";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PortalCalendarPage() {
  const { content, workspace } = useStore();
  const portalClient = client(workspaceClientId(workspace));
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [view, setView] = useState<"month" | "list">("month");

  const mine = content.filter((c) => c.clientId === portalClient.id);
  const byDay = new Map<string, ContentItem[]>();
  for (const item of mine) {
    const key = item.scheduledDate.slice(0, 10);
    byDay.set(key, [...(byDay.get(key) ?? []), item]);
  }

  const monthKey = format(month, "yyyy-MM");
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  const monthItems = mine
    .filter((c) => c.scheduledDate.startsWith(monthKey))
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  const listDays = [...new Set(monthItems.map((c) => c.scheduledDate.slice(0, 10)))];

  const chip = (item: ContentItem) => (
    <Link
      key={item.id}
      href={`/portal/content/${item.id}`}
      title={`${item.title} — ${portalStatusLabel(item.status)}`}
      className="flex items-center gap-1.5 rounded-md bg-muted/60 px-1.5 py-1 transition-colors hover:bg-accent"
    >
      <PlatformIcon platform={item.platform} className="size-4 rounded text-[7px]" />
      <span className="min-w-0 flex-1 truncate text-[11px] font-medium">{item.title}</span>
      <span
        className={cn("size-1.5 shrink-0 rounded-full", portalStatusDotClass(item.status))}
        aria-label={portalStatusLabel(item.status)}
      />
    </Link>
  );

  return (
    <div>
      <PageHeader
        title="Content calendar"
        description="When your content goes live."
        actions={
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "month" | "list")}
            className="hidden md:block"
          >
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {/* Month navigation */}
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous month"
          disabled={monthKey <= MIN_MONTH}
          onClick={() => setMonth((m) => addMonths(m, -1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next month"
          disabled={monthKey >= MAX_MONTH}
          onClick={() => setMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight className="size-4" />
        </Button>
        <h2 className="ml-1 text-lg font-semibold tracking-tight">{format(month, "MMMM yyyy")}</h2>
      </div>

      {/* Month grid — desktop only */}
      <div className={cn(view === "month" ? "hidden md:block" : "hidden")}>
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <div className="grid grid-cols-7 border-b bg-muted/40">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const inMonth = isSameMonth(day, month);
              const isToday = isSameDay(day, TODAY);
              const items = inMonth ? (byDay.get(key) ?? []) : [];
              return (
                <div
                  key={key}
                  className={cn(
                    "min-h-28 space-y-1 border-b border-r p-1.5 [&:nth-child(7n)]:border-r-0",
                    !inMonth && "bg-muted/30"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                      !inMonth && "text-muted-foreground/50",
                      isToday && "bg-primary font-semibold text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {items.slice(0, 3).map(chip)}
                  {items.length > 3 && (
                    <p className="px-1.5 text-[10px] font-medium text-muted-foreground">
                      +{items.length - 3} more
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {(["Client Review", "Approved", "Published", "Idea"] as const).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", portalStatusDotClass(s))} />
              {portalStatusLabel(s)}
            </span>
          ))}
        </div>
      </div>

      {/* List view — mobile always, desktop when selected */}
      <div className={cn(view === "month" && "md:hidden")}>
        {listDays.length > 0 ? (
          <div className="space-y-6">
            {listDays.map((dayKey) => {
              const items = byDay.get(dayKey) ?? [];
              const isToday = dayKey === "2026-08-26";
              return (
                <div key={dayKey}>
                  <h3
                    className={cn(
                      "mb-2 text-sm font-semibold",
                      isToday ? "text-primary" : "text-foreground"
                    )}
                  >
                    {fmtDayDate(dayKey)}
                    {isToday && " · Today"}
                  </h3>
                  <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/portal/content/${item.id}`}
                        className="flex items-center gap-3 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-accent/50"
                      >
                        <PlatformIcon platform={item.platform} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.type}</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span
                            className={cn("size-1.5 rounded-full", portalStatusDotClass(item.status))}
                          />
                          {portalStatusLabel(item.status)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<CalendarDays className="size-5" />}
            title="Nothing on the calendar this month"
            description="New content will appear here as soon as it's planned in."
          />
        )}
      </div>
    </div>
  );
}
