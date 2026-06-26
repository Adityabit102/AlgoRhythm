"use client";

import { motion } from "framer-motion";
import { Showcase } from "@/components/three/Showcase";
import { SearchInput } from "@/components/hero/SearchInput";
import { RegionPills } from "@/components/ui/RegionPill";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { StickerShape } from "@/components/ui/StickerShape";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GrainOverlay } from "@/components/ui/Overlays";
import { InsightTeasers } from "@/components/home/InsightTeasers";
import { RecentFeed } from "@/components/home/RecentFeed";
import { RetroScene } from "@/components/home/RetroScene";
import { VinylRecord2D } from "@/components/home/VinylRecord2D";
import { useRegion } from "@/lib/store";

export default function Home() {
  const { region, setRegion } = useRegion();

  return (
    <main className="flex flex-col">
      {/* ───────────── Hero ───────────── */}
      <section className="grain relative overflow-hidden bg-cobalt text-cream">
        <GrainOverlay />
        {/* 3D backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <Showcase name="wave" className="h-full w-full" />
        </div>

        <StickerShape shape="star" className="absolute left-8 top-28 text-gold" />
        <StickerShape shape="squiggle" className="absolute right-12 top-40 text-mint" />
        <StickerShape shape="note" className="absolute bottom-24 left-1/4 text-coral" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full border-2 border-cream/40 px-4 py-1 font-mono text-xs uppercase tracking-[0.3em]"
          >
            The science behind every hit
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 90, damping: 16 }}
            className="font-display mt-6 text-5xl font-bold leading-[0.92] sm:text-7xl md:text-8xl"
          >
            What makes a song
            <br />a <span className="text-gold">hit?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-xl text-lg text-cream/80"
          >
            Paste any Spotify track. AlgoRhythm scores its hit probability and breaks
            down exactly which features — danceability, timing, momentum — drove the call.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-10 flex w-full flex-col items-center gap-6"
          >
            <SearchInput onDark />
            <RegionPills value={region} onChange={setRegion} />
          </motion.div>
        </div>
      </section>

      <MarqueeStrip text="DANCEABILITY · ENERGY · VALENCE · TEMPO · MOMENTUM · TIMING" />

      {/* ───────────── Insight teasers ───────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <SectionHeading
          index="01"
          kicker="What the data says"
          title="Three patterns hiding in the charts"
          className="mb-10"
        />
        <InsightTeasers />
      </section>

      {/* ───────────── Retro parallax scene (Decathlon-style) ───────────── */}
      <RetroScene />

      {/* ───────────── 3D toolkit band ───────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-4">
        <SectionHeading
          index="02"
          kicker="Built for music"
          title="An interface that sounds like the subject"
          className="mb-10"
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { name: "cassette" as const, label: "Cassette", tone: "bg-mint" },
            { name: "boombox" as const, label: "Boombox", tone: "bg-gold" },
            { name: "headphones" as const, label: "Headphones", tone: "bg-coral" },
          ].map((c) => (
            <div key={c.name} className="pop-card overflow-hidden">
              <Showcase name={c.name} className={`h-60 ${c.tone}`} controls />
              <div className="border-t-2 border-ink px-4 py-3 font-display font-semibold">
                {c.label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-xs text-ink/50">
          drag any panel to spin it · plus a 3D globe on Atlas, a synth on Explore,
          a boombox on Insights and equalizer bars on every prediction
        </p>
      </section>

      {/* ───────────── Recent feed + CTA ───────────── */}
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-24 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            index="03"
            kicker="Live"
            title="Fresh off the model"
            className="mb-6"
          />
          <p className="mb-6 max-w-md text-ink/70">
            Every track anyone analyzes shows up here. Click one to see its full SHAP
            breakdown — or run your own above.
          </p>
          <RecentFeed />
        </div>
        <div className="flex items-center justify-center">
          <VinylRecord2D size={400} className="max-w-full" />
        </div>
      </section>
    </main>
  );
}
