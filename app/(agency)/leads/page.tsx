"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Plus, Search, Users } from "lucide-react";
import type { Lead, LeadSource, LeadStage } from "@/lib/types";
import { useStore } from "@/lib/store";
import { team, member } from "@/data/users";
import { aud, fmtDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { LeadSheet } from "@/components/crm/lead-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STAGES: LeadStage[] = [
  "New Lead",
  "Contacted",
  "Discovery",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const SOURCES: LeadSource[] = [
  "Referral",
  "Website",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "Google",
  "Event",
  "Cold Outreach",
];

type ViewId = "all" | "mine" | "followup" | "high" | "new";

const VIEWS: { id: ViewId; label: string; match: (l: Lead) => boolean }[] = [
  { id: "all", label: "All Leads", match: () => true },
  { id: "mine", label: "My Leads", match: (l) => l.ownerId === "olivia" },
  {
    id: "followup",
    label: "Needs Follow-up",
    match: (l) =>
      l.nextActionDate <= "2026-08-27" && l.stage !== "Won" && l.stage !== "Lost",
  },
  { id: "high", label: "High Value", match: (l) => l.value >= 6000 },
  { id: "new", label: "New This Week", match: (l) => l.createdAt >= "2026-08-20" },
];

type SortKey = "value" | "lastContact";

export default function LeadsPage() {
  const { leads, createLead } = useStore();

  const [view, setView] = useState<ViewId>("all");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // New lead dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newService, setNewService] = useState("Social Media Management");
  const [newValue, setNewValue] = useState("");
  const [newOwner, setNewOwner] = useState("olivia");

  const services = useMemo(
    () => Array.from(new Set(leads.map((l) => l.service))).sort(),
    [leads]
  );

  const activeView = VIEWS.find((v) => v.id === view) ?? VIEWS[0];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = leads.filter(
      (l) =>
        activeView.match(l) &&
        (stageFilter === "all" || l.stage === stageFilter) &&
        (sourceFilter === "all" || l.source === sourceFilter) &&
        (ownerFilter === "all" || l.ownerId === ownerFilter) &&
        (serviceFilter === "all" || l.service === serviceFilter) &&
        (!q ||
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q))
    );
    if (sort) {
      out = [...out].sort((a, b) => {
        const cmp =
          sort.key === "value"
            ? a.value - b.value
            : a.lastContact.localeCompare(b.lastContact);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return out;
  }, [leads, activeView, search, stageFilter, sourceFilter, ownerFilter, serviceFilter, sort]);

  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s?.key === key
        ? s.dir === "desc"
          ? { key, dir: "asc" }
          : null
        : { key, dir: "desc" }
    );

  const sortIndicator = (key: SortKey) =>
    sort?.key === key ? (
      <ChevronDown
        className={cn("size-3.5 transition-transform", sort.dir === "asc" && "rotate-180")}
      />
    ) : null;

  const submitNewLead = () => {
    const slug = newCompany.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const domain = newCompany.toLowerCase().replace(/[^a-z0-9]/g, "") || "example";
    const lead: Lead = {
      id: `lead-${slug || "new"}-${Date.now()}`,
      name: newName.trim(),
      company: newCompany.trim(),
      email: `${newName.trim().split(" ")[0]?.toLowerCase() ?? "hello"}@${domain}.com.au`,
      phone: "—",
      source: "Website",
      service: newService,
      value: Number(newValue) || 0,
      stage: "New Lead",
      ownerId: newOwner,
      lastContact: "2026-08-26",
      nextAction: "Qualify new enquiry",
      nextActionDate: "2026-08-27",
      expectedClose: "2026-09-30",
      createdAt: "2026-08-26",
      daysInStage: 0,
      notes: "",
      activities: [
        {
          id: "a1",
          type: "note",
          text: "Lead created manually",
          date: "2026-08-26",
          actorId: newOwner,
        },
      ],
    };
    createLead(lead);
    setDialogOpen(false);
    setNewName("");
    setNewCompany("");
    setNewValue("");
    toast.success("Lead created", {
      description: `${lead.company} added to your pipeline.`,
    });
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Track and qualify new business for Northstar Social."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New Lead
          </Button>
        }
      />

      {/* Saved views */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              view === v.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads…"
            className="h-8 w-56 pl-8"
            aria-label="Search leads"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger size="sm" aria-label="Filter by stage">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger size="sm" aria-label="Filter by source">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {SOURCES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger size="sm" aria-label="Filter by owner">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {team.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger size="sm" aria-label="Filter by service">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {services.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No leads match your filters"
          description="Try widening your search or clearing a filter to see more of the pipeline."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStageFilter("all");
                setSourceFilter("all");
                setOwnerFilter("all");
                setServiceFilter("all");
                setView("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort("value")}
                      className="ml-auto inline-flex items-center gap-1 hover:text-foreground"
                    >
                      Est. Value {sortIndicator("value")}
                    </button>
                  </TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("lastContact")}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      Last Contact {sortIndicator("lastContact")}
                    </button>
                  </TableHead>
                  <TableHead>Next Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow
                    key={lead.id}
                    onClick={() => setActiveId(lead.id)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.service}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {aud(lead.value)}/mo
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.stage} />
                    </TableCell>
                    <TableCell>
                      <UserAvatar member={member(lead.ownerId)} size="sm" />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmtDateShort(lead.lastContact)}
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[180px] truncate text-sm">{lead.nextAction}</p>
                      <p className="text-xs text-muted-foreground">
                        {fmtDateShort(lead.nextActionDate)}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
            <span>
              Showing 1–{filtered.length} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="xs" disabled>
                Previous
              </Button>
              <Button variant="ghost" size="xs" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <LeadSheet
        lead={activeLead}
        open={activeId !== null}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
      />

      {/* New lead dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Lead</DialogTitle>
            <DialogDescription>
              Add a new prospect to the Northstar pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-name">Contact name</Label>
              <Input
                id="lead-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Alex Nguyen"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Harbourside Studio"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Service</Label>
                <Select value={newService} onValueChange={setNewService}>
                  <SelectTrigger className="w-full" aria-label="Service">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-value">Est. value / mo</Label>
                <Input
                  id="lead-value"
                  type="number"
                  min={0}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="4500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Owner</Label>
              <Select value={newOwner} onValueChange={setNewOwner}>
                <SelectTrigger className="w-full" aria-label="Owner">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitNewLead}
              disabled={!newName.trim() || !newCompany.trim()}
            >
              Create lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
