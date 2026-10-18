"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClientLogo } from "@/components/shared/client-logo";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusPills } from "@/components/finance/status-pills";
import { useStore } from "@/lib/store";
import { clientById } from "@/data/clients";
import { aud, fmtDateShort } from "@/lib/format";

const STATUS_FILTERS = ["All", "Draft", "Sent", "Viewed", "Signed", "Expired"];

export default function ContractsPage() {
  const router = useRouter();
  const { contracts } = useStore();
  const [status, setStatus] = useState("All");

  const filtered = contracts.filter((c) => status === "All" || c.status === status);

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Agreements and e-signatures."
        actions={
          <Button
            onClick={() =>
              toast("New agreement", { description: "Agreement creation is not part of this demo." })
            }
          >
            <Plus className="size-4" />
            New Agreement
          </Button>
        }
      />

      <StatusPills options={STATUS_FILTERS} value={status} onChange={setStatus} />

      <div className="mt-4 overflow-x-auto rounded-xl border bg-card shadow-xs">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-5" />}
            title="No agreements match"
            description="Try a different status filter."
            className="border-0 bg-transparent"
          />
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="hover:bg-transparent">
                <TableHead>Agreement</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((contract) => {
                const c = clientById[contract.clientId];
                return (
                  <TableRow
                    key={contract.id}
                    onClick={() => router.push(`/contracts/${contract.id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <span className="block whitespace-nowrap text-sm font-medium">
                        {contract.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {contract.termMonths}-month term
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {c ? <ClientLogo client={c} size="sm" /> : null}
                        <span className="whitespace-nowrap text-sm">{c?.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {aud(contract.value)}
                      <span className="font-normal text-muted-foreground">/mo</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {fmtDateShort(contract.createdDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {contract.sentDate ? fmtDateShort(contract.sentDate) : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {contract.signedDate ? fmtDateShort(contract.signedDate) : "—"}
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
