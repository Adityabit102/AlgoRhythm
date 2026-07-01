"""API endpoint tests (run in mock mode — see conftest)."""

TRACK_URL = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT"


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["service"] == "AlgoRhythm API"


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["mock_mode"] is True


def test_predict_shape(client):
    r = client.post("/predict", json={"spotify_url": TRACK_URL})
    assert r.status_code == 200
    d = r.json()
    # full contract the frontend relies on
    for key in ("track", "prediction", "features", "shap", "similar_hits", "model_version"):
        assert key in d
    p = d["prediction"]
    assert 0.0 <= p["hit_probability"] <= 1.0
    assert p["verdict"] in ("hit", "miss", "borderline")
    assert set(("base_value", "values", "top_positive", "top_negative")) <= set(d["shap"])


def test_predict_is_deterministic(client):
    a = client.post("/predict", json={"spotify_url": TRACK_URL}).json()
    b = client.post("/predict", json={"spotify_url": TRACK_URL}).json()
    assert a["prediction"]["hit_probability"] == b["prediction"]["hit_probability"]


def test_predict_empty_url_400(client):
    r = client.post("/predict", json={"spotify_url": ""})
    assert r.status_code == 400


def test_batch_predict(client):
    r = client.post("/batch-predict", json={"spotify_urls": ["a", "b", "c"]})
    assert r.status_code == 200
    results = r.json()["results"]
    assert len(results) == 3
    assert all("prediction" in x for x in results)


def test_batch_predict_empty_400(client):
    assert client.post("/batch-predict", json={"spotify_urls": []}).status_code == 400


def test_track(client):
    r = client.get("/track/4cOdK2wGLETKBW3PvgPWqT")
    assert r.status_code == 200
    body = r.json()
    assert "track" in body and "features" in body


def test_regions(client):
    r = client.get("/regions")
    assert r.status_code == 200
    assert len(r.json()) == 8


def test_genres(client):
    r = client.get("/genres")
    assert r.status_code == 200
    assert all("hit_rate" in g for g in r.json())


def test_features_importance(client):
    r = client.get("/features/importance")
    assert r.status_code == 200
    assert len(r.json()["features"]) > 0


def test_insights_region_ok(client):
    r = client.get("/insights/region/us")
    assert r.status_code == 200
    assert r.json()["region"] == "us"


def test_insights_region_unknown_404(client):
    assert client.get("/insights/region/atlantis").status_code == 404


def test_insights_era(client):
    r = client.get("/insights/era/2010s")
    assert r.status_code == 200


def test_similar_hits(client):
    r = client.get("/similar-hits", params={"track": "abc123"})
    assert r.status_code == 200
    assert "similar_hits" in r.json()
