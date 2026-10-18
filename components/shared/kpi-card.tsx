import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  /** e.g. "+8.4%" — rendered green; prefix with "-" for red */
  delta?: string;
  /** small line under the value, e.g. "Across 8 clients" */
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, delta, hint, icon, className }: KpiCardProps) {
  const negative = delta?.startsWith("-");
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon ? <span className="text-muted-foreground/70">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {(delta || hint) && (
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          {delta ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                negative ? "text-red-600" : "text-emerald-600"
              )}
            >
              {negative ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
              {delta.replace(/^[+-]/, "")}
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      )}
    </div>
  );
}
