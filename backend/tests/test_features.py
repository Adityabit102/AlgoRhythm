"""Feature engineering pipeline tests."""
import pandas as pd

from features import build_feature_pipeline


def _row(**kw):
    base = dict(
        danceability=0.7, energy=0.6, loudness=-6.0, speechiness=0.1,
        acousticness=0.2, instrumentalness=0.0, liveness=0.1, valence=0.5,
        tempo=120.0, duration_ms=200000, key=5, mode=1, time_signature=4,
        release_date="2019-05-10", collaborator_count=1, primary_genre="pop",
        artist_prior_hits=2, artist_hit_rate=0.3,
    )
    base.update(kw)
    return base


def test_pipeline_fit_transform_adds_engineered_features():
    df = pd.DataFrame([_row(), _row(danceability=0.3, energy=0.2), _row(valence=0.9)])
    y = [1, 0, 1]
    pipe = build_feature_pipeline().fit(df, y)
    X = pipe.transform(df)
    assert X.shape[0] == 3
    # 13 audio + engineered numerics + one-hot categoricals
    assert X.shape[1] > 13


def test_has_featured_artist_derived_from_collaborators():
    from features import EngineeredFeatures

    df = pd.DataFrame([_row(collaborator_count=0), _row(collaborator_count=2)])
    out = EngineeredFeatures()._engineer(df.copy())
    assert out["has_featured_artist"].tolist() == [0, 1]
