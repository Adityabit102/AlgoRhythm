"use client";

import { motion } from "framer-motion";
import type { SimilarHit } from "@/lib/types";

function Cover({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-xl border-2 border-ink bg-gradient-to-br from-electric via-cobalt to-mint">
      <span className="font-display text-2xl font-bold text-cream">{initials}</span>
    </div>
  );
}

export function SimilarHits({ hits }: { hits: SimilarHit[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {hits.map((h, i) => (
        <motion.a
          key={i}
          href={h.spotify_url}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -6 }}
          className="group block"
        >
          {h.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={h.cover_url}
              alt={h.name}
              className="aspect-square w-full rounded-xl border-2 border-ink object-cover"
            />
          ) : (
            <Cover name={h.name} />
          )}
          <div className="mt-2 truncate font-display text-sm font-semibold">
            {h.name}
          </div>
          <div className="truncate text-xs text-ink/60">{h.artist}</div>
          <div className="font-mono text-[10px] text-cobalt">
            {Math.round(h.similarity_score * 100)}% match
          </div>
        </motion.a>
      ))}
    </div>
  );
}
