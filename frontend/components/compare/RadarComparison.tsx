"use client";

import { motion } from "framer-motion";

const AXES = [
  { key: "danceability", label: "Dance" },
  { key: "energy", label: "Energy" },
  { key: "valence", label: "Valence" },
  { key: "acousticness", label: "Acoustic" },
  { key: "speechiness", label: "Speech" },
  { key: "liveness", label: "Live" },
];

const SERIES_COLORS = ["#1a43e0", "#ff5a45", "#5fc9ab"];

export interface RadarSeries {
  name: string;
  values: Record<string, number | string>;
}

/** Custom SVG radar overlaying up to 3 tracks' normalized audio profiles. */
export function RadarComparison({ series }: { series: RadarSeries[] }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 44;
  const n = AXES.length;

  const point = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  };

  const polygon = (vals: Record<string, number | string>) =>
    AXES.map((ax, i) => {
      const v = Math.max(0, Math.min(1, Number(vals[ax.key] ?? 0)));
      const [x, y] = point(i, v * radius);
      return `${x},${y}`;
    }).join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        className="h-auto w-full max-w-[340px]"
      >
        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={AXES.map((_, i) => point(i, f * radius).join(",")).join(" ")}
            fill="none"
            stroke="#14181f"
            strokeOpacity={0.15}
          />
        ))}
        {/* spokes + labels */}
        {AXES.map((ax, i) => {
          const [x, y] = point(i, radius);
          const [lx, ly] = point(i, radius + 22);
          return (
            <g key={ax.key}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="#14181f" strokeOpacity={0.15} />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-ink font-mono"
                fontSize={11}
              >
                {ax.label}
              </text>
            </g>
          );
        })}
        {/* series */}
        {series.map((s, si) => (
          <motion.polygon
            key={si}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: si * 0.1 }}
            points={polygon(s.values)}
            fill={SERIES_COLORS[si]}
            fillOpacity={0.18}
            stroke={SERIES_COLORS[si]}
            strokeWidth={2}
            style={{ transformOrigin: "center" }}
          />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-4">
        {series.map((s, si) => (
          <span key={si} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: SERIES_COLORS[si] }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
