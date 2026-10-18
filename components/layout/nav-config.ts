import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  Clapperboard,
  FileSignature,
  FolderKanban,
  FolderOpen,
  Inbox,
  KanbanSquare,
  LayoutDashboard,
  Plug,
  Receipt,
  Settings,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export const agencyNav: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Inbox", href: "/inbox", icon: Inbox },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Leads", href: "/leads", icon: UserPlus },
      { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
    ],
  },
  {
    label: "Clients",
    items: [
      { label: "Clients", href: "/clients", icon: Users },
      { label: "Onboarding", href: "/onboarding", icon: ClipboardCheck },
    ],
  },
  {
    label: "Delivery",
    items: [
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Content", href: "/content", icon: Clapperboard },
      { label: "Calendar", href: "/calendar", icon: CalendarDays },
      { label: "Tasks", href: "/tasks", icon: CheckSquare },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", href: "/invoices", icon: Receipt },
      { label: "Contracts", href: "/contracts", icon: FileSignature },
    ],
  },
  {
    label: "Insights",
    items: [{ label: "Reports", href: "/reports", icon: BarChart3 }],
  },
  {
    label: "Assets",
    items: [{ label: "Files", href: "/files", icon: FolderOpen }],
  },
  {
    label: "Automation",
    items: [
      { label: "Automations", href: "/automations", icon: Zap },
      { label: "Integrations", href: "/integrations", icon: Plug },
    ],
  },
  {
    items: [{ label: "Settings", href: "/settings/profile", icon: Settings }],
  },
];

export const portalNav = [
  { label: "Home", href: "/portal" },
  { label: "Content", href: "/portal/content" },
  { label: "Calendar", href: "/portal/calendar" },
  { label: "Projects", href: "/portal/projects" },
  { label: "Files", href: "/portal/files" },
  { label: "Invoices", href: "/portal/invoices" },
  { label: "Agreements", href: "/portal/agreements" },
  { label: "Reports", href: "/portal/reports" },
];

/** Maps a top-level path segment to a breadcrumb label. */
export const breadcrumbLabels: Record<string, string> = {
  dashboard: "Overview",
  inbox: "Inbox",
  leads: "Leads",
  pipeline: "Pipeline",
  clients: "Clients",
  onboarding: "Onboarding",
  projects: "Projects",
  content: "Content",
  calendar: "Calendar",
  tasks: "Tasks",
  invoices: "Invoices",
  contracts: "Contracts",
  reports: "Reports",
  files: "Files",
  automations: "Automations",
  integrations: "Integrations",
  settings: "Settings",
};
