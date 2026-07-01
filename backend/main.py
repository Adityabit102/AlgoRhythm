"""AlgoRhythm FastAPI inference server — app entrypoint."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from core.config import settings
from core.middleware import setup_middleware
from routers import health, insights, predict, track


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model artifacts (local dir or S3) at startup unless in mock mode.
    # Don't crash the whole service if it fails — /health should still respond.
    if not settings.use_mock_model:
        try:
            from services.model import load_artifacts

            load_artifacts()
        except Exception as e:  # noqa: BLE001
            import logging

            logging.getLogger("algorhythm").error("artifact load failed: %s", e)
    yield


app = FastAPI(
    title="AlgoRhythm API",
    description="Music hit prediction — XGBoost + SHAP, served live.",
    version="1.0.0",
    lifespan=lifespan,
)

setup_middleware(app)

app.include_router(health.router)
app.include_router(predict.router)
app.include_router(track.router)
app.include_router(insights.router)


@app.get("/", tags=["health"])
def root():
    return {"service": "AlgoRhythm API", "docs": "/docs", "health": "/health"}
