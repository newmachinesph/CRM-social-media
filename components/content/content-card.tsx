"use client";

import Link from "next/link";
import type { ContentItem } from "@/lib/types";
import { clientById } from "@/data/clients";
import { member } from "@/data/users";
import { ContentThumb } from "@/components/shared/content-thumb";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformIcon } from "@/components/shared/platform-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { fmtDateShort } from "@/lib/format";

export function ContentCard({ item }: { item: ContentItem }) {
  const client = clientById[item.clientId];
  return (
    <Link
      href={`/content/${item.id}`}
      className="group block rounded-xl border bg-card p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative">
        <ContentThumb item={item} />
        <StatusBadge status={item.status} className="absolute left-2 top-2 bg-white/90 shadow-xs backdrop-blur-sm dark:bg-black/60" />
        {item.version > 1 ? (
          <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            v{item.version}
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="truncate text-sm font-medium leading-tight">{item.title}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <PlatformIcon platform={item.platform} className="size-4 rounded text-[8px]" />
          <span className="truncate">{client?.name}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{item.type}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">{fmtDateShort(item.scheduledDate)}</span>
          <UserAvatar member={member(item.ownerId)} size="sm" />
        </div>
      </div>
    </Link>
  );
}
