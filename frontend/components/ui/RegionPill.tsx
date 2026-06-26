"use client";

import { motion } from "framer-motion";
import { REGIONS, type Region } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Region selector pill group. Controlled via value/onChange. */
export function RegionPills({
  value,
  onChange,
  className,
}: {
  value: Region;
  onChange: (r: Region) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {REGIONS.map((r) => {
        const active = r.id === value;
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            className={cn(
              "relative rounded-full pop-border px-4 py-2 text-sm font-medium transition-colors",
              active ? "text-cream" : "bg-cream text-ink hover:bg-mint/40",
            )}
          >
            {active && (
              <motion.span
                layoutId="region-pill"
                className="absolute inset-0 -z-10 rounded-full bg-cobalt"
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
              />
            )}
            <span className="mr-1">{r.flag}</span>
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
