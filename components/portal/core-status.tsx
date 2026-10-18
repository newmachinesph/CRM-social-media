import type { ContentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Client-friendly wording for the internal content workflow.
 * Internal statuses (Idea / Draft / Internal Review) are never shown as-is
 * in the portal — everything earlier than Client Review reads "In production".
 */
export function portalStatusLabel(status: ContentStatus): string {
  switch (status) {
    case "Client Review":
      return "Waiting for your approval";
    case "Changes Requested":
      return "We're making your changes";
    case "Approved":
    case "Scheduled":
      return "Scheduled";
    case "Published":
      return "Published";
    default:
      return "In production";
  }
}

type Tone = "amber" | "orange" | "blue" | "violet" | "neutral";

function portalTone(status: ContentStatus): Tone {
  switch (status) {
    case "Client Review":
      return "amber";
    case "Changes Requested":
      return "orange";
    case "Approved":
    case "Scheduled":
      return "blue";
    case "Published":
      return "violet";
    default:
      return "neutral";
  }
}

// Mirrors the tone palette in components/shared/status-badge.tsx — the shared
// badge only knows internal status strings, and the portal shows friendly ones.
const CHIP_CLASSES: Record<Tone, string> = {
  amber:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  orange:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900",
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  violet:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  neutral: "bg-muted text-muted-foreground border-border",
};

const DOT_CLASSES: Record<Tone, string> = {
  amber: "bg-amber-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  neutral: "bg-muted-foreground/50",
};

/** Small coloured dot for calendar chips etc. */
export function portalStatusDotClass(status: ContentStatus): string {
  return DOT_CLASSES[portalTone(status)];
}

/** Client-friendly status pill, same visual language as StatusBadge. */
export function PortalStatusChip({
  status,
  className,
}: {
  status: ContentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4",
        CHIP_CLASSES[portalTone(status)],
        className
      )}
    >
      {portalStatusLabel(status)}
    </span>
  );
}
