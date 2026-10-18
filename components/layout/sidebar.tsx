"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Star } from "lucide-react";
import { agencyNav } from "@/components/layout/nav-config";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  /** rendered inside a mobile sheet (no collapse control, always expanded) */
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, onToggle, mobile = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const isCollapsed = !mobile && collapsed;

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Brand */}
      <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b px-4", isCollapsed && "justify-center px-2")}>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Star className="size-4 fill-current" />
        </span>
        {!isCollapsed && (
          <div className="leading-none">
            <p className="text-[13px] font-bold tracking-wide">NORTHSTAR</p>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">SOCIAL</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="thin-scroll flex-1 space-y-4 overflow-y-auto px-2 py-4">
        {agencyNav.map((section, i) => (
          <div key={section.label ?? i}>
            {section.label && !isCollapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href.split("/").slice(0, 2).join("/")) && item.href.startsWith(`/${pathname.split("/")[1]}`));
                const link = (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      active && "bg-sidebar-accent font-semibold text-sidebar-foreground",
                      isCollapsed && "justify-center px-0 py-2"
                    )}
                  >
                    <item.icon className={cn("size-4 shrink-0", active && "text-primary")} />
                    {!isCollapsed && item.label}
                  </Link>
                );
                return (
                  <li key={item.href}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: demo view switcher + collapse */}
      <div className="shrink-0 space-y-2 border-t p-2">
        <WorkspaceSwitcher collapsed={isCollapsed} />
        {!mobile && (
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            {collapsed ? <ChevronsRight className="size-4" /> : (
              <>
                <ChevronsLeft className="size-4" /> Collapse
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
