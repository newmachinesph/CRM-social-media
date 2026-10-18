"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Copy,
  Film,
  History,
  MessageSquare,
  Pencil,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import type { ContentStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { clientById } from "@/data/clients";
import { member } from "@/data/users";
import { projectById } from "@/data/projects";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ContentThumb } from "@/components/shared/content-thumb";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClientLogo } from "@/components/shared/client-logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { ReviewPlayer } from "@/components/content/review-player";
import { VersionHistory } from "@/components/content/version-history";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compact, fmtDate, fmtDateTime, fmtDuration, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

const ALL_STATUSES: ContentStatus[] = [
  "Idea",
  "Draft",
  "Internal Review",
  "Client Review",
  "Changes Requested",
  "Approved",
  "Scheduled",
  "Published",
];

/** 7 -> "00:07" */
function fmtStamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useStore();
  const item = store.content.find((c) => c.id === params.id);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewingVersion, setViewingVersion] = useState<number | null>(null);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [changesOpen, setChangesOpen] = useState(false);
  const [changesReason, setChangesReason] = useState("");

  const duration = item?.durationSec ?? 0;

  // ponytail: fake playback — advance a clock, clamp to duration
  useEffect(() => {
    if (!playing || duration <= 0) return;
    const id = setInterval(() => {
      setCurrentTime((t) => Math.min(t + 0.25, duration));
    }, 250);
    return () => clearInterval(id);
  }, [playing, duration]);

  useEffect(() => {
    if (playing && currentTime >= duration) setPlaying(false);
  }, [playing, currentTime, duration]);

  if (!item) {
    return (
      <EmptyState
        icon={<Film className="size-5" />}
        title="Content not found"
        description="This piece of content doesn't exist or was removed."
        action={
          <Button asChild variant="outline">
            <Link href="/content">Back to content</Link>
          </Button>
        }
      />
    );
  }

  const client = clientById[item.clientId];
  const owner = member(item.ownerId);
  const project = item.projectId ? projectById[item.projectId] : undefined;
  const viewing = viewingVersion ?? item.version;
  const viewingOld = viewing < item.version;

  const seek = (t: number) => setCurrentTime(Math.min(Math.max(t, 0), duration));

  const togglePlay = () => {
    if (!playing && currentTime >= duration) setCurrentTime(0);
    setPlaying((p) => !p);
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(
        [item.caption, item.hashtags.join(" ")].filter(Boolean).join("\n\n")
      );
      toast.success("Caption copied");
    } catch {
      toast.error("Couldn't copy caption");
    }
  };

  const sendComment = () => {
    const text = commentText.trim();
    if (!text) return;
    store.addContentComment(item.id, {
      id: `c-${Date.now()}`,
      authorId: "olivia",
      authorName: "Olivia Chen",
      timestamp: item.isVideo && includeTimestamp ? Math.floor(currentTime) : undefined,
      text,
      date: "2026-08-26T10:16",
    });
    setCommentText("");
    toast.success("Comment added");
  };

  const requestChanges = () => {
    const reason = changesReason.trim();
    if (!reason) return;
    store.setContentStatus(item.id, "Changes Requested");
    store.addContentComment(item.id, {
      id: `c-${Date.now()}`,
      authorId: "olivia",
      authorName: "Olivia Chen",
      text: reason,
      date: "2026-08-26T10:16",
    });
    setChangesOpen(false);
    setChangesReason("");
    toast.success("Changes requested", {
      description: "The feedback has been added and the team notified.",
    });
  };

  const approve = () => {
    store.setContentStatus(item.id, "Approved");
    setApproveOpen(false);
    toast.success("Content approved", {
      description: "Northstar Social has been notified.",
    });
  };

  const activity = [
    ...item.versions.map((v) => ({
      key: `v${v.number}`,
      date: v.date,
      text: `${owner.name} uploaded Version ${v.number}`,
      note: v.note,
    })),
    ...item.comments.map((c) => ({
      key: c.id,
      date: c.date,
      text: `${c.authorName} commented`,
      note: c.text,
    })),
    ...(item.publishedDate
      ? [{ key: "published", date: item.publishedDate, text: "Published to " + item.platform, note: "" }]
      : []),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader
        title={item.title}
        description={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link href="/content" className="text-muted-foreground hover:text-foreground">
              Content
            </Link>
            <span aria-hidden>/</span>
            <span>{item.campaign}</span>
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Media / review column ─────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {viewingOld ? (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
              <History className="size-3.5" />
              Viewing Version {viewing} — read only
            </div>
          ) : null}

          <Card>
            <CardContent className="pt-6">
              {item.isVideo ? (
                <ReviewPlayer
                  item={item}
                  currentTime={currentTime}
                  playing={playing}
                  dimmed={viewingOld}
                  onSeek={seek}
                  onTogglePlay={togglePlay}
                />
              ) : (
                <div
                  className={cn(
                    "group relative mx-auto w-full max-w-md transition-opacity",
                    viewingOld && "opacity-60"
                  )}
                >
                  <ContentThumb item={item} aspect="aspect-square" rounded="rounded-xl" />
                  <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="line-clamp-2 text-xs text-white/90">{item.caption}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Caption */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm">Caption</CardTitle>
              <Button variant="ghost" size="sm" onClick={copyCaption}>
                <Copy />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{item.caption}</p>
              {item.hashtags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.hashtags.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="comments">
                <TabsList>
                  <TabsTrigger value="comments">
                    Comments
                    <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                      {item.comments.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="versions">Versions</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="mt-4 space-y-4">
                  {item.comments.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No feedback yet. Be the first to comment.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {item.comments.map((c) => (
                        <li key={c.id} className="flex gap-3">
                          {c.authorId ? (
                            <UserAvatar member={member(c.authorId)} size="sm" />
                          ) : (
                            <UserAvatar name={c.authorName} size="sm" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium">{c.authorName}</span>
                              {c.timestamp != null && item.isVideo ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    seek(c.timestamp!);
                                    setPlaying(false);
                                  }}
                                  className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
                                  aria-label={`Jump to ${fmtStamp(c.timestamp)}`}
                                >
                                  {fmtStamp(c.timestamp)}
                                </button>
                              ) : null}
                              <span className="text-xs text-muted-foreground">{timeAgo(c.date)}</span>
                            </div>
                            <p className="mt-0.5 text-sm text-foreground/90">{c.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Separator />

                  <div className="flex items-center gap-2">
                    {item.isVideo ? (
                      <button
                        type="button"
                        onClick={() => setIncludeTimestamp((v) => !v)}
                        aria-pressed={includeTimestamp}
                        aria-label={
                          includeTimestamp
                            ? "Timestamp will be attached — click to remove"
                            : "Attach current time to comment"
                        }
                        className={cn(
                          "shrink-0 rounded-md border px-2 py-1.5 font-mono text-[11px] font-medium transition-colors",
                          includeTimestamp
                            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
                            : "border-input text-muted-foreground line-through"
                        )}
                      >
                        {fmtStamp(currentTime)}
                      </button>
                    ) : null}
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendComment();
                      }}
                      placeholder={
                        item.isVideo
                          ? `Add feedback at ${fmtDuration(Math.floor(currentTime))}…`
                          : "Add feedback…"
                      }
                      aria-label="Add a comment"
                    />
                    <Button
                      size="icon"
                      onClick={sendComment}
                      disabled={!commentText.trim()}
                      aria-label="Send comment"
                    >
                      <Send />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="versions" className="mt-4">
                  <VersionHistory
                    versions={item.versions}
                    viewing={viewing}
                    onSelect={setViewingVersion}
                  />
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <ul className="space-y-3">
                    {activity.map((a) => (
                      <li key={a.key} className="flex gap-3 text-sm">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border" />
                        <div className="min-w-0">
                          <p className="text-foreground/90">
                            {a.text}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {fmtDate(a.date)}
                            </span>
                          </p>
                          {a.note ? (
                            <p className="mt-0.5 text-xs text-muted-foreground">{a.note}</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* ── Info sidebar ──────────────────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={item.status} className="px-2.5 py-1 text-xs" />
                <Select
                  value={item.status}
                  onValueChange={(v) => {
                    store.setContentStatus(item.id, v as ContentStatus);
                    toast.success("Status updated");
                  }}
                >
                  <SelectTrigger size="sm" aria-label="Change status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <dl className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Client</dt>
                  <dd>
                    {client ? (
                      <Link
                        href={`/clients/${client.id}`}
                        className="flex items-center gap-2 font-medium hover:underline"
                      >
                        <ClientLogo client={client} size="sm" />
                        {client.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Campaign</dt>
                  <dd className="truncate font-medium">{item.campaign}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Platform</dt>
                  <dd>
                    <PlatformBadge platform={item.platform} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{item.type}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Owner</dt>
                  <dd className="flex items-center gap-2 font-medium">
                    <UserAvatar member={owner} size="xs" />
                    {owner.name}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Scheduled</dt>
                  <dd className="font-medium">{fmtDateTime(item.scheduledDate)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Version</dt>
                  <dd>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      v{item.version}
                    </span>
                  </dd>
                </div>
              </dl>

              {project ? (
                <>
                  <Separator />
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between gap-2 text-sm font-medium hover:underline"
                  >
                    <span className="truncate">{project.name}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Review actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => setApproveOpen(true)}>
                <Check />
                Approve Content
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setChangesOpen(true)}>
                <Pencil />
                Request Changes
              </Button>
              <p className="pt-1 text-center text-xs text-muted-foreground">
                Version {item.version} is being reviewed.
              </p>
            </CardContent>
          </Card>

          {/* Performance */}
          {item.metrics ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-3">
                  {(
                    [
                      ["Reach", item.metrics.reach],
                      ["Likes", item.metrics.likes],
                      ["Comments", item.metrics.comments],
                      ["Shares", item.metrics.shares],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="rounded-lg border bg-muted/30 p-3">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                        {compact(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Approve dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve this content?</DialogTitle>
            <DialogDescription>
              Version {item.version} will be marked as approved and the Northstar team will be
              notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={approve}>Approve Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request changes dialog */}
      <Dialog open={changesOpen} onOpenChange={setChangesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request changes</DialogTitle>
            <DialogDescription>
              Describe what needs to change — it will be added to the feedback thread.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="changes-reason">What needs to change?</Label>
            <Textarea
              id="changes-reason"
              value={changesReason}
              onChange={(e) => setChangesReason(e.target.value)}
              placeholder="e.g. Please swap the end card music and tighten the intro."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={requestChanges} disabled={!changesReason.trim()}>
              <MessageSquare />
              Request Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
