import { FileText, Film, Folder, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileKind } from "@/lib/types";

type KindGroup = "image" | "video" | "document";

/** Maps every file kind to a filter group for the kind Select. */
export const KIND_GROUP: Record<FileKind, KindGroup> = {
  png: "image",
  jpg: "image",
  svg: "image",
  mp4: "video",
  mov: "video",
  pdf: "document",
  docx: "document",
  zip: "document",
};

const KIND_META: Record<FileKind, { icon: typeof FileText; tint: string }> = {
  png: { icon: ImageIcon, tint: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400" },
  jpg: { icon: ImageIcon, tint: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400" },
  svg: { icon: ImageIcon, tint: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
  mp4: { icon: Film, tint: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
  mov: { icon: Film, tint: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
  pdf: { icon: FileText, tint: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" },
  docx: { icon: FileText, tint: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
  zip: { icon: Folder, tint: "bg-muted text-muted-foreground" },
};

interface FileTileProps {
  kind: FileKind;
  /** sizing/rounding classes, e.g. "size-9 rounded-lg" or "h-20 w-full rounded-lg" */
  className?: string;
  iconClassName?: string;
}

/** Kind-specific icon tile with a tinted background. */
export function FileTile({ kind, className, iconClassName }: FileTileProps) {
  const meta = KIND_META[kind];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        meta.tint,
        className ?? "size-9 rounded-lg"
      )}
    >
      <Icon className={iconClassName ?? "size-4"} />
    </span>
  );
}
