"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Download, FileText, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useStore } from "@/lib/store";
import { clientById } from "@/data/clients";
import { aud, fmtDate } from "@/lib/format";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { contracts, signContract } = useStore();
  const [signOpen, setSignOpen] = useState(false);
  const [signName, setSignName] = useState("");

  const contract = contracts.find((c) => c.id === id);

  if (!contract) {
    return (
      <EmptyState
        icon={<FileText className="size-5" />}
        title="Agreement not found"
        description="This agreement doesn't exist or has been removed."
        action={
          <Button variant="outline" asChild>
            <Link href="/contracts">Back to contracts</Link>
          </Button>
        }
      />
    );
  }

  const client = clientById[contract.clientId];
  const clientLegalName = `${client?.name ?? "The Client"} Pty Ltd`;
  const isSigned = contract.status === "Signed";

  const sections: { heading: string; body: string }[] = [
    {
      heading: "Scope of Services",
      body: `Northstar Social will provide social media management services to the Client under the ${client?.package ?? "agreed"} package, including strategy, content planning, publishing, and community management across the Client's agreed channels.`,
    },
    {
      heading: "Deliverables",
      body: "Deliverables include a monthly content calendar, produced and scheduled content, community management, and a monthly performance report, as set out in the agreed package inclusions.",
    },
    {
      heading: "Monthly Fee",
      body: `The Client will pay ${aud(contract.value)} + GST, invoiced monthly in advance.`,
    },
    {
      heading: "Payment Terms",
      body: "Invoices are payable within 14 days of the invoice date. Services may be paused where an invoice remains unpaid beyond the payment term.",
    },
    {
      heading: "Intellectual Property",
      body: "On payment in full, ownership of approved deliverables transfers to the Client. Northstar Social retains the right to reference the work in its portfolio unless otherwise agreed in writing.",
    },
    {
      heading: "Term",
      body: `This agreement runs for ${contract.termMonths} months from execution and continues month-to-month thereafter unless renewed or terminated.`,
    },
    {
      heading: "Termination",
      body: "Either party may terminate this agreement with 30 days written notice. Fees for services delivered up to the termination date remain payable.",
    },
  ];

  const handleSign = () => {
    signContract(contract.id, signName.trim(), "Authorised signatory");
    setSignOpen(false);
    toast.success("Agreement signed", { description: "All parties have been notified." });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/contracts"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Contracts
        </Link>
        <span className="text-sm font-semibold">{contract.title}</span>
        <StatusBadge status={contract.status} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast("Preparing PDF", { description: "Download is simulated in this demo." })
            }
          >
            <Download className="size-4" />
            Download
          </Button>
          {contract.status === "Draft" ? (
            <Button
              size="sm"
              onClick={() =>
                toast.success("Sent to client", {
                  description: `${clientLegalName} has been emailed a signing link — demo only.`,
                })
              }
            >
              <Send className="size-4" />
              Send to client
            </Button>
          ) : null}
          {contract.status === "Sent" || contract.status === "Viewed" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Reminder sent", {
                  description: `${clientLegalName} has been re-sent the signing link — demo only.`,
                })
              }
            >
              <Send className="size-4" />
              Resend
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl rounded-xl border bg-card p-8 shadow-xs sm:p-12">
        <div className="text-center">
          <h2 className="text-lg font-semibold uppercase tracking-[0.14em]">{contract.title}</h2>
          <p className="mt-4 text-sm text-muted-foreground">between</p>
          <p className="mt-1 text-sm font-medium">Northstar Social Pty Ltd (ABN 84 321 675 908)</p>
          <p className="mt-1 text-sm text-muted-foreground">and</p>
          <p className="mt-1 text-sm font-medium">{clientLegalName}</p>
        </div>

        <Separator className="my-8" />

        <ol className="space-y-6">
          {sections.map((s, i) => (
            <li key={s.heading}>
              <h3 className="text-sm font-semibold tracking-wide">
                {i + 1}. {s.heading}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <Separator className="my-8" />

        {isSigned ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-5">
              <span className="font-serif text-2xl italic">{contract.signerName}</span>
              <Separator className="my-3" />
              <p className="text-sm font-medium">{contract.signerName}</p>
              <p className="text-xs text-muted-foreground">{contract.signerRole}</p>
              {contract.signedDate ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Signed {fmtDate(contract.signedDate)}
                </p>
              ) : null}
            </div>
            <div className="rounded-lg border bg-muted/30 p-5">
              <span className="font-serif text-2xl italic">Daniel Cooper</span>
              <Separator className="my-3" />
              <p className="text-sm font-medium">Daniel Cooper</p>
              <p className="text-xs text-muted-foreground">Founder, Northstar Social</p>
              {contract.signedDate ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Signed {fmtDate(contract.signedDate)}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Awaiting signature from {clientLegalName}
            </p>
            <Button onClick={() => setSignOpen(true)}>
              <Pencil className="size-4" />
              Review &amp; Sign
            </Button>
          </div>
        )}
      </div>

      <Dialog open={signOpen} onOpenChange={setSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign agreement</DialogTitle>
            <DialogDescription>
              {contract.title} — {clientLegalName} · {aud(contract.value)}/mo + GST ·{" "}
              {contract.termMonths}-month term
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="sign-name">Type your full name to sign</Label>
            <Input
              id="sign-name"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder="Full name"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">Simulated e-signature — demo only</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!signName.trim()} onClick={handleSign}>
              Sign agreement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
