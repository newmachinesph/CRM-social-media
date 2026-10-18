"use client";

import { useState, type DragEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Clock, MoreHorizontal } from "lucide-react";
import type { Lead, LeadStage } from "@/lib/types";
import { useStore } from "@/lib/store";
import { member } from "@/data/users";
import { aud, fmtDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { UserAvatar } from "@/components/shared/user-avatar";
import { LeadSheet } from "@/components/crm/lead-sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STAGES: LeadStage[] = [
  "New Lead",
  "Contacted",
  "Discovery",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const ONBOARDING_STEPS = [
  "Create client profile",
  "Create onboarding checklist",
  "Generate agreement",
  "Prepare first invoice",
  "Create Dropbox workspace",
  "Send portal invitation",
];

export default function PipelinePage() {
  const { leads, setLeadStage } = useStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);
  const [wonLead, setWonLead] = useState<Lead | null>(null);

  const activeLead = leads.find((l) => l.id === activeId) ?? null;
  const openLeads = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");
  const openValue = openLeads.reduce((sum, l) => sum + l.value, 0);

  const moveLead = (lead: Lead, stage: LeadStage) => {
    if (lead.stage === stage) return;
    setLeadStage(lead.id, stage);
    if (stage === "Won") {
      setWonLead(lead);
    } else {
      toast.success(`Moved to ${stage}`, {
        description: `${lead.company} is now in ${stage}.`,
      });
    }
  };

  const handleDrop = (e: DragEvent, stage: LeadStage) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === draggedId);
    setDraggedId(null);
    setOverStage(null);
    if (lead) moveLead(lead, stage);
  };

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description={`Every open deal from first touch to close — ${aud(openValue)}/mo across ${openLeads.length} open opportunities.`}
      />

      <div className="thin-scroll flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          const stageValue = stageLeads.reduce((sum, l) => sum + l.value, 0);
          return (
            <div
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage);
              }}
              onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
              onDrop={(e) => handleDrop(e, stage)}
              className={cn(
                "flex w-[280px] shrink-0 flex-col rounded-xl border bg-muted/30 transition-shadow",
                overStage === stage && draggedId && "ring-2 ring-primary/40"
              )}
            >
              <div className="flex items-baseline justify-between px-3 pt-3 pb-2">
                <p className="text-sm font-medium">
                  {stage}{" "}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {stageLeads.length}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {aud(stageValue)}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedId(lead.id);
                      e.dataTransfer.setData("text/plain", lead.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setOverStage(null);
                    }}
                    onClick={() => setActiveId(lead.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveId(lead.id);
                      }
                    }}
                    className={cn(
                      "cursor-grab rounded-xl border bg-card p-3 shadow-xs transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing",
                      draggedId === lead.id && "opacity-40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{lead.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {lead.company}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`Move ${lead.name}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuLabel>Move to</DropdownMenuLabel>
                          {STAGES.filter((s) => s !== lead.stage).map((s) => (
                            <DropdownMenuItem key={s} onClick={() => moveLead(lead, s)}>
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{lead.service}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-medium tabular-nums">
                        {aud(lead.value)}/mo
                      </p>
                      <UserAvatar member={member(lead.ownerId)} size="xs" />
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {lead.daysInStage}d in stage
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {lead.nextAction} · {fmtDateShort(lead.nextActionDate)}
                    </p>
                  </div>
                ))}
                {stageLeads.length === 0 ? (
                  <div className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                    No deals here
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <LeadSheet
        lead={activeLead}
        open={activeId !== null}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
      />

      {/* Deal won dialog */}
      <Dialog
        open={wonLead !== null}
        onOpenChange={(open) => {
          if (!open) setWonLead(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>🎉 Deal Won</DialogTitle>
            <DialogDescription>
              Create onboarding workspace for {wonLead?.company}?
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-1.5 text-sm">
            {ONBOARDING_STEPS.map((step) => (
              <li key={step} className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600" />
                {step}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            You can track progress any time in{" "}
            <Link href="/onboarding" className="text-primary hover:underline">
              Onboarding
            </Link>
            .
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWonLead(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const company = wonLead?.company ?? "";
                setWonLead(null);
                toast.success("Onboarding workspace created", {
                  description: `${company} is ready in Onboarding.`,
                });
              }}
            >
              Start Onboarding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
