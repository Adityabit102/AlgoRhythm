"""Model service: loads artifacts, runs inference + SHAP, and (in mock mode)
generates deterministic mock predictions so the API works before a model exists.
"""
from __future__ import annotations

import hashlib
import math
import time

from core.config import settings
from schemas.predict import (
    Prediction,
    PredictionResponse,
    ShapBlock,
    SimilarHit,
    TrackMeta,
)
from services.spotify import extract_track_id

MODEL_VERSION = "v20260615-mock" if settings.use_mock_model else "v20260615"

_TRACKS = [
    ("Neon Gravity", "Lumen Drift", "Afterglow"),
    ("Paper Hearts", "Marisol Vega", "Cassette Sun"),
    ("Midnight Algorithm", "The Hex Collective", "Static"),
    ("Golden Hour Riot", "KOSMO", "Daybreak"),
]


def _rng(seed: str):
    """Deterministic [0,1) generator seeded by a string."""
    h = int(hashlib.sha256(seed.encode()).hexdigest(), 16)
    state = h % (2**32)

    def nxt() -> float:
        nonlocal state
        state = (1103515245 * state + 12345) % (2**31)
        return state / (2**31)

    return nxt


def _mock_prediction(track_id: str, variant: int = 0) -> PredictionResponse:
    started = time.perf_counter()
    rnd = _rng(track_id + str(variant))
    name, artist, album = _TRACKS[int(rnd() * len(_TRACKS)) % len(_TRACKS)]

    prob = 0.32 + rnd() * 0.6
    verdict = "hit" if prob > 0.66 else "borderline" if prob > 0.45 else "miss"
    confidence = "high" if (prob > 0.75 or prob < 0.4) else "medium"

    raw_shap = {
        "danceability": 0.16 * (rnd() - 0.25),
        "artist_prior_hits": 0.13 * (rnd() - 0.2),
        "energy": 0.09 * (rnd() - 0.3),
        "release_day_of_week_friday": 0.07 * (rnd() - 0.2),
        "dance_energy_product": 0.06 * (rnd() - 0.35),
        "is_streaming_era": 0.05 * (rnd() - 0.3),
        "valence": 0.05 * (rnd() - 0.55),
        "has_featured_artist": 0.04 * (rnd() - 0.4),
        "loudness_normalized": 0.04 * (rnd() - 0.5),
        "acousticness": -0.08 * rnd(),
        "speechiness": -0.05 * rnd(),
        "tempo": 0.03 * (rnd() - 0.5),
    }
    ordered = sorted(raw_shap.items(), key=lambda kv: abs(kv[1]), reverse=True)
    top_pos = [k for k, v in ordered if v > 0][:3]
    top_neg = [k for k, v in ordered if v < 0][:2]

    features = {
        "danceability": round(0.5 + rnd() * 0.45, 2),
        "energy": round(0.45 + rnd() * 0.5, 2),
        "valence": round(0.2 + rnd() * 0.7, 2),
        "acousticness": round(rnd() * 0.5, 2),
        "speechiness": round(rnd() * 0.3, 2),
        "tempo": round(90 + rnd() * 70),
        "artist_prior_hits": int(rnd() * 18),
        "release_day_of_week": "Friday",
    }

    resp = PredictionResponse(
        track=TrackMeta(
            id=track_id,
            name=name,
            artist=artist,
            album=album,
            release_date="2024-09-13",
            duration_ms=168000 + int(rnd() * 80000),
            cover_url="",
            spotify_url=f"https://open.spotify.com/track/{track_id}",
        ),
        prediction=Prediction(
            hit_probability=round(prob, 4),
            confidence=confidence,
            verdict=verdict,
            percentile=round(prob * 100),
            regional_scores={
                "global": round(prob, 3),
                "us": round(min(0.98, prob + (rnd() - 0.5) * 0.2), 3),
                "india": round(max(0.05, prob - rnd() * 0.3), 3),
                "uk": round(min(0.98, prob + (rnd() - 0.5) * 0.18), 3),
                "latin": round(max(0.05, prob - rnd() * 0.25), 3),
                "kpop": round(max(0.05, prob - rnd() * 0.2), 3),
            },
        ),
        features=features,
        shap=ShapBlock(
            base_value=0.41,
            values={k: round(v, 4) for k, v in raw_shap.items()},
            top_positive=top_pos,
            top_negative=top_neg,
        ),
        similar_hits=[
            SimilarHit(
                name=_TRACKS[(variant + i) % len(_TRACKS)][0],
                artist=_TRACKS[(variant + i) % len(_TRACKS)][1],
                similarity_score=round(0.99 - i * 0.04 - rnd() * 0.02, 2),
                spotify_url=f"https://open.spotify.com/track/{1000 + i}",
            )
            for i in range(5)
        ],
        model_version=MODEL_VERSION,
        inference_time_ms=int((time.perf_counter() - started) * 1000) + 140,
    )
    return resp


# ── Real inference path (lazy — only touched when use_mock_model is False) ──

_ARTIFACTS: dict | None = None


def load_artifacts() -> None:
    """Pull model.json, shap_explainer.pkl and the feature pipeline from S3 and
    cache them in memory. Called from the app lifespan when not in mock mode."""
    global _ARTIFACTS
    import joblib  # noqa: F401  (lazy ML deps)
    import xgboost as xgb
    from services import s3

    blobs = s3.download_all(
        ["model.json", "shap_explainer.pkl", "feature_pipeline.pkl"]
    )
    booster = xgb.Booster()
    booster.load_model(bytearray(blobs["model.json"]))
    _ARTIFACTS = {
        "booster": booster,
        "explainer": joblib.loads(blobs["shap_explainer.pkl"]),
        "pipeline": joblib.loads(blobs["feature_pipeline.pkl"]),
    }


def _real_prediction(spotify_url: str) -> PredictionResponse:
    # Wire up once artifacts + feature pipeline exist (Phase 13).
    raise NotImplementedError(
        "Real inference requires trained artifacts in S3. "
        "Set USE_MOCK_MODEL=1 until the model is trained and uploaded."
    )


def predict(spotify_url: str, variant: int = 0) -> PredictionResponse:
    track_id = extract_track_id(spotify_url)
    if settings.use_mock_model:
        return _mock_prediction(track_id, variant)
    return _real_prediction(spotify_url)
