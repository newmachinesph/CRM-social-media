"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, CheckCircle2, ChevronLeft, Clock, History, Search, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentThumb } from "@/components/shared/content-thumb";
import { EmptyState } from "@/components/shared/empty-state";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { CorePlayer } from "@/components/portal/core-player";
import { PortalStatusChip } from "@/components/portal/core-status";
import { client } from "@/data/clients";
import { teamById } from "@/data/users";
import { fmtDate, fmtDayDate, fmtDuration, timeAgo } from "@/lib/format";
import { useStore, workspaceClientId } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function PortalContentDetailPage() {
  const params = useParams<{ id: string }>();
  const { content, workspace, setContentStatus, addContentComment } = useStore();
  const portalClient = client(workspaceClientId(workspace));
  const contact = portalClient.contacts[0];

  const item = content.find((c) => c.id === params.id);
  const duration = item?.durationSec ?? 0;

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [viewVersion, setViewVersion] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [pinTimestamp, setPinTimestamp] = useState(true);
  const [changesOpen, setChangesOpen] = useState(false);
  const [changesText, setChangesText] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);

  // fake playback progress
  useEffect(() => {
    if (!playing || duration === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => Math.min(duration, c + 0.5));
    }, 500);
    return () => clearInterval(timer);
  }, [playing, duration]);

  useEffect(() => {
    if (playing && duration > 0 && current >= duration) setPlaying(false);
  }, [playing, current, duration]);

  if (!item || item.clientId !== portalClient.id) {
    return (
      <EmptyState
        icon={<Search className="size-5" />}
        title="We couldn't find that content"
        description="It may have been moved or it belongs to a different workspace."
        action={
          <Button asChild variant="outline">
            <Link href="/portal/content">Back to your content</Link>
          </Button>
        }
      />
    );
  }

  const markers = item.comments
    .filter((c) => c.timestamp !== undefined)
    .map((c) => c.timestamp as number);
  const viewingOld = viewVersion !== null && viewVersion !== item.version;
  const decided =
    item.status === "Approved" || item.status === "Scheduled" || item.status === "Published";
  const approvedVersion = item.versions.find((v) => v.status === "Approved");

  const seek = (sec: number) => setCurrent(Math.min(duration, Math.max(0, sec)));

  const togglePlay = () => {
    if (!playing && duration > 0 && current >= duration) setCurrent(0);
    setPlaying((p) => !p);
  };

  const sendFeedback = () => {
    const text = feedback.trim();
    if (!text) return;
    addContentComment(item.id, {
      id: `c-${Date.now()}`,
      authorId: null,
      authorName: contact.name,
      timestamp: item.isVideo && pinTimestamp ? Math.round(current) : undefined,
      text,
      date: "2026-08-26T10:16",
    });
    setFeedback("");
    toast("Feedback sent to Northstar");
  };

  const requestChanges = () => {
    const text = changesText.trim();
    if (text) {
      addContentComment(item.id, {
        id: `c-${Date.now()}`,
        authorId: null,
        authorName: contact.name,
        text,
        date: "2026-08-26T10:16",
      });
    }
    setContentStatus(item.id, "Changes Requested");
    setChangesOpen(false);
    setChangesText("");
    toast("Changes requested", { description: "The Northstar team has been notified." });
  };

  const approve = () => {
    setContentStatus(item.id, "Approved");
    setApproveOpen(false);
    toast.success("Content approved", { description: "Northstar Social has been notified." });
  };

  return (
    <div className="space-y-8">
      <Link
        href="/portal/content"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Your content
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Media + feedback thread */}
        <div className="space-y-6">
          <div className="space-y-3">
            {viewingOld && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
                Viewing Version {viewVersion} — this isn&apos;t the latest cut.
              </div>
            )}
            {item.isVideo ? (
              <CorePlayer
                item={item}
                currentSec={current}
                playing={playing}
                markers={markers}
                onTogglePlay={togglePlay}
                onSeek={seek}
                dimmed={viewingOld}
              />
            ) : (
              <div className={cn("transition-opacity", viewingOld && "opacity-60")}>
                <ContentThumb item={item} rounded="rounded-xl" className="shadow-xs" />
              </div>
            )}
          </div>

          {/* Feedback thread */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {item.comments.length > 0 ? (
                <div className="space-y-4">
                  {item.comments.map((comment) => {
                    const teamMember = comment.authorId ? teamById[comment.authorId] : undefined;
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <UserAvatar member={teamMember} name={comment.authorName} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium">{comment.authorName}</span>
                            {comment.timestamp !== undefined && item.isVideo && (
                              <button
                                type="button"
                                onClick={() => seek(comment.timestamp!)}
                                className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
                              >
                                {fmtDuration(comment.timestamp)}
                              </button>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(comment.date)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-foreground/90">{comment.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No feedback yet — tell us what you think below.
                </p>
              )}

              {/* Composer */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex gap-2">
                  <Input
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendFeedback();
                    }}
                    placeholder={
                      item.isVideo
                        ? `Add feedback at ${fmtDuration(Math.round(current))}…`
                        : "Share your feedback…"
                    }
                  />
                  <Button size="icon" onClick={sendFeedback} disabled={!feedback.trim()} aria-label="Send feedback">
                    <Send className="size-4" />
                  </Button>
                </div>
                {item.isVideo && (
                  <button
                    type="button"
                    onClick={() => setPinTimestamp((p) => !p)}
                    aria-pressed={pinTimestamp}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      pinTimestamp
                        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
                        : "border-border text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Clock className="size-3" />
                    {pinTimestamp
                      ? `Pinned to ${fmtDuration(Math.round(current))}`
                      : "Pin to current time"}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <PlatformBadge platform={item.platform} label={item.type} />
              <span className="rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Version {item.version}
              </span>
              <PortalStatusChip status={item.status} />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              {item.status === "Published" && item.publishedDate
                ? `Went live ${fmtDayDate(item.publishedDate)}`
                : `Going live ${fmtDayDate(item.scheduledDate)}`}
            </p>
          </div>

          {/* Caption */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Caption</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm leading-relaxed text-foreground/90">{item.caption}</p>
              {item.hashtags.length > 0 && (
                <p className="text-sm font-medium text-primary">{item.hashtags.join(" ")}</p>
              )}
            </CardContent>
          </Card>

          {/* Version history */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4 text-muted-foreground" /> Version history
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {item.versions.map((v) => {
                const isCurrent = v.number === item.version;
                const selected = viewVersion === null ? isCurrent : viewVersion === v.number;
                return (
                  <button
                    key={v.number}
                    type="button"
                    onClick={() => setViewVersion(isCurrent ? null : v.number)}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                      selected ? "bg-accent" : "hover:bg-accent/50"
                    )}
                  >
                    <span className="text-sm">
                      <span className="font-medium">Version {v.number}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {isCurrent ? "Current" : v.status} · {fmtDate(v.date)}
                      </span>
                    </span>
                    {v.note && (
                      <span className="hidden max-w-[45%] truncate text-xs text-muted-foreground sm:block">
                        {v.note}
                      </span>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Action bar */}
          {decided ? (
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                <p className="text-sm text-muted-foreground">
                  {item.status === "Published" && item.publishedDate
                    ? `Published on ${fmtDate(item.publishedDate)}. Thanks for the approval!`
                    : `Approved${approvedVersion ? ` on ${fmtDate(approvedVersion.date)}` : ""} — going live ${fmtDayDate(item.scheduledDate)}.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="sticky bottom-0 -mx-4 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setChangesOpen(true)}>
                  Request Changes
                </Button>
                <Button className="flex-1" onClick={() => setApproveOpen(true)}>
                  <CheckCircle2 className="size-4" /> Approve Content
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request changes dialog */}
      <Dialog open={changesOpen} onOpenChange={setChangesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request changes</DialogTitle>
            <DialogDescription>
              Tell us what you&apos;d like adjusted and the team will get straight onto it.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={changesText}
            onChange={(e) => setChangesText(e.target.value)}
            placeholder="e.g. Could we try a different opening shot?"
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={requestChanges} disabled={!changesText.trim()}>
              Send request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button onClick={approve}>
              <CheckCircle2 className="size-4" /> Approve Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
