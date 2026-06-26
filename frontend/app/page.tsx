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
import { ScrollDecor } from "@/components/home/ScrollDecor";
import { useRegion } from "@/lib/store";

export default function Home() {
  const { region, setRegion } = useRegion();

  return (
    <main className="flex flex-col">
      {/* ───────────── Hero ───────────── */}
      <section className="grain relative overflow-hidden bg-blush text-ink">
        <GrainOverlay />
        {/* 3D backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-95">
          <Showcase name="wave" className="h-full w-full" />
        </div>

        <StickerShape shape="star" className="absolute left-8 top-16 text-lime" />
        <StickerShape shape="squiggle" className="absolute right-12 top-24 text-jade" />
        <StickerShape shape="note" className="absolute right-10 top-1/2 text-purple" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-10 text-center sm:pb-28 sm:pt-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full border-2 border-ink bg-lime px-4 py-1 font-mono text-xs uppercase tracking-[0.3em] shadow-[var(--shadow-pop-sm)]"
          >
            The science behind every hit
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 90, damping: 16 }}
            className="font-display mt-6 text-5xl font-bold leading-[0.92] [text-shadow:3px_3px_0_var(--color-cream)] sm:text-7xl md:text-8xl"
          >
            What makes a song
            <br />a <span className="text-pink">hit?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-xl text-lg font-medium text-ink/80"
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
            <SearchInput />
            <RegionPills value={region} onChange={setRegion} />
          </motion.div>
        </div>
      </section>

      <MarqueeStrip text="DANCEABILITY · ENERGY · VALENCE · TEMPO · MOMENTUM · TIMING" />

      {/* ───────────── Insight teasers (with scroll-by cassette) ───────────── */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <ScrollDecor
          name="cassette"
          className="-right-10 top-0 hidden h-72 w-72 opacity-90 lg:block"
        />
        <div className="relative z-10">
          <SectionHeading
            index="01"
            kicker="What the data says"
            title="Three patterns hiding in the charts"
            className="mb-10"
          />
          <InsightTeasers />
        </div>
      </section>

      {/* ───────────── Retro parallax scene (Decathlon-style) ───────────── */}
      <RetroScene />

      {/* ───────────── Floating boombox band ───────────── */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-24">
        <ScrollDecor
          name="boombox"
          className="left-1/2 top-0 h-80 w-[34rem] -translate-x-1/2 opacity-95"
          drift={180}
        />
        <div className="relative z-10 text-center">
          <SectionHeading
            align="center"
            index="02"
            kicker="Turn it up"
            title="Built for music, down to the pixels"
            className="mb-2"
          />
          <p className="mx-auto mt-40 max-w-md text-ink/70">
            A 3D globe on Atlas, a synth on Explore, a boombox on Insights, equalizer
            bars on every prediction — the whole studio drifts by as you scroll.
          </p>
        </div>
      </section>

      {/* ───────────── Recent feed + spinning vinyl ───────────── */}
      <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 pb-28 lg:grid-cols-2 lg:items-center">
        <ScrollDecor
          name="headphones"
          className="-left-16 bottom-0 hidden h-64 w-64 opacity-80 lg:block"
        />
        <div className="relative z-10">
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
        <div className="relative z-10 flex items-center justify-center">
          <VinylRecord2D size={400} className="max-w-full" />
        </div>
      </section>
    </main>
  );
}
