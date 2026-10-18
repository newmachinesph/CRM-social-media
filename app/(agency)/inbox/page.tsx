"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, ExternalLink, Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ClientLogo } from "@/components/shared/client-logo";
import { conversations } from "@/data/conversations";
import { clientById } from "@/data/clients";
import { member } from "@/data/users";
import { aud, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [showThread, setShowThread] = useState(false); // mobile: thread open
  const [readIds, setReadIds] = useState<string[]>([]);
  const [replies, setReplies] = useState<Record<string, Message[]>>({});
  const [draft, setDraft] = useState("");

  const selected =
    conversations.find((c) => c.id === selectedId) ?? conversations[0];
  const client = clientById[selected.clientId];
  const contact =
    client.contacts.find((c) => c.name === selected.contactName) ??
    client.contacts[0];
  const manager = member(client.accountManagerId);
  const messages = [...selected.messages, ...(replies[selected.id] ?? [])];

  const openConversation = (id: string) => {
    setSelectedId(id);
    setShowThread(true);
    setDraft("");
    setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  };

  const sendReply = () => {
    const text = draft.trim();
    if (!text) return;
    const reply: Message = {
      from: "agency",
      authorName: "Olivia Chen",
      text,
      // ponytail: fixed demo timestamp — the demo "now" is 26 Aug 2026
      date: "2026-08-26T09:30",
    };
    setReplies((r) => ({
      ...r,
      [selected.id]: [...(r[selected.id] ?? []), reply],
    }));
    setDraft("");
    toast.success("Reply sent", { description: "Synced to Gmail (demo)." });
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Inbox"
        description="Client conversations, synced from Gmail."
      />

      <div className="flex h-[calc(100dvh-14rem)] min-h-[480px] overflow-hidden rounded-xl border bg-card shadow-xs">
        {/* Conversation list */}
        <aside
          className={cn(
            "w-full shrink-0 flex-col lg:flex lg:w-[280px] lg:border-r",
            showThread ? "hidden" : "flex"
          )}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Conversations</h2>
            <span className="text-xs text-muted-foreground">
              {conversations.length}
            </span>
          </div>
          <ul className="thin-scroll flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const convReplies = replies[conv.id] ?? [];
              const last =
                convReplies[convReplies.length - 1] ??
                conv.messages[conv.messages.length - 1];
              const isUnread = conv.unread && !readIds.includes(conv.id);
              const isSelected = conv.id === selectedId;
              return (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => openConversation(conv.id)}
                    className={cn(
                      "w-full border-b px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                      isSelected && "bg-muted lg:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          isUnread ? "font-semibold" : "font-medium"
                        )}
                      >
                        {conv.contactName}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">
                          {timeAgo(last.date)}
                        </span>
                        {isUnread && (
                          <span
                            className="size-2 rounded-full bg-primary"
                            aria-label="Unread"
                          />
                        )}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {clientById[conv.clientId]?.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-foreground/70">
                      {last.text}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Message thread */}
        <section
          className={cn(
            "min-w-0 flex-1 flex-col lg:flex",
            showThread ? "flex" : "hidden"
          )}
        >
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <button
              type="button"
              aria-label="Back to conversations"
              onClick={() => setShowThread(false)}
              className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted lg:hidden"
            >
              <ChevronLeft className="size-4" />
            </button>
            <UserAvatar name={selected.contactName} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {selected.contactName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {client.name} · {selected.subject}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Mail className="size-3" />
              Synced from Gmail
            </span>
          </div>

          <div className="thin-scroll flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col",
                  m.from === "agency" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%]",
                    m.from === "agency"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted text-foreground"
                  )}
                >
                  {m.text}
                </div>
                <p className="mt-1 px-1 text-[11px] text-muted-foreground">
                  {m.authorName} · {timeAgo(m.date)}
                </p>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendReply();
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Reply to ${selected.contactName}…`}
              aria-label="Reply message"
            />
            <Button type="submit" disabled={!draft.trim()}>
              <Send className="size-4" />
              Send
            </Button>
          </form>
        </section>

        {/* Contact / client details */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-l xl:flex">
          <div className="thin-scroll flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center pb-4 pt-2 text-center">
              <ClientLogo client={client} size="xl" />
              <p className="mt-3 text-sm font-semibold">{client.name}</p>
              <p className="text-xs text-muted-foreground">{client.industry}</p>
              <StatusBadge status={client.status} className="mt-2" />
            </div>

            <Separator />

            <div className="space-y-2 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Primary contact
              </p>
              <div className="flex items-center gap-2.5">
                <UserAvatar name={contact.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{contact.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {contact.role}
                  </p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="size-3.5 shrink-0" />
                {contact.phone}
              </p>
            </div>

            <Separator />

            <div className="space-y-2.5 py-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Account manager
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <UserAvatar member={manager} size="xs" />
                  {manager.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Retainer</span>
                <span className="text-xs font-medium">
                  {aud(client.retainer)}/mo
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 pt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/clients/${client.id}`}>
                  <ExternalLink className="size-3.5" />
                  View client profile
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/content">View content</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/invoices">View invoices</Link>
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
