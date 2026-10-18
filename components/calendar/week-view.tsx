"use client";

import { addDays, format, isSameDay, isWeekend, parseISO } from "date-fns";
import { PlatformIcon } from "@/components/shared/platform-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { clientById } from "@/data/clients";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/lib/types";

/** The demo universe's "today". */
const TODAY = new Date(2026, 7, 26);

interface WeekViewProps {
  weekStart: Date;
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
}

export function WeekView({ weekStart, items, onSelect }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border shadow-xs">
      {days.map((day) => {
        const today = isSameDay(day, TODAY);
        const dayItems = items
          .filter((i) => isSameDay(parseISO(i.scheduledDate), day))
          .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex min-h-[300px] flex-col",
              isWeekend(day) ? "bg-muted/40" : "bg-card"
            )}
          >
            <div className="flex items-center justify-center gap-1.5 border-b py-2">
              <span className="text-[11px] font-medium text-muted-foreground">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                  today
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {day.getDate()}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 p-1.5">
              {dayItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full rounded-lg border bg-card p-2 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center gap-1.5">
                    <PlatformIcon
                      platform={item.platform}
                      className="size-4 rounded text-[7px]"
                    />
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {format(parseISO(item.scheduledDate), "h:mm a")}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    {clientById[item.clientId]?.name}
                  </p>
                  <StatusBadge status={item.status} className="mt-1.5" />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
