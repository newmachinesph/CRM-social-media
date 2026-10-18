"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentThumb } from "@/components/shared/content-thumb";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { ClientLogo } from "@/components/shared/client-logo";
import { clientById } from "@/data/clients";
import { fmtDateTime } from "@/lib/format";
import type { ContentItem } from "@/lib/types";

interface QuickViewProps {
  item: ContentItem | null;
  onClose: () => void;
}

/** Quick-view dialog for a piece of content, opened from any calendar view. */
export function QuickView({ item, onClose }: QuickViewProps) {
  const client = item ? clientById[item.clientId] : undefined;
  return (
    <Dialog open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {item ? (
          <>
            <div className="flex gap-4">
              <div className="group w-20 shrink-0">
                <ContentThumb item={item} />
              </div>
              <DialogHeader className="min-w-0 flex-1 text-left">
                <DialogTitle className="leading-snug">{item.title}</DialogTitle>
                <DialogDescription>{item.campaign}</DialogDescription>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  {client ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <ClientLogo client={client} size="sm" />
                      {client.name}
                    </span>
                  ) : null}
                  <PlatformBadge platform={item.platform} label={item.type} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.status} />
                  <span className="text-xs text-muted-foreground">
                    {fmtDateTime(item.scheduledDate)}
                  </span>
                </div>
              </DialogHeader>
            </div>
            <p className="line-clamp-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              {item.caption}
            </p>
            <DialogFooter>
              <Button asChild>
                <Link href={`/content/${item.id}`}>
                  Open content
                  <ArrowUpRight data-icon="inline-end" className="size-3.5" />
                </Link>
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
