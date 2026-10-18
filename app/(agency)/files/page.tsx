"use client";

import { useMemo, useState } from "react";
import { FolderOpen, LayoutGrid, List, Search, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientLogo } from "@/components/shared/client-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientTree, type FileFolder } from "@/components/files/client-tree";
import { FileTile, KIND_GROUP } from "@/components/files/file-tile";
import { FileSheet } from "@/components/files/file-sheet";
import { UploadDialog } from "@/components/files/upload-dialog";
import { files as seedFiles } from "@/data/files";
import { clientById } from "@/data/clients";
import { fmtDate, fmtDateShort } from "@/lib/format";
import type { FileItem } from "@/lib/types";

type KindFilter = "all" | "image" | "video" | "document";
type ViewMode = "grid" | "list";

const BRAND_ASSET_CHIPS = [
  "Logos",
  "Brand guide",
  "Fonts",
  "Colour palette",
  "Photography",
];

export default function FilesPage() {
  const [allFiles, setAllFiles] = useState<FileItem[]>(seedFiles);
  const [clientSel, setClientSel] = useState<string | null>(null);
  const [folderSel, setFolderSel] = useState<FileFolder | null>(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ViewMode>("grid");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [detail, setDetail] = useState<FileItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allFiles
      .filter(
        (f) =>
          (clientSel === null || f.clientId === clientSel) &&
          (folderSel === null || f.folder === folderSel) &&
          (kindFilter === "all" || KIND_GROUP[f.kind] === kindFilter) &&
          (q === "" || f.name.toLowerCase().includes(q))
      )
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [allFiles, clientSel, folderSel, kindFilter, search]);

  const scopeLabel =
    clientSel === null
      ? "All files"
      : `${clientById[clientSel]?.name}${folderSel ? ` / ${folderSel}` : ""}`;

  return (
    <div>
      <PageHeader
        title="Files"
        description="Brand assets, campaign files and deliverables."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload data-icon="inline-start" className="size-4" />
            Upload
          </Button>
        }
      />

      <div className="flex flex-col gap-6 md:flex-row">
        <ClientTree
          files={allFiles}
          clientSel={clientSel}
          folderSel={folderSel}
          onSelect={(clientId, folder) => {
            setClientSel(clientId);
            setFolderSel(folder);
          }}
        />

        <div className="min-w-0 flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-44 flex-1 sm:max-w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files"
                aria-label="Search files"
                className="pl-8"
              />
            </div>
            <Select
              value={kindFilter}
              onValueChange={(v) => setKindFilter(v as KindFilter)}
            >
              <SelectTrigger className="w-32" aria-label="Filter by file kind">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All kinds</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={0}
              value={mode}
              onValueChange={(v) => v && setMode(v as ViewMode)}
              className="ml-auto"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Scope + brand assets strip */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{scopeLabel}</p>
            <span className="text-xs text-muted-foreground">
              {visible.length} {visible.length === 1 ? "file" : "files"}
            </span>
            {folderSel === "Brand Assets" ? (
              <span className="flex flex-wrap items-center gap-1.5">
                {BRAND_ASSET_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </span>
            ) : null}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="size-5" />}
              title="No files here yet"
              description="Try a different folder or clear the search — or upload the first file."
              action={
                <Button variant="outline" onClick={() => setUploadOpen(true)}>
                  <Upload data-icon="inline-start" className="size-4" />
                  Upload files
                </Button>
              }
            />
          ) : mode === "grid" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDetail(f)}
                  className="group flex flex-col rounded-xl border bg-card p-3 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FileTile
                    kind={f.kind}
                    className="h-20 w-full rounded-lg transition-transform group-hover:scale-[1.01]"
                    iconClassName="size-7"
                  />
                  <p className="mt-2.5 w-full truncate text-sm font-medium">
                    {f.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {f.size} · {fmtDateShort(f.uploadedAt)}
                    {f.fromClient ? " · from client" : ""}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Folder</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((f) => {
                    const client = clientById[f.clientId];
                    return (
                      <TableRow
                        key={f.id}
                        onClick={() => setDetail(f)}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          <span className="flex items-center gap-2.5">
                            <FileTile kind={f.kind} className="size-8 rounded-lg" />
                            <span className="max-w-56 truncate font-medium">
                              {f.name}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          {client ? (
                            <span className="flex items-center gap-1.5 whitespace-nowrap">
                              <ClientLogo client={client} size="sm" />
                              {client.name}
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {f.folder}
                        </TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                          {f.size}
                        </TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                          {fmtDate(f.uploadedAt)}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 whitespace-nowrap">
                            {f.uploadedBy}
                            {f.fromClient ? (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                from client
                              </span>
                            ) : null}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <FileSheet
        file={detail}
        onClose={() => setDetail(null)}
        onDelete={(id) => {
          setAllFiles((fs) => fs.filter((f) => f.id !== id));
          setDetail(null);
        }}
      />
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
