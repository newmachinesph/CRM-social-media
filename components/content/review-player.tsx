"use client";

import { Pause, Play } from "lucide-react";
import type { ContentItem } from "@/lib/types";
import { ContentThumb } from "@/components/shared/content-thumb";
import { Button } from "@/components/ui/button";
import { fmtDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ReviewPlayerProps {
  item: ContentItem;
  currentTime: number;
  playing: boolean;
  /** dim the media when an older version is being viewed */
  dimmed?: boolean;
  onSeek: (seconds: number) => void;
  onTogglePlay: () => void;
}

/** Simulated vertical reel player with a scrubbable timeline and comment markers. */
export function ReviewPlayer({
  item,
  currentTime,
  playing,
  dimmed = false,
  onSeek,
  onTogglePlay,
}: ReviewPlayerProps) {
  const duration = item.durationSec ?? 0;
  const pct = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const markers = item.comments.filter((c) => c.timestamp != null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    onSeek(ratio * duration);
  };

  return (
    <div>
      <div
        className={cn(
          "group mx-auto w-full max-w-[315px] transition-opacity",
          dimmed && "opacity-60"
        )}
      >
        <ContentThumb item={item} aspect="aspect-[9/16]" rounded="rounded-xl" className="max-h-[560px]" />
      </div>

      <div className="mx-auto mt-4 flex max-w-xl items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          className="shrink-0 rounded-full"
          aria-label={playing ? "Pause" : "Play"}
          onClick={onTogglePlay}
        >
          {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
        </Button>

        <div
          className="relative flex-1 cursor-pointer py-3"
          onClick={handleTimelineClick}
          role="slider"
          aria-label="Playback position"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={Math.floor(currentTime)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") onSeek(Math.min(currentTime + 5, duration));
            if (e.key === "ArrowLeft") onSeek(Math.max(currentTime - 5, 0));
          }}
        >
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          {duration > 0 &&
            markers.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Comment from ${c.authorName} at ${fmtDuration(c.timestamp!)}`}
                title={`${c.authorName} · ${fmtDuration(c.timestamp!)}`}
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 ring-2 ring-background transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-ring"
                style={{ left: `${(c.timestamp! / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(c.timestamp!);
                }}
              />
            ))}
        </div>

        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {fmtDuration(Math.floor(currentTime))} / {fmtDuration(duration)}
        </span>
      </div>
    </div>
  );
}
