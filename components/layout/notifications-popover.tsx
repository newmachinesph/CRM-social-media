"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationCategory } from "@/lib/types";

const CATEGORIES: ("All" | NotificationCategory)[] = [
  "All",
  "Approvals",
  "Comments",
  "Tasks",
  "Payments",
];

export function NotificationsPopover() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const shown = notifications.filter((n) => category === "All" || n.category === category);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}>
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-muted-foreground"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-3.5" /> Mark all read
          </Button>
        </div>
        <div className="border-b px-2 py-2">
          <Tabs value={category} onValueChange={(v) => setCategory(v as typeof category)}>
            <TabsList className="h-8 w-full justify-start gap-0.5 bg-transparent p-0">
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c} value={c} className="h-7 rounded-md px-2.5 text-xs data-[state=active]:bg-muted data-[state=active]:shadow-none">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="thin-scroll max-h-[380px] overflow-y-auto">
          {shown.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing here — you&apos;re all caught up 🎉
            </p>
          ) : (
            shown.map((n) => {
              const inner = (
                <div
                  className={cn(
                    "flex gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent/60",
                    !n.read && "bg-primary/[0.03]"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : "bg-primary"
                    )}
                  />
                  <div className="min-w-0">
                    <p className={cn("text-[13px] leading-snug", !n.read && "font-medium")}>{n.text}</p>
                    {n.detail && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.detail}</p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      {n.category} · {timeAgo(n.date)}
                    </p>
                  </div>
                </div>
              );
              return n.href ? (
                <Link
                  key={n.id}
                  href={n.href}
                  className="block"
                  onClick={() => {
                    markNotificationRead(n.id);
                    setOpen(false);
                  }}
                >
                  {inner}
                </Link>
              ) : (
                <button key={n.id} type="button" className="block w-full" onClick={() => markNotificationRead(n.id)}>
                  {inner}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
