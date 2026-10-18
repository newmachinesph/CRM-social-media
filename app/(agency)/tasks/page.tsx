"use client";

import { useState, type DragEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2, MoreHorizontal, Plus, Search } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { clients, clientById } from "@/data/clients";
import { member, team } from "@/data/users";
import { projectById } from "@/data/projects";
import { fmtDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { TaskDrawer } from "@/components/projects/task-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TODAY = "2026-08-26";
const GROUP_ORDER: TaskStatus[] = ["To Do", "In Progress", "Review", "Done", "Backlog"];
const PRIORITIES: TaskPriority[] = ["Urgent", "High", "Medium", "Low"];

function isOverdue(task: Task): boolean {
  return task.dueDate < TODAY && task.status !== "Done";
}

export default function TasksPage() {
  const store = useStore();

  const [drawerTaskId, setDrawerTaskId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const [newAssigneeId, setNewAssigneeId] = useState("olivia");
  const [newPriority, setNewPriority] = useState<TaskPriority>("Medium");
  const [newDueDate, setNewDueDate] = useState("2026-08-31");

  const filtered = store.tasks.filter(
    (t) =>
      (assigneeFilter === "all" || t.assigneeId === assigneeFilter) &&
      (priorityFilter === "all" || t.priority === priorityFilter) &&
      (clientFilter === "all" || t.clientId === clientFilter) &&
      (search.trim() === "" ||
        t.title.toLowerCase().includes(search.trim().toLowerCase()))
  );

  const myTasks = [...store.tasks]
    .filter((t) => t.assigneeId === "olivia")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  function openTask(id: string) {
    setDrawerTaskId(id);
    setDrawerOpen(true);
  }

  function toggleDone(task: Task) {
    const next: TaskStatus = task.status === "Done" ? "To Do" : "Done";
    store.setTaskStatus(task.id, next);
    toast.success(next === "Done" ? "Task completed" : "Task reopened", {
      description: `"${task.title}" moved to ${next}.`,
    });
  }

  function moveTask(task: Task, status: TaskStatus) {
    if (task.status === status) return;
    store.setTaskStatus(task.id, status);
    toast.success("Task updated", { description: `"${task.title}" moved to ${status}.` });
  }

  function createNewTask() {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      clientId: newClientId || undefined,
      status: "To Do",
      priority: newPriority,
      assigneeId: newAssigneeId,
      dueDate: newDueDate,
      tags: [],
      description: "",
      subtasks: [],
      comments: [],
      internal: true,
    };
    store.createTask(task);
    toast.success("Task created", { description: `"${task.title}" added to To Do.` });
    setDialogOpen(false);
    setNewTitle("");
    setNewClientId("");
  }

  function rowKeyDown(e: KeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openTask(id);
    }
  }

  function renderRow(t: Task) {
    const client = t.clientId ? clientById[t.clientId] : undefined;
    const project = t.projectId ? projectById[t.projectId] : undefined;
    return (
      <div
        key={t.id}
        role="button"
        tabIndex={0}
        onClick={() => openTask(t.id)}
        onKeyDown={(e) => rowKeyDown(e, t.id)}
        className="flex cursor-pointer items-center gap-3 p-3.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span onClick={(e) => e.stopPropagation()} className="flex items-center">
          <Checkbox
            checked={t.status === "Done"}
            onCheckedChange={() => toggleDone(t)}
            aria-label={`Mark "${t.title}" as done`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium",
              t.status === "Done" && "text-muted-foreground line-through"
            )}
          >
            {t.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {client?.name ?? "Internal"}
            {project ? ` · ${project.name}` : ""}
          </p>
        </div>
        <div className="hidden gap-1 lg:flex">
          {t.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <StatusBadge status={t.priority} />
        <span
          className={cn(
            "hidden w-14 shrink-0 text-right text-xs sm:inline",
            isOverdue(t) ? "font-medium text-red-600" : "text-muted-foreground"
          )}
        >
          {fmtDateShort(t.dueDate)}
        </span>
        <UserAvatar member={member(t.assigneeId)} size="sm" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Everything the team is working on."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            New Task
          </Button>
        }
      />

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="mine">My Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks…"
                className="h-8 w-52 pl-8 text-sm"
              />
            </div>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger size="sm" aria-label="Filter by assignee">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {team.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger size="sm" aria-label="Filter by priority">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger size="sm" aria-label="Filter by client">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="size-5" />}
              title="No tasks match these filters"
              description="Try clearing a filter or searching for something else."
            />
          ) : (
            <div className="space-y-6">
              {GROUP_ORDER.map((status) => {
                const group = filtered.filter((t) => t.status === status);
                if (group.length === 0) return null;
                return (
                  <div key={status}>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      {status} · {group.length}
                    </p>
                    <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs">
                      {group.map(renderRow)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="board">
          <div className="thin-scroll -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
            {GROUP_ORDER.map((status) => {
              const column = store.tasks.filter((t) => t.status === status);
              return (
                <div
                  key={status}
                  onDragOver={(e: DragEvent) => e.preventDefault()}
                  onDrop={(e: DragEvent) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    const task = store.tasks.find((t) => t.id === id);
                    if (task) moveTask(task, status);
                  }}
                  className="flex w-64 shrink-0 flex-col rounded-xl bg-muted/50 p-2.5"
                >
                  <p className="mb-2.5 px-1 text-xs font-medium text-muted-foreground">
                    {status} · {column.length}
                  </p>
                  <div className="flex flex-1 flex-col gap-2">
                    {column.map((t) => {
                      const client = t.clientId ? clientById[t.clientId] : undefined;
                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e: DragEvent) =>
                            e.dataTransfer.setData("text/plain", t.id)
                          }
                          role="button"
                          tabIndex={0}
                          onClick={() => openTask(t.id)}
                          onKeyDown={(e) => rowKeyDown(e, t.id)}
                          className="cursor-grab rounded-lg border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <p className="min-w-0 text-sm font-medium leading-snug">
                              {t.title}
                            </p>
                            <span onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="-mr-1 -mt-1 text-muted-foreground"
                                    aria-label={`Move "${t.title}"`}
                                  >
                                    <MoreHorizontal className="size-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Move to…</DropdownMenuLabel>
                                  {GROUP_ORDER.filter((s) => s !== t.status).map((s) => (
                                    <DropdownMenuItem key={s} onClick={() => moveTask(t, s)}>
                                      {s}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </span>
                          </div>
                          {client ? (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {client.name}
                            </p>
                          ) : null}
                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <StatusBadge status={t.priority} />
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "text-xs",
                                  isOverdue(t)
                                    ? "font-medium text-red-600"
                                    : "text-muted-foreground"
                                )}
                              >
                                {fmtDateShort(t.dueDate)}
                              </span>
                              <UserAvatar member={member(t.assigneeId)} size="xs" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="mine">
          {myTasks.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="size-5" />}
              title="Nothing on your plate"
              description="Tasks assigned to you will appear here."
            />
          ) : (
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs">
              {myTasks.map(renderRow)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>Add a task for the team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Draft September content plan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select value={newClientId} onValueChange={setNewClientId}>
                  <SelectTrigger className="w-full" aria-label="Client">
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Assignee</Label>
                <Select value={newAssigneeId} onValueChange={setNewAssigneeId}>
                  <SelectTrigger className="w-full" aria-label="Assignee">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {team.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={newPriority}
                  onValueChange={(v) => setNewPriority(v as TaskPriority)}
                >
                  <SelectTrigger className="w-full" aria-label="Priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-due">Due date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewTask} disabled={!newTitle.trim() || !newDueDate}>
              Create task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TaskDrawer taskId={drawerTaskId} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
