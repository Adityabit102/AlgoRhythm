"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { TrackMeta } from "@/lib/types";

function fmtDuration(ms: number) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Cover-art fallback when no image: gradient disc with initials. */
function CoverFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cobalt via-electric to-mint">
      <span className="font-display text-2xl font-bold text-cream">{initials}</span>
    </div>
  );
}

export function TrackCard({
  track,
  className,
  compact = false,
}: {
  track: TrackMeta;
  className?: string;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className={cn("pop-card flex items-center gap-4 p-4", className)}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl border-2 border-ink",
          compact ? "h-14 w-14" : "h-20 w-20",
        )}
      >
        {track.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.cover_url}
            alt={track.album}
            className="h-full w-full object-cover"
          />
        ) : (
          <CoverFallback name={track.name} />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-display text-lg font-bold">{track.name}</h3>
        <p className="truncate text-sm text-ink/70">{track.artist}</p>
        {!compact && (
          <p className="mt-1 font-mono text-xs text-ink/50">
            {track.album} · {track.release_date} · {fmtDuration(track.duration_ms)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
