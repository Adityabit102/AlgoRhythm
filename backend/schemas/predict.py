"""Pydantic request/response models for prediction endpoints (mirrors PRD §4.7
and frontend/lib/types.ts)."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Verdict = Literal["hit", "miss", "borderline"]
Confidence = Literal["low", "medium", "high"]


class PredictRequest(BaseModel):
    spotify_url: str = Field(..., description="Spotify track URL, URI, or bare ID")


class BatchPredictRequest(BaseModel):
    spotify_urls: list[str] = Field(..., max_length=10)


class TrackMeta(BaseModel):
    id: str
    name: str
    artist: str
    album: str
    release_date: str
    duration_ms: int
    cover_url: str
    spotify_url: str


class Prediction(BaseModel):
    hit_probability: float
    confidence: Confidence
    verdict: Verdict
    percentile: int
    regional_scores: dict[str, float]


class ShapBlock(BaseModel):
    base_value: float
    values: dict[str, float]
    top_positive: list[str]
    top_negative: list[str]


class SimilarHit(BaseModel):
    name: str
    artist: str
    similarity_score: float
    spotify_url: str
    cover_url: str = ""


class ArtistTrack(BaseModel):
    name: str
    artist: str
    spotify_url: str
    cover_url: str = ""


class PredictionResponse(BaseModel):
    track: TrackMeta
    prediction: Prediction
    features: dict[str, float | str]
    shap: ShapBlock
    similar_hits: list[SimilarHit]
    more_from_artist: list[ArtistTrack] = []
    model_version: str
    inference_time_ms: int


class BatchPredictResponse(BaseModel):
    results: list[PredictionResponse]
