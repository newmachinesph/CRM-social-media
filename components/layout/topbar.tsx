"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandPalette } from "@/components/layout/command-palette";
import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { QuickCreate } from "@/components/layout/quick-create";
import { breadcrumbLabels } from "@/components/layout/nav-config";
import { UserAvatar } from "@/components/shared/user-avatar";
import { team } from "@/data/users";
import { useStore } from "@/lib/store";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { presentationMode, setPresentationMode, resetDemo } = useStore();

  const olivia = team[0];
  const segments = pathname.split("/").filter(Boolean);
  const rootLabel = breadcrumbLabels[segments[0]] ?? "Overview";
  const hasDetail = segments.length > 1 && segments[0] !== "settings";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur-sm md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileNav} aria-label="Open navigation">
        <Menu className="size-5" />
      </Button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
        <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
          Northstar
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <Link
          href={`/${segments[0] ?? "dashboard"}`}
          className={hasDetail ? "text-muted-foreground transition-colors hover:text-foreground" : "font-medium text-foreground"}
        >
          {rootLabel}
        </Link>
        {hasDetail && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <span className="truncate font-medium text-foreground">Detail</span>
          </>
        )}
      </nav>

      <div className="flex-1" />

      {/* Search trigger */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="hidden h-8 w-64 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left text-[13px]">Search…</span>
        <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setPaletteOpen(true)} aria-label="Search">
        <Search className="size-4.5" />
      </Button>

      <QuickCreate />
      <NotificationsPopover />

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" aria-label="Account menu" className="rounded-full outline-none ring-primary/40 focus-visible:ring-2">
            <UserAvatar member={olivia} size="md" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{olivia.name}</p>
            <p className="text-xs font-normal text-muted-foreground">{olivia.email}</p>
            {!presentationMode && (
              <p className="mt-1 inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Demo Workspace
              </p>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => router.push("/settings/profile")}>Profile settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push("/settings/agency")}>Agency settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setPresentationMode(!presentationMode);
              toast(presentationMode ? "Presentation mode off" : "Presentation mode on", {
                description: presentationMode
                  ? "Demo controls are visible again."
                  : "Demo labels and controls are hidden.",
              });
            }}
          >
            {presentationMode ? "Exit presentation mode" : "Presentation mode"}
          </DropdownMenuItem>
          {!presentationMode && (
            <DropdownMenuItem
              onSelect={() => {
                resetDemo();
                toast.success("Demo data reset");
              }}
            >
              Reset demo data
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
