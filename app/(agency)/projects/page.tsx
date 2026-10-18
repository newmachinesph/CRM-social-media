"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { ProjectStatus } from "@/lib/types";
import { projects } from "@/data/projects";
import { clients, clientById } from "@/data/clients";
import { member, teamById } from "@/data/users";
import { fmtDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClientLogo } from "@/components/shared/client-logo";
import { UserAvatar, AvatarGroup } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_FILTERS = ["All", "Planning", "Active", "Review", "Complete", "On Hold"] as const;

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [clientFilter, setClientFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClientId, setNewClientId] = useState("");

  const filtered = projects.filter(
    (p) =>
      (statusFilter === "All" || p.status === (statusFilter as ProjectStatus)) &&
      (clientFilter === "all" || p.clientId === clientFilter)
  );

  function createProject() {
    const clientName = newClientId ? clientById[newClientId]?.name : undefined;
    toast.success("Project created", {
      description: `"${newName}"${clientName ? ` for ${clientName}` : ""} — demo only, not persisted.`,
    });
    setDialogOpen(false);
    setNewName("");
    setNewClientId("");
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Campaigns and programs across all clients."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            New Project
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  statusFilter === s
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger size="sm" className="ml-auto" aria-label="Filter by client">
              <SelectValue placeholder="All clients" />
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
      </PageHeader>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-muted/30 px-6 py-14 text-center text-sm text-muted-foreground">
          No projects match these filters.
        </p>
      ) : (
        <div className="space-y-3 md:space-y-0 md:divide-y md:overflow-hidden md:rounded-xl md:border md:bg-card md:shadow-xs">
          <div className="hidden gap-4 px-4 py-2.5 text-xs text-muted-foreground md:grid md:grid-cols-[minmax(0,2.2fr)_100px_minmax(0,1.3fr)_130px_70px_80px] md:items-center">
            <span>Project</span>
            <span>Status</span>
            <span>Progress</span>
            <span>Team</span>
            <span>Due</span>
            <span>Priority</span>
          </div>
          {filtered.map((p) => {
            const client = clientById[p.clientId];
            const team = p.teamIds.map((id) => teamById[id]).filter(Boolean);
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-xs transition-colors hover:bg-accent/40 md:grid-cols-[minmax(0,2.2fr)_100px_minmax(0,1.3fr)_130px_70px_80px] md:items-center md:gap-4 md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:first-of-type:rounded-t-none md:hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  {client ? (
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ClientLogo client={client} size="sm" />
                      {client.name}
                    </span>
                  ) : null}
                </div>
                <div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-2.5">
                  <Progress value={p.progress} className="h-1.5" />
                  <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {p.progress}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserAvatar member={member(p.managerId)} size="sm" />
                  <AvatarGroup members={team.filter((m) => m.id !== p.managerId)} max={3} />
                </div>
                <span className="text-xs text-muted-foreground">
                  <span className="mr-1 md:hidden">Due</span>
                  {fmtDateShort(p.dueDate)}
                </span>
                <div>
                  <StatusBadge status={p.priority} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Set up a campaign or program for a client. Demo only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="October Organic Social"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Select value={newClientId} onValueChange={setNewClientId}>
                <SelectTrigger className="w-full" aria-label="Client">
                  <SelectValue placeholder="Select a client" />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createProject} disabled={!newName.trim() || !newClientId}>
              Create project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
