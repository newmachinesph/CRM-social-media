"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, Check, CircleDollarSign, Plus, Receipt, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClientLogo } from "@/components/shared/client-logo";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusPills } from "@/components/finance/status-pills";
import { useStore } from "@/lib/store";
import { clients, clientById } from "@/data/clients";
import { aud, audExact, fmtDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = ["All", "Draft", "Sent", "Due", "Paid", "Overdue"];

export default function InvoicesPage() {
  const router = useRouter();
  const { invoices } = useStore();
  const [status, setStatus] = useState("All");
  const [clientId, setClientId] = useState("all");
  const [search, setSearch] = useState("");

  const outstanding = invoices
    .filter((i) => i.status === "Sent" || i.status === "Due")
    .reduce((s, i) => s + i.total, 0);
  const overdueInvoices = invoices.filter((i) => i.status === "Overdue");
  const overdue = overdueInvoices.reduce((s, i) => s + i.total, 0);
  const paidThisMonth = invoices
    .filter((i) => i.status === "Paid" && i.paidDate?.startsWith("2026-08"))
    .reduce((s, i) => s + i.total, 0);

  const filtered = invoices.filter(
    (i) =>
      (status === "All" || i.status === status) &&
      (clientId === "all" || i.clientId === clientId) &&
      i.number.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Billing across all clients, synced with MYOB."
        actions={
          <Button
            onClick={() =>
              toast("New invoice", { description: "Invoice creation is not part of this demo." })
            }
          >
            <Plus className="size-4" />
            New Invoice
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Outstanding"
          value={aud(outstanding)}
          hint="Sent and due invoices"
          icon={<CircleDollarSign className="size-4" />}
        />
        <KpiCard
          label="Overdue"
          value={<span className="text-red-600 dark:text-red-400">{aud(overdue)}</span>}
          hint={`${overdueInvoices.length} invoice${overdueInvoices.length === 1 ? "" : "s"}`}
          icon={<AlertTriangle className="size-4" />}
        />
        <KpiCard
          label="Paid This Month"
          value={aud(paidThisMonth)}
          delta="+12%"
          hint="vs July"
          icon={<Receipt className="size-4" />}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <StatusPills options={STATUS_FILTERS} value={status} onChange={setStatus} />
        <div className="ml-auto flex items-center gap-2">
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="w-44" aria-label="Filter by client">
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
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice #"
              className="w-44 pl-8"
              aria-label="Search by invoice number"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border bg-card shadow-xs">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-5" />}
            title="No invoices match"
            description="Try a different status, client, or invoice number."
            className="border-0 bg-transparent"
          />
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MYOB</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const c = clientById[inv.clientId];
                return (
                  <TableRow
                    key={inv.id}
                    onClick={() => router.push(`/invoices/${inv.id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-mono text-xs font-medium">{inv.number}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {c ? <ClientLogo client={c} size="sm" /> : null}
                        <span className="whitespace-nowrap text-sm">{c?.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {audExact(inv.total)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {fmtDateShort(inv.issueDate)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-nowrap",
                        inv.status === "Overdue"
                          ? "font-medium text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {fmtDateShort(inv.dueDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell>
                      {inv.myobSynced ? (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check className="size-3" />
                          Synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          Not synced
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
