"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LifeBuoy, Menu, Star } from "lucide-react";
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
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { portalNav } from "@/components/layout/nav-config";
import { ClientLogo } from "@/components/shared/client-logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { client } from "@/data/clients";
import { useStore, workspaceClientId } from "@/lib/store";
import type { WorkspaceId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { workspace, setWorkspace, presentationMode } = useStore();

  const portalClient = client(workspaceClientId(workspace));
  const primaryContact = portalClient.contacts[0];

  const isActive = (href: string) =>
    href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);

  const switchTo = (id: WorkspaceId) => {
    setWorkspace(id);
    if (id === "agency") {
      router.push("/dashboard");
      toast("Switched to the agency workspace");
    } else {
      router.push("/portal");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Menu className="size-5" />
          </Button>

          <Link href="/portal" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Star className="size-4 fill-current" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-[13px] font-bold tracking-wide">NORTHSTAR SOCIAL</span>
              <span className="block text-[10px] text-muted-foreground">Client Portal</span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-0.5 lg:flex" aria-label="Portal navigation">
            {portalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  isActive(item.href) && "bg-accent font-semibold text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          <Link
            href="/portal/support"
            className={cn(
              "hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex",
              isActive("/portal/support") && "bg-accent text-foreground"
            )}
          >
            <LifeBuoy className="size-4" /> Support
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label="Account menu" className="flex items-center gap-2 rounded-full outline-none ring-primary/40 focus-visible:ring-2">
                <ClientLogo client={portalClient} size="md" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{primaryContact.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{portalClient.name}</p>
                {!presentationMode && (
                  <p className="mt-1 inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Demo Workspace
                  </p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!presentationMode && (
                <>
                  <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Demo view
                  </DropdownMenuLabel>
                  {(["abc-fitness", "harbour-dental", "solace-skin"] as const).map((id) => (
                    <DropdownMenuItem key={id} onSelect={() => switchTo(id)} className={cn(workspace === id && "bg-accent")}>
                      {client(id).name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onSelect={() => switchTo("agency")}>
                Back to agency workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile nav */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Portal navigation</SheetTitle>
          <div className="flex items-center gap-2.5 border-b p-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Star className="size-4 fill-current" />
            </span>
            <div className="leading-none">
              <p className="text-[13px] font-bold tracking-wide">NORTHSTAR SOCIAL</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">Client Portal</p>
            </div>
          </div>
          <nav className="space-y-0.5 p-3">
            {[...portalNav, { label: "Support", href: "/portal/support" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  isActive(item.href) && "bg-accent font-semibold text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6">{children}</main>

      <footer className="border-t bg-background py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 text-xs text-muted-foreground md:px-6">
          <p>Northstar Social · Sydney, NSW</p>
          <p>Social, content &amp; growth — beautifully managed.</p>
        </div>
      </footer>
    </div>
  );
}
