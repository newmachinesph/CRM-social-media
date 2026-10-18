"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronsUpDown, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientLogo } from "@/components/shared/client-logo";
import { useStore } from "@/lib/store";
import { client } from "@/data/clients";
import type { WorkspaceId } from "@/lib/types";
import { cn } from "@/lib/utils";

const OPTIONS: { id: WorkspaceId; name: string; kind: "Agency" | "Client" }[] = [
  { id: "agency", name: "Northstar Social", kind: "Agency" },
  { id: "abc-fitness", name: "ABC Fitness", kind: "Client" },
  { id: "harbour-dental", name: "Harbour Dental", kind: "Client" },
  { id: "solace-skin", name: "Solace Skin", kind: "Client" },
];

export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  const { workspace, setWorkspace, presentationMode } = useStore();
  const router = useRouter();

  const current = OPTIONS.find((o) => o.id === workspace) ?? OPTIONS[0];

  const choose = (id: WorkspaceId) => {
    setOpen(false);
    if (id === workspace) return;
    setWorkspace(id);
    if (id === "agency") {
      router.push("/dashboard");
      toast("Switched to the agency workspace");
    } else {
      router.push("/portal");
      toast(`Viewing the client portal as ${OPTIONS.find((o) => o.id === id)?.name}`);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border bg-background px-2 py-1.5 text-left transition-colors hover:bg-accent",
          collapsed && "justify-center border-0 bg-transparent"
        )}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          {current.kind === "Agency" ? <Star className="size-3.5" /> : <Building2 className="size-3.5" />}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              {!presentationMode && (
                <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Demo view
                </span>
              )}
              <span className="block truncate text-xs font-medium">{current.name}</span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Switch workspace</DialogTitle>
            <DialogDescription>
              Jump between the agency workspace and each client&apos;s portal experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1">
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(o.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:bg-accent",
                  o.id === workspace && "border-primary/40 bg-primary/5"
                )}
              >
                {o.id === "agency" ? (
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Star className="size-4 fill-current" />
                  </span>
                ) : (
                  <ClientLogo client={client(o.id)} size="md" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{o.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {o.kind === "Agency" ? "Agency workspace" : "Client portal"}
                  </span>
                </span>
                {o.id === workspace && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
