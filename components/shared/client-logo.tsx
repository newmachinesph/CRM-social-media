import type { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-6 rounded-md text-[9px]",
  md: "size-8 rounded-lg text-[11px]",
  lg: "size-10 rounded-lg text-sm",
  xl: "size-14 rounded-xl text-lg",
} as const;

interface ClientLogoProps {
  client: Client;
  size?: keyof typeof SIZES;
  className?: string;
}

export function ClientLogo({ client, size = "md", className }: ClientLogoProps) {
  return (
    <span
      title={client.name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center bg-gradient-to-br font-bold text-white shadow-xs",
        client.brandGradient,
        SIZES[size],
        className
      )}
    >
      {client.logoInitials}
    </span>
  );
}
