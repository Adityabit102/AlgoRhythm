"""Prediction endpoints: /predict and /batch-predict."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.predict import (
    BatchPredictRequest,
    BatchPredictResponse,
    PredictRequest,
    PredictionResponse,
)
from services import model

router = APIRouter(tags=["predict"])


@router.post("/predict", response_model=PredictionResponse)
def predict(req: PredictRequest):
    if not req.spotify_url.strip():
        raise HTTPException(status_code=400, detail="spotify_url is required")
    return model.predict(req.spotify_url)


@router.post("/batch-predict", response_model=BatchPredictResponse)
def batch_predict(req: BatchPredictRequest):
    if not req.spotify_urls:
        raise HTTPException(status_code=400, detail="spotify_urls is required")
    results = [model.predict(u, variant=i) for i, u in enumerate(req.spotify_urls)]
    return BatchPredictResponse(results=results)
