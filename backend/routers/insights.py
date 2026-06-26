"""Reference + insight endpoints: regions, genres, feature importance, era/region
insight summaries, similar hits."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from services import model

router = APIRouter(tags=["insights"])

REGIONS = [
    {"id": "global", "label": "Global", "hit_rate": 0.18},
    {"id": "us", "label": "US", "hit_rate": 0.21},
    {"id": "india", "label": "India", "hit_rate": 0.16},
    {"id": "uk", "label": "UK", "hit_rate": 0.19},
    {"id": "latin", "label": "Latin", "hit_rate": 0.20},
    {"id": "kpop", "label": "K-Pop", "hit_rate": 0.17},
    {"id": "afrobeats", "label": "Afrobeats", "hit_rate": 0.18},
    {"id": "edm", "label": "EDM", "hit_rate": 0.15},
]

GENRES = [
    {"name": "Pop", "hit_rate": 0.31},
    {"name": "Hip-Hop", "hit_rate": 0.27},
    {"name": "Dance", "hit_rate": 0.22},
    {"name": "R&B", "hit_rate": 0.18},
    {"name": "Rock", "hit_rate": 0.14},
    {"name": "Latin", "hit_rate": 0.20},
]

FEATURE_IMPORTANCE = [
    {"feature": "danceability", "importance": 0.142},
    {"feature": "artist_prior_hits", "importance": 0.118},
    {"feature": "energy", "importance": 0.091},
    {"feature": "release_day_of_week_friday", "importance": 0.073},
    {"feature": "dance_energy_product", "importance": 0.064},
    {"feature": "is_streaming_era", "importance": 0.052},
    {"feature": "loudness_normalized", "importance": 0.041},
    {"feature": "has_featured_artist", "importance": 0.037},
]


@router.get("/regions")
def regions():
    return REGIONS


@router.get("/genres")
def genres():
    return GENRES


@router.get("/features/importance")
def feature_importance():
    return {"model_version": model.MODEL_VERSION, "features": FEATURE_IMPORTANCE}


@router.get("/insights/region/{region}")
def region_insight(region: str):
    match = next((r for r in REGIONS if r["id"] == region), None)
    if not match:
        raise HTTPException(status_code=404, detail="Unknown region")
    return {
        "region": region,
        "hit_rate": match["hit_rate"],
        "top_features": ["danceability", "energy", "artist_prior_hits"],
        "summary": f"Hit patterns for {match['label']} — danceability and momentum lead.",
    }


@router.get("/insights/era/{era}")
def era_insight(era: str):
    return {
        "era": era,
        "summary": f"Hit patterns for the {era} era.",
        "median_tempo": 120,
        "dominant_genres": ["Pop", "Hip-Hop"],
    }


@router.get("/similar-hits")
def similar_hits(track: str):
    pred = model.predict(track)
    return {"track_id": pred.track.id, "similar_hits": pred.similar_hits}
