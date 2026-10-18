"use client";

import { useState } from "react";
import {
  CheckSquare,
  Clapperboard,
  FolderKanban,
  Plus,
  Receipt,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { clients } from "@/data/clients";
import { team } from "@/data/users";
import { useStore } from "@/lib/store";
import type { ContentType, Platform, TaskPriority } from "@/lib/types";

type CreateKind = "lead" | "client" | "project" | "task" | "content" | "invoice";

const KINDS: { kind: CreateKind; label: string; icon: typeof Plus }[] = [
  { kind: "lead", label: "New lead", icon: UserPlus },
  { kind: "client", label: "New client", icon: Users },
  { kind: "project", label: "New project", icon: FolderKanban },
  { kind: "task", label: "New task", icon: CheckSquare },
  { kind: "content", label: "New content", icon: Clapperboard },
  { kind: "invoice", label: "New invoice", icon: Receipt },
];

const CONTENT_TYPES: { type: ContentType; platform: Platform }[] = [
  { type: "Instagram Reel", platform: "Instagram" },
  { type: "Instagram Carousel", platform: "Instagram" },
  { type: "Instagram Story", platform: "Instagram" },
  { type: "TikTok", platform: "TikTok" },
  { type: "Facebook Post", platform: "Facebook" },
  { type: "LinkedIn Post", platform: "LinkedIn" },
  { type: "YouTube Short", platform: "YouTube" },
];

export function QuickCreate() {
  const [open, setOpen] = useState<CreateKind | null>(null);
  const store = useStore();

  // shared lightweight form state (reset on open)
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [clientId, setClientId] = useState(clients[0].id);
  const [assigneeId, setAssigneeId] = useState(team[0].id);
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [contentType, setContentType] = useState<ContentType>("Instagram Reel");
  const [date, setDate] = useState("2026-09-01");
  const [notes, setNotes] = useState("");

  const openDialog = (kind: CreateKind) => {
    setTitle("");
    setName("");
    setCompany("");
    setNotes("");
    setOpen(kind);
  };

  const close = () => setOpen(null);

  const submit = () => {
    const id = `demo-${Date.now()}`;
    switch (open) {
      case "task":
        if (!title.trim()) return;
        store.createTask({
          id,
          title: title.trim(),
          clientId,
          status: "To Do",
          priority,
          assigneeId,
          dueDate: date,
          tags: [],
          description: notes,
          subtasks: [],
          comments: [],
          internal: true,
        });
        toast.success("Task created", { description: title.trim() });
        break;
      case "content": {
        if (!title.trim()) return;
        const platform = CONTENT_TYPES.find((c) => c.type === contentType)!.platform;
        store.createContent({
          id,
          title: title.trim(),
          clientId,
          campaign: "Ad hoc",
          platform,
          type: contentType,
          status: "Draft",
          ownerId: assigneeId,
          scheduledDate: `${date}T09:00`,
          caption: notes,
          hashtags: [],
          version: 1,
          versions: [{ number: 1, date: "2026-08-26", status: "Current", note: "Created in demo." }],
          comments: [],
          thumbGradient: "from-indigo-400 via-violet-500 to-purple-600",
          isVideo: contentType.includes("Reel") || contentType === "TikTok" || contentType === "YouTube Short",
          durationSec: 30,
        });
        toast.success("Content created", { description: `${title.trim()} — added as Draft` });
        break;
      }
      case "lead":
        if (!name.trim() || !company.trim()) return;
        store.createLead({
          id,
          name: name.trim(),
          company: company.trim(),
          email: "",
          phone: "",
          source: "Website",
          service: "Social Media Management",
          value: 4000,
          stage: "New Lead",
          ownerId: assigneeId,
          lastContact: "2026-08-26",
          nextAction: "Qualify lead",
          nextActionDate: "2026-08-28",
          expectedClose: "2026-10-01",
          createdAt: "2026-08-26",
          daysInStage: 0,
          notes,
          activities: [],
        });
        toast.success("Lead created", { description: `${name.trim()} · ${company.trim()}` });
        break;
      case "client":
        toast.success("Client workspace created", { description: `${company || "New client"} — demo only` });
        break;
      case "project":
        toast.success("Project created", { description: `${title || "New project"} — demo only` });
        break;
      case "invoice":
        toast.success("Invoice drafted", { description: "Draft saved and queued for MYOB sync — demo only" });
        break;
    }
    close();
  };

  const meta = KINDS.find((k) => k.kind === open);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="h-8 gap-1.5">
            <Plus className="size-4" /> Create
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Quick create</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {KINDS.map((k) => (
            <DropdownMenuItem key={k.kind} onSelect={() => openDialog(k.kind)}>
              <k.icon className="size-4" /> {k.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open !== null} onOpenChange={(v) => !v && close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{meta?.label}</DialogTitle>
            <DialogDescription>Created locally in the demo workspace.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(open === "lead") && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="qc-name">Contact name</Label>
                  <Input id="qc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Nguyen" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qc-company">Company</Label>
                  <Input id="qc-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Coastline Cafe" />
                </div>
              </>
            )}

            {(open === "client") && (
              <div className="space-y-1.5">
                <Label htmlFor="qc-company2">Business name</Label>
                <Input id="qc-company2" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Coastline Cafe" />
              </div>
            )}

            {(open === "task" || open === "content" || open === "project") && (
              <div className="space-y-1.5">
                <Label htmlFor="qc-title">{open === "task" ? "Task title" : "Title"}</Label>
                <Input id="qc-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={open === "content" ? "e.g. Spring Offer Reel" : "e.g. Prepare September report"} />
              </div>
            )}

            {(open === "task" || open === "content" || open === "project" || open === "invoice") && (
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {open === "content" && (
              <div className="space-y-1.5">
                <Label>Content type</Label>
                <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((c) => (
                      <SelectItem key={c.type} value={c.type}>{c.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {open === "task" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["Urgent", "High", "Medium", "Low"] as const).map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assignee</Label>
                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {team.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(open === "task" || open === "content") && (
              <div className="space-y-1.5">
                <Label htmlFor="qc-date">{open === "content" ? "Publish date" : "Due date"}</Label>
                <Input id="qc-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            )}

            {(open === "task" || open === "content" || open === "lead") && (
              <div className="space-y-1.5">
                <Label htmlFor="qc-notes">{open === "content" ? "Caption" : "Notes"}</Label>
                <Textarea id="qc-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
              </div>
            )}

            {open === "invoice" && (
              <p className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                A draft invoice will be generated from the client&apos;s current retainer and queued for MYOB sync.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={submit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
