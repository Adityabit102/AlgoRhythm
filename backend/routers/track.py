"""Track metadata endpoint: /track/{id}."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.track import TrackFeatures
from services import model

router = APIRouter(tags=["track"])


@router.get("/track/{spotify_id}", response_model=TrackFeatures)
def get_track(spotify_id: str):
    """Fetch metadata + audio features without running a prediction."""
    try:
        pred = model.predict(spotify_id)
    except Exception:
        raise HTTPException(status_code=422, detail="Track unavailable.")
    return TrackFeatures(track=pred.track, features=pred.features)
