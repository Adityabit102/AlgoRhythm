"""AlgoRhythm FastAPI inference server — app entrypoint."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from core.config import settings
from core.middleware import setup_middleware
from routers import health, insights, predict, track


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model artifacts from S3 at startup unless running in mock mode.
    if not settings.use_mock_model:
        from services.model import load_artifacts

        load_artifacts()
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
