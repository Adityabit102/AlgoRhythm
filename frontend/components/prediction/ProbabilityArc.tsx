"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

/** Custom SVG arc meter (0–100%) with an animated sweep + counting label. */
export function ProbabilityArc({
  value,
  size = 240,
}: {
  value: number; // 0..1
  size?: number;
}) {
  const stroke = 18;
  const r = (size - stroke) / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  // 270° arc from 135° to 45° (gauge style)
  const START = 135;
  const SWEEP = 270;
  const circumference = 2 * Math.PI * r;
  const arcLen = (SWEEP / 360) * circumference;

  const progress = useMotionValue(0);
  const dash = useTransform(progress, (p) => `${(p * arcLen) / 100} ${circumference}`);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Math.round(value * 100);
    const controls = animate(progress, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, progress]);

  const color = value > 0.66 ? "#ffd23f" : value > 0.45 ? "#8fe3c8" : "#ff5a45";

  return (
    <div className="relative aspect-square w-full" style={{ maxWidth: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="arcgrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a43e0" />
            <stop offset="50%" stopColor="#2d5bff" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        {/* track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#14181f"
          strokeOpacity={0.12}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${circumference}`}
          transform={`rotate(${START} ${cx} ${cy})`}
        />
        {/* value */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#arcgrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{ strokeDasharray: dash }}
          transform={`rotate(${START} ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold tabular-nums">{display}%</span>
        <span className="font-mono text-xs uppercase tracking-widest text-ink/50">
          hit probability
        </span>
      </div>
    </div>
  );
}
