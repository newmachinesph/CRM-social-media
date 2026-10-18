"use client";

import type { ContentVersion } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const VERSION_TONE: Record<ContentVersion["status"], string> = {
  Current: "text-blue-600 dark:text-blue-400",
  Approved: "text-emerald-600 dark:text-emerald-400",
  "Changes requested": "text-orange-600 dark:text-orange-400",
  Superseded: "text-muted-foreground",
};

interface VersionHistoryProps {
  versions: ContentVersion[];
  viewing: number;
  onSelect: (versionNumber: number) => void;
}

export function VersionHistory({ versions, viewing, onSelect }: VersionHistoryProps) {
  return (
    <RadioGroup
      value={String(viewing)}
      onValueChange={(v) => onSelect(Number(v))}
      className="gap-2"
      aria-label="Version history"
    >
      {versions.map((v) => (
        <Label
          key={v.number}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40",
            viewing === v.number && "border-primary/40 bg-primary/5"
          )}
        >
          <RadioGroupItem value={String(v.number)} className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-medium">
              <span>Version {v.number}</span>
              <span className={cn("text-xs font-medium", VERSION_TONE[v.status])}>{v.status}</span>
              <span className="text-xs font-normal text-muted-foreground">{fmtDate(v.date)}</span>
            </div>
            {v.note ? <p className="mt-0.5 text-xs text-muted-foreground">{v.note}</p> : null}
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
