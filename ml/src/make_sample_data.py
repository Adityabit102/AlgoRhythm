"""Generate a synthetic but realistic training CSV so the whole pipeline runs
end-to-end before the real Spotify/chart datasets are assembled.

The signal is intentionally aligned with the EDA story beats (danceability floor,
Friday effect, momentum, streaming era) so a trained model finds sensible SHAP
patterns. Replace ml/data/processed/tracks.csv with the real merged dataset when
ready — the columns are the contract.
"""
from __future__ import annotations

import argparse
import os

import numpy as np
import pandas as pd

GENRES = ["Pop", "Hip-Hop", "Dance", "R&B", "Rock", "Latin", "K-Pop", "Afrobeats"]


def make(n: int, seed: int = 7) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    danceability = np.clip(rng.beta(5, 3, n), 0, 1)
    energy = np.clip(rng.beta(4, 3, n), 0, 1)
    valence = np.clip(rng.beta(3, 3, n), 0, 1)
    acousticness = np.clip(rng.beta(2, 5, n), 0, 1)
    instrumentalness = np.clip(rng.beta(1.5, 8, n), 0, 1)
    speechiness = np.clip(rng.beta(1.5, 8, n), 0, 1)
    liveness = np.clip(rng.beta(2, 6, n), 0, 1)
    loudness = rng.normal(-8, 3, n)
    tempo = np.clip(rng.normal(118, 20, n), 50, 210)
    duration_ms = rng.normal(195000, 45000, n).astype(int)
    key = rng.integers(0, 12, n)
    mode = rng.integers(0, 2, n)
    time_signature = np.full(n, 4)

    year = rng.integers(1995, 2025, n)
    month = rng.integers(1, 13, n)
    dow = rng.integers(0, 7, n)
    # bias release day toward Friday for ~40%
    dow = np.where(rng.random(n) < 0.4, 4, dow)
    release_date = pd.to_datetime(
        dict(year=year, month=month, day=np.clip(rng.integers(1, 28, n), 1, 28))
    )

    artist_prior_hits = rng.poisson(2.2, n)
    artist_hit_rate = np.clip(rng.beta(2, 6, n), 0, 1)
    collaborator_count = rng.binomial(2, 0.3, n)
    primary_genre = rng.choice(GENRES, n)

    # ── latent hit propensity aligned with the EDA story ──
    z = (
        2.6 * (danceability - 0.55)          # danceability floor
        + 1.4 * energy
        + 0.9 * (dow == 4)                    # Friday effect
        + 0.18 * artist_prior_hits           # momentum (saturating below)
        + 0.8 * (collaborator_count > 0)     # featured-artist lift
        + 0.7 * (year >= 2015)               # streaming era
        - 1.3 * acousticness
        - 1.1 * speechiness
        + rng.normal(0, 1.0, n)
    )
    z -= 0.02 * np.maximum(0, artist_prior_hits - 8) * artist_prior_hits  # plateau
    prob = 1 / (1 + np.exp(-z))
    # target ~40% positive rate
    threshold = np.quantile(prob, 0.6)
    is_hit = (prob >= threshold).astype(int)

    return pd.DataFrame(
        dict(
            danceability=danceability, energy=energy, loudness=loudness,
            speechiness=speechiness, acousticness=acousticness,
            instrumentalness=instrumentalness, liveness=liveness, valence=valence,
            tempo=tempo, duration_ms=duration_ms, key=key, mode=mode,
            time_signature=time_signature, release_date=release_date,
            artist_prior_hits=artist_prior_hits, artist_hit_rate=artist_hit_rate,
            collaborator_count=collaborator_count, primary_genre=primary_genre,
            is_hit=is_hit,
        )
    )


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=20000)
    ap.add_argument(
        "--out",
        default=os.path.join(os.path.dirname(__file__), "..", "data", "processed", "tracks.csv"),
    )
    args = ap.parse_args()
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    df = make(args.n)
    df.to_csv(args.out, index=False)
    print(f"Wrote {len(df):,} rows to {args.out} | hit rate {df.is_hit.mean():.3f}")
