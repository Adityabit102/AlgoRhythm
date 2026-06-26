"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/** Big number + label callout. Pops up on scroll into view. */
export function StatCallout({
  value,
  label,
  tone = "cobalt",
  className,
}: {
  value: string;
  label: string;
  tone?: "cobalt" | "gold" | "coral" | "mint";
  className?: string;
}) {
  const tones: Record<string, string> = {
    cobalt: "text-cobalt",
    gold: "text-gold",
    coral: "text-coral",
    mint: "text-mint-deep",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className={cn("pop-card p-6", className)}
    >
      <div className={cn("font-display text-5xl font-bold sm:text-6xl", tones[tone])}>
        {value}
      </div>
      <div className="mt-2 text-sm text-ink/70">{label}</div>
    </motion.div>
  );
}
