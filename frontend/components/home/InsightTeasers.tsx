"use client";

import { motion } from "framer-motion";
import { StickerShape } from "@/components/ui/StickerShape";

const TEASERS = [
  {
    stat: "2.3×",
    title: "The Friday Effect",
    body: "Tracks released on Friday chart 2.3× more often — they ride the playlist refresh cycle.",
    tone: "bg-gold text-ink",
    shape: "star" as const,
  },
  {
    stat: "0.55",
    title: "The Danceability Floor",
    body: "Below ~0.55 danceability, hits almost vanish. There’s a rhythmic threshold to clear.",
    tone: "bg-mint text-ink",
    shape: "squiggle" as const,
  },
  {
    stat: "+31%",
    title: "Collabs Beat Solos",
    body: "Tracks with a featured artist out-chart solo releases by roughly 31%.",
    tone: "bg-coral text-cream",
    shape: "note" as const,
  },
];

export function InsightTeasers() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {TEASERS.map((t, i) => (
        <motion.div
          key={t.title}
          initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 110, damping: 14, delay: i * 0.08 }}
          whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
          className={`pop-card relative overflow-hidden p-6 ${t.tone}`}
        >
          <StickerShape
            shape={t.shape}
            className="absolute -right-3 -top-3 h-20 w-20 opacity-20"
            float={false}
          />
          <div className="font-display text-5xl font-bold">{t.stat}</div>
          <h3 className="mt-3 font-display text-xl font-bold">{t.title}</h3>
          <p className="mt-2 text-sm opacity-80">{t.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
