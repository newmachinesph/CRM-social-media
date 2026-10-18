import { cn } from "@/lib/utils";

// One consistent colour language for every status in the product.
// green = done/positive · amber = waiting/review · red = problem
// blue = in an active workflow · neutral = not started/dormant

type Tone = "green" | "amber" | "red" | "blue" | "violet" | "neutral" | "orange";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  violet: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  orange: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900",
  neutral: "bg-muted text-muted-foreground border-border",
};

const DOT_CLASSES: Record<Tone, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  neutral: "bg-muted-foreground/50",
};

const STATUS_TONES: Record<string, Tone> = {
  // Content workflow
  Idea: "neutral",
  Draft: "neutral",
  "Internal Review": "amber",
  "Client Review": "amber",
  "Changes Requested": "orange",
  Approved: "green",
  Scheduled: "blue",
  Published: "violet",
  // Leads
  "New Lead": "neutral",
  Contacted: "blue",
  Discovery: "blue",
  "Proposal Sent": "amber",
  Negotiation: "amber",
  Won: "green",
  Lost: "red",
  // Tasks
  Backlog: "neutral",
  "To Do": "blue",
  "In Progress": "blue",
  Review: "amber",
  Done: "green",
  // Priorities
  Urgent: "red",
  High: "orange",
  Medium: "amber",
  Low: "neutral",
  // Clients
  Active: "green",
  Onboarding: "blue",
  Paused: "neutral",
  "At Risk": "red",
  // Projects
  Planning: "neutral",
  Complete: "green",
  "On Hold": "neutral",
  // Invoices
  Sent: "blue",
  Due: "amber",
  Paid: "green",
  Overdue: "red",
  // Contracts
  Viewed: "amber",
  Signed: "green",
  Expired: "neutral",
  // Misc
  Connected: "green",
  "Not Connected": "neutral",
  Synced: "green",
};

export function statusTone(status: string): Tone {
  return STATUS_TONES[status] ?? "neutral";
}

interface StatusBadgeProps {
  status: string;
  /** show a coloured dot instead of a filled pill */
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ status, dot = false, className }: StatusBadgeProps) {
  const tone = statusTone(status);
  if (dot) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80", className)}>
        <span className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])} />
        {status}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4",
        TONE_CLASSES[tone],
        className
      )}
    >
      {status}
    </span>
  );
}
