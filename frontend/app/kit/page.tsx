"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, VerdictBadge } from "@/components/ui/Badge";
import { StickerShape } from "@/components/ui/StickerShape";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCallout } from "@/components/ui/StatCallout";
import { RegionPills } from "@/components/ui/RegionPill";
import { Spinner } from "@/components/ui/Spinner";
import { Tooltip } from "@/components/ui/Tooltip";
import { TrackCard } from "@/components/ui/TrackCard";
import type { Region } from "@/lib/types";

/** Internal component gallery — quick visual smoke test for the UI kit. */
export default function Kit() {
  const [region, setRegion] = useState<Region>("global");
  return (
    <>
      <MarqueeStrip />
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <SectionHeading index="00" kicker="UI Kit" title="Design system smoke test" />

        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="gold">Gold</Button>
          <Button variant="coral">Coral</Button>
          <Button variant="mint">Mint</Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <VerdictBadge verdict="hit" />
          <VerdictBadge verdict="borderline" />
          <VerdictBadge verdict="miss" />
          <Badge tone="cobalt">model v1</Badge>
          <Tooltip content="This is a tooltip">
            <span className="underline">hover me</span>
          </Tooltip>
        </div>

        <RegionPills value={region} onChange={setRegion} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCallout value="2.3×" label="Friday release advantage" tone="cobalt" />
          <StatCallout value="0.55" label="Danceability floor" tone="gold" />
          <StatCallout value="+31%" label="Collabs vs solos" tone="coral" />
          <StatCallout value="0.84" label="Model AUC target" tone="mint" />
        </div>

        <div className="flex gap-6">
          <StickerShape shape="star" className="text-gold" />
          <StickerShape shape="squiggle" className="text-coral" />
          <StickerShape shape="note" className="text-cobalt" />
          <StickerShape shape="zigzag" className="text-mint-deep" />
          <Spinner label="Analyzing…" />
        </div>

        <TrackCard
          track={{
            id: "demo",
            name: "Neon Gravity",
            artist: "Lumen Drift",
            album: "Afterglow",
            release_date: "2024-09-13",
            duration_ms: 198000,
            cover_url: "",
            spotify_url: "#",
          }}
        />
      </main>
    </>
  );
}
