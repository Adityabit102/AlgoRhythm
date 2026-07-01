"""Test config — force mock mode before the app imports its settings, so the
suite runs with no Spotify / ReccoBeats / AWS / model artifacts required."""
import os

os.environ["USE_MOCK_MODEL"] = "1"
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:3000")

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def client():
    from main import app

    with TestClient(app) as c:
        yield c
