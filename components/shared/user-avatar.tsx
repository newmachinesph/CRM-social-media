import type { TeamMember } from "@/lib/types";
import { initials as toInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-14 text-lg",
} as const;

interface UserAvatarProps {
  member?: TeamMember;
  /** for non-team people (client contacts) */
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function UserAvatar({ member, name, size = "md", className }: UserAvatarProps) {
  const label = member?.initials ?? toInitials(name ?? "?");
  const color = member?.color ?? "bg-neutral-400";
  return (
    <span
      title={member?.name ?? name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ring-2 ring-background",
        SIZES[size],
        color,
        className
      )}
    >
      {label}
    </span>
  );
}

/** Overlapping row of team avatars. */
export function AvatarGroup({ members, max = 4 }: { members: TeamMember[]; max?: number }) {
  const shown = members.slice(0, max);
  const rest = members.length - shown.length;
  return (
    <div className="flex -space-x-1.5">
      {shown.map((m) => (
        <UserAvatar key={m.id} member={m} size="sm" />
      ))}
      {rest > 0 && (
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-background">
          +{rest}
        </span>
      )}
    </div>
  );
}
