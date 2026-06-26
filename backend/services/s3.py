"""S3 artifact download + in-memory cache (boto3).

Loads the versioned model artifacts at startup and caches them. Skipped entirely
in mock mode.
"""
from __future__ import annotations

import io
import os
from functools import lru_cache

from core.config import settings

# local cache dir for downloaded artifacts
ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "..", ".artifacts")


@lru_cache(maxsize=1)
def _s3():
    import boto3

    return boto3.client(
        "s3",
        region_name=settings.aws_region,
        aws_access_key_id=settings.aws_access_key_id or None,
        aws_secret_access_key=settings.aws_secret_access_key or None,
    )


def download_artifact(key: str) -> bytes:
    """Fetch a single artifact object's bytes from the configured bucket/prefix."""
    full_key = f"{settings.s3_artifact_prefix.rstrip('/')}/{key}"
    buf = io.BytesIO()
    _s3().download_fileobj(settings.s3_bucket_name, full_key, buf)
    return buf.getvalue()


def download_all(keys: list[str]) -> dict[str, bytes]:
    return {k: download_artifact(k) for k in keys}
