"use client";

import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clients, clientById } from "@/data/clients";
import { FOLDERS, type FileFolder } from "@/components/files/client-tree";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [clientId, setClientId] = useState("abc-fitness");
  const [folder, setFolder] = useState<FileFolder>("Brand Assets");

  const handleUpload = () => {
    onOpenChange(false);
    toast.success("2 files uploaded", {
      description: `Added to ${clientById[clientId]?.name} / ${folder} — demo only`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Add brand assets, campaign files or deliverables to a client folder.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/50">
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CloudUpload className="size-5" />
          </div>
          <p className="text-sm font-medium">
            Drag files here or <span className="text-primary underline underline-offset-2">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Images, video, PDF and documents up to 5 GB
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="upload-client">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="upload-client" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="upload-folder">Folder</Label>
            <Select value={folder} onValueChange={(v) => setFolder(v as FileFolder)}>
              <SelectTrigger id="upload-folder" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOLDERS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload}>
            <CloudUpload data-icon="inline-start" className="size-4" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
