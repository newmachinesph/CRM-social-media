"use client";

import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { PlatformIcon } from "@/components/shared/platform-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { clientById } from "@/data/clients";
import { fmtDayDate } from "@/lib/format";
import type { ContentItem } from "@/lib/types";

const TODAY_KEY = "2026-08-26";

interface ListViewProps {
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
}

export function ListView({ items, onSelect }: ListViewProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="size-5" />}
        title="Nothing scheduled this month"
        description="Try clearing a filter, or flick to the next month to see what's coming up."
      />
    );
  }

  const sorted = [...items].sort((a, b) =>
    a.scheduledDate.localeCompare(b.scheduledDate)
  );
  const groups = new Map<string, ContentItem[]>();
  for (const item of sorted) {
    const key = item.scheduledDate.slice(0, 10);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }

  return (
    <div className="space-y-5">
      {[...groups.entries()].map(([day, dayItems]) => (
        <section key={day}>
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-sm font-semibold">{fmtDayDate(day)}</h2>
            {day === TODAY_KEY ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Today
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">
              {dayItems.length} {dayItems.length === 1 ? "post" : "posts"}
            </span>
          </div>
          <div className="divide-y rounded-xl border bg-card shadow-xs">
            {dayItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PlatformIcon platform={item.platform} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {clientById[item.clientId]?.name}
                  </p>
                </div>
                <span className="hidden w-36 truncate text-xs text-muted-foreground md:block">
                  {item.type}
                </span>
                <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {format(parseISO(item.scheduledDate), "h:mm a")}
                </span>
                <StatusBadge status={item.status} className="hidden sm:inline-flex" />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
