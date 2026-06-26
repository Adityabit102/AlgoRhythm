"use client";

import type { PredictionResponse } from "@/lib/types";
import { TrackCard } from "@/components/ui/TrackCard";
import { VerdictBadge, Badge } from "@/components/ui/Badge";
import { ProbabilityArc } from "./ProbabilityArc";

export function PredictionCard({ data }: { data: PredictionResponse }) {
  const p = data.prediction;
  return (
    <div className="pop-card grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <VerdictBadge verdict={p.verdict} />
          <Badge tone="cobalt">{p.confidence} confidence</Badge>
          <Badge tone="ink">top {100 - p.percentile}%</Badge>
        </div>
        <TrackCard track={data.track} />
        <div className="flex flex-wrap gap-4 font-mono text-xs text-ink/50">
          <span>model {data.model_version}</span>
          <span>· {data.inference_time_ms} ms</span>
          <a
            href={data.track.spotify_url}
            target="_blank"
            rel="noreferrer"
            className="text-cobalt underline"
          >
            open in Spotify ↗
          </a>
        </div>
      </div>
      <div className="flex justify-center md:justify-end">
        <ProbabilityArc value={p.hit_probability} />
      </div>
    </div>
  );
}
