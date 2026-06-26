"""Health check endpoint."""
from __future__ import annotations

import time

from fastapi import APIRouter

from core.config import settings
from services.model import MODEL_VERSION

router = APIRouter(tags=["health"])
_STARTED = time.time()


@router.get("/health")
def health():
    return {
        "status": "ok",
        "model_version": MODEL_VERSION,
        "mock_mode": settings.use_mock_model,
        "uptime_seconds": round(time.time() - _STARTED, 1),
        "artifact_prefix": settings.s3_artifact_prefix,
    }
