import type { ReactNode } from "react";
import { AgencyShell } from "@/components/layout/agency-shell";

export default function AgencyLayout({ children }: { children: ReactNode }) {
  return <AgencyShell>{children}</AgencyShell>;
}
