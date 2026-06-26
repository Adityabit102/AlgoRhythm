"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Showcase, type SceneName } from "@/components/three/Showcase";
import { cn } from "@/lib/cn";

/** A 3D object that floats in the page background and drifts (and turns) as you
 *  scroll past it — Decathlon-style scroll decor. Purely decorative, non-blocking.
 *  Position + size come from `className`; it parks itself absolutely behind content. */
export function ScrollDecor({
  name,
  className,
  drift = 150,
  spin = 14,
}: {
  name: SceneName;
  className?: string;
  drift?: number;
  spin?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-spin, spin]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate }}
      aria-hidden
      className={cn("pointer-events-none absolute z-0", className)}
    >
      <Showcase name={name} className="h-full w-full" />
    </motion.div>
  );
}
