"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/agency", label: "Agency" },
  { href: "/settings/team", label: "Team" },
  { href: "/settings/branding", label: "Branding" },
  { href: "/settings/notifications", label: "Notifications" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, agency and client portal preferences.
        </p>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <nav aria-label="Settings" className="shrink-0 md:w-44">
          <ul className="thin-scroll flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
                    pathname === link.href
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
