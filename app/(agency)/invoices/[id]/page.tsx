"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Check, CheckCircle2, Download, Receipt, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useStore } from "@/lib/store";
import { clientById } from "@/data/clients";
import { audExact, fmtDate } from "@/lib/format";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { invoices, payInvoice } = useStore();
  const [syncing, setSyncing] = useState(false);

  const invoice = invoices.find((i) => i.id === id);

  if (!invoice) {
    return (
      <EmptyState
        icon={<Receipt className="size-5" />}
        title="Invoice not found"
        description="This invoice doesn't exist or has been removed."
        action={
          <Button variant="outline" asChild>
            <Link href="/invoices">Back to invoices</Link>
          </Button>
        }
      />
    );
  }

  const client = clientById[invoice.clientId];
  const isPaid = invoice.status === "Paid";

  const syncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Synced to MYOB — demo only");
    }, 800);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/invoices"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Invoices
        </Link>
        <span className="font-mono text-sm font-semibold">{invoice.number}</span>
        <StatusBadge status={invoice.status} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast("Preparing PDF", { description: "Download is simulated in this demo." })
            }
          >
            <Download className="size-4" />
            Download PDF
          </Button>
          {!isPaid ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Reminder sent", {
                  description: `${client?.contacts[0]?.name ?? "The client"} has been emailed — demo only.`,
                })
              }
            >
              <Send className="size-4" />
              Send reminder
            </Button>
          ) : null}
          {!isPaid ? (
            <Button
              size="sm"
              onClick={() => {
                payInvoice(invoice.id);
                toast.success("Invoice marked as paid — demo only");
              }}
            >
              <Check className="size-4" />
              Mark as paid
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Invoice document */}
        <div className="w-full max-w-3xl rounded-xl border bg-card p-8 shadow-xs sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-lg font-bold tracking-[0.18em]">NORTHSTAR SOCIAL</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Northstar Social Pty Ltd
                <br />
                ABN 84 321 675 908
                <br />
                Level 4, 285 Crown Street, Surry Hills NSW 2010
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tracking-widest text-muted-foreground">
                TAX INVOICE
              </p>
              <p className="mt-1 font-mono text-sm font-medium">{invoice.number}</p>
              {isPaid ? (
                <div className="mt-3 inline-flex flex-col items-end">
                  <span className="inline-flex -rotate-3 items-center gap-1 rounded-md border-2 border-emerald-500 px-3 py-1 text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    Paid
                  </span>
                  {invoice.paidDate ? (
                    <span className="mt-1.5 text-xs text-muted-foreground">
                      {fmtDate(invoice.paidDate)}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <Separator className="my-8" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Billed to
              </p>
              <p className="mt-2 text-sm font-semibold">{client?.name}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {client?.address}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:justify-items-end sm:text-right">
              <div className="sm:col-span-2 sm:grid sm:grid-cols-[auto_auto] sm:gap-x-6">
                <span className="text-xs text-muted-foreground">Issue date</span>
                <span className="block font-medium">{fmtDate(invoice.issueDate)}</span>
              </div>
              <div className="sm:col-span-2 sm:grid sm:grid-cols-[auto_auto] sm:gap-x-6">
                <span className="text-xs text-muted-foreground">Due date</span>
                <span className="block font-medium">{fmtDate(invoice.dueDate)}</span>
              </div>
              <div className="col-span-2 sm:grid sm:grid-cols-[auto_auto] sm:gap-x-6">
                <span className="text-xs text-muted-foreground">Period</span>
                <span className="block font-medium">{invoice.periodLabel}</span>
              </div>
            </div>
          </div>

          {invoice.status === "Overdue" ? (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              Overdue — payment was due {fmtDate(invoice.dueDate)}
            </p>
          ) : null}

          <div className="mt-8">
            <div className="flex items-center justify-between border-b pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <ul>
              {invoice.lineItems.map((li) => (
                <li
                  key={li.description}
                  className="flex items-center justify-between gap-4 border-b border-dashed py-3 text-sm"
                >
                  <span>{li.description}</span>
                  <span className="tabular-nums">{audExact(li.amount)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{audExact(invoice.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">GST (10%)</span>
              <span className="tabular-nums">{audExact(invoice.gst)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold">Total AUD</span>
              <span className="text-xl font-bold tabular-nums tracking-tight">
                {audExact(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        {/* MYOB card */}
        <div className="w-full rounded-xl border bg-card p-5 shadow-xs lg:w-72 lg:shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-purple-600 text-xs font-bold text-white">
              MY
            </span>
            <div>
              <p className="text-sm font-semibold">MYOB</p>
              <p className="text-xs text-muted-foreground">
                {invoice.myobSynced ? "✓ Synced" : "Sync pending"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Last synced 26 Aug 2026, 10:42 AM</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            disabled={syncing}
            onClick={syncNow}
          >
            <RefreshCw className={syncing ? "size-4 animate-spin" : "size-4"} />
            {syncing ? "Syncing…" : "Sync now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
