"""Turn the raw Kaggle CSVs into the training table `data/processed/tracks.csv`.

Auto-detects two files dropped in `data/raw/`:
  • the charts file  (asaniczka top-spotify-songs-73-countries) → positives (is_hit=1)
  • the genre file   (maharshipandya spotify-tracks-dataset)     → negatives (is_hit=0)

Spotify deprecated live audio features, so we rely on the features already present
in these pre-scraped datasets. Run:  python src/prepare_data.py
"""
from __future__ import annotations

import glob
import os

import numpy as np
import pandas as pd

RAW = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "tracks.csv")

AUDIO = [
    "danceability", "energy", "loudness", "speechiness", "acousticness",
    "instrumentalness", "liveness", "valence", "tempo", "duration_ms",
    "key", "mode", "time_signature",
]


def _find(predicate) -> str | None:
    for path in glob.glob(os.path.join(RAW, "*.csv")):
        try:
            cols = pd.read_csv(path, nrows=1).columns
        except Exception:
            continue
        if predicate(cols):
            return path
    return None


def load_positives() -> pd.DataFrame:
    """Charted tracks (top-50 in any of 73 countries) → hits."""
    path = _find(lambda c: "daily_rank" in c and "country" in c)
    if not path:
        raise SystemExit("No charts CSV found in data/raw/ (need daily_rank + country).")
    print(f"positives ← {os.path.basename(path)}")
    df = pd.read_csv(path)
    df = df.dropna(subset=["danceability"])  # drop rows scraped after the API cutoff
    id_col = "spotify_id" if "spotify_id" in df else "track_id"
    df["collaborator_count"] = df["artists"].fillna("").apply(
        lambda s: max(0, len(str(s).split(", ")) - 1)
    )
    df["release_date"] = df.get("album_release_date", "2020-01-01")
    df["primary_genre"] = "unknown"
    # one row per track (best chart rank)
    df = df.sort_values("daily_rank").drop_duplicates(subset=[id_col], keep="first")
    keep = AUDIO + ["collaborator_count", "release_date", "primary_genre"]
    out = df[[c for c in keep if c in df]].copy()
    # artist momentum: prior charting tracks per primary artist
    df["primary_artist"] = df["artists"].fillna("").apply(lambda s: str(s).split(", ")[0])
    counts = df.groupby("primary_artist")[id_col].transform("count")
    out["artist_prior_hits"] = (counts - 1).clip(lower=0).values
    out["artist_hit_rate"] = 0.5
    out["is_hit"] = 1
    return out


def load_negatives() -> pd.DataFrame:
    """Genre catalogue tracks (not chart-derived) → non-hits."""
    path = _find(lambda c: "track_genre" in c)
    if not path:
        print("No genre CSV found — using synthetic-style negatives is recommended.")
        return pd.DataFrame()
    print(f"negatives ← {os.path.basename(path)}")
    df = pd.read_csv(path).dropna(subset=["danceability"])
    df["collaborator_count"] = df["artists"].fillna("").apply(
        lambda s: max(0, len(str(s).split(";")) - 1)
    )
    df["release_date"] = "2019-01-01"
    df["primary_genre"] = df.get("track_genre", "unknown")
    df["artist_prior_hits"] = 0
    df["artist_hit_rate"] = 0.0
    df["is_hit"] = 0
    keep = AUDIO + [
        "collaborator_count", "release_date", "primary_genre",
        "artist_prior_hits", "artist_hit_rate", "is_hit",
    ]
    return df[[c for c in keep if c in df]].copy()


def main():
    pos = load_positives()
    neg = load_negatives()

    if not neg.empty:
        # target ~40/60 hit/non-hit (PRD): cap negatives at 1.5× positives
        n_neg = min(len(neg), int(len(pos) * 1.5))
        neg = neg.sample(n=n_neg, random_state=42)

    data = pd.concat([pos, neg], ignore_index=True)
    for c in AUDIO:
        data[c] = pd.to_numeric(data[c], errors="coerce")
    data = data.dropna(subset=AUDIO).sample(frac=1, random_state=42).reset_index(drop=True)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    data.to_csv(OUT, index=False)
    print(
        f"\nWrote {len(data):,} rows → {OUT}"
        f"\n  hits {int(data.is_hit.sum()):,} | non-hits {int((1 - data.is_hit).sum()):,}"
        f" | hit rate {data.is_hit.mean():.3f}"
    )
    print("Now run:  python src/train.py --trials 60")


if __name__ == "__main__":
    main()
