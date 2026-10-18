# Northstar Social — Agency OS Demo

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)

**Social, content & growth — beautifully managed.**

A frontend-only Next.js prototype of an agency operating system for a fictional
Sydney social media agency, Northstar Social: an agency workspace (CRM, pipeline,
projects, content review, invoicing, reporting) plus a simpler client portal. It is
for agencies and builders who want a clickable reference for a custom client
portal. Everything runs on typed mock data in the browser: there is no backend.

**What's in it:** the **Agency Operating System** covers CRM, sales pipeline, client management,
onboarding, projects, tasks, content production workflow, Frame.io-style video
review with timestamped feedback, content calendar, invoicing (MYOB representation),
contracts & e-signatures, reporting, automations, integrations — plus a dramatically
simpler **Client Portal** with content approvals, payments, agreements and reports.

Built as a working product concept to demo to prospective clients as a custom
alternative to generic client-portal software.

## Stack

- [Next.js 16.3](https://nextjs.org) (App Router) · React 19 · TypeScript
- Tailwind CSS v4 · [shadcn/ui](https://ui.shadcn.com) · Lucide icons
- Recharts (charts) · Sonner (toasts) · date-fns · cmdk (command palette) · vaul (drawers)

## Getting started

Requires Node.js 20.9 or newer (Next.js 16).

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll land in the agency workspace (`/dashboard`).

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint (`eslint-config-next`) |
| `npx tsc --noEmit` | Type-check (no script; used as the quality bar in [`CONVENTIONS.md`](CONVENTIONS.md)) |

There is no automated test suite.

## Demo architecture — everything is mocked

There is **no backend**: no database, no auth, no API routes, no real integrations.

- All records live in typed mock data under [`/data`](data) (clients, leads,
  projects, tasks, content, invoices, contracts, files, reports, notifications,
  activities, automations, conversations). Dates centre on **August 2026**; the
  in-app "today" is 26 Aug 2026.
- Interactive state (approving content, moving pipeline cards, task statuses,
  paying invoices, signing agreements, toggling automations, switching
  workspaces…) runs through a lightweight client store
  ([`lib/store.tsx`](lib/store.tsx)) persisted to `localStorage`.
- Integrations (MYOB, Google Workspace, Dropbox, Meta, TikTok…) are purely
  visual simulations — buttons change UI state and show toasts, nothing calls
  a real API.
- **Reset Demo Data** lives in Settings → Agency (and the user menu), clearing
  `localStorage` back to the seed data.

## Switching experiences

Use the **Demo view** switcher in the sidebar footer (or the avatar menu in the
portal) to jump between:

- **Northstar Social — Agency** → the full agency workspace
- **ABC Fitness / Harbour Dental / Solace Skin — Client** → the client portal
  (`/portal`) as that client

**Presentation mode** (avatar menu) hides demo labels and controls for clean
screen-sharing.

## The demo story

One coherent narrative runs through every module:

| Entity | Where it appears |
|---|---|
| **ABC Fitness** (client, contact Sarah Mitchell, AM Olivia Chen) | Clients, portal, invoices, reports |
| **Father's Day Gym Challenge** (Instagram Reel, v3, in client review) | Content hub, review screen, calendar, portal approvals, activity |
| **September Organic Social** (active project) | Projects, client profile, portal |
| **INV-2026-1048** ($6,050 inc GST, paid, MYOB-synced) | Invoices, client profile, portal, dashboard activity |
| **Bondi Wellness Co.** (deal won → onboarding) | Pipeline, onboarding, contracts |

Suggested walkthrough: Dashboard → Pipeline (drag a deal to Won) → Onboarding →
Content hub → Father's Day Gym Challenge (timestamped review) → switch to the
ABC Fitness portal → approve the reel → pay an invoice → Reports.

## Project structure

```
app/
  (agency)/        dashboard, inbox, leads, pipeline, clients, onboarding,
                   projects, tasks, content, calendar, files, invoices,
                   contracts, reports, automations, integrations, settings
  portal/          client portal: home, content, calendar, projects, files,
                   invoices, agreements, reports, support
components/
  layout/          shells, sidebar, topbar, command palette, switchers
  shared/          design system: status badges, KPI cards, avatars, thumbs…
  ui/              shadcn/ui primitives
  <feature>/       feature-private components (crm, content, portal, …)
data/              all mock data (typed)
lib/               types, store, formatting helpers
```

Build conventions for contributors (and coding agents) are in
[`CONVENTIONS.md`](CONVENTIONS.md).

## Notes

- ⌘K / Ctrl+K opens the global command palette (search clients, content,
  invoices, leads, pages).
- All contract/invoice text is sample interface content, not legal or financial
  advice; ABNs, phone numbers and addresses are fictional.

## License

[MIT](LICENSE) © 2026 Northstar Social. Northstar Social is a fictional agency
created for this demo.
