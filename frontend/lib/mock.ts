import type {
  PredictionResponse,
  FeatureExplanation,
  Verdict,
  Confidence,
} from "./types";

/** Deterministic pseudo-random from a string seed so the same track id
 *  always yields the same mock prediction. */
function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TRACKS = [
  { name: "Neon Gravity", artist: "Lumen Drift", album: "Afterglow" },
  { name: "Paper Hearts", artist: "Marisol Vega", album: "Cassette Sun" },
  { name: "Midnight Algorithm", artist: "The Hex Collective", album: "Static" },
  { name: "Golden Hour Riot", artist: "KOSMO", album: "Daybreak" },
];

const FEATURE_LABELS: Record<string, string> = {
  danceability: "Danceability",
  energy: "Energy",
  valence: "Valence",
  acousticness: "Acousticness",
  speechiness: "Speechiness",
  tempo: "Tempo",
  artist_prior_hits: "Artist prior hits",
  release_day_of_week_friday: "Friday release",
  dance_energy_product: "Dance × Energy",
  is_streaming_era: "Streaming era",
  loudness_normalized: "Loudness (norm.)",
  has_featured_artist: "Featured artist",
};

export const FEATURE_EXPLANATIONS: FeatureExplanation[] = [
  {
    key: "danceability",
    label: "Danceability",
    blurb: "Tracks above 0.75 chart 3.1× more often. This one clears the floor.",
  },
  {
    key: "artist_prior_hits",
    label: "Artist momentum",
    blurb: "Prior charting tracks compound — momentum is one of the strongest signals.",
  },
  {
    key: "release_day_of_week_friday",
    label: "Friday release",
    blurb: "Friday drops align with playlist refresh cycles — a real 2.3× edge.",
  },
  {
    key: "energy",
    label: "Energy",
    blurb: "Perceptual intensity in the sweet spot for radio + playlist placement.",
  },
];

export function mockPrediction(
  trackId: string,
  variant = 0,
): PredictionResponse {
  const rnd = seeded(trackId + variant);
  const pick = TRACKS[Math.floor(rnd() * TRACKS.length)];

  const prob = 0.32 + rnd() * 0.6; // 0.32..0.92
  const verdict: Verdict = prob > 0.66 ? "hit" : prob > 0.45 ? "borderline" : "miss";
  const confidence: Confidence = prob > 0.75 || prob < 0.4 ? "high" : "medium";

  const base = 0.41;
  const rawShap: Record<string, number> = {
    danceability: 0.16 * (rnd() - 0.25),
    artist_prior_hits: 0.13 * (rnd() - 0.2),
    energy: 0.09 * (rnd() - 0.3),
    release_day_of_week_friday: 0.07 * (rnd() - 0.2),
    dance_energy_product: 0.06 * (rnd() - 0.35),
    is_streaming_era: 0.05 * (rnd() - 0.3),
    valence: 0.05 * (rnd() - 0.55),
    has_featured_artist: 0.04 * (rnd() - 0.4),
    loudness_normalized: 0.04 * (rnd() - 0.5),
    acousticness: -0.08 * rnd(),
    speechiness: -0.05 * rnd(),
    tempo: 0.03 * (rnd() - 0.5),
  };

  const sorted = Object.entries(rawShap).sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
  );
  const top_positive = sorted.filter(([, v]) => v > 0).slice(0, 3).map(([k]) => k);
  const top_negative = sorted.filter(([, v]) => v < 0).slice(0, 2).map(([k]) => k);

  return {
    track: {
      id: trackId,
      name: pick.name,
      artist: pick.artist,
      album: pick.album,
      release_date: "2024-09-13",
      duration_ms: 168000 + Math.floor(rnd() * 80000),
      cover_url: "",
      spotify_url: `https://open.spotify.com/track/${trackId}`,
    },
    prediction: {
      hit_probability: prob,
      confidence,
      verdict,
      percentile: Math.round(prob * 100),
      regional_scores: {
        global: prob,
        us: Math.min(0.98, prob + (rnd() - 0.5) * 0.2),
        india: Math.max(0.05, prob - rnd() * 0.3),
        uk: Math.min(0.98, prob + (rnd() - 0.5) * 0.18),
        latin: Math.max(0.05, prob - rnd() * 0.25),
        kpop: Math.max(0.05, prob - rnd() * 0.2),
      },
    },
    features: {
      danceability: +(0.5 + rnd() * 0.45).toFixed(2),
      energy: +(0.45 + rnd() * 0.5).toFixed(2),
      valence: +(0.2 + rnd() * 0.7).toFixed(2),
      acousticness: +(rnd() * 0.5).toFixed(2),
      speechiness: +(rnd() * 0.3).toFixed(2),
      instrumentalness: +(rnd() * 0.2).toFixed(2),
      liveness: +(rnd() * 0.4).toFixed(2),
      loudness: +(-12 + rnd() * 8).toFixed(1),
      tempo: Math.round(90 + rnd() * 70),
      key: Math.floor(rnd() * 12),
      mode: rnd() > 0.5 ? 1 : 0,
      time_signature: 4,
      artist_prior_hits: Math.floor(rnd() * 18),
      release_day_of_week: "Friday",
    },
    shap: { base_value: base, values: rawShap, top_positive, top_negative },
    similar_hits: Array.from({ length: 5 }).map((_, i) => {
      const t = TRACKS[(variant + i) % TRACKS.length];
      return {
        name: t.name,
        artist: t.artist,
        similarity_score: +(0.99 - i * 0.04 - rnd() * 0.02).toFixed(2),
        spotify_url: "https://open.spotify.com/track/" + (1000 + i),
        cover_url: "",
      };
    }),
    model_version: "v20260615-mock",
    inference_time_ms: 140 + Math.floor(rnd() * 90),
  };
}

export function featureLabel(key: string): string {
  return (
    FEATURE_LABELS[key] ??
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
