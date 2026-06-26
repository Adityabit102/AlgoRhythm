"""Spotify Web API client (Spotipy, Client Credentials flow).

Only instantiated when real inference is requested. In mock mode this module is
never imported, so missing Spotify credentials don't block boot.
"""
from __future__ import annotations

import re
from functools import lru_cache

from core.config import settings

_TRACK_RE = re.compile(r"track[/:]([a-zA-Z0-9]+)")


def extract_track_id(value: str) -> str:
    m = _TRACK_RE.search(value)
    if m:
        return m.group(1)
    return value.strip()


@lru_cache(maxsize=1)
def _client():
    import spotipy
    from spotipy.oauth2 import SpotifyClientCredentials

    auth = SpotifyClientCredentials(
        client_id=settings.spotify_client_id,
        client_secret=settings.spotify_client_secret,
    )
    return spotipy.Spotify(auth_manager=auth)


def fetch_track(track_id: str) -> dict:
    """Return raw track metadata + audio features for a track id."""
    sp = _client()
    meta = sp.track(track_id)
    audio = sp.audio_features([track_id])[0] or {}
    artist_id = meta["artists"][0]["id"]
    artist = sp.artist(artist_id)
    return {"meta": meta, "audio": audio, "artist": artist}
