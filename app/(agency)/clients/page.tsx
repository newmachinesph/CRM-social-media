"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import type { ClientStatus } from "@/lib/types";
import { clients } from "@/data/clients";
import { member } from "@/data/users";
import { aud, fmtDayDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClientLogo } from "@/components/shared/client-logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { HealthMeter } from "@/components/clients/health-meter";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_FILTERS = ["All", "Active", "Onboarding", "Paused", "At Risk"] as const;

export default function ClientsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = clients.filter((c) => {
    if (status !== "All" && c.status !== (status as ClientStatus)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  function createClient() {
    const name = newName.trim();
    if (!name) return;
    toast.success(`${name} added`, {
      description: "Demo only — new clients aren't persisted.",
    });
    setNewName("");
    setDialogOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage your client relationships and accounts."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            New Client
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients…"
              className="pl-8"
              aria-label="Search clients"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as (typeof STATUS_FILTERS)[number])}>
            <SelectTrigger className="w-36" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto">
            <ToggleGroup
              type="single"
              variant="outline"
              value={view}
              onValueChange={(v) => {
                if (v) setView(v as "grid" | "list");
              }}
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </PageHeader>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No clients match"
          description="Try a different search or clear the status filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setStatus("All");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const am = member(c.accountManagerId);
            return (
              <Link
                key={c.id}
                href={`/clients/${c.id}`}
                className="group rounded-xl border bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ClientLogo client={c} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate font-medium leading-tight group-hover:text-primary">
                        {c.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {c.industry} · {c.location}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <UserAvatar member={am} size="sm" />
                    <span className="truncate text-muted-foreground">{am.name}</span>
                  </span>
                  <HealthMeter score={c.healthScore} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
                  <span className="truncate text-muted-foreground">{c.package}</span>
                  <span className="font-medium tabular-nums">
                    {aud(c.retainer)}
                    <span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </span>
                </div>

                {c.nextMeeting ? (
                  <p className="mt-2 truncate text-xs text-muted-foreground">
                    Next: {c.nextMeeting.title} · {fmtDayDate(c.nextMeeting.date)}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account manager</TableHead>
                <TableHead>Package</TableHead>
                <TableHead className="text-right">Retainer</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Next meeting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const am = member(c.accountManagerId);
                return (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/clients/${c.id}`} className="flex items-center gap-3">
                        <ClientLogo client={c} size="md" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{c.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {c.industry} · {c.location}
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <UserAvatar member={am} size="sm" />
                        <span className="whitespace-nowrap text-muted-foreground">{am.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {c.package}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                      {aud(c.retainer)}
                      <span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </TableCell>
                    <TableCell>
                      <HealthMeter score={c.healthScore} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {c.nextMeeting ? `${fmtDayDate(c.nextMeeting.date)} · ${c.nextMeeting.title}` : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
            <DialogDescription>
              Add a business to Northstar Social. This is a demo — the client won&apos;t be saved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-client-name">Business name</Label>
            <Input
              id="new-client-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Driftwood Surf Co."
              onKeyDown={(e) => {
                if (e.key === "Enter") createClient();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createClient} disabled={!newName.trim()}>
              Add client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
