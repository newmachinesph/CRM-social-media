"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { ContentItem, ContentType, Platform } from "@/lib/types";
import { useStore } from "@/lib/store";
import { clients, clientById } from "@/data/clients";
import { team } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformBadge } from "@/components/shared/platform-badge";

const CONTENT_TYPES: ContentType[] = [
  "Instagram Reel",
  "Instagram Carousel",
  "Instagram Story",
  "TikTok",
  "Facebook Post",
  "LinkedIn Post",
  "YouTube Short",
];

const TYPE_PLATFORM: Record<ContentType, Platform> = {
  "Instagram Reel": "Instagram",
  "Instagram Carousel": "Instagram",
  "Instagram Story": "Instagram",
  TikTok: "TikTok",
  "Facebook Post": "Facebook",
  "LinkedIn Post": "LinkedIn",
  "YouTube Short": "YouTube",
};

const VIDEO_TYPES: ContentType[] = ["Instagram Reel", "TikTok", "YouTube Short"];

export function NewContentDrawer() {
  const store = useStore();
  const [open, setOpen] = useState(false);

  const [clientId, setClientId] = useState("");
  const [campaign, setCampaign] = useState("");
  const [type, setType] = useState<ContentType | "">("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [publishDate, setPublishDate] = useState("2026-09-01");
  const [publishTime, setPublishTime] = useState("09:00");
  const [assigneeId, setAssigneeId] = useState("olivia");
  const [approvalRequired, setApprovalRequired] = useState(true);

  const platform = type ? TYPE_PLATFORM[type] : undefined;
  const canCreate = clientId !== "" && type !== "" && title.trim() !== "";

  const reset = () => {
    setClientId("");
    setCampaign("");
    setType("");
    setTitle("");
    setCaption("");
    setPublishDate("2026-09-01");
    setPublishTime("09:00");
    setAssigneeId("olivia");
    setApprovalRequired(true);
  };

  const handleCreate = () => {
    if (!canCreate || !type) return;
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const item: ContentItem = {
      id: `${slug || "content"}-${store.content.length + 1}`,
      title: title.trim(),
      clientId,
      campaign: campaign.trim() || "September Organic Social",
      platform: TYPE_PLATFORM[type],
      type,
      status: approvalRequired ? "Internal Review" : "Draft",
      ownerId: assigneeId,
      scheduledDate: `${publishDate}T${publishTime}`,
      caption: caption.trim(),
      hashtags: [],
      version: 1,
      versions: [
        { number: 1, date: "2026-08-26", status: "Current", note: "Created in Northstar." },
      ],
      comments: [],
      thumbGradient: "from-indigo-400 via-violet-500 to-purple-600",
      isVideo: VIDEO_TYPES.includes(type),
    };
    store.createContent(item);
    toast.success("Content created", {
      description: `"${item.title}" added for ${clientById[clientId]?.name ?? "client"}.`,
    });
    reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          New Content
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New content</SheetTitle>
          <SheetDescription>Brief a new piece of content for a client.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="nc-client">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="nc-client" className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nc-campaign">Campaign</Label>
            <Input
              id="nc-campaign"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. September Organic Social"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nc-type">Content type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ContentType)}>
                <SelectTrigger id="nc-type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="flex h-8 items-center rounded-lg border border-input px-2.5">
                {platform ? (
                  <PlatformBadge platform={platform} />
                ) : (
                  <span className="text-xs text-muted-foreground">Auto from type</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nc-title">Title</Label>
            <Input
              id="nc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spring Launch Teaser"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nc-caption">Caption</Label>
            <Textarea
              id="nc-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="First draft of the caption…"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nc-date">Publish date</Label>
              <Input
                id="nc-date"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nc-time">Time</Label>
              <Input
                id="nc-time"
                type="time"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nc-assignee">Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger id="nc-assignee" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {team.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} · {m.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="nc-approval" className="text-sm font-medium">
                Approval required
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Route through internal review before the client sees it.
              </p>
            </div>
            <Switch
              id="nc-approval"
              checked={approvalRequired}
              onCheckedChange={setApprovalRequired}
            />
          </div>
        </div>

        <SheetFooter className="flex-row justify-end border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate}>
            Create content
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
