"use client";

import { useState } from "react";
import { CloudUpload, Download, FileText, Film, Folder, Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { files as seedFiles } from "@/data/files";
import { client } from "@/data/clients";
import { fmtDate, fmtDateShort } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";
import type { FileItem, FileKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const CHIPS = [
  { label: "Brand Assets", folder: "Brand Assets" },
  { label: "Uploaded Content", folder: "Uploaded Content" },
  { label: "Approved Content", folder: "Approved Content" },
  { label: "Reports", folder: "Reports" },
  { label: "Agreements", folder: "Contracts" },
] as const;

function kindMeta(kind: FileKind) {
  if (kind === "png" || kind === "jpg" || kind === "svg")
    return { icon: ImageIcon, classes: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300" };
  if (kind === "mp4" || kind === "mov")
    return { icon: Film, classes: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" };
  return { icon: FileText, classes: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" };
}

export default function PortalFilesPage() {
  const { workspace } = useStore();
  const clientId = workspaceClientId(workspace);
  const portalClient = client(clientId);
  const viewer = portalClient.contacts[0];

  const [chip, setChip] = useState<(typeof CHIPS)[number]["label"]>("Brand Assets");
  const [uploads, setUploads] = useState<FileItem[]>([]);
  const [selected, setSelected] = useState<FileItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const allFiles = [...uploads, ...seedFiles].filter((f) => f.clientId === clientId);
  const activeFolder = CHIPS.find((c) => c.label === chip)!.folder;
  const shown =
    chip === "Uploaded Content"
      ? allFiles.filter((f) => f.fromClient)
      : allFiles.filter((f) => f.folder === activeFolder);

  const handleUpload = () => {
    const n = uploads.length + 1;
    setUploads((u) => [
      {
        id: `portal-upload-${n}`,
        name: `Upload-${n}.jpg`,
        clientId,
        folder: activeFolder,
        kind: "jpg",
        size: "3.4 MB",
        uploadedAt: "2026-08-26",
        uploadedBy: viewer.name,
        fromClient: true,
      },
      ...u,
    ]);
    setUploadOpen(false);
    toast.success("File uploaded", {
      description: "The Northstar team has been notified.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Files"
        description="Your brand assets, deliverables and documents — all in one place."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="size-4" /> Upload files
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setChip(c.label)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              chip === c.label
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<Folder className="size-5" />}
          title="Nothing here yet"
          description="Nothing here yet — files we deliver will appear in this folder."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((f) => {
            const meta = kindMeta(f.kind);
            const Icon = meta.icon;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelected(f)}
                className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
              >
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", meta.classes)}>
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{f.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {f.size} · {fmtDateShort(f.uploadedAt)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* File details */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="break-words">{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.folder === "Contracts" ? "Agreements" : selected.folder}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-3 px-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium uppercase">{selected.kind}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{selected.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded</span>
                  <span className="font-medium">{fmtDate(selected.uploadedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded by</span>
                  <span className="font-medium">{selected.uploadedBy}</span>
                </div>
                <Separator />
                <Button
                  className="w-full"
                  onClick={() => toast("Download started — demo only")}
                >
                  <Download className="size-4" /> Download
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>
              Share photos, footage or documents with the Northstar team.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-6 py-10 text-center">
            <CloudUpload className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag &amp; drop files here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click Upload to add a file to {chip}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="size-4" /> Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
