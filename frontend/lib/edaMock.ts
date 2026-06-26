/** Deterministic mock EDA distributions for the Feature Explorer.
 *  Filters nudge the curves so the charts visibly react. */

export type Era = "all" | "pre2000" | "2000s" | "2010s" | "streaming";
export const ERAS: { id: Era; label: string }[] = [
  { id: "all", label: "All eras" },
  { id: "pre2000", label: "Pre-2000" },
  { id: "2000s", label: "2000s" },
  { id: "2010s", label: "2010s" },
  { id: "streaming", label: "Streaming (2015+)" },
];

export const GENRES = ["All", "Pop", "Hip-Hop", "Dance", "R&B", "Rock", "Latin"];

const eraShift: Record<Era, number> = {
  all: 0,
  pre2000: -0.08,
  "2000s": -0.03,
  "2010s": 0.04,
  streaming: 0.09,
};

function bell(x: number, mu: number, sigma: number) {
  return Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));
}

export function danceabilityDist(era: Era) {
  const shift = eraShift[era];
  return Array.from({ length: 20 }).map((_, i) => {
    const x = i / 20 + 0.025;
    return {
      bin: x.toFixed(2),
      hits: Math.round(bell(x, 0.72 + shift, 0.12) * 100),
      nonHits: Math.round(bell(x, 0.5, 0.2) * 80),
    };
  });
}

export function tempoHist(era: Era) {
  const shift = eraShift[era] * 40;
  return Array.from({ length: 16 }).map((_, i) => {
    const bpm = 60 + i * 10;
    return {
      bpm,
      count: Math.round(
        (bell(bpm, 122 + shift, 18) + bell(bpm, 95 + shift, 12) * 0.7) * 100,
      ),
    };
  });
}

export function valenceScatter(genre: string) {
  const base = genre === "Latin" ? 0.62 : genre === "Hip-Hop" ? 0.45 : 0.55;
  return Array.from({ length: 40 }).map((_, i) => {
    const valence = (i + 0.5) / 40;
    const noise = (Math.sin(i * 12.9898) * 43758.5453) % 0.12;
    return {
      valence: +valence.toFixed(2),
      hitRate: +Math.max(
        0.02,
        Math.min(0.5, bell(valence, base, 0.28) * 0.45 + noise),
      ).toFixed(3),
    };
  });
}

export const GENRE_ERA_HEAT = {
  genres: ["Pop", "Hip-Hop", "Dance", "R&B", "Rock", "Latin"],
  eras: ["Pre-2000", "2000s", "2010s", "Streaming"],
  // hit-rate matrix [genre][era]
  matrix: [
    [0.28, 0.31, 0.33, 0.3],
    [0.12, 0.22, 0.34, 0.37],
    [0.18, 0.24, 0.26, 0.22],
    [0.26, 0.24, 0.2, 0.18],
    [0.34, 0.26, 0.16, 0.1],
    [0.14, 0.18, 0.25, 0.31],
  ],
};
