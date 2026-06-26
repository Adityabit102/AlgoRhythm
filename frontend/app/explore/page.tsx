"use client";

import { useState } from "react";
import { ERAS, GENRES, type Era } from "@/lib/edaMock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { Showcase } from "@/components/three/Showcase";
import { FeatureCharts } from "@/components/explore/FeatureCharts";
import { cn } from "@/lib/cn";

export default function ExplorePage() {
  const [era, setEra] = useState<Era>("all");
  const [genre, setGenre] = useState("All");

  return (
    <main className="flex flex-col">
      <MarqueeStrip text="FEATURE EXPLORER · THE RESEARCH LAYER" tone="gold" />
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
          <SectionHeading
            kicker="Explore"
            title="Poke at the data yourself"
          />
          <div className="hidden h-44 lg:block">
            <Showcase name="synth" className="h-full w-full" />
          </div>
        </div>

        {/* filters */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/50">
              Era
            </div>
            <div className="flex flex-wrap gap-2">
              {ERAS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEra(e.id)}
                  className={cn(
                    "rounded-full border-2 border-ink px-3 py-1 text-sm transition-colors",
                    era === e.id ? "bg-cobalt text-cream" : "bg-cream hover:bg-mint/40",
                  )}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/50">
              Genre
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={cn(
                    "rounded-full border-2 border-ink px-3 py-1 text-sm transition-colors",
                    genre === g ? "bg-coral text-cream" : "bg-cream hover:bg-mint/40",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <FeatureCharts era={era} genre={genre} />
        </div>
      </div>
    </main>
  );
}
