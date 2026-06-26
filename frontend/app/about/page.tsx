"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { StatCallout } from "@/components/ui/StatCallout";
import { Badge } from "@/components/ui/Badge";
import { Showcase } from "@/components/three/Showcase";

const FEATURE_GROUPS = [
  { group: "Audio (Spotify)", items: ["danceability", "energy", "valence", "tempo", "loudness", "acousticness", "speechiness", "instrumentalness", "liveness", "key", "mode", "time_signature", "duration_ms"] },
  { group: "Release timing", items: ["release_month", "release_quarter", "release_day_of_week", "release_era", "is_streaming_era", "days_since_release_at_charting"] },
  { group: "Artist momentum", items: ["artist_prior_hits", "artist_hit_rate", "artist_avg_popularity", "is_debut_track", "collaborator_count", "has_featured_artist"] },
  { group: "Cultural / genre", items: ["primary_genre", "genre_era_hit_rate", "is_crossover", "region_affinity_score", "language"] },
  { group: "Audio interactions", items: ["energy_valence_ratio", "dance_energy_product", "loudness_normalized", "tempo_bucket", "acoustic_vs_electric"] },
];

const FLOW = [
  "Spotify URL",
  "FastAPI /predict",
  "Spotify Web API",
  "Feature engineering",
  "XGBoost inference",
  "SHAP explainer",
  "Result + waterfall",
];

export default function AboutPage() {
  return (
    <main className="flex flex-col">
      <MarqueeStrip text="MODEL CARD · METHODOLOGY · LIMITATIONS" tone="cobalt" />

      <section className="relative overflow-hidden bg-cobalt text-cream">
        <div className="absolute inset-0 opacity-90">
          <Showcase name="headphones" className="h-full w-full" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <SectionHeading
            align="center"
            kicker="About"
            title={<span className="text-cream">How AlgoRhythm works — and where it doesn’t</span>}
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl space-y-16 px-6 py-14">
        {/* metrics */}
        <section>
          <SectionHeading index="01" kicker="Performance" title="Evaluation metrics" className="mb-6" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCallout value="0.92" label="AUC-ROC (held-out test)" tone="cobalt" />
            <StatCallout value="0.81" label="F1 @ 0.5 threshold" tone="gold" />
            <StatCallout value="62K" label="tracks (25K real chart hits)" tone="coral" />
            <StatCallout value="35+" label="engineered features" tone="mint" />
          </div>
          <p className="mt-4 font-mono text-xs text-ink/50">
            Trained on real Spotify chart + catalogue data (XGBoost + Optuna).
          </p>
        </section>

        {/* methodology / data flow */}
        <section>
          <SectionHeading index="02" kicker="Pipeline" title="From URL to explanation" className="mb-6" />
          <div className="flex flex-wrap items-center gap-2">
            {FLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border-2 border-ink bg-cloud px-4 py-2 text-sm shadow-[var(--shadow-pop-sm)]">
                  {step}
                </span>
                {i < FLOW.length - 1 && <span className="text-cobalt">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* feature list */}
        <section>
          <SectionHeading index="03" kicker="Inputs" title="The full feature set" className="mb-6" />
          <div className="space-y-5">
            {FEATURE_GROUPS.map((g) => (
              <div key={g.group}>
                <h4 className="mb-2 font-display font-bold">{g.group}</h4>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-xs"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* data + biases + limits */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="pop-card p-6">
            <Badge tone="cobalt">Training data</Badge>
            <ul className="mt-4 space-y-2 text-sm text-ink/75">
              <li>· Spotify Charts (2017–2023) for chart positions and dates</li>
              <li>· Billboard Hot 100 historical for US labels</li>
              <li>· Spotify Web API for per-track audio features</li>
              <li>· Negative sampling from low-popularity catalog tracks</li>
            </ul>
          </div>
          <div className="pop-card p-6">
            <Badge tone="coral">Known biases</Badge>
            <ul className="mt-4 space-y-2 text-sm text-ink/75">
              <li>· Western chart data is overrepresented</li>
              <li>· Pre-2000 data is sparse and noisier</li>
              <li>· Label/marketing spend is invisible to the model</li>
            </ul>
          </div>
          <div className="pop-card p-6 md:col-span-2">
            <Badge tone="ink">Limitations</Badge>
            <p className="mt-4 text-sm text-ink/75">
              AlgoRhythm predicts hit <em>probability</em> from intrinsic and
              contextual signal — it can’t foresee a viral TikTok moment, a sync
              placement, or a marketing budget. Treat the score as “does this track
              have hit DNA,” not “will this be a hit.”
            </p>
          </div>
        </section>

        {/* version history + notebook */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="pop-card p-6">
            <Badge tone="mint">Version history</Badge>
            <div className="mt-4 space-y-2 font-mono text-sm">
              <div>v20260615 · baseline XGBoost + Optuna HPO</div>
              <div className="text-ink/50">v20260601 · feature pipeline v2</div>
              <div className="text-ink/50">v20260520 · first trained model</div>
            </div>
          </div>
          <div className="pop-card flex flex-col justify-between p-6">
            <div>
              <Badge tone="gold">Research artifact</Badge>
              <p className="mt-4 text-sm text-ink/75">
                The full EDA + training notebook is published as a public HTML
                artifact — the research-paper version of this project.
              </p>
            </div>
            <a
              href="/notebook"
              className="mt-4 inline-block font-display font-semibold text-cobalt underline"
            >
              Read the notebook ↗
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
