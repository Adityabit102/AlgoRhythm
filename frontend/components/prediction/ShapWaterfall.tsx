"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { ShapBlock } from "@/lib/types";
import { featureLabel } from "@/lib/mock";

/** Custom animated SHAP waterfall — bars grow from the base value outward.
 *  Green = pushes toward hit, red = pushes away. Built in SVG/divs, not matplotlib. */
export function ShapWaterfall({
  shap,
  features,
  maxRows = 10,
}: {
  shap: ShapBlock;
  features?: Record<string, number | string>;
  maxRows?: number;
}) {
  const rows = useMemo(() => {
    const entries = Object.entries(shap.values)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, maxRows);
    const max = Math.max(...entries.map(([, v]) => Math.abs(v)), 0.001);
    return { entries, max };
  }, [shap, maxRows]);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between font-mono text-xs text-ink/50">
        <span>base value {shap.base_value.toFixed(2)}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-mint-deep" /> toward hit
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-coral" /> away
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {rows.entries.map(([key, val], i) => {
          const positive = val > 0;
          const widthPct = (Math.abs(val) / rows.max) * 50; // half-width per side
          const fv = features?.[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="w-40 shrink-0 truncate text-right font-mono text-xs text-ink/70">
                {featureLabel(key)}
              </div>
              {/* track with center axis — bar is positioned against THIS box */}
              <div className="relative h-7 flex-1">
                <div className="absolute left-1/2 top-0 h-full w-px bg-ink/30" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(widthPct, 1.5)}%` }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
                  title={`${featureLabel(key)}${
                    fv !== undefined ? ` · value ${fv}` : ""
                  } · SHAP ${val > 0 ? "+" : ""}${val.toFixed(3)}`}
                  className={`absolute top-1 h-5 rounded-sm border-2 border-ink ${
                    positive ? "bg-mint-deep" : "bg-coral"
                  }`}
                  style={positive ? { left: "50%" } : { right: "50%" }}
                />
              </div>
              <div className="w-14 shrink-0 font-mono text-xs tabular-nums text-ink/70">
                {val > 0 ? "+" : ""}
                {val.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
