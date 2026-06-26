/**
 * TypeScript types mirroring the FastAPI `/predict` response schema (PRD §4.7).
 * Keep in sync with backend/schemas/predict.py.
 */

export type Region =
  | "global"
  | "us"
  | "india"
  | "uk"
  | "latin"
  | "kpop"
  | "afrobeats"
  | "edm";

export const REGIONS: { id: Region; label: string; flag: string }[] = [
  { id: "global", label: "Global", flag: "🌍" },
  { id: "us", label: "US", flag: "🇺🇸" },
  { id: "india", label: "India", flag: "🇮🇳" },
  { id: "uk", label: "UK", flag: "🇬🇧" },
  { id: "latin", label: "Latin", flag: "🌶️" },
  { id: "kpop", label: "K-Pop", flag: "🇰🇷" },
  { id: "afrobeats", label: "Afrobeats", flag: "🥁" },
  { id: "edm", label: "EDM", flag: "🎛️" },
];

export type Verdict = "hit" | "miss" | "borderline";
export type Confidence = "low" | "medium" | "high";

export interface TrackMeta {
  id: string;
  name: string;
  artist: string;
  album: string;
  release_date: string;
  duration_ms: number;
  cover_url: string;
  spotify_url: string;
}

export interface Prediction {
  hit_probability: number; // 0..1
  confidence: Confidence;
  verdict: Verdict;
  percentile: number;
  regional_scores: Partial<Record<Region, number>>;
}

export interface ShapBlock {
  base_value: number;
  values: Record<string, number>;
  top_positive: string[];
  top_negative: string[];
}

export interface SimilarHit {
  name: string;
  artist: string;
  similarity_score: number;
  spotify_url: string;
  cover_url?: string;
}

export interface PredictionResponse {
  track: TrackMeta;
  prediction: Prediction;
  features: Record<string, number | string>;
  shap: ShapBlock;
  similar_hits: SimilarHit[];
  model_version: string;
  inference_time_ms: number;
}

/** Human-readable copy for a feature key, used in spotlight cards. */
export interface FeatureExplanation {
  key: string;
  label: string;
  blurb: string;
}
