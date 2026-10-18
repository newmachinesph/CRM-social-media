"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthGrid } from "@/components/calendar/month-grid";
import { WeekView } from "@/components/calendar/week-view";
import { ListView } from "@/components/calendar/list-view";
import { QuickView } from "@/components/calendar/quick-view";
import { useStore } from "@/lib/store";
import { clients } from "@/data/clients";
import type { ContentItem, ContentStatus, Platform } from "@/lib/types";

type CalView = "month" | "week" | "list";

/** Demo "today" is 26 Aug 2026; navigation is bounded to Aug–Sep 2026 (the data range). */
const TODAY = new Date(2026, 7, 26);
const MIN_MONTH = new Date(2026, 7, 1);
const MAX_MONTH = new Date(2026, 8, 1);

const PLATFORMS: Platform[] = ["Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube"];
const STATUSES: ContentStatus[] = [
  "Idea",
  "Draft",
  "Internal Review",
  "Client Review",
  "Changes Requested",
  "Approved",
  "Scheduled",
  "Published",
];

export default function CalendarPage() {
  const { content } = useStore();
  const [view, setView] = useState<CalView>("month");
  const [anchor, setAnchor] = useState(TODAY);
  const [clientFilter, setClientFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<ContentItem | null>(null);

  const filtered = useMemo(
    () =>
      content.filter(
        (c) =>
          (clientFilter === "all" || c.clientId === clientFilter) &&
          (platformFilter === "all" || c.platform === platformFilter) &&
          (statusFilter === "all" || c.status === statusFilter)
      ),
    [content, clientFilter, platformFilter, statusFilter]
  );

  const monthItems = useMemo(
    () => filtered.filter((c) => isSameMonth(parseISO(c.scheduledDate), anchor)),
    [filtered, anchor]
  );

  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const minWeek = startOfWeek(MIN_MONTH, { weekStartsOn: 1 });
  const maxWeek = startOfWeek(endOfMonth(MAX_MONTH), { weekStartsOn: 1 });

  const prevDisabled =
    view === "week" ? weekStart <= minWeek : isSameMonth(anchor, MIN_MONTH);
  const nextDisabled =
    view === "week" ? weekStart >= maxWeek : isSameMonth(anchor, MAX_MONTH);

  const navigate = (dir: 1 | -1) =>
    setAnchor((a) => (view === "week" ? addWeeks(a, dir) : addMonths(a, dir)));

  const label =
    view === "week"
      ? `${format(weekStart, "d MMM")} – ${format(addDays(weekStart, 6), "d MMM yyyy")}`
      : format(anchor, "MMMM yyyy");

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="What's going live, across every client."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as CalView)}
            className="hidden md:block"
          >
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous period"
              disabled={prevDisabled}
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-32 text-center text-sm font-medium tabular-nums">
              {label}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next period"
              disabled={nextDisabled}
              onClick={() => navigate(1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-40" aria-label="Filter by client">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-36" aria-label="Filter by platform">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PageHeader>

      {/* Below md: list view only — the grid needs the room. */}
      <div className="md:hidden">
        <p className="mb-3 text-xs text-muted-foreground">
          Month and week views are available on larger screens.
        </p>
        <ListView items={monthItems} onSelect={setSelected} />
      </div>

      <div className="hidden md:block">
        {view === "month" ? (
          <MonthGrid month={anchor} items={filtered} onSelect={setSelected} />
        ) : view === "week" ? (
          <WeekView weekStart={weekStart} items={filtered} onSelect={setSelected} />
        ) : (
          <ListView items={monthItems} onSelect={setSelected} />
        )}
      </div>

      <QuickView item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
