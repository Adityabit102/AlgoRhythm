"""Application settings, loaded from environment / .env (pydantic-settings)."""
from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    environment: str = "development"
    port: int = 8000
    allowed_origins: str = "http://localhost:3000"
    rate_limit_per_minute: int = 30

    # Model serving — when true, the API returns deterministic mock predictions
    # and never imports xgboost/shap. Lets the backend run before a model exists.
    use_mock_model: bool = True

    # Spotify
    spotify_client_id: str = ""
    spotify_client_secret: str = ""

    # AWS / S3
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "ap-south-1"
    s3_bucket_name: str = "algorhythm-artifacts"
    s3_artifact_prefix: str = "artifacts/latest"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()
