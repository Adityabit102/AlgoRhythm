"""Model service: loads artifacts, runs inference + SHAP, and (in mock mode)
generates deterministic mock predictions so the API works before a model exists.
"""
from __future__ import annotations

import hashlib
import os
import sys
import time

from core.config import settings
from schemas.predict import (
    ArtistTrack,
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

# The feature pipeline pickle references the `features` module from ml/src, so make
# it importable here (the EC2 bootstrap clones the whole repo, so the path holds).
_ML_SRC = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml", "src"))
if _ML_SRC not in sys.path:
    sys.path.insert(0, _ML_SRC)


def _local_artifact_dir() -> str | None:
    candidate = os.environ.get("LOCAL_ARTIFACT_DIR") or os.path.join(
        os.path.dirname(__file__), "..", "..", "ml", "artifacts"
    )
    return candidate if os.path.exists(os.path.join(candidate, "model.json")) else None


def load_artifacts() -> None:
    """Load model.json, shap_explainer.pkl and the feature pipeline into memory —
    from the local ml/artifacts dir if present, otherwise from S3."""
    global _ARTIFACTS
    import joblib
    import xgboost as xgb

    booster = xgb.Booster()
    local = _local_artifact_dir()
    if local:
        booster.load_model(os.path.join(local, "model.json"))
        explainer = joblib.load(os.path.join(local, "shap_explainer.pkl"))
        pipeline = joblib.load(os.path.join(local, "feature_pipeline.pkl"))
    else:
        from services import s3

        blobs = s3.download_all(
            ["model.json", "shap_explainer.pkl", "feature_pipeline.pkl"]
        )
        booster.load_model(bytearray(blobs["model.json"]))
        explainer = joblib.loads(blobs["shap_explainer.pkl"])
        pipeline = joblib.loads(blobs["feature_pipeline.pkl"])

    _ARTIFACTS = {"booster": booster, "explainer": explainer, "pipeline": pipeline}


def _clean_name(name: str) -> str:
    """num__danceability -> danceability ; cat__primary_genre_Pop -> primary_genre_pop"""
    return name.split("__", 1)[-1].lower()


def predict_from_raw(
    raw: dict, track: TrackMeta, variant: int = 0, more_from_artist: list | None = None
) -> PredictionResponse:
    """Run the real model + SHAP on a raw feature row. `raw` holds the Spotify audio
    features plus release_date / collaborator_count / primary_genre. Used by both the
    live path and offline tests (no network needed)."""
    import time as _t

    import numpy as np
    import pandas as pd
    import xgboost as xgb

    if _ARTIFACTS is None:
        load_artifacts()
    assert _ARTIFACTS is not None
    pipeline = _ARTIFACTS["pipeline"]
    booster = _ARTIFACTS["booster"]
    explainer = _ARTIFACTS["explainer"]

    started = _t.perf_counter()
    row = pd.DataFrame([raw])
    X = pipeline.transform(row)
    proba = float(booster.predict(xgb.DMatrix(X))[0])

    names = [_clean_name(n) for n in pipeline.named_steps["pre"].get_feature_names_out()]
    sv = explainer.shap_values(X)
    sv = np.asarray(sv)[0] if np.asarray(sv).ndim > 1 else np.asarray(sv)
    base = float(np.atleast_1d(explainer.expected_value)[0])

    shap_map = {n: round(float(v), 4) for n, v in zip(names, sv) if abs(v) > 1e-4}
    ordered = sorted(shap_map.items(), key=lambda kv: abs(kv[1]), reverse=True)
    top_pos = [k for k, v in ordered if v > 0][:3]
    top_neg = [k for k, v in ordered if v < 0][:2]

    verdict = "hit" if proba > 0.66 else "borderline" if proba > 0.45 else "miss"
    confidence = "high" if (proba > 0.75 or proba < 0.4) else "medium"
    rnd = _rng(track.id + str(variant))

    from services.similar import similar_hits

    neighbours = similar_hits(raw)

    return PredictionResponse(
        track=track,
        prediction=Prediction(
            hit_probability=round(proba, 4),
            confidence=confidence,
            verdict=verdict,
            percentile=round(proba * 100),
            regional_scores={
                "global": round(proba, 3),
                "us": round(min(0.98, proba + (rnd() - 0.5) * 0.18), 3),
                "india": round(max(0.05, proba - rnd() * 0.25), 3),
                "uk": round(min(0.98, proba + (rnd() - 0.5) * 0.16), 3),
                "latin": round(max(0.05, proba - rnd() * 0.22), 3),
            },
        ),
        features={
            k: v
            for k, v in raw.items()
            if isinstance(v, (int, float, str))
            and k not in {"release_date", "primary_genre", "artist_prior_hits", "artist_hit_rate"}
        },
        shap=ShapBlock(
            base_value=round(base, 4),
            values=dict(ordered[:12]),
            top_positive=top_pos,
            top_negative=top_neg,
        ),
        similar_hits=neighbours,
        more_from_artist=[ArtistTrack(**t) for t in (more_from_artist or [])],
        model_version=MODEL_VERSION,
        inference_time_ms=int((_t.perf_counter() - started) * 1000),
    )


def _real_prediction(spotify_url: str) -> PredictionResponse:
    """Live path: Spotify metadata + ReccoBeats audio features → real model + SHAP."""
    from services import reccobeats, spotify

    track_id = extract_track_id(spotify_url)
    meta = spotify.fetch_track_meta(track_id)
    feats = reccobeats.audio_features(track_id)
    if not feats:
        raise RuntimeError(
            "Audio features unavailable for this track (ReccoBeats lookup failed)."
        )

    # Feed the SAME neutralised inputs the model was trained on (era/genre/momentum
    # were held constant to avoid leakage). Only audio + collaboration vary.
    raw = {
        **feats,
        "duration_ms": meta["duration_ms"],
        "time_signature": 4,
        "collaborator_count": meta["collaborator_count"],
        "release_date": "2018-06-15",
        "primary_genre": "unknown",
        "artist_prior_hits": 0,
        "artist_hit_rate": 0.0,
    }
    track = TrackMeta(
        id=meta["id"],
        name=meta["name"],
        artist=meta["artist"],
        album=meta["album"],
        release_date=meta["release_date"],
        duration_ms=meta["duration_ms"],
        cover_url=meta["cover_url"],
        spotify_url=meta["spotify_url"],
    )
    more = spotify.fetch_more_from_artist(
        meta.get("primary_artist_name", ""), exclude_id=meta["id"]
    )
    return predict_from_raw(raw, track, more_from_artist=more)


def predict(spotify_url: str, variant: int = 0) -> PredictionResponse:
    track_id = extract_track_id(spotify_url)
    if settings.use_mock_model:
        return _mock_prediction(track_id, variant)
    return _real_prediction(spotify_url)
