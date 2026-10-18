"use client";

import {
  addDays,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isWeekend,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { PlatformIcon } from "@/components/shared/platform-badge";
import { statusTone } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/lib/types";

/** The demo universe's "today". */
const TODAY = new Date(2026, 7, 26);
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_CHIPS = 3;

const TONE_DOT: Record<ReturnType<typeof statusTone>, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  neutral: "bg-muted-foreground/50",
};

interface MonthGridProps {
  month: Date;
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
}

export function MonthGrid({ month, items, onSelect }: MonthGridProps) {
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);

  return (
    <div className="overflow-hidden rounded-xl border bg-border shadow-xs">
      <div className="grid grid-cols-7 gap-px">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="bg-card py-2 text-center text-[11px] font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px border-t">
        {days.map((day) => {
          const outside = !isSameMonth(day, month);
          const today = isSameDay(day, TODAY);
          const dayItems = items
            .filter((i) => isSameDay(parseISO(i.scheduledDate), day))
            .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[110px] p-1.5",
                isWeekend(day) ? "bg-muted/40" : "bg-card",
                outside && "bg-muted/20"
              )}
            >
              <div className="mb-1 flex justify-end">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                    today
                      ? "bg-primary font-semibold text-primary-foreground"
                      : outside
                        ? "text-muted-foreground/50"
                        : "text-muted-foreground"
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="space-y-0.5">
                {dayItems.slice(0, MAX_CHIPS).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex w-full items-center gap-1 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <PlatformIcon
                      platform={item.platform}
                      className="size-4 rounded text-[7px]"
                    />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                      {item.title}
                    </span>
                    <span
                      title={item.status}
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        TONE_DOT[statusTone(item.status)]
                      )}
                    />
                  </button>
                ))}
                {dayItems.length > MAX_CHIPS ? (
                  <p className="px-1 text-[10px] font-medium text-muted-foreground">
                    +{dayItems.length - MAX_CHIPS} more
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
