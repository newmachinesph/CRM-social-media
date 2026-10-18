"use client";

import type { ComponentType } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Zap,
} from "lucide-react";
import type { Lead, LeadActivity } from "@/lib/types";
import { useStore } from "@/lib/store";
import { member } from "@/data/users";
import { aud, fmtDate } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const ACTIVITY_ICONS: Record<LeadActivity["type"], ComponentType<{ className?: string }>> = {
  note: MessageSquare,
  email: Mail,
  call: Phone,
  meeting: CalendarDays,
  task: Check,
  stage: Zap,
};

interface LeadSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadSheet({ lead, open, onOpenChange }: LeadSheetProps) {
  const { setLeadStage } = useStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-[480px]"
      >
        {lead ? (
          <>
            <SheetHeader className="pb-2">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg">{lead.name}</SheetTitle>
                <StatusBadge status={lead.stage} />
              </div>
              <SheetDescription>
                {lead.company} · {aud(lead.value)}/mo
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-6">
              {/* Contact */}
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
              </div>

              <Separator />

              {/* Deal info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Expected close</p>
                  <p className="mt-0.5 font-medium">{fmtDate(lead.expectedClose)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="mt-0.5 font-medium">{lead.source}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                    <UserAvatar member={member(lead.ownerId)} size="xs" />
                    {member(lead.ownerId).name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Days in stage</p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                    <Clock className="size-3.5 text-muted-foreground" />
                    {lead.daysInStage} {lead.daysInStage === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>

              {/* Services */}
              <div>
                <p className="text-xs text-muted-foreground">Services interested</p>
                <div className="mt-1.5">
                  <Badge variant="outline">{lead.service}</Badge>
                </div>
              </div>

              {/* Notes */}
              {lead.notes ? (
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm leading-relaxed">{lead.notes}</p>
                </div>
              ) : null}

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Email composer opened — demo only")}
                >
                  <Mail /> Send email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Call scheduler opened — demo only")}
                >
                  <Phone /> Schedule call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Task composer opened — demo only")}
                >
                  <Plus /> Add task
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Note editor opened — demo only")}
                >
                  <MessageSquare /> Add note
                </Button>
              </div>

              {lead.stage !== "Won" ? (
                <Button
                  className="w-full"
                  onClick={() => {
                    setLeadStage(lead.id, "Won");
                    toast.success("Deal won 🎉", {
                      description: `${lead.company} has been marked Won. Time to onboard.`,
                    });
                  }}
                >
                  <BadgeCheck /> Convert to client
                </Button>
              ) : null}

              <Separator />

              {/* Activity timeline */}
              <div>
                <p className="text-sm font-medium">Activity</p>
                <div className="mt-3 space-y-0">
                  {lead.activities.map((activity, i) => {
                    const Icon = ACTIVITY_ICONS[activity.type];
                    const last = i === lead.activities.length - 1;
                    return (
                      <div key={activity.id} className="relative flex gap-3 pb-5 last:pb-0">
                        {!last ? (
                          <span
                            aria-hidden
                            className="absolute top-7 left-3 h-[calc(100%-1.75rem)] w-px bg-border"
                          />
                        ) : null}
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground">
                          <Icon className="size-3" />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-sm">{activity.text}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {member(activity.actorId).name} · {fmtDate(activity.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
