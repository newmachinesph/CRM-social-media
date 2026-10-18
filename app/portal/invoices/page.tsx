"use client";

import { useState } from "react";
import { Receipt, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { client } from "@/data/clients";
import { audExact, fmtDate } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";
import type { Invoice } from "@/lib/types";

const UNPAID = ["Sent", "Due", "Overdue"];

export default function PortalInvoicesPage() {
  const store = useStore();
  const clientId = workspaceClientId(store.workspace);
  const portalClient = client(clientId);

  const invoices = store.invoices
    .filter((i) => i.clientId === clientId && i.status !== "Draft")
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.number.localeCompare(a.number));

  const unpaid = invoices
    .filter((i) => UNPAID.includes(i.status))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const highlight = unpaid[0];

  const [viewing, setViewing] = useState<Invoice | null>(null);
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePay = (inv: Invoice) => {
    setProcessing(true);
    setTimeout(() => {
      store.payInvoice(inv.id);
      setProcessing(false);
      setPaying(null);
      toast.success("Payment received — thank you!", {
        description: `Invoice ${inv.number} marked as paid and synced to MYOB. Demo only.`,
      });
    }, 1000);
  };

  return (
    <div>
      <PageHeader title="Invoices" description="Your billing with Northstar Social." />

      {highlight ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div>
            <p className="text-sm text-muted-foreground">
              {highlight.periodLabel} · <span className="font-mono">{highlight.number}</span>
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {audExact(highlight.total)}{" "}
              <span className="text-base font-normal text-muted-foreground">
                due {fmtDate(highlight.dueDate)}
              </span>
            </p>
          </div>
          <Button onClick={() => setPaying(highlight)}>Pay Invoice</Button>
        </div>
      ) : null}

      {invoices.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-5" />}
          title="No invoices yet"
          description="Invoices from Northstar Social will appear here."
        />
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => {
            const isUnpaid = UNPAID.includes(inv.status);
            return (
              <div
                key={inv.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{inv.periodLabel}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <span className="font-mono">{inv.number}</span> · Issued {fmtDate(inv.issueDate)}
                    {inv.status === "Paid" && inv.paidDate ? ` · Paid ${fmtDate(inv.paidDate)}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{audExact(inv.total)}</p>
                  <p className="text-xs text-muted-foreground">incl. {audExact(inv.gst)} GST</p>
                </div>
                <StatusBadge status={inv.status} />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setViewing(inv)}>
                    View
                  </Button>
                  {isUnpaid ? (
                    <Button size="sm" onClick={() => setPaying(inv)}>
                      Pay Invoice
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing ? (
            <>
              <DialogHeader>
                <DialogTitle>Invoice {viewing.number}</DialogTitle>
                <DialogDescription>
                  {viewing.periodLabel} · Issued {fmtDate(viewing.issueDate)}
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm">
                <div className="mb-4 flex justify-between text-xs text-muted-foreground">
                  <span>
                    From
                    <span className="mt-0.5 block font-medium text-foreground">Northstar Social</span>
                  </span>
                  <span className="text-right">
                    To
                    <span className="mt-0.5 block font-medium text-foreground">{portalClient.name}</span>
                  </span>
                </div>
                <div className="space-y-2">
                  {viewing.lineItems.map((li) => (
                    <div key={li.description} className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{li.description}</span>
                      <span className="shrink-0 font-medium">{audExact(li.amount)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="space-y-1.5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{audExact(viewing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (10%)</span>
                    <span>{audExact(viewing.gst)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{audExact(viewing.total)}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => toast("Download started — demo only")}
                >
                  Download PDF
                </Button>
                {UNPAID.includes(viewing.status) ? (
                  <Button
                    onClick={() => {
                      setPaying(viewing);
                      setViewing(null);
                    }}
                  >
                    Pay Invoice
                  </Button>
                ) : null}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Pay dialog */}
      <Dialog
        open={!!paying}
        onOpenChange={(open) => {
          if (!open && !processing) setPaying(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {paying ? (
            <>
              <DialogHeader>
                <DialogTitle>Pay invoice {paying.number}</DialogTitle>
                <DialogDescription>{paying.periodLabel}</DialogDescription>
              </DialogHeader>
              <p className="text-3xl font-semibold tracking-tight">{audExact(paying.total)}</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="card-number">Card number</Label>
                  <Input id="card-number" defaultValue="4242 4242 4242 4242" inputMode="numeric" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-expiry">Expiry</Label>
                    <Input id="card-expiry" defaultValue="08 / 28" inputMode="numeric" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input id="card-cvc" defaultValue="424" inputMode="numeric" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Demo payment — no real transaction will occur.
                </p>
              </div>
              <DialogFooter>
                <Button className="w-full" disabled={processing} onClick={() => handlePay(paying)}>
                  {processing ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    <>Pay {audExact(paying.total)}</>
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
