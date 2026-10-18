# Northstar Social — build conventions (read fully before writing pages)

Frontend-only demo CRM + client portal for a fictional Sydney social agency.
**No backend, no API routes, no real integrations.** All data from `/data`, all
mutations via the client store in `lib/store.tsx` (localStorage-persisted).

## Stack
- Next.js 16.3 App Router, TypeScript, Tailwind v4, shadcn/ui (in `components/ui/*`),
  lucide-react, Recharts, sonner (`toast` from `"sonner"`), date-fns, framer-motion (sparingly).
- Pages are client components: put `"use client"` at the top of every page you build
  (everything is interactive and reads the store).
- "Today" in the demo universe is **26 Aug 2026**. All dates in data are Aug–Sep 2026.

## Layout / routing
- Agency pages live in `app/(agency)/<route>/page.tsx` — the group layout already wraps
  them in the sidebar+topbar shell. Portal pages live in `app/portal/...` (shell provided).
- Do NOT add layouts, do NOT touch `app/layout.tsx`, shells, or `components/ui/*`.
- Page content renders inside a padded max-width container. Do not add your own page-level
  horizontal padding wrappers.

## Data (import directly for static reference data)
- `@/data/users` — `team`, `member(id)` (6 team members: olivia, james, mia, ethan, chloe, daniel)
- `@/data/clients` — `clients`, `client(id)`, `clientById` (8 clients; ids like `abc-fitness`)
- `@/data/projects` — `projects`, `projectById`
- `@/data/files` — `files`
- `@/data/activities` — `activities`
- `@/data/conversations` — `conversations`
- `@/data/onboarding` — `onboardingRecords`, `onboardingJourney`
- `@/data/reports` — `reports`, `reportByClientId` (6 months of metrics per client + platformSplit + topContentIds)
- `@/data/contracts`, `@/data/invoices`, `@/data/content`, `@/data/tasks`, `@/data/leads`,
  `@/data/notifications`, `@/data/automations` (also exports `integrations`) — these seed the store;
  **read the mutable copies from `useStore()` instead of importing them directly** so demo
  actions (approve, status change, pay, sign, toggle) reflect everywhere.

## Store — `useStore()` from `@/lib/store`
State: `content, tasks, leads, notifications, automations, integrations, invoices, contracts, workspace, presentationMode, hydrated`.
Actions: `setContentStatus(id,status)`, `addContentComment(id,comment)`, `createContent(item)`,
`setTaskStatus(id,status)`, `updateTask(id,patch)`, `createTask(task)`, `setLeadStage(id,stage)`,
`createLead(lead)`, `markNotificationRead(id)`, `markAllNotificationsRead()`,
`toggleAutomation(id)`, `setIntegrationConnected(id,bool)`, `payInvoice(id)`,
`signContract(id,name,role)`, `setWorkspace(w)`, `resetDemo()`, `setPresentationMode(bool)`.
- Portal pages: `workspaceClientId(workspace)` (from `@/lib/store`) gives the active portal client id.
- After a store mutation show a `toast` (from `"sonner"`), e.g.
  `toast.success("Content approved", { description: "Northstar Social has been notified." })`.

## Types
All in `@/lib/types` — `ContentItem`, `ContentStatus`, `Lead`, `LeadStage`, `Task`, `TaskStatus`,
`Client`, `Project`, `Invoice`, `Contract`, `FileItem`, `Platform`, etc. Check the file for exact fields.

## Formatting — `@/lib/format`
`aud(n)` `$5,500` · `audExact(n)` `$6,050.00` · `fmtDate(iso)` `26 Aug 2026` · `fmtDateShort` `26 Aug`
· `fmtDayDate` `Wed 26 Aug` · `fmtDateTime` · `timeAgo(iso)` · `fmtDuration(sec)` `0:42`
· `compact(n)` `84.2K` · `initials(name)`.
Always AUD, GST terminology, DD MMM YYYY dates. Never USD, never lorem ipsum.

## Shared components (use these — do not reinvent)
- `PageHeader` (`@/components/shared/page-header`) — `title, description, actions, children`.
  Use on every page: title + one-line description + primary action button.
- `KpiCard` (`.../kpi-card`) — `label, value, delta ("+8.4%" / "-2%"), hint, icon`.
- `StatusBadge` (`.../status-badge`) — `status` (any status string in the product), `dot?`.
  Also exports `statusTone(status)`. NEVER hand-roll status colours.
- `EmptyState` (`.../empty-state`) — `icon, title, description, action`.
- `UserAvatar`, `AvatarGroup` (`.../user-avatar`) — team member discs; `name` prop for client contacts.
- `ClientLogo` (`.../client-logo`) — gradient brand tile, sizes sm/md/lg/xl.
- `ContentThumb` (`.../content-thumb`) — media placeholder for a `ContentItem` (`aspect` prop,
  default `aspect-[4/5]`; wrap in a `group` for hover affordance).
- `PlatformIcon` / `PlatformBadge` (`.../platform-badge`).
- `ActivityFeed` (`.../activity-feed`) — renders `ActivityItem[]` with icons + timeline.

## shadcn/ui available
button, card, badge, avatar, input, label, textarea, select, checkbox, switch, tabs, table,
dialog, sheet, drawer, dropdown-menu, command, popover, calendar, separator, skeleton, tooltip,
progress, scroll-area, breadcrumb, sonner, accordion, radio-group, collapsible, toggle-group,
slider, alert. Import from `@/components/ui/<name>`.

## Design rules
- Premium, minimal, whitespace-rich. Neutral surfaces, indigo primary. NO heavy gradients on
  UI chrome (gradients only inside `ContentThumb`/`ClientLogo` brand tiles).
- Cards: `rounded-xl border bg-card shadow-xs` (KpiCard/Card already do this).
- Tables: shadcn Table inside `rounded-xl border` wrapper, `overflow-x-auto` for mobile,
  row hover, muted 11–12px uppercase-free headers. On small screens either horizontal scroll
  or a stacked card alternative.
- Charts (Recharts): minimal — no legends unless needed, thin axes
  (`tickLine={false} axisLine={false}`, fontSize 11, `stroke="var(--color-muted-foreground)"`),
  `CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)"`,
  colors `var(--chart-1)`..`var(--chart-5)`, rounded bar tops, tooltips with white card style.
  Wrap in `ResponsiveContainer` with a fixed-height parent div.
- Micro-interactions: subtle `transition-colors`/`hover:shadow-sm`/`hover:-translate-y-0.5` on
  cards, focus-visible rings. Framer-motion only for genuinely helpful touches.
- Accessibility: semantic elements, `aria-label` on icon-only buttons, keyboard reachable.
- Copy: concise and confident ("2 pieces need your approval"). No emojis as icons (an emoji in
  a friendly empty-state line is fine). No TODO/lorem/placeholder text.
- Responsive: grid collapses (`grid gap-4 md:grid-cols-2 xl:grid-cols-4` pattern), never
  horizontal page overflow. Use `thin-scroll` class on internal scroll areas.

## Icon caution
lucide-react here does NOT include brand icons (Facebook, Linkedin, Youtube, Instagram, Twitter
are absent — use `PlatformIcon`). Stick to common icons (Plus, Search, Filter, Calendar,
CalendarDays, Clock, Check, CheckCircle2, X, ChevronDown/Right, ArrowUpRight, MoreHorizontal,
Users, User, FileText, Folder, FolderOpen, Download, Upload, Play, Pause, MessageSquare, Send,
Mail, Phone, Star, Zap, Plug, Settings, Receipt, DollarSign, CircleDollarSign, TrendingUp,
BarChart3, Eye, Pencil, Trash2, ExternalLink, Building2, Sparkles, AlertTriangle, Info,
ThumbsUp, RefreshCw, LayoutGrid, List, Kanban, GripVertical, PanelRight, CloudUpload, Video,
Image, Film, Globe, Link2, Lock, ShieldCheck, BadgeCheck, PartyPopper, Rocket, Timer, History).
If unsure whether an icon exists, pick from this list. Verify with `npx tsc --noEmit`.

## Demo-story consistency (do not invent conflicting records)
Star entities that must stay consistent: client **ABC Fitness** (contact Sarah Mitchell, AM
Olivia Chen), project **September Organic Social**, content **Father's Day Gym Challenge**
(id `fathers-day-gym-challenge`, Instagram Reel, v3, in Client Review), invoice
**INV-2026-1048** (id `inv-1048`, paid). Link to them wherever natural:
`/content/fathers-day-gym-challenge`, `/invoices/inv-1048`, `/clients/abc-fitness`,
`/projects/september-organic-abc`.

## Quality bar
- `npx tsc --noEmit` must pass when you finish. Fix ALL errors you introduce.
- No console.log, no unused imports, keys on all lists, no hydration hazards
  (no `Date.now()`/`Math.random()` in render paths — the demo "now" is fixed data).
- Every button visible on screen must do something (navigate, open a dialog/drawer, mutate
  the store, or show a labelled demo toast). No dead CTAs.
