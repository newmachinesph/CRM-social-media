"use client";

import Link from "next/link";
import { CheckCircle2, Eye, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentThumb } from "@/components/shared/content-thumb";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PortalStatusChip } from "@/components/portal/core-status";
import { client } from "@/data/clients";
import { compact, fmtDayDate } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";
import type { ContentItem, ContentStatus } from "@/lib/types";

const TABS: { value: string; label: string; status: ContentStatus; empty: [string, string] }[] = [
  {
    value: "needs-approval",
    label: "Needs Approval",
    status: "Client Review",
    empty: ["No content awaiting approval 🎉", "Everything has been reviewed."],
  },
  {
    value: "approved",
    label: "Approved",
    status: "Approved",
    empty: ["Nothing approved just now", "Content you approve will appear here."],
  },
  {
    value: "scheduled",
    label: "Scheduled",
    status: "Scheduled",
    empty: ["Nothing scheduled yet", "Approved content lands here once it's booked in."],
  },
  {
    value: "published",
    label: "Published",
    status: "Published",
    empty: ["Nothing published yet", "Your live content and its results will appear here."],
  },
];

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Link
      href={`/portal/content/${item.id}`}
      className="group block rounded-xl border bg-card p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <ContentThumb item={item} />
      <div className="mt-3 space-y-1.5 px-0.5">
        <PortalStatusChip status={item.status} />
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">
          {item.type} · {fmtDayDate(item.publishedDate ?? item.scheduledDate)}
        </p>
        {item.status === "Published" && item.metrics && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="size-3.5" /> {compact(item.metrics.reach)} reach ·{" "}
            {compact(item.metrics.likes)} likes
          </p>
        )}
      </div>
    </Link>
  );
}

export default function PortalContentPage() {
  const { content, workspace } = useStore();
  const portalClient = client(workspaceClientId(workspace));
  const mine = content.filter((c) => c.clientId === portalClient.id);

  const byStatus = (status: ContentStatus) =>
    mine
      .filter((c) => c.status === status)
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  return (
    <div>
      <PageHeader
        title="Your content"
        description="Review, approve and revisit everything we've made together."
      />
      <Tabs defaultValue="needs-approval">
        <TabsList className="mb-4 h-auto flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {byStatus(tab.status).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => {
          const items = byStatus(tab.status);
          return (
            <TabsContent key={tab.value} value={tab.value}>
              {items.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    tab.value === "needs-approval" ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <Sparkles className="size-5" />
                    )
                  }
                  title={tab.empty[0]}
                  description={tab.empty[1]}
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
