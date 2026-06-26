"use client";

import { cn } from "@/lib/cn";

/** 80s striped sunset disc (gold→coral, sliced by gaps). */
export function RetroSun({ className }: { className?: string }) {
  const slices = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg viewBox="0 0 200 120" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd23f" />
          <stop offset="100%" stopColor="#ff5a45" />
        </linearGradient>
        <clipPath id="sunClip">
          <circle cx="100" cy="120" r="92" />
        </clipPath>
      </defs>
      <g clipPath="url(#sunClip)">
        <rect x="0" y="0" width="200" height="120" fill="url(#sun)" />
        {slices.map((i) => (
          <rect
            key={i}
            x="0"
            y={48 + i * 9}
            width="200"
            height={i < 4 ? 3 : 4 + i}
            fill="#f7b7c8"
          />
        ))}
      </g>
      <circle cx="100" cy="120" r="92" fill="none" stroke="#14181f" strokeWidth="3" />
    </svg>
  );
}

/** Bold-outlined palm tree. */
export function PalmTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={cn("h-auto w-full", className)} aria-hidden>
      <path
        d="M58 195c-4-40-2-78 4-116"
        fill="none"
        stroke="#14181f"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M58 195c-4-40-2-78 4-116"
        fill="none"
        stroke="#5fc9ab"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {[
        "M62 78C40 60 18 58 4 68c20-2 34 6 44 22",
        "M62 78C84 58 108 56 120 70c-22-4-38 4-46 22",
        "M62 76C46 44 22 30 6 34c22 4 36 20 42 44",
        "M62 76C80 44 104 32 118 38c-22 2-38 18-44 42",
        "M62 74c0-26-8-52-22-64 18 8 26 30 28 56",
      ].map((d, i) => (
        <path key={i} d={d} fill="#2fae8a" stroke="#14181f" strokeWidth="4" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

/** Neon 80s perspective grid floor. */
export function PerspectiveGrid({ className }: { className?: string }) {
  const verticals = Array.from({ length: 17 }, (_, i) => i);
  const horizontals = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 400 160"
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      {verticals.map((i) => {
        const topX = 200 + (i - 8) * 10;
        const botX = 200 + (i - 8) * 60;
        return (
          <line key={i} x1={topX} y1="0" x2={botX} y2="160" stroke="#14181f" strokeWidth="1.5" opacity="0.6" />
        );
      })}
      {horizontals.map((i) => {
        const t = i / horizontals.length;
        const y = t * t * 160;
        return <line key={i} x1="0" y1={y} x2="400" y2={y} stroke="#14181f" strokeWidth="1.5" opacity="0.6" />;
      })}
    </svg>
  );
}

/** Chunky lightning bolt. */
export function LightningBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={cn("h-auto w-full", className)} aria-hidden>
      <path
        d="M34 2 6 56h18l-8 42 36-58H30z"
        fill="#ffd23f"
        stroke="#14181f"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Horizontal candy stripes band (CSS gradient). */
export function StripeBand({
  className,
  from = "#f48fb6",
  to = "#fbd5e2",
}: {
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div
      className={cn("w-full", className)}
      style={{
        backgroundImage: `repeating-linear-gradient(180deg, ${from} 0 14px, ${to} 14px 28px)`,
      }}
    />
  );
}
