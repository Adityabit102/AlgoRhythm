"""Find real charting tracks with the most similar audio profile (nearest neighbour
over a few normalised audio features). Reference set built from the chart data."""
from __future__ import annotations

import json
import os
from functools import lru_cache

from schemas.predict import SimilarHit

_FEATS = ["danceability", "energy", "valence", "acousticness", "speechiness", "instrumentalness"]
_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "reference_hits.json")


@lru_cache(maxsize=1)
def _reference() -> list[dict]:
    try:
        with open(_PATH) as fh:
            return json.load(fh)
    except OSError:
        return []


def similar_hits(features: dict, k: int = 5) -> list[SimilarHit]:
    ref = _reference()
    if not ref:
        return []
    target = [float(features.get(f, 0.0)) for f in _FEATS]

    scored = []
    for r in ref:
        d = sum((target[i] - r["f"][f]) ** 2 for i, f in enumerate(_FEATS)) ** 0.5
        scored.append((d, r))
    scored.sort(key=lambda t: t[0])

    out: list[SimilarHit] = []
    for d, r in scored[:k]:
        out.append(
            SimilarHit(
                name=r["name"],
                artist=r["artist"],
                similarity_score=round(1.0 / (1.0 + d), 3),
                spotify_url=f"https://open.spotify.com/track/{r['spotify_id']}",
                cover_url=r.get("cover_url", ""),
            )
        )
    return out
