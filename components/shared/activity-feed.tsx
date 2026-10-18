import type { ActivityItem } from "@/lib/types";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FilePlus2,
  MessageSquare,
  RefreshCw,
  Upload,
} from "lucide-react";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

const ICONS = {
  approve: { icon: CheckCircle2, classes: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950" },
  upload: { icon: Upload, classes: "text-blue-600 bg-blue-50 dark:bg-blue-950" },
  create: { icon: FilePlus2, classes: "text-violet-600 bg-violet-50 dark:bg-violet-950" },
  payment: { icon: CircleDollarSign, classes: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950" },
  comment: { icon: MessageSquare, classes: "text-amber-600 bg-amber-50 dark:bg-amber-950" },
  status: { icon: RefreshCw, classes: "text-muted-foreground bg-muted" },
  meeting: { icon: CalendarDays, classes: "text-sky-600 bg-sky-50 dark:bg-sky-950" },
} as const;

interface ActivityFeedProps {
  items: ActivityItem[];
  limit?: number;
  className?: string;
}

export function ActivityFeed({ items, limit, className }: ActivityFeedProps) {
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul className={cn("space-y-0", className)}>
      {shown.map((item, idx) => {
        const meta = ICONS[item.icon];
        const Icon = meta.icon;
        return (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {idx < shown.length - 1 && (
              <span className="absolute left-[13px] top-8 h-[calc(100%-28px)] w-px bg-border" />
            )}
            <span className={cn("z-10 flex size-7 shrink-0 items-center justify-center rounded-full", meta.classes)}>
              <Icon className="size-3.5" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm leading-snug">
                <span className="font-medium">{item.actor}</span>{" "}
                <span className="text-foreground/80">{item.action}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.date)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
