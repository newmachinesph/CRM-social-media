"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle, PartyPopper, Send } from "lucide-react";
import { toast } from "sonner";
import type { OnboardingRecord } from "@/lib/types";
import { onboardingJourney, onboardingRecords } from "@/data/onboarding";
import { client } from "@/data/clients";
import { member } from "@/data/users";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { ClientLogo } from "@/components/shared/client-logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const RECENTLY_COMPLETED = [
  { clientId: "harbour-dental", completedDate: "2026-02-16" },
  { clientId: "coastal-kitchens", completedDate: "2026-03-23" },
];

export default function OnboardingPage() {
  const [records, setRecords] = useState<OnboardingRecord[]>(onboardingRecords);
  const [openClientId, setOpenClientId] = useState<string | null>(null);

  const openRecord = records.find((r) => r.clientId === openClientId);

  function markStepDone(clientId: string, stepIndex: number) {
    setRecords((rs) =>
      rs.map((r) =>
        r.clientId === clientId
          ? {
              ...r,
              steps: r.steps.map((s, i) => (i === stepIndex ? { ...s, done: true } : s)),
            }
          : r
      )
    );
    toast.success("Step marked done", {
      description: `${client(clientId).name}'s onboarding checklist has been updated.`,
    });
  }

  return (
    <div>
      <PageHeader
        title="Onboarding"
        description="Guide new clients from signed to launched."
      />

      {/* Standard journey */}
      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <p className="text-sm font-medium">The Northstar onboarding journey</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Every new client moves through the same nine steps.
        </p>
        <div className="mt-5 overflow-x-auto thin-scroll">
          <ol className="flex min-w-max items-start">
            {onboardingJourney.map((step, i) => {
              const isLast = i === onboardingJourney.length - 1;
              return (
                <li key={step} className="flex items-start">
                  <div className="flex w-24 flex-col items-center text-center">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                        isLast
                          ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950"
                          : "border-primary/30 bg-primary/5 text-primary"
                      )}
                    >
                      {isLast ? <PartyPopper className="size-3.5" /> : i + 1}
                    </span>
                    <span className="mt-2 text-xs font-medium leading-tight">{step}</span>
                  </div>
                  {!isLast && <span className="mt-4 h-0.5 w-8 shrink-0 rounded bg-border" />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Clients currently onboarding */}
      <h2 className="mb-3 mt-8 text-sm font-medium">Currently onboarding</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {records.map((rec) => {
          const c = client(rec.clientId);
          const am = member(c.accountManagerId);
          const done = rec.steps.filter((s) => s.done).length;
          const total = rec.steps.length;
          const pct = Math.round((done / total) * 100);
          return (
            <button
              key={rec.clientId}
              type="button"
              onClick={() => setOpenClientId(rec.clientId)}
              className="group rounded-xl border bg-card p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ClientLogo client={c} size="lg" />
                  <div>
                    <p className="font-medium leading-tight group-hover:text-primary">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Started {fmtDate(rec.startedDate)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Progress value={pct} className="h-1.5 flex-1" />
                <span className="text-xs font-medium tabular-nums text-muted-foreground">{pct}%</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {done} of {total} steps complete
                </span>
                <span className="flex items-center gap-1.5">
                  <UserAvatar member={am} size="xs" />
                  {am.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recently completed */}
      <h2 className="mb-3 mt-8 text-sm font-medium text-muted-foreground">
        Recently completed onboarding
      </h2>
      <div className="overflow-hidden rounded-xl border bg-card/50 shadow-xs">
        <ul className="divide-y">
          {RECENTLY_COMPLETED.map(({ clientId, completedDate }) => {
            const c = client(clientId);
            return (
              <li key={clientId}>
                <Link
                  href={`/clients/${clientId}`}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/40"
                >
                  <ClientLogo client={c} size="md" className="opacity-80" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground/80">
                      {c.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Completed {fmtDate(completedDate)}
                    </span>
                  </span>
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Checklist detail */}
      <Sheet open={openClientId !== null} onOpenChange={(open) => !open && setOpenClientId(null)}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          {openRecord ? (
            (() => {
              const c = client(openRecord.clientId);
              const done = openRecord.steps.filter((s) => s.done).length;
              return (
                <>
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                      <ClientLogo client={c} size="md" />
                      {c.name}
                    </SheetTitle>
                    <SheetDescription>
                      Started {fmtDate(openRecord.startedDate)} · {done} of {openRecord.steps.length} steps complete
                    </SheetDescription>
                  </SheetHeader>
                  <ul className="flex-1 space-y-1 overflow-y-auto px-4 thin-scroll">
                    {openRecord.steps.map((step, i) => (
                      <li
                        key={step.label}
                        className="flex items-center gap-3 rounded-lg px-2 py-2"
                      >
                        {step.done ? (
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                        )}
                        <span
                          className={cn(
                            "flex-1 text-sm",
                            step.done && "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                        {!step.done && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markStepDone(openRecord.clientId, i)}
                          >
                            Mark done
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <SheetFooter className="flex-row gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        toast.success("Reminder sent", {
                          description: `${c.contacts[0].name} has been nudged about the remaining steps.`,
                        })
                      }
                    >
                      <Send className="size-4" />
                      Send reminder
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/clients/${c.id}`}>Open client profile</Link>
                    </Button>
                  </SheetFooter>
                </>
              );
            })()
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
