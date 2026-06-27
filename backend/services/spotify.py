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


def fetch_track_meta(track_id: str) -> dict:
    """Return track metadata for the UI (name, artist, album, cover, release date,
    popularity, collaborators, genre). Metadata is NOT part of the deprecated
    audio-features endpoint, so this still works for new apps."""
    sp = _client()
    meta = sp.track(track_id)
    artists = meta.get("artists", [])
    primary_artist = sp.artist(artists[0]["id"]) if artists else {}
    images = meta.get("album", {}).get("images", [])
    return {
        "id": meta["id"],
        "name": meta["name"],
        "artist": ", ".join(a["name"] for a in artists) or "Unknown",
        "album": meta.get("album", {}).get("name", ""),
        "release_date": meta.get("album", {}).get("release_date", "2020-01-01"),
        "duration_ms": meta.get("duration_ms", 0),
        "cover_url": images[0]["url"] if images else "",
        "spotify_url": meta.get("external_urls", {}).get("spotify", ""),
        "collaborator_count": max(0, len(artists) - 1),
        "primary_genre": (primary_artist.get("genres") or ["unknown"])[0],
        "popularity": meta.get("popularity", 0),
        "primary_artist_name": artists[0]["name"] if artists else "",
    }


def fetch_track_covers(track_ids: list[str]) -> dict[str, str]:
    """Batch album-art lookup (one call for up to 50 tracks). Metadata still works."""
    ids = [t for t in track_ids if t]
    if not ids:
        return {}
    sp = _client()
    try:
        tracks = sp.tracks(ids[:50]).get("tracks", [])
    except Exception:
        return {}
    covers = {}
    for t in tracks:
        if not t:
            continue
        imgs = t.get("album", {}).get("images", [])
        covers[t["id"]] = imgs[0]["url"] if imgs else ""
    return covers


def fetch_more_from_artist(artist_name: str, exclude_id: str = "", limit: int = 5) -> list[dict]:
    """More tracks by the same artist via search (top-tracks is 403 for new apps)."""
    if not artist_name:
        return []
    sp = _client()
    try:
        items = sp.search(q=f'artist:"{artist_name}"', type="track", limit=10, market="US")
        items = items.get("tracks", {}).get("items", [])
    except Exception:
        return []
    out, seen = [], set()
    for t in items:
        if t["id"] == exclude_id or t["name"] in seen:
            continue
        seen.add(t["name"])
        imgs = t.get("album", {}).get("images", [])
        out.append({
            "name": t["name"],
            "artist": ", ".join(a["name"] for a in t.get("artists", [])),
            "spotify_url": t.get("external_urls", {}).get("spotify", ""),
            "cover_url": imgs[0]["url"] if imgs else "",
        })
        if len(out) >= limit:
            break
    return out
