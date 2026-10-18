"use client";

import { useMemo, useState } from "react";
import { Film, Search } from "lucide-react";
import type { ContentItem, ContentStatus, ContentType, Platform } from "@/lib/types";
import { useStore } from "@/lib/store";
import { clients, clientById } from "@/data/clients";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ContentCard } from "@/components/content/content-card";
import { NewContentDrawer } from "@/components/content/new-content-drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORMS: Platform[] = ["Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube"];

const CONTENT_TYPES: ContentType[] = [
  "Instagram Reel",
  "Instagram Carousel",
  "Instagram Story",
  "TikTok",
  "Facebook Post",
  "LinkedIn Post",
  "YouTube Short",
];

const TABS: { value: string; label: string; status?: ContentStatus }[] = [
  { value: "all", label: "All Content" },
  { value: "internal", label: "Needs Review", status: "Internal Review" },
  { value: "client", label: "Client Review", status: "Client Review" },
  { value: "changes", label: "Changes Requested", status: "Changes Requested" },
  { value: "approved", label: "Approved", status: "Approved" },
  { value: "scheduled", label: "Scheduled", status: "Scheduled" },
  { value: "published", label: "Published", status: "Published" },
];

const EMPTY_COPY: Record<string, { title: string; description: string }> = {
  all: {
    title: "No content matches your filters",
    description: "Try a different search or clear the client, platform and type filters.",
  },
  internal: {
    title: "Nothing waiting on the team",
    description: "No content is sitting in internal review right now.",
  },
  client: {
    title: "No content awaiting approval 🎉",
    description: "Everything has been reviewed.",
  },
  changes: {
    title: "No changes requested",
    description: "No client feedback is waiting on a re-edit.",
  },
  approved: {
    title: "Nothing approved yet",
    description: "Approved content will land here, ready to schedule.",
  },
  scheduled: {
    title: "Nothing scheduled",
    description: "Approved content with a publish slot will appear here.",
  },
  published: {
    title: "Nothing published yet",
    description: "Published content and its performance will show here.",
  },
};

export default function ContentPage() {
  const store = useStore();
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return store.content.filter((c) => {
      if (clientFilter !== "all" && c.clientId !== clientFilter) return false;
      if (platformFilter !== "all" && c.platform !== platformFilter) return false;
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (
        q &&
        !c.title.toLowerCase().includes(q) &&
        !c.campaign.toLowerCase().includes(q) &&
        !(clientById[c.clientId]?.name.toLowerCase().includes(q) ?? false)
      )
        return false;
      return true;
    });
  }, [store.content, search, clientFilter, platformFilter, typeFilter]);

  const byTab = (tab: (typeof TABS)[number]): ContentItem[] =>
    tab.status ? filtered.filter((c) => c.status === tab.status) : filtered;

  return (
    <div>
      <PageHeader
        title="Content"
        description="Every piece of content across every client."
        actions={<NewContentDrawer />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content…"
            className="pl-8"
            aria-label="Search content"
          />
        </div>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger aria-label="Filter by client">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger aria-label="Filter by platform">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger aria-label="Filter by content type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {CONTENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <div className="thin-scroll overflow-x-auto">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                  {byTab(tab).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {TABS.map((tab) => {
          const items = byTab(tab);
          const empty = EMPTY_COPY[tab.value];
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {items.length === 0 ? (
                <EmptyState
                  icon={<Film className="size-5" />}
                  title={empty.title}
                  description={empty.description}
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
