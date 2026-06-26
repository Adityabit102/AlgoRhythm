"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  RetroSun,
  PalmTree,
  PerspectiveGrid,
  LightningBolt,
  StripeBand,
} from "@/components/retro/RetroDecor";

/** A Decathlon-Yestalgia-style illustrated scene with scroll parallax: the sun
 *  rises, palms drift out, the grid floor slides, and stickers float as you scroll. */
export function RetroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const sunY = useTransform(scrollYProgress, [0, 1], [120, -60]);
  const palmL = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const palmR = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const gridY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const boltY = useTransform(scrollYProgress, [0, 1], [-30, 60]);
  const titleY = useTransform(scrollYProgress, [0, 1], [60, -40]);

  return (
    <section
      ref={ref}
      className="grain relative overflow-hidden border-y-2 border-ink"
      style={{ backgroundColor: "#f6bcd2" }}
    >
      <StripeBand className="absolute inset-x-0 top-0 h-24 opacity-70" />

      {/* sun */}
      <motion.div
        style={{ y: sunY }}
        className="pointer-events-none absolute left-1/2 top-24 w-[420px] max-w-[80vw] -translate-x-1/2"
      >
        <RetroSun />
      </motion.div>

      {/* palms */}
      <motion.div
        style={{ x: palmL }}
        className="pointer-events-none absolute bottom-28 left-2 w-28 sm:left-10 sm:w-40"
      >
        <PalmTree />
      </motion.div>
      <motion.div
        style={{ x: palmR }}
        className="pointer-events-none absolute bottom-28 right-2 w-28 -scale-x-100 sm:right-10 sm:w-40"
      >
        <PalmTree />
      </motion.div>

      {/* lightning */}
      <motion.div style={{ y: boltY }} className="pointer-events-none absolute right-1/4 top-16 w-10">
        <LightningBolt />
      </motion.div>
      <motion.div style={{ y: boltY }} className="pointer-events-none absolute left-1/4 top-28 w-7 rotate-12">
        <LightningBolt />
      </motion.div>

      {/* content */}
      <motion.div
        style={{ y: titleY }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-36 text-center"
      >
        <span className="rounded-full border-2 border-ink bg-cream px-4 py-1 font-mono text-xs uppercase tracking-[0.3em] shadow-[var(--shadow-pop-sm)]">
          Nostalgia, measured
        </span>
        <h2 className="font-display mt-6 text-5xl font-bold leading-[0.95] text-ink sm:text-7xl">
          Built on the feeling.
          <br />
          <span className="text-cobalt">Scored by the data.</span>
        </h2>
        <p className="mt-5 max-w-lg text-ink/80">
          The charts are nostalgia you can quantify — cassette warmth, Friday drops,
          boombox energy. AlgoRhythm turns all of it into a number.
        </p>
      </motion.div>

      {/* perspective grid floor */}
      <motion.div style={{ y: gridY }} className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
        <PerspectiveGrid />
      </motion.div>
    </section>
  );
}
