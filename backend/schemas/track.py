"""Track + reference data schemas."""
from __future__ import annotations

from pydantic import BaseModel

from .predict import TrackMeta


class TrackFeatures(BaseModel):
    track: TrackMeta
    features: dict[str, float | str]


class RegionInfo(BaseModel):
    id: str
    label: str
    hit_rate: float


class GenreInfo(BaseModel):
    name: str
    hit_rate: float
