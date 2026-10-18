"use client";

// Lightweight in-memory demo store with localStorage persistence.
// Holds only the entities the demo can mutate; static reference data
// (clients, projects, files, reports, ...) is imported directly from /data.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Automation,
  ContentComment,
  ContentItem,
  ContentStatus,
  Contract,
  Integration,
  Invoice,
  Lead,
  LeadStage,
  NotificationItem,
  Task,
  TaskStatus,
  WorkspaceId,
} from "@/lib/types";
import { content as seedContent } from "@/data/content";
import { tasks as seedTasks } from "@/data/tasks";
import { leads as seedLeads } from "@/data/leads";
import { notifications as seedNotifications } from "@/data/notifications";
import { automations as seedAutomations, integrations as seedIntegrations } from "@/data/automations";
import { invoices as seedInvoices } from "@/data/invoices";
import { contracts as seedContracts } from "@/data/contracts";

const STORAGE_KEY = "northstar-demo-v1";

interface DemoState {
  content: ContentItem[];
  tasks: Task[];
  leads: Lead[];
  notifications: NotificationItem[];
  automations: Automation[];
  integrations: Integration[];
  invoices: Invoice[];
  contracts: Contract[];
  workspace: WorkspaceId;
  presentationMode: boolean;
}

function seedState(): DemoState {
  return {
    content: seedContent,
    tasks: seedTasks,
    leads: seedLeads,
    notifications: seedNotifications,
    automations: seedAutomations,
    integrations: seedIntegrations,
    invoices: seedInvoices,
    contracts: seedContracts,
    workspace: "agency",
    presentationMode: false,
  };
}

interface StoreApi extends DemoState {
  /** true once localStorage has been read (avoids hydration mismatch) */
  hydrated: boolean;

  setWorkspace: (w: WorkspaceId) => void;
  setPresentationMode: (on: boolean) => void;
  resetDemo: () => void;

  setContentStatus: (id: string, status: ContentStatus) => void;
  addContentComment: (id: string, comment: ContentComment) => void;
  createContent: (item: ContentItem) => void;

  setTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  createTask: (task: Task) => void;

  setLeadStage: (id: string, stage: LeadStage) => void;
  createLead: (lead: Lead) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  toggleAutomation: (id: string) => void;
  setIntegrationConnected: (id: string, connected: boolean) => void;

  payInvoice: (id: string) => void;
  signContract: (id: string, signerName: string, signerRole: string) => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(seedState);
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<DemoState>;
        setState((s) => ({ ...s, ...saved }));
      }
    } catch {
      // corrupt storage — ignore and use seed data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full/unavailable — demo continues in memory
    }
  }, [state, hydrated]);

  const api = useMemo<StoreApi>(() => {
    const patch = (p: Partial<DemoState>) => setState((s) => ({ ...s, ...p }));

    return {
      ...state,
      hydrated,

      setWorkspace: (workspace) => patch({ workspace }),
      setPresentationMode: (presentationMode) => patch({ presentationMode }),
      resetDemo: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        setState(seedState());
      },

      setContentStatus: (id, status) =>
        setState((s) => ({
          ...s,
          content: s.content.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      addContentComment: (id, comment) =>
        setState((s) => ({
          ...s,
          content: s.content.map((c) =>
            c.id === id ? { ...c, comments: [...c.comments, comment] } : c
          ),
        })),
      createContent: (item) =>
        setState((s) => ({ ...s, content: [item, ...s.content] })),

      setTaskStatus: (id, status) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),
      updateTask: (id, p) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...p } : t)),
        })),
      createTask: (task) => setState((s) => ({ ...s, tasks: [task, ...s.tasks] })),

      setLeadStage: (id, stage) =>
        setState((s) => ({
          ...s,
          leads: s.leads.map((l) =>
            l.id === id ? { ...l, stage, daysInStage: 0 } : l
          ),
        })),
      createLead: (lead) => setState((s) => ({ ...s, leads: [lead, ...s.leads] })),

      markNotificationRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        })),
      markAllNotificationsRead: () =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((notif) => ({ ...notif, read: true })),
        })),

      toggleAutomation: (id) =>
        setState((s) => ({
          ...s,
          automations: s.automations.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          ),
        })),
      setIntegrationConnected: (id, connected) =>
        setState((s) => ({
          ...s,
          integrations: s.integrations.map((i) =>
            i.id === id
              ? { ...i, connected, lastSync: connected ? "just now" : undefined }
              : i
          ),
        })),

      payInvoice: (id) =>
        setState((s) => ({
          ...s,
          invoices: s.invoices.map((inv) =>
            inv.id === id
              ? { ...inv, status: "Paid", paidDate: "2026-08-26", myobSynced: true }
              : inv
          ),
        })),
      signContract: (id, signerName, signerRole) =>
        setState((s) => ({
          ...s,
          contracts: s.contracts.map((c) =>
            c.id === id
              ? { ...c, status: "Signed", signedDate: "2026-08-26", signerName, signerRole }
              : c
          ),
        })),
    };
  }, [state, hydrated]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Maps a portal workspace to its client id. */
export function workspaceClientId(w: WorkspaceId): string {
  return w === "agency" ? "abc-fitness" : w;
}
