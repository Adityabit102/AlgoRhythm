"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Shape = "squiggle" | "star" | "zigzag" | "halfcircle" | "blob" | "note";

const PATHS: Record<Shape, React.ReactNode> = {
  squiggle: (
    <path
      d="M4 28C12 12 20 44 28 28C36 12 44 44 52 28"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
  ),
  star: (
    <path
      d="M28 2l7 16 17 1-13 11 4 17-15-9-15 9 4-17L4 19l17-1z"
      fill="currentColor"
    />
  ),
  zigzag: (
    <path
      d="M2 40L14 12l12 28L38 12l14 28"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  halfcircle: <path d="M4 40a24 24 0 0 1 48 0z" fill="currentColor" />,
  blob: (
    <path
      d="M28 4c12 0 22 6 22 18s-6 26-22 26S6 36 6 22 16 4 28 4z"
      fill="currentColor"
    />
  ),
  note: (
    <path
      d="M40 6v26a9 9 0 1 1-6-8.5V12L22 15v23a9 9 0 1 1-6-8.5V12z"
      fill="currentColor"
    />
  ),
};

/** Decorative Memphis sticker. Floats gently; purely ornamental (aria-hidden). */
export function StickerShape({
  shape = "star",
  className,
  float = true,
  spin = false,
}: {
  shape?: Shape;
  className?: string;
  float?: boolean;
  spin?: boolean;
}) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 56 56"
      className={cn("pointer-events-none h-16 w-16", className)}
      animate={
        spin
          ? { rotate: 360 }
          : float
            ? { y: [0, -10, 0], rotate: [0, 6, 0] }
            : undefined
      }
      transition={
        spin
          ? { duration: 12, repeat: Infinity, ease: "linear" }
          : { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {PATHS[shape]}
    </motion.svg>
  );
}
