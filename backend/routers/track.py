"""Track metadata endpoint: /track/{id}."""
from __future__ import annotations

from fastapi import APIRouter

from schemas.track import TrackFeatures
from services import model

router = APIRouter(tags=["track"])


@router.get("/track/{spotify_id}", response_model=TrackFeatures)
def get_track(spotify_id: str):
    """Fetch metadata + audio features without running a prediction."""
    pred = model.predict(spotify_id)
    return TrackFeatures(track=pred.track, features=pred.features)
