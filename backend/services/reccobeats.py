"""ReccoBeats audio-features client — the drop-in replacement for Spotify's
deprecated /audio-features endpoint (removed for new apps on 2024-11-27).

Flow: Spotify track id → look up the ReccoBeats track → fetch its audio features.
"""
from __future__ import annotations

import httpx

BASE = "https://api.reccobeats.com/v1"

# Spotify audio-feature keys the model expects.
FEATURE_KEYS = [
    "danceability", "energy", "loudness", "speechiness", "acousticness",
    "instrumentalness", "liveness", "valence", "tempo", "key", "mode",
    "duration_ms", "time_signature",
]


def _recco_id(client: httpx.Client, spotify_id: str) -> str | None:
    """Map a Spotify track id to a ReccoBeats track id."""
    r = client.get(f"{BASE}/track", params={"ids": spotify_id})
    r.raise_for_status()
    data = r.json()
    items = data.get("content") or data.get("tracks") or data.get("data") or []
    if isinstance(items, list) and items:
        return items[0].get("id")
    return None


def audio_features(spotify_id: str) -> dict[str, float] | None:
    """Return Spotify-style audio features for a track, or None if unavailable."""
    try:
        with httpx.Client(timeout=10) as client:
            rid = _recco_id(client, spotify_id)
            if not rid:
                return None
            r = client.get(f"{BASE}/track/{rid}/audio-features")
            r.raise_for_status()
            feats = r.json()
            # normalise to the exact keys the feature pipeline wants
            out: dict[str, float] = {}
            for k in FEATURE_KEYS:
                if k in feats and feats[k] is not None:
                    out[k] = float(feats[k])
            return out or None
    except (httpx.HTTPError, ValueError, KeyError):
        return None
