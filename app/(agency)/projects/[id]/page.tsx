"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  FileText,
  Film,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  Timer,
} from "lucide-react";
import type { FileKind, TaskStatus } from "@/lib/types";
import { projectById } from "@/data/projects";
import { clientById } from "@/data/clients";
import { member, teamById } from "@/data/users";
import { files } from "@/data/files";
import { activities } from "@/data/activities";
import { useStore } from "@/lib/store";
import { fmtDate, fmtDateShort } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ContentThumb } from "@/components/shared/content-thumb";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { TaskDrawer } from "@/components/projects/task-drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TASK_STATUSES: TaskStatus[] = ["Backlog", "To Do", "In Progress", "Review", "Done"];

const FILE_ICONS: Record<FileKind, typeof FileText> = {
  png: ImageIcon,
  jpg: ImageIcon,
  svg: ImageIcon,
  pdf: FileText,
  docx: FileText,
  mp4: Film,
  mov: Film,
  zip: Folder,
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const store = useStore();
  const [drawerTaskId, setDrawerTaskId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const project = projectById[id];

  if (!project) {
    return (
      <EmptyState
        icon={<FolderOpen className="size-5" />}
        title="Project not found"
        description="This project doesn't exist or may have been archived."
        action={
          <Button asChild variant="outline">
            <Link href="/projects">Back to projects</Link>
          </Button>
        }
      />
    );
  }

  const client = clientById[project.clientId];
  const manager = member(project.managerId);
  const projectTasks = store.tasks.filter((t) => t.projectId === project.id);
  const projectContent = store.content.filter((c) => c.projectId === project.id);
  const campaignFiles = files.filter(
    (f) =>
      f.clientId === project.clientId &&
      (f.folder === "Campaigns" || f.folder === "Raw Content")
  );
  const projectFiles =
    campaignFiles.length > 0
      ? campaignFiles
      : files.filter((f) => f.clientId === project.clientId);
  const projectActivity = activities.filter((a) => a.clientId === project.clientId);

  const upcoming = project.milestones
    .filter((m) => !m.done)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextMilestone = upcoming[0];

  function openTask(taskId: string) {
    setDrawerTaskId(taskId);
    setDrawerOpen(true);
  }

  return (
    <div>
      <Link
        href="/projects"
        className="mb-3 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Projects
      </Link>
      <PageHeader
        title={project.name}
        description={
          client ? (
            <>
              <Link href={`/clients/${client.id}`} className="hover:underline">
                {client.name}
              </Link>
              {" · "}
              {fmtDateShort(project.startDate)} — {fmtDateShort(project.dueDate)}
            </>
          ) : null
        }
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            <StatusBadge status={project.priority} />
          </div>
        }
      >
        <div className="flex max-w-sm items-center gap-3">
          <Progress value={project.progress} className="h-2" />
          <span className="shrink-0 text-sm font-medium tabular-nums">{project.progress}%</span>
        </div>
      </PageHeader>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Project brief</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-0">
                    {project.milestones.map((m, idx) => {
                      const isNext = !m.done && m.name === nextMilestone?.name;
                      return (
                        <li key={m.name} className="relative flex gap-3 pb-4 last:pb-0">
                          {idx < project.milestones.length - 1 && (
                            <span className="absolute left-[9px] top-6 h-[calc(100%-20px)] w-px bg-border" />
                          )}
                          {m.done ? (
                            <CheckCircle2 className="z-10 mt-0.5 size-[18px] shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="z-10 mt-0.5 size-[18px] shrink-0 text-muted-foreground/40" />
                          )}
                          <div className="min-w-0">
                            <p
                              className={
                                isNext
                                  ? "text-sm font-semibold"
                                  : m.done
                                    ? "text-sm text-muted-foreground"
                                    : "text-sm"
                              }
                            >
                              {m.name}
                              {isNext ? (
                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                  Up next
                                </span>
                              ) : null}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {fmtDate(m.date)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Deliverables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    <span className="text-2xl font-semibold tabular-nums">
                      {project.deliverablesDone}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      of {project.deliverablesTotal} deliverables completed
                    </span>
                  </p>
                  <Progress
                    value={(project.deliverablesDone / project.deliverablesTotal) * 100}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2.5">
                      <UserAvatar member={manager} size="md" />
                      <div>
                        <p className="text-sm font-medium">{manager.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {manager.role} · Project lead
                        </p>
                      </div>
                    </li>
                    {project.teamIds
                      .filter((tid) => tid !== project.managerId)
                      .map((tid) => {
                        const m = teamById[tid];
                        if (!m) return null;
                        return (
                          <li key={tid} className="flex items-center gap-2.5">
                            <UserAvatar member={m} size="md" />
                            <div>
                              <p className="text-sm font-medium">{m.name}</p>
                              <p className="text-xs text-muted-foreground">{m.role}</p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Upcoming deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcoming.length > 0 ? (
                    <ul className="space-y-3">
                      {upcoming.map((m) => (
                        <li key={m.name} className="flex items-center gap-2.5">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Timer className="size-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm">{m.name}</p>
                          </div>
                          <span className="shrink-0 text-xs font-medium text-muted-foreground">
                            {fmtDateShort(m.date)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      All milestones complete. Nice work.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          {projectTasks.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="size-5" />}
              title="No tasks yet"
              description="Tasks linked to this project will appear here."
            />
          ) : (
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs">
              {projectTasks.map((t) => (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openTask(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openTask(t.id);
                    }
                  }}
                  className="flex cursor-pointer flex-wrap items-center gap-3 p-3.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                  </div>
                  <StatusBadge status={t.priority} />
                  <span className="text-xs text-muted-foreground">
                    {fmtDateShort(t.dueDate)}
                  </span>
                  <UserAvatar member={member(t.assigneeId)} size="sm" />
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={t.status}
                      onValueChange={(v) => {
                        store.setTaskStatus(t.id, v as TaskStatus);
                        toast.success("Task updated", {
                          description: `"${t.title}" moved to ${v}.`,
                        });
                      }}
                    >
                      <SelectTrigger size="sm" aria-label={`Status for ${t.title}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="content">
          {projectContent.length === 0 ? (
            <EmptyState
              icon={<ImageIcon className="size-5" />}
              title="No content yet"
              description="Content pieces linked to this project will appear here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projectContent.map((c) => (
                <Link
                  key={c.id}
                  href={`/content/${c.id}`}
                  className="group rounded-xl border bg-card p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <ContentThumb item={c} />
                  <div className="mt-2.5 flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-medium">{c.title}</p>
                  </div>
                  <div className="mt-1.5">
                    <StatusBadge status={c.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="files">
          {projectFiles.length === 0 ? (
            <EmptyState
              icon={<Folder className="size-5" />}
              title="No files yet"
              description="Campaign files for this client will appear here."
            />
          ) : (
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs">
              {projectFiles.map((f) => {
                const Icon = FILE_ICONS[f.kind];
                return (
                  <div key={f.id} className="flex items-center gap-3 p-3.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.folder}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{f.size}</span>
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                      {fmtDate(f.uploadedAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <div className="rounded-xl border bg-card p-5 shadow-xs">
            {projectActivity.length > 0 ? (
              <ActivityFeed items={projectActivity} />
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <TaskDrawer taskId={drawerTaskId} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
