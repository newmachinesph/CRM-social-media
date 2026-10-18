import type { ContentItem } from "@/lib/types";
import { GalleryHorizontalEnd, Image as ImageIcon, Play } from "lucide-react";
import { fmtDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ContentThumbProps {
  item: ContentItem;
  /** aspect class, e.g. "aspect-[4/5]" (default) or "aspect-video" */
  aspect?: string;
  className?: string;
  rounded?: string;
}

/**
 * Tasteful CSS media placeholder: brand-tinted gradient, subtle texture,
 * a play affordance for video and duration chip. No remote images needed.
 */
export function ContentThumb({ item, aspect = "aspect-[4/5]", className, rounded = "rounded-lg" }: ContentThumbProps) {
  const isCarousel = item.type.includes("Carousel");
  return (
    <div
      className={cn(
        "relative w-full select-none overflow-hidden bg-gradient-to-br",
        item.thumbGradient,
        aspect,
        rounded,
        className
      )}
    >
      {/* soft texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.18),transparent_60%)]" />

      {item.isVideo ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm transition-transform group-hover:scale-105">
            <Play className="size-4 fill-white text-white" />
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/50">
          {isCarousel ? <GalleryHorizontalEnd className="size-7" /> : <ImageIcon className="size-7" />}
        </div>
      )}

      {item.isVideo && item.durationSec ? (
        <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {fmtDuration(item.durationSec)}
        </span>
      ) : null}
      {isCarousel ? (
        <span className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          Carousel
        </span>
      ) : null}
    </div>
  );
}
