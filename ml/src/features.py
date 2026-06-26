"""Feature engineering for AlgoRhythm.

Turns raw track rows (Spotify audio features + chart/artist metadata) into the
engineered feature matrix the model trains on. The exact same transform must run
at inference time in the backend, so everything here is wrapped in an
sklearn-compatible pipeline that gets serialized to feature_pipeline.pkl.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Base audio features straight from the Spotify API.
AUDIO_FEATURES = [
    "danceability", "energy", "loudness", "speechiness", "acousticness",
    "instrumentalness", "liveness", "valence", "tempo", "duration_ms",
    "key", "mode", "time_signature",
]

# Engineered numeric features produced by EngineeredFeatures below.
ENGINEERED_NUMERIC = [
    "release_month", "release_quarter", "release_dow", "is_streaming_era",
    "artist_prior_hits", "artist_hit_rate", "is_debut_track",
    "has_featured_artist", "collaborator_count",
    "energy_valence_ratio", "dance_energy_product", "loudness_normalized",
    "acoustic_vs_electric", "genre_era_hit_rate",
]

CATEGORICAL = ["primary_genre", "tempo_bucket", "release_era"]


class EngineeredFeatures(BaseEstimator, TransformerMixin):
    """Row-wise feature engineering. Stateless except for genre/era hit-rate
    lookups, which are fit on the training set."""

    def __init__(self) -> None:
        self.genre_era_hit_rate_: dict[tuple, float] = {}
        self.global_hit_rate_: float = 0.18

    # ── helpers ───────────────────────────────────────────────────────────
    @staticmethod
    def _release_era(year: int) -> str:
        if year < 2000:
            return "pre2000"
        if year < 2010:
            return "2000s"
        if year < 2015:
            return "2010s"
        if year < 2020:
            return "streaming"
        return "post2020"

    @staticmethod
    def _tempo_bucket(bpm: float) -> str:
        if bpm < 90:
            return "slow"
        if bpm < 120:
            return "mid"
        if bpm < 140:
            return "uptempo"
        return "fast"

    def fit(self, X: pd.DataFrame, y=None):
        df = self._engineer(X.copy())
        if y is not None:
            df = df.assign(_y=np.asarray(y))
            self.global_hit_rate_ = float(df["_y"].mean())
            grp = df.groupby(["primary_genre", "release_era"])["_y"].mean()
            self.genre_era_hit_rate_ = grp.to_dict()
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        df = self._engineer(X.copy())
        df["genre_era_hit_rate"] = [
            self.genre_era_hit_rate_.get((g, e), self.global_hit_rate_)
            for g, e in zip(df["primary_genre"], df["release_era"])
        ]
        cols = AUDIO_FEATURES + ENGINEERED_NUMERIC + CATEGORICAL
        return df[cols]

    # ── core engineering ──────────────────────────────────────────────────
    def _engineer(self, df: pd.DataFrame) -> pd.DataFrame:
        rel = pd.to_datetime(df["release_date"], errors="coerce")
        rel = rel.fillna(pd.Timestamp("2018-01-01"))
        df["release_month"] = rel.dt.month
        df["release_quarter"] = rel.dt.quarter
        df["release_dow"] = rel.dt.dayofweek  # 0=Mon ... 4=Fri
        year = rel.dt.year
        df["release_era"] = year.map(self._release_era)
        df["is_streaming_era"] = (year >= 2015).astype(int)

        df["collaborator_count"] = df.get("collaborator_count", 0)
        df["has_featured_artist"] = (df["collaborator_count"] > 0).astype(int)
        df["artist_prior_hits"] = df.get("artist_prior_hits", 0)
        df["artist_hit_rate"] = df.get("artist_hit_rate", 0.0)
        df["is_debut_track"] = (df["artist_prior_hits"] == 0).astype(int)

        eps = 1e-6
        df["energy_valence_ratio"] = df["energy"] / (df["valence"] + eps)
        df["dance_energy_product"] = df["danceability"] * df["energy"]
        # mastering loudness-war correction: pre-streaming tracks were hotter
        df["loudness_normalized"] = df["loudness"] + np.where(
            df["is_streaming_era"] == 1, 0.0, 2.0
        )
        df["acoustic_vs_electric"] = df["acousticness"] - df["instrumentalness"]
        df["tempo_bucket"] = df["tempo"].map(self._tempo_bucket)
        df["primary_genre"] = df.get("primary_genre", "unknown").fillna("unknown")
        return df


def build_feature_pipeline() -> Pipeline:
    """The full transform: engineering → scale numerics + one-hot categoricals."""
    numeric = AUDIO_FEATURES + ENGINEERED_NUMERIC
    pre = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ]
    )
    return Pipeline([("engineer", EngineeredFeatures()), ("pre", pre)])
