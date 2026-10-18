import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

// Restrained, recognisable platform indicators (letter tiles — no brand assets).
const PLATFORM_META: Record<Platform, { abbr: string; classes: string }> = {
  Instagram: { abbr: "IG", classes: "text-pink-700 bg-pink-50 dark:text-pink-300 dark:bg-pink-950" },
  TikTok: { abbr: "TT", classes: "text-foreground bg-muted" },
  Facebook: { abbr: "FB", classes: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950" },
  LinkedIn: { abbr: "LI", classes: "text-sky-800 bg-sky-50 dark:text-sky-300 dark:bg-sky-950" },
  YouTube: { abbr: "YT", classes: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950" },
};

export function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  const meta = PLATFORM_META[platform];
  return (
    <span
      title={platform}
      className={cn(
        "inline-flex size-6 shrink-0 select-none items-center justify-center rounded-md text-[9px] font-bold tracking-wide",
        meta.classes,
        className
      )}
    >
      {meta.abbr}
    </span>
  );
}

export function PlatformBadge({ platform, label, className }: { platform: Platform; label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground", className)}>
      <PlatformIcon platform={platform} className="size-5 rounded" />
      {label ?? platform}
    </span>
  );
}
