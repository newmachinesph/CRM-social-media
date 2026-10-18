"use client";

import { useState } from "react";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ClientLogo } from "@/components/shared/client-logo";
import { clients } from "@/data/clients";
import { cn } from "@/lib/utils";
import type { FileItem } from "@/lib/types";

export type FileFolder = FileItem["folder"];

export const FOLDERS: FileFolder[] = [
  "Brand Assets",
  "Campaigns",
  "Raw Content",
  "Approved Content",
  "Contracts",
  "Reports",
];

interface ClientTreeProps {
  files: FileItem[];
  clientSel: string | null;
  folderSel: FileFolder | null;
  onSelect: (clientId: string | null, folder: FileFolder | null) => void;
}

/** Client → folder navigation: rail on desktop, horizontal chips on mobile. */
export function ClientTree({ files, clientSel, folderSel, onSelect }: ClientTreeProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    clientSel ? { [clientSel]: true } : {}
  );

  return (
    <>
      {/* Mobile: horizontal chips */}
      <div className="md:hidden">
        <div className="thin-scroll flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onSelect(null, null)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              clientSel === null
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            All files
          </button>
          {clients.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id, null)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-xs font-medium transition-colors",
                clientSel === c.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              <ClientLogo client={c} size="sm" className="rounded-full" />
              {c.name}
            </button>
          ))}
        </div>
        {clientSel ? (
          <div className="thin-scroll mt-2 flex gap-2 overflow-x-auto pb-1">
            {FOLDERS.map((folder) => (
              <button
                key={folder}
                type="button"
                onClick={() =>
                  onSelect(clientSel, folderSel === folder ? null : folder)
                }
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                  folderSel === folder
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {folder}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop: rail */}
      <nav aria-label="File folders" className="hidden w-56 shrink-0 space-y-0.5 md:block">
        <button
          type="button"
          onClick={() => onSelect(null, null)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
            clientSel === null && "bg-muted font-medium"
          )}
        >
          All files
          <span className="text-xs tabular-nums text-muted-foreground">
            {files.length}
          </span>
        </button>
        {clients.map((c) => {
          const isOpen = !!open[c.id];
          const clientCount = files.filter((f) => f.clientId === c.id).length;
          return (
            <Collapsible
              key={c.id}
              open={isOpen}
              onOpenChange={(o) => setOpen((prev) => ({ ...prev, [c.id]: o }))}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen((prev) => ({ ...prev, [c.id]: !isOpen }));
                  onSelect(c.id, null);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                  clientSel === c.id && folderSel === null && "bg-muted font-medium"
                )}
              >
                <ChevronRight
                  className={cn(
                    "size-3.5 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-90"
                  )}
                />
                <ClientLogo client={c} size="sm" />
                <span className="min-w-0 flex-1 truncate text-left">{c.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {clientCount}
                </span>
              </button>
              <CollapsibleContent>
                <div className="ml-4 space-y-0.5 border-l pl-2 pt-0.5">
                  {FOLDERS.map((folder) => {
                    const active = clientSel === c.id && folderSel === folder;
                    const count = files.filter(
                      (f) => f.clientId === c.id && f.folder === folder
                    ).length;
                    return (
                      <button
                        key={folder}
                        type="button"
                        onClick={() => onSelect(c.id, folder)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-1 text-[13px] transition-colors hover:bg-muted",
                          active
                            ? "bg-muted font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {active ? (
                          <FolderOpen className="size-3.5 shrink-0" />
                        ) : (
                          <Folder className="size-3.5 shrink-0" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-left">
                          {folder}
                        </span>
                        {count > 0 ? (
                          <span className="text-[11px] tabular-nums">{count}</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </>
  );
}
