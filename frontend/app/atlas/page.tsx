"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGIONS, type Region } from "@/lib/types";
import { REGION_PROFILES } from "@/lib/regionMock";
import { featureLabel } from "@/lib/mock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { RegionPills } from "@/components/ui/RegionPill";
import { Showcase } from "@/components/three/Showcase";
import { RadarComparison } from "@/components/compare/RadarComparison";

export default function AtlasPage() {
  const [region, setRegion] = useState<Region>("global");
  const p = REGION_PROFILES[region];
  const meta = REGIONS.find((r) => r.id === region)!;

  return (
    <main className="flex flex-col">
      <MarqueeStrip text="GLOBAL HIT ATLAS · WHAT CHARTS WHERE" tone="cobalt" />

      {/* hero globe */}
      <section className="grain relative overflow-hidden bg-cobalt text-cream">
        <div className="absolute inset-0 opacity-90">
          <Showcase name="globe" className="h-full w-full" controls autoRotate />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <SectionHeading
            align="center"
            kicker="Atlas"
            title={<span className="text-cream">Hits aren’t the same everywhere</span>}
          />
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            The features that predict a hit in Lagos aren’t the ones that predict a
            hit in Seoul. Pick a market to see its hit fingerprint.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <RegionPills value={region} onChange={setRegion} className="mb-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="grid gap-8 lg:grid-cols-2"
          >
            {/* left: stats */}
            <div className="space-y-6">
              <div className="pop-card p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{meta.flag}</span>
                  <h3 className="font-display text-2xl font-bold">{meta.label}</h3>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-display text-4xl font-bold text-cobalt">
                      {Math.round(p.hitRate * 100)}%
                    </div>
                    <div className="text-xs text-ink/60">base hit rate</div>
                  </div>
                  <div>
                    <div className="font-display text-4xl font-bold text-coral">
                      {p.tempoRange[0]}–{p.tempoRange[1]}
                    </div>
                    <div className="text-xs text-ink/60">typical hit BPM</div>
                  </div>
                </div>
              </div>

              <div className="pop-card p-6">
                <h4 className="font-mono text-xs uppercase tracking-widest text-ink/50">
                  Top predictive features
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.topFeatures.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border-2 border-ink bg-gold px-3 py-1 text-sm"
                    >
                      {featureLabel(f)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pop-card p-6">
                <h4 className="font-mono text-xs uppercase tracking-widest text-ink/50">
                  Hit rate by genre
                </h4>
                <div className="mt-4 space-y-3">
                  {p.genreHitRates.map((g) => (
                    <div key={g.genre} className="flex items-center gap-3">
                      <div className="w-28 shrink-0 text-sm">{g.genre}</div>
                      <div className="h-5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-cream">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${g.rate * 100 * 2.2}%` }}
                          transition={{ duration: 0.7 }}
                          className="h-full bg-mint-deep"
                        />
                      </div>
                      <div className="w-10 text-right font-mono text-xs">
                        {Math.round(g.rate * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right: fingerprint + divergence */}
            <div className="space-y-6">
              <div className="pop-card flex flex-col items-center p-6">
                <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/50">
                  Feature fingerprint
                </h4>
                <RadarComparison
                  series={[{ name: meta.label, values: p.fingerprint }]}
                />
              </div>
              <div className="pop-card bg-ink p-6 text-cream">
                <h4 className="font-mono text-xs uppercase tracking-widest text-cream/50">
                  Regional divergence
                </h4>
                <p className="mt-3 font-display text-xl leading-snug">
                  {p.divergence}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
