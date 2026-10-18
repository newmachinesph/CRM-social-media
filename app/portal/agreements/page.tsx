"use client";

import { useState } from "react";
import { FileSignature } from "lucide-react";
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
import { aud, fmtDate } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";
import type { Contract } from "@/lib/types";

function AgreementSummary({ contract, clientName }: { contract: Contract; clientName: string }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Parties</span>
        <span className="text-right font-medium">Northstar Social &amp; {clientName}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Scope</span>
        <span className="max-w-[16rem] text-right font-medium">
          Social media strategy, content production and channel management.
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Monthly fee</span>
        <span className="font-medium">{aud(contract.value)}/month ex GST</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Term</span>
        <span className="font-medium">{contract.termMonths} months</span>
      </div>
    </div>
  );
}

export default function PortalAgreementsPage() {
  const store = useStore();
  const clientId = workspaceClientId(store.workspace);
  const portalClient = client(clientId);

  const agreements = store.contracts.filter(
    (c) => c.clientId === clientId && c.status !== "Draft"
  );

  const [viewing, setViewing] = useState<Contract | null>(null);
  const [signing, setSigning] = useState<Contract | null>(null);
  const [signName, setSignName] = useState("");

  const handleSign = (contract: Contract) => {
    store.signContract(contract.id, signName.trim(), "Authorised signatory");
    setSigning(null);
    setSignName("");
    toast.success("Agreement signed", {
      description: "Northstar Social has been notified.",
    });
  };

  return (
    <div>
      <PageHeader title="Agreements" description="Your agreements with Northstar Social." />

      {agreements.length === 0 ? (
        <EmptyState
          icon={<FileSignature className="size-5" />}
          title="No agreements yet"
          description="Agreements sent by Northstar Social will appear here."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {agreements.map((c) => {
            const signed = !!c.signedDate;
            return (
              <div
                key={c.id}
                className="rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileSignature className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold leading-snug">{c.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.termMonths}-month term · {aud(c.value)}/month
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {c.sentDate ? `Sent ${fmtDate(c.sentDate)}` : null}
                  {c.signedDate ? ` · Signed ${fmtDate(c.signedDate)}` : null}
                </p>
                <div className="mt-4">
                  {signed ? (
                    <Button variant="outline" size="sm" onClick={() => setViewing(c)}>
                      View agreement
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setSigning(c)}>
                      Review &amp; Sign
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View signed agreement */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing ? (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.title}</DialogTitle>
                <DialogDescription>Agreement summary</DialogDescription>
              </DialogHeader>
              <AgreementSummary contract={viewing} clientName={portalClient.name} />
              <Separator />
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <p className="font-medium italic">{viewing.signerName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {viewing.signerRole}
                  {viewing.signedDate ? ` · Signed ${fmtDate(viewing.signedDate)}` : ""}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => toast("Download started — demo only")}
                >
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Review & sign */}
      <Dialog
        open={!!signing}
        onOpenChange={(open) => {
          if (!open) {
            setSigning(null);
            setSignName("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {signing ? (
            <>
              <DialogHeader>
                <DialogTitle>{signing.title}</DialogTitle>
                <DialogDescription>Review the summary below, then sign to accept.</DialogDescription>
              </DialogHeader>
              <AgreementSummary contract={signing} clientName={portalClient.name} />
              <Separator />
              <div className="space-y-1.5">
                <Label htmlFor="sign-name">Type your full name to sign</Label>
                <Input
                  id="sign-name"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  placeholder={portalClient.contacts[0].name}
                />
                <p className="text-xs text-muted-foreground">Simulated e-signature — demo only.</p>
              </div>
              <DialogFooter>
                <Button disabled={!signName.trim()} onClick={() => handleSign(signing)}>
                  Sign agreement
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
