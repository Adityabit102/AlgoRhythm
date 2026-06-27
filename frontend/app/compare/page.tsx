"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { batchPredict } from "@/lib/api";
import type { PredictionResponse } from "@/lib/types";
import { featureLabel } from "@/lib/mock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { VerdictBadge } from "@/components/ui/Badge";
import { Showcase } from "@/components/three/Showcase";
import { RadarComparison } from "@/components/compare/RadarComparison";

const SLOT_COLORS = ["border-cobalt", "border-coral", "border-mint-deep"];

export default function ComparePage() {
  const [count, setCount] = useState<2 | 3>(2);
  const [urls, setUrls] = useState(["", "", ""]);
  const [results, setResults] = useState<PredictionResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const filled = urls.slice(0, count).filter((u) => u.trim());
    if (filled.length < count) return;
    setLoading(true);
    setError(null);
    try {
      setResults(await batchPredict(filled));
    } catch {
      setResults(null);
      setError(
        "Couldn't compare those tracks — make sure they're valid Spotify links to reasonably popular tracks.",
      );
    } finally {
      setLoading(false);
    }
  }

  const shapDelta =
    results && results.length >= 2
      ? Object.keys(results[0].shap.values)
          .map((k) => ({
            key: k,
            delta:
              (results[1].shap.values[k] ?? 0) - (results[0].shap.values[k] ?? 0),
          }))
          .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
          .slice(0, 5)
      : [];

  return (
    <main className="flex flex-col">
      <MarqueeStrip text="A vs B vs C · WHAT SEPARATES A HIT FROM A MISS" tone="coral" />
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
          <SectionHeading
            kicker="Compare"
            title="Put tracks side by side"
          />
          <div className="hidden h-40 lg:block">
            <Showcase name="cassette" className="h-full w-full" />
          </div>
        </div>

        {/* how many tracks */}
        <div className="mt-8 flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-ink/50">
            Compare
          </span>
          <div className="inline-flex rounded-full border-2 border-ink p-1">
            {([2, 3] as const).map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  count === n ? "bg-ink text-cream" : "text-ink hover:bg-mint/40"
                }`}
              >
                {n} tracks
              </button>
            ))}
          </div>
        </div>

        {/* inputs */}
        <div className={`mt-5 grid gap-4 ${count === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {urls.slice(0, count).map((u, i) => (
            <input
              key={i}
              value={u}
              onChange={(e) =>
                setUrls((s) => s.map((x, j) => (j === i ? e.target.value : x)))
              }
              placeholder={`Track ${String.fromCharCode(65 + i)} Spotify link`}
              className={`rounded-xl border-2 bg-cloud px-4 py-3 outline-none ${SLOT_COLORS[i]} focus:shadow-[var(--shadow-pop-sm)]`}
            />
          ))}
        </div>
        <div className="mt-5">
          <Button onClick={run} variant="primary">
            {loading ? "Analyzing…" : `Compare ${count} tracks`}
          </Button>
        </div>

        {error && !loading && (
          <div className="mt-6 rounded-xl border-2 border-coral bg-coral/10 px-5 py-4 text-sm text-ink">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size={64} label="Scoring each track…" />
          </div>
        )}

        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-12"
          >
            {/* probability bars */}
            <section>
              <SectionHeading index="01" kicker="Verdict" title="Hit probability" className="mb-6" />
              <div className="space-y-4">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-40 shrink-0">
                      <div className="truncate font-display font-bold">
                        {r.track.name}
                      </div>
                      <div className="truncate text-xs text-ink/60">{r.track.artist}</div>
                    </div>
                    <div className="relative h-8 flex-1 overflow-hidden rounded-full border-2 border-ink bg-cream">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.prediction.hit_probability * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-cobalt to-electric"
                      />
                    </div>
                    <div className="w-12 text-right font-mono">
                      {Math.round(r.prediction.hit_probability * 100)}%
                    </div>
                    <VerdictBadge verdict={r.prediction.verdict} className="scale-75" />
                  </div>
                ))}
              </div>
            </section>

            {/* radar */}
            <section>
              <SectionHeading index="02" kicker="Feature DNA" title="Audio profile overlay" className="mb-6" />
              <div className="pop-card flex justify-center p-6">
                <RadarComparison
                  series={results.map((r) => ({ name: r.track.name, values: r.features }))}
                />
              </div>
            </section>

            {/* SHAP delta + hit gap */}
            {results.length >= 2 && (
              <section className="grid gap-8 lg:grid-cols-2">
                <div>
                  <SectionHeading index="03" kicker="Delta" title={`What ${results[1].track.name} has that ${results[0].track.name} doesn’t`} className="mb-6" />
                  <div className="pop-card divide-y-2 divide-ink/10 p-2">
                    {shapDelta.map((d) => (
                      <div key={d.key} className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm">{featureLabel(d.key)}</span>
                        <span
                          className={`font-mono text-sm ${
                            d.delta > 0 ? "text-mint-deep" : "text-coral"
                          }`}
                        >
                          {d.delta > 0 ? "+" : ""}
                          {d.delta.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <SectionHeading index="04" kicker="Gap" title="Hit gap" className="mb-6" />
                  <div className="pop-card p-6">
                    <div className="font-display text-6xl font-bold text-cobalt">
                      {Math.round(
                        Math.abs(
                          results[1].prediction.hit_probability -
                            results[0].prediction.hit_probability,
                        ) * 100,
                      )}
                      <span className="text-2xl"> pts</span>
                    </div>
                    <p className="mt-3 text-sm text-ink/70">
                      Probability distance between {results[0].track.name} and{" "}
                      {results[1].track.name}. The radar above shows where that gap
                      comes from.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
