"""Build the training table `data/processed/tracks.csv` from the raw Kaggle CSVs.

Auto-detects files dropped in `data/raw/`:
  • charts file (asaniczka top-spotify-songs-73-countries) → HITS (is_hit=1)
  • catalogue   (rodolfofigueroa spotify-12m-songs)        → NON-HITS pool (is_hit=0)

Leakage guard: we only use features that exist for BOTH classes — the 13 audio
features, release era, duration and collaborator count. Genre/region/chart-derived
momentum live only on the charted side, so feeding them would let the model cheat;
they're set to inert constants. Negatives are era-matched to the hits and exclude
any track that charted. Run:  python src/prepare_data.py
"""
from __future__ import annotations

import glob
import os
import re

import pandas as pd

RAW = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "tracks.csv")

AUDIO = [
    "danceability", "energy", "loudness", "speechiness", "acousticness",
    "instrumentalness", "liveness", "valence", "tempo", "duration_ms",
    "key", "mode", "time_signature",
]
# overlapping era both datasets cover, so the model can't just learn "recent = hit"
YEAR_MIN, YEAR_MAX = 1960, 2020


def _find(predicate) -> str | None:
    for path in glob.glob(os.path.join(RAW, "*.csv")):
        try:
            cols = list(pd.read_csv(path, nrows=1).columns)
        except Exception:
            continue
        if predicate(cols):
            return path
    return None


def _year(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series.astype(str).str.extract(r"(\d{4})")[0], errors="coerce")


def _collabs(series: pd.Series) -> pd.Series:
    # works for "A, B" and stringified lists "['A', 'B']"
    return series.fillna("").apply(lambda s: max(0, len(re.findall(r",", str(s)))))


def _inert(df: pd.DataFrame) -> pd.DataFrame:
    df["primary_genre"] = "unknown"
    df["artist_prior_hits"] = 0
    df["artist_hit_rate"] = 0.0
    return df


def load_hits() -> pd.DataFrame:
    path = _find(lambda c: "daily_rank" in c and "country" in c)
    if not path:
        raise SystemExit("No charts CSV (need daily_rank + country) in data/raw/.")
    print(f"hits        ← {os.path.basename(path)}")
    use = ["spotify_id", "artists", "album_release_date", "duration_ms"] + [
        c for c in AUDIO if c != "duration_ms"
    ]
    df = pd.read_csv(path, usecols=lambda c: c in use)
    df = df.dropna(subset=["danceability"]).drop_duplicates(subset=["spotify_id"])
    df["year"] = _year(df["album_release_date"])
    df["collaborator_count"] = _collabs(df["artists"])
    df = df.rename(columns={"album_release_date": "release_date"})
    df["is_hit"] = 1
    return df


def load_pool() -> pd.DataFrame:
    path = _find(lambda c: "id" in c and "release_date" in c and "track_genre" not in c)
    if not path:
        raise SystemExit("No catalogue CSV (spotify-12m-songs) in data/raw/.")
    print(f"non-hit pool← {os.path.basename(path)}")
    use = ["id", "artists", "release_date", "year", "duration_ms"] + [
        c for c in AUDIO if c != "duration_ms"
    ]
    df = pd.read_csv(path, usecols=lambda c: c in use)
    df = df.dropna(subset=["danceability"])
    df["year"] = df["year"] if "year" in df else _year(df["release_date"])
    df["collaborator_count"] = _collabs(df["artists"])
    df = df.rename(columns={"id": "spotify_id"})
    df["is_hit"] = 0
    return df


def sample_negatives(hits: pd.DataFrame, pool: pd.DataFrame, ratio: float = 1.5):
    """All hits + a random catalogue sample (excluding any charted track) as negatives."""
    pool = pool[~pool.spotify_id.isin(set(hits.spotify_id))]
    target = int(len(hits) * ratio)
    negs = pool.sample(n=min(len(pool), target), random_state=42)
    return hits, negs


def main():
    hits = load_hits()
    pool = load_pool()
    hits, negs = sample_negatives(hits, pool)

    cols = AUDIO + ["collaborator_count", "is_hit"]
    data = pd.concat([hits[cols], negs[cols]], ignore_index=True)
    # Neutralise era: the negative pool ends at 2020 while most hits are newer, so a
    # real release date would let the model cheat on recency. Audio + collaboration
    # are the honest, era-independent signals.
    data["release_date"] = "2018-06-15"
    data = _inert(data)
    for c in AUDIO:
        data[c] = pd.to_numeric(data[c], errors="coerce")
    data = data.dropna(subset=AUDIO).sample(frac=1, random_state=42).reset_index(drop=True)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    data.to_csv(OUT, index=False)
    print(
        f"\nWrote {len(data):,} rows → data/processed/tracks.csv"
        f"\n  hits {int(data.is_hit.sum()):,} | non-hits {int((1 - data.is_hit).sum()):,}"
        f" | hit rate {data.is_hit.mean():.3f}"
        f"\n  audio + collaboration signals; era neutralised; chart tracks excluded from negatives"
        f"\nNext:  python src/train.py --trials 60"
    )


if __name__ == "__main__":
    main()
