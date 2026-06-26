"use client";

import { motion } from "framer-motion";
import { REGIONS, type Region } from "@/lib/types";

/** Horizontal bar per region. */
export function RegionalScores({
  scores,
}: {
  scores: Partial<Record<Region, number>>;
}) {
  const rows = REGIONS.filter((r) => scores[r.id] !== undefined);

  return (
    <div className="space-y-3">
      {rows.map((r, i) => {
        const v = scores[r.id]!;
        return (
          <div key={r.id} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-sm">
              <span className="mr-1">{r.flag}</span>
              {r.label}
            </div>
            <div className="relative h-6 flex-1 overflow-hidden rounded-full border-2 border-ink bg-cream">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${v * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-cobalt to-electric"
              />
            </div>
            <div className="w-12 shrink-0 text-right font-mono text-sm tabular-nums">
              {Math.round(v * 100)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
