"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown, Kanban } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AvatarGroup } from "@/components/shared/user-avatar";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { projects } from "@/data/projects";
import { member } from "@/data/users";
import { fmtDate, fmtDateShort } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FRIENDLY_STATUS: Record<ProjectStatus, string> = {
  Planning: "In planning",
  Active: "In progress",
  Review: "In review",
  Complete: "Complete",
  "On Hold": "On hold",
};

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const nextMilestone = project.milestones.find((m) => !m.done);
  const team = project.teamIds.map((id) => member(id));

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{project.name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {fmtDateShort(project.startDate)} – {fmtDate(project.dueDate)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">
          {FRIENDLY_STATUS[project.status]}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="mt-2 h-2.5" />
        <p className="mt-2 text-xs text-muted-foreground">
          {project.deliverablesDone} / {project.deliverablesTotal} deliverables completed
        </p>
      </div>

      {nextMilestone ? (
        <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-primary/5 px-3 py-2.5">
          <CalendarDays className="size-4 shrink-0 text-primary" />
          <p className="text-sm">
            <span className="font-medium">{nextMilestone.name}</span>
            <span className="text-muted-foreground"> · {fmtDateShort(nextMilestone.date)}</span>
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <AvatarGroup members={team} />
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            Milestones
            <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent>
          <ul className="mt-3 space-y-2 border-t pt-3">
            {project.milestones.map((m) => (
              <li key={m.name} className="flex items-center gap-2.5 text-sm">
                {m.done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <span className="size-4 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                )}
                <span className={cn("min-w-0 truncate", m.done && "text-muted-foreground")}>
                  {m.name}
                </span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {fmtDateShort(m.date)}
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default function PortalProjectsPage() {
  const { workspace } = useStore();
  const clientId = workspaceClientId(workspace);
  const clientProjects = projects.filter(
    (p) => p.clientId === clientId && p.status !== "Complete"
  );

  return (
    <div>
      <PageHeader
        title="Your projects"
        description="What the Northstar team is working on for you."
      />
      {clientProjects.length === 0 ? (
        <EmptyState
          icon={<Kanban className="size-5" />}
          title="No active projects right now"
          description="When the Northstar team kicks off your next project, you'll see it here."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {clientProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
