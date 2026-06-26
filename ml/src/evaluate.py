"""Evaluation: AUC, F1, confusion matrix, ROC and calibration curves.

    python src/evaluate.py
"""
from __future__ import annotations

import json
import os

import joblib
import numpy as np
import pandas as pd

ART_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")
DATA = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "tracks.csv")


def main():
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import xgboost as xgb
    from sklearn.calibration import calibration_curve
    from sklearn.metrics import (
        ConfusionMatrixDisplay,
        RocCurveDisplay,
        f1_score,
        roc_auc_score,
    )
    from sklearn.model_selection import train_test_split

    pipe = joblib.load(os.path.join(ART_DIR, "feature_pipeline.pkl"))
    booster = xgb.Booster()
    booster.load_model(os.path.join(ART_DIR, "model.json"))

    df = pd.read_csv(DATA)
    y = df["is_hit"].astype(int).values
    X = df.drop(columns=["is_hit"])
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.15, stratify=y, random_state=42)

    dmat = xgb.DMatrix(pipe.transform(X_test))
    proba = booster.predict(dmat)
    pred = (proba >= 0.5).astype(int)

    auc = roc_auc_score(y_test, proba)
    f1 = f1_score(y_test, pred)
    print(f"AUC-ROC: {auc:.4f} | F1@0.5: {f1:.4f}")

    RocCurveDisplay.from_predictions(y_test, proba)
    plt.savefig(os.path.join(ART_DIR, "roc_curve.png"), dpi=120)
    plt.close()

    ConfusionMatrixDisplay.from_predictions(y_test, pred)
    plt.savefig(os.path.join(ART_DIR, "confusion_matrix.png"), dpi=120)
    plt.close()

    frac_pos, mean_pred = calibration_curve(y_test, proba, n_bins=10)
    plt.plot(mean_pred, frac_pos, "o-", label="model")
    plt.plot([0, 1], [0, 1], "--", color="gray", label="perfect")
    plt.xlabel("predicted probability")
    plt.ylabel("observed hit rate")
    plt.legend()
    plt.savefig(os.path.join(ART_DIR, "calibration_curve.png"), dpi=120)
    plt.close()

    with open(os.path.join(ART_DIR, "eval_metrics.json"), "w") as fh:
        json.dump({"auc": round(float(auc), 4), "f1": round(float(f1), 4)}, fh, indent=2)
    print(f"Eval artifacts written to {ART_DIR}")


if __name__ == "__main__":
    main()
