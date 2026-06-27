"""Prediction endpoints: /predict and /batch-predict."""
from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from schemas.predict import (
    BatchPredictRequest,
    BatchPredictResponse,
    PredictRequest,
    PredictionResponse,
)
from services import model

router = APIRouter(tags=["predict"])
log = logging.getLogger("algorhythm.predict")


@router.post("/predict", response_model=PredictionResponse)
def predict(req: PredictRequest):
    if not req.spotify_url.strip():
        raise HTTPException(status_code=400, detail="spotify_url is required")
    try:
        return model.predict(req.spotify_url)
    except Exception as e:  # unanalysable track / upstream timeout
        log.warning("predict failed for %s: %s", req.spotify_url, e)
        raise HTTPException(
            status_code=422,
            detail="Couldn't analyze this track — its audio features aren't available. Try a more popular track.",
        )


@router.post("/batch-predict", response_model=BatchPredictResponse)
def batch_predict(req: BatchPredictRequest):
    if not req.spotify_urls:
        raise HTTPException(status_code=400, detail="spotify_urls is required")
    results = []
    for i, u in enumerate(req.spotify_urls):
        try:
            results.append(model.predict(u, variant=i))
        except Exception as e:  # one bad track shouldn't sink the whole comparison
            log.warning("batch item %s failed (%s): %s", i, u, e)
    if not results:
        raise HTTPException(
            status_code=422,
            detail="None of those tracks could be analyzed. Try more popular tracks.",
        )
    return BatchPredictResponse(results=results)
