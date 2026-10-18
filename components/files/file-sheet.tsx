"use client";

import { Download, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientLogo } from "@/components/shared/client-logo";
import { FileTile } from "@/components/files/file-tile";
import { clientById } from "@/data/clients";
import { fmtDate } from "@/lib/format";
import type { FileItem } from "@/lib/types";

interface FileSheetProps {
  file: FileItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
        {children}
      </span>
    </div>
  );
}

export function FileSheet({ file, onClose, onDelete }: FileSheetProps) {
  const client = file ? clientById[file.clientId] : undefined;
  return (
    <Sheet open={file !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        {file ? (
          <div className="flex h-full flex-col overflow-y-auto p-4 pt-10">
            <div className="flex flex-col items-center text-center">
              <FileTile
                kind={file.kind}
                className="size-20 rounded-2xl"
                iconClassName="size-9"
              />
              <SheetHeader className="items-center p-0 pt-4">
                <SheetTitle className="break-all leading-snug">{file.name}</SheetTitle>
                <SheetDescription>
                  {file.kind.toUpperCase()} · {file.size}
                  {file.fromClient ? " · uploaded via portal" : ""}
                </SheetDescription>
              </SheetHeader>
            </div>

            <Separator className="my-4" />

            <div className="divide-y">
              <MetaRow label="Client">
                {client ? (
                  <>
                    <ClientLogo client={client} size="sm" />
                    <span className="truncate">{client.name}</span>
                  </>
                ) : null}
              </MetaRow>
              <MetaRow label="Folder">{file.folder}</MetaRow>
              <MetaRow label="Size">{file.size}</MetaRow>
              <MetaRow label="Uploaded">{fmtDate(file.uploadedAt)}</MetaRow>
              <MetaRow label="Uploaded by">
                <span className="truncate">{file.uploadedBy}</span>
                {file.fromClient ? (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    from client
                  </span>
                ) : null}
              </MetaRow>
            </div>

            <div className="mt-auto space-y-2 pt-6">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    toast.success("Download started", {
                      description: `${file.name} — demo only`,
                    })
                  }
                >
                  <Download data-icon="inline-start" className="size-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("Link copied", {
                      description: "Anyone at Northstar Social can open it.",
                    })
                  }
                >
                  <Link2 data-icon="inline-start" className="size-4" />
                  Share link
                </Button>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  onDelete(file.id);
                  toast.success("File removed", {
                    description: `${file.name} — demo only`,
                  });
                }}
              >
                <Trash2 data-icon="inline-start" className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
