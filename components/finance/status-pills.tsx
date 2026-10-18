"use client";

import { cn } from "@/lib/utils";

interface StatusPillsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function StatusPills({ options, value, onChange }: StatusPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === opt
              ? "border-transparent bg-foreground text-background"
              : "bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
