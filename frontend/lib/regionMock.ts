import type { Region } from "./types";

export interface RegionProfile {
  hitRate: number; // overall hit base-rate
  topFeatures: string[];
  genreHitRates: { genre: string; rate: number }[];
  tempoRange: [number, number];
  fingerprint: Record<string, number>; // normalized audio profile
  divergence: string;
}

/** EDA-derived (mocked) hit fingerprints per region. */
export const REGION_PROFILES: Record<Region, RegionProfile> = {
  global: {
    hitRate: 0.18,
    topFeatures: ["danceability", "artist_prior_hits", "energy"],
    genreHitRates: [
      { genre: "Pop", rate: 0.31 },
      { genre: "Hip-Hop", rate: 0.27 },
      { genre: "Dance", rate: 0.22 },
      { genre: "R&B", rate: 0.18 },
    ],
    tempoRange: [100, 130],
    fingerprint: { danceability: 0.72, energy: 0.68, valence: 0.55, acousticness: 0.18, speechiness: 0.12, liveness: 0.16 },
    divergence: "The global baseline leans danceable, mid-tempo, and momentum-driven.",
  },
  us: {
    hitRate: 0.21,
    topFeatures: ["artist_prior_hits", "energy", "speechiness"],
    genreHitRates: [
      { genre: "Hip-Hop", rate: 0.36 },
      { genre: "Pop", rate: 0.3 },
      { genre: "Country", rate: 0.19 },
      { genre: "R&B", rate: 0.17 },
    ],
    tempoRange: [85, 120],
    fingerprint: { danceability: 0.7, energy: 0.66, valence: 0.5, acousticness: 0.2, speechiness: 0.22, liveness: 0.15 },
    divergence: "Speechiness matters far more in the US — rap dominance pulls the model.",
  },
  india: {
    hitRate: 0.16,
    topFeatures: ["danceability", "valence", "energy"],
    genreHitRates: [
      { genre: "Bollywood", rate: 0.34 },
      { genre: "Punjabi", rate: 0.29 },
      { genre: "Pop", rate: 0.2 },
      { genre: "Indie", rate: 0.12 },
    ],
    tempoRange: [95, 135],
    fingerprint: { danceability: 0.78, energy: 0.74, valence: 0.68, acousticness: 0.22, speechiness: 0.09, liveness: 0.2 },
    divergence: "High valence + danceability — India rewards bright, celebratory tracks.",
  },
  uk: {
    hitRate: 0.19,
    topFeatures: ["energy", "danceability", "loudness_normalized"],
    genreHitRates: [
      { genre: "UK Garage", rate: 0.3 },
      { genre: "Pop", rate: 0.28 },
      { genre: "Grime", rate: 0.24 },
      { genre: "Indie", rate: 0.18 },
    ],
    tempoRange: [120, 140],
    fingerprint: { danceability: 0.71, energy: 0.72, valence: 0.48, acousticness: 0.15, speechiness: 0.15, liveness: 0.18 },
    divergence: "Faster tempos chart in the UK — garage and grime push the BPM band up.",
  },
  latin: {
    hitRate: 0.2,
    topFeatures: ["danceability", "dance_energy_product", "valence"],
    genreHitRates: [
      { genre: "Reggaeton", rate: 0.38 },
      { genre: "Latin Pop", rate: 0.29 },
      { genre: "Bachata", rate: 0.21 },
      { genre: "Trap Latino", rate: 0.19 },
    ],
    tempoRange: [90, 100],
    fingerprint: { danceability: 0.82, energy: 0.7, valence: 0.62, acousticness: 0.16, speechiness: 0.14, liveness: 0.17 },
    divergence: "Reggaeton's ~95 BPM dembow makes danceability the single biggest signal.",
  },
  kpop: {
    hitRate: 0.17,
    topFeatures: ["energy", "danceability", "has_featured_artist"],
    genreHitRates: [
      { genre: "K-Pop", rate: 0.33 },
      { genre: "K-R&B", rate: 0.22 },
      { genre: "K-Hip-Hop", rate: 0.2 },
      { genre: "K-Ballad", rate: 0.14 },
    ],
    tempoRange: [110, 140],
    fingerprint: { danceability: 0.74, energy: 0.8, valence: 0.58, acousticness: 0.12, speechiness: 0.13, liveness: 0.19 },
    divergence: "Energy peaks highest of any region — K-Pop production is maximalist.",
  },
  afrobeats: {
    hitRate: 0.18,
    topFeatures: ["danceability", "valence", "tempo"],
    genreHitRates: [
      { genre: "Afrobeats", rate: 0.35 },
      { genre: "Amapiano", rate: 0.28 },
      { genre: "Afropop", rate: 0.22 },
      { genre: "Highlife", rate: 0.15 },
    ],
    tempoRange: [100, 115],
    fingerprint: { danceability: 0.8, energy: 0.66, valence: 0.64, acousticness: 0.2, speechiness: 0.11, liveness: 0.22 },
    divergence: "Groove over intensity — afrobeats wins on danceability and warmth, not loudness.",
  },
  edm: {
    hitRate: 0.15,
    topFeatures: ["energy", "loudness_normalized", "dance_energy_product"],
    genreHitRates: [
      { genre: "House", rate: 0.27 },
      { genre: "Future Bass", rate: 0.24 },
      { genre: "Techno", rate: 0.18 },
      { genre: "Dubstep", rate: 0.16 },
    ],
    tempoRange: [124, 130],
    fingerprint: { danceability: 0.76, energy: 0.86, valence: 0.5, acousticness: 0.06, speechiness: 0.08, liveness: 0.25 },
    divergence: "Energy and normalized loudness rule — EDM hits live in a tight 124–128 BPM band.",
  },
};
