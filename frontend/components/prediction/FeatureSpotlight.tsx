"use client";

import { motion } from "framer-motion";
import type { PredictionResponse } from "@/lib/types";
import { FEATURE_EXPLANATIONS, featureLabel } from "@/lib/mock";

/** Top-3 most influential features with human-readable explanations. */
export function FeatureSpotlight({ data }: { data: PredictionResponse }) {
  const top = data.shap.top_positive.slice(0, 3);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {top.map((key, i) => {
        const explain = FEATURE_EXPLANATIONS.find((e) => e.key === key);
        const value = data.features[key];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="pop-card p-5"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-cobalt">
              #{i + 1} driver
            </div>
            <div className="mt-1 font-display text-lg font-bold">
              {featureLabel(key)}
            </div>
            {value !== undefined && (
              <div className="mt-1 font-mono text-sm text-ink/60">
                value: {String(value)}
              </div>
            )}
            <p className="mt-3 text-sm text-ink/70">
              {explain?.blurb ??
                "One of the strongest positive contributors to this prediction."}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
