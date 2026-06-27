"use client";

import { useMemo, useState } from "react";
import type { PredictionResponse } from "@/lib/types";

/** Local "what-if" sensitivity. We approximate the model response by scaling each
 *  tunable feature's SHAP contribution by how far it's moved from its original
 *  value, then re-summing onto the base value. Heuristic, but directionally honest. */
const TUNABLE: { key: string; label: string; min: number; max: number; step: number }[] = [
  { key: "danceability", label: "Danceability", min: 0, max: 1, step: 0.01 },
  { key: "energy", label: "Energy", min: 0, max: 1, step: 0.01 },
  { key: "valence", label: "Valence", min: 0, max: 1, step: 0.01 },
  { key: "tempo", label: "Tempo (BPM)", min: 60, max: 200, step: 1 },
];

export function SensitivitySliders({ data }: { data: PredictionResponse }) {
  const originals = useMemo(() => {
    const o: Record<string, number> = {};
    for (const t of TUNABLE) o[t.key] = Number(data.features[t.key] ?? 0.5);
    return o;
  }, [data]);

  const [vals, setVals] = useState(originals);

  const newProb = useMemo(() => {
    // Anchor to the model's actual probability, then nudge by the *change* in each
    // feature's SHAP contribution. SHAP is in log-odds space, so adjust the margin
    // and map back through a sigmoid — works for both the real model and the mock.
    const actual = Math.min(0.999, Math.max(0.001, data.prediction.hit_probability));
    let margin = Math.log(actual / (1 - actual));
    for (const [key, shapVal] of Object.entries(data.shap.values)) {
      if (key in originals && originals[key] !== 0) {
        const ratio = vals[key] / originals[key];
        margin += shapVal * ((ratio - 1) * 0.8);
      }
    }
    return 1 / (1 + Math.exp(-margin));
  }, [vals, originals, data]);

  const delta = newProb - data.prediction.hit_probability;

  return (
    <div className="pop-card p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="font-display text-xl font-bold">What would change this?</h3>
        <div className="text-right">
          <div className="font-display text-3xl font-bold tabular-nums">
            {Math.round(newProb * 100)}%
          </div>
          <div
            className={`font-mono text-xs ${
              delta > 0.001 ? "text-mint-deep" : delta < -0.001 ? "text-coral" : "text-ink/50"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {Math.round(delta * 100)} pts vs actual
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {TUNABLE.map((t) => (
          <div key={t.key}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{t.label}</span>
              <span className="font-mono tabular-nums">
                {t.step < 1 ? vals[t.key].toFixed(2) : Math.round(vals[t.key])}
              </span>
            </div>
            <input
              type="range"
              min={t.min}
              max={t.max}
              step={t.step}
              value={vals[t.key]}
              onChange={(e) =>
                setVals((s) => ({ ...s, [t.key]: Number(e.target.value) }))
              }
              className="w-full accent-cobalt"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => setVals(originals)}
        className="mt-5 font-mono text-xs text-cobalt underline"
      >
        reset to actual values
      </button>
    </div>
  );
}
