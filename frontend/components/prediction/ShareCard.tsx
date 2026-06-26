"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import type { PredictionResponse } from "@/lib/types";
import { VerdictBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/** Renders an OG-style share card and exports it as a downloadable PNG. */
export function ShareCard({ data }: { data: PredictionResponse }) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `algorhythm-${data.track.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={ref}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-ink bg-cobalt p-8 text-cream"
      >
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-cream/60">
          Analyzed by AlgoRhythm
        </div>
        <div className="mt-4 font-display text-3xl font-bold leading-tight">
          {data.track.name}
        </div>
        <div className="text-cream/70">{data.track.artist}</div>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="font-display text-6xl font-bold text-gold">
              {Math.round(data.prediction.hit_probability * 100)}%
            </div>
            <div className="font-mono text-xs text-cream/60">hit probability</div>
          </div>
          <VerdictBadge verdict={data.prediction.verdict} />
        </div>
      </div>
      <Button variant="gold" onClick={download}>
        {busy ? "Rendering…" : "Download share card"}
      </Button>
    </div>
  );
}
