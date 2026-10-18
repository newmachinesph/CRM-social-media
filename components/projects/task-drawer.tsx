"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Building2, Folder, Link2, Pencil, Send } from "lucide-react";
import type { TaskStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { member, team } from "@/data/users";
import { clientById } from "@/data/clients";
import { projectById } from "@/data/projects";
import { fmtDate, timeAgo } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TASK_STATUSES: TaskStatus[] = ["Backlog", "To Do", "In Progress", "Review", "Done"];

interface TaskDrawerProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDrawer({ taskId, open, onOpenChange }: TaskDrawerProps) {
  const store = useStore();
  const [draft, setDraft] = useState("");
  const task = store.tasks.find((t) => t.id === taskId);

  const client = task?.clientId ? clientById[task.clientId] : undefined;
  const project = task?.projectId ? projectById[task.projectId] : undefined;
  const content = task?.contentId
    ? store.content.find((c) => c.id === task.contentId)
    : undefined;

  function toggleSubtask(index: number) {
    if (!task) return;
    const subtasks = task.subtasks.map((s, i) =>
      i === index ? { ...s, done: !s.done } : s
    );
    store.updateTask(task.id, { subtasks });
    toast.success("Task updated");
  }

  function addComment() {
    if (!task || !draft.trim()) return;
    store.updateTask(task.id, {
      comments: [
        ...task.comments,
        { authorId: "olivia", text: draft.trim(), date: "2026-08-26T10:16" },
      ],
    });
    setDraft("");
    toast.success("Comment added");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        {task ? (
          <>
            <SheetHeader className="pr-12">
              <div className="flex items-start gap-2">
                <SheetTitle className="text-base leading-snug">{task.title}</SheetTitle>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground"
                  aria-label="Edit title"
                  onClick={() =>
                    toast("Title editing is demo-only", {
                      description: "Task titles are fixed in this demo.",
                    })
                  }
                >
                  <Pencil className="size-3.5" />
                </Button>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StatusBadge status={task.priority} />
                <Select
                  value={task.status}
                  onValueChange={(v) => {
                    store.setTaskStatus(task.id, v as TaskStatus);
                    toast.success("Task updated");
                  }}
                >
                  <SelectTrigger size="sm" aria-label="Task status">
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
            </SheetHeader>

            <div className="thin-scroll flex-1 space-y-5 overflow-y-auto px-4 pb-6">
              <div className="space-y-2.5 text-sm">
                {client ? (
                  <div className="flex items-center gap-2">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium hover:underline"
                    >
                      {client.name}
                    </Link>
                  </div>
                ) : null}
                {project ? (
                  <div className="flex items-center gap-2">
                    <Folder className="size-3.5 text-muted-foreground" />
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                  </div>
                ) : null}
                {content ? (
                  <div className="flex items-center gap-2">
                    <Link2 className="size-3.5 text-muted-foreground" />
                    <Link
                      href={`/content/${content.id}`}
                      className="font-medium hover:underline"
                    >
                      {content.title}
                    </Link>
                    <StatusBadge status={content.status} />
                  </div>
                ) : null}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Assignee</p>
                  <Select
                    value={task.assigneeId}
                    onValueChange={(v) => {
                      store.updateTask(task.id, { assigneeId: v });
                      toast.success("Task updated", {
                        description: `Reassigned to ${member(v).name}.`,
                      });
                    }}
                  >
                    <SelectTrigger size="sm" className="w-full" aria-label="Assignee">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {team.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <UserAvatar member={m} size="xs" />
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Due date</p>
                  <p className="pt-1 text-sm font-medium">{fmtDate(task.dueDate)}</p>
                </div>
              </div>

              {task.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {task.description ? (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Description</p>
                  <p className="text-sm leading-relaxed text-foreground/90">{task.description}</p>
                </div>
              ) : null}

              {task.subtasks.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Subtasks Â· {task.subtasks.filter((s) => s.done).length} of {task.subtasks.length}
                  </p>
                  <ul className="space-y-2">
                    {task.subtasks.map((s, i) => (
                      <li key={s.title} className="flex items-center gap-2.5">
                        <Checkbox
                          id={`subtask-${i}`}
                          checked={s.done}
                          onCheckedChange={() => toggleSubtask(i)}
                        />
                        <label
                          htmlFor={`subtask-${i}`}
                          className={
                            s.done
                              ? "text-sm text-muted-foreground line-through"
                              : "text-sm"
                          }
                        >
                          {s.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <Separator />

              <div>
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  Comments Â· {task.comments.length}
                </p>
                {task.comments.length > 0 ? (
                  <ul className="space-y-4">
                    {task.comments.map((c, i) => {
                      const author = member(c.authorId);
                      return (
                        <li key={`${c.date}-${i}`} className="flex gap-2.5">
                          <UserAvatar member={author} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs">
                              <span className="font-medium">{author.name}</span>{" "}
                              <span className="text-muted-foreground">{timeAgo(c.date)}</span>
                            </p>
                            <p className="mt-0.5 text-sm leading-snug">{c.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                )}
                <div className="mt-4 flex items-start gap-2.5">
                  <UserAvatar member={member("olivia")} size="sm" />
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Add a commentâ€¦"
                      className="min-h-16 text-sm"
                    />
                    <Button size="sm" onClick={addComment} disabled={!draft.trim()}>
                      <Send className="size-3.5" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <SheetHeader>
            <SheetTitle>Task not found</SheetTitle>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  );
}
