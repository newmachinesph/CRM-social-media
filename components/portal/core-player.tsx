"use client";

import { Pause, Play } from "lucide-react";
import { ContentThumb } from "@/components/shared/content-thumb";
import { fmtDuration } from "@/lib/format";
import type { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CorePlayerProps {
  item: ContentItem;
  currentSec: number;
  playing: boolean;
  /** comment timestamps (seconds) shown as amber markers on the timeline */
  markers: number[];
  onTogglePlay: () => void;
  onSeek: (sec: number) => void;
  /** true while an older version is being "viewed" */
  dimmed?: boolean;
}

/**
 * Simulated vertical reel player for the client review experience.
 * No real media — progress is driven by the parent's interval.
 */
export function CorePlayer({
  item,
  currentSec,
  playing,
  markers,
  onTogglePlay,
  onSeek,
  dimmed = false,
}: CorePlayerProps) {
  const duration = item.durationSec ?? 0;
  const pct = duration > 0 ? Math.min(100, (currentSec / duration) * 100) : 0;

  const seekFromPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(Math.round(ratio * duration));
  };

  return (
    <div className={cn("mx-auto w-full max-w-[304px] transition-opacity", dimmed && "opacity-60")}>
      <div className="group relative overflow-hidden rounded-xl shadow-xs">
        <ContentThumb item={item} aspect="aspect-[9/16]" rounded="rounded-xl" className="max-h-[540px]" />

        {/* play / pause overlay */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="absolute inset-0 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all",
              playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            )}
          >
            {playing ? (
              <Pause className="size-6 fill-current" />
            ) : (
              <Play className="size-6 translate-x-0.5 fill-current" />
            )}
          </span>
        </button>

        {/* scrubber */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
          <div
            role="slider"
            aria-label="Video timeline"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={Math.round(currentSec)}
            tabIndex={0}
            onClick={seekFromPointer}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") onSeek(Math.min(duration, currentSec + 5));
              if (e.key === "ArrowLeft") onSeek(Math.max(0, currentSec - 5));
            }}
            className="relative h-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            {/* track */}
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* comment markers */}
            {duration > 0 &&
              markers.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={`Jump to feedback at ${fmtDuration(t)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(t);
                  }}
                  className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-amber-400 transition-transform hover:scale-125"
                  style={{ left: `${(t / duration) * 100}%` }}
                />
              ))}
          </div>
          <p className="mt-1 font-mono text-[11px] font-medium text-white/90">
            {fmtDuration(Math.round(currentSec))} / {fmtDuration(duration)}
          </p>
        </div>
      </div>
    </div>
  );
}
