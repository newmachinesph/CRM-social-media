import { cn } from "@/lib/utils";

function healthColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

interface HealthMeterProps {
  score: number;
  className?: string;
  /** show the numeric score next to the bar */
  showValue?: boolean;
}

/** Small coloured health bar: green ≥80, amber ≥60, red below. */
export function HealthMeter({ score, className, showValue = true }: HealthMeterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Health score ${score} of 100`}
        className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"
      >
        <div className={cn("h-full rounded-full", healthColor(score))} style={{ width: `${score}%` }} />
      </div>
      {showValue ? <span className="text-xs font-medium tabular-nums text-muted-foreground">{score}</span> : null}
    </div>
  );
}
