"""Train the XGBoost hit classifier with Optuna HPO and export all artifacts.

Run (in a Python 3.11 venv):
    python src/make_sample_data.py        # or drop in real data/processed/tracks.csv
    python src/train.py --trials 60

Produces ml/artifacts/:
    model.json · feature_pipeline.pkl · shap_explainer.pkl ·
    training_metadata.json · feature_importance.json
"""
from __future__ import annotations

import argparse
import json
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

from features import build_feature_pipeline

ART_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")


def load_data(path: str):
    df = pd.read_csv(path)
    y = df["is_hit"].astype(int).values
    X = df.drop(columns=["is_hit"])
    return X, y


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--data",
        default=os.path.join(os.path.dirname(__file__), "..", "data", "processed", "tracks.csv"),
    )
    ap.add_argument("--trials", type=int, default=60)
    args = ap.parse_args()

    import optuna
    import xgboost as xgb
    from sklearn.metrics import roc_auc_score

    os.makedirs(ART_DIR, exist_ok=True)
    X, y = load_data(args.data)

    # stratified 70/15/15
    X_tmp, X_test, y_tmp, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=42
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_tmp, y_tmp, test_size=0.1765, stratify=y_tmp, random_state=42
    )

    pipe = build_feature_pipeline().fit(X_train, y_train)
    Xtr, Xv, Xte = pipe.transform(X_train), pipe.transform(X_val), pipe.transform(X_test)

    def objective(trial: "optuna.Trial") -> float:
        params = dict(
            objective="binary:logistic",
            eval_metric="auc",
            n_estimators=trial.suggest_int("n_estimators", 200, 900),
            max_depth=trial.suggest_int("max_depth", 3, 9),
            learning_rate=trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
            subsample=trial.suggest_float("subsample", 0.6, 1.0),
            colsample_bytree=trial.suggest_float("colsample_bytree", 0.6, 1.0),
            min_child_weight=trial.suggest_int("min_child_weight", 1, 10),
            gamma=trial.suggest_float("gamma", 0.0, 5.0),
            reg_alpha=trial.suggest_float("reg_alpha", 0.0, 5.0),
            reg_lambda=trial.suggest_float("reg_lambda", 0.0, 5.0),
            tree_method="hist",
            early_stopping_rounds=40,
        )
        m = xgb.XGBClassifier(**params)
        m.fit(Xtr, y_train, eval_set=[(Xv, y_val)], verbose=False)
        return roc_auc_score(y_val, m.predict_proba(Xv)[:, 1])

    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=args.trials, show_progress_bar=True)
    print(f"Best val AUC: {study.best_value:.4f}")

    # final model on train+val
    best = study.best_params
    best.update(objective="binary:logistic", eval_metric="auc", tree_method="hist")
    X_full = pd.concat([X_train, X_val])
    y_full = np.concatenate([y_train, y_val])
    pipe = build_feature_pipeline().fit(X_full, y_full)
    Xfull, Xte = pipe.transform(X_full), pipe.transform(X_test)
    model = xgb.XGBClassifier(**best)
    model.fit(Xfull, y_full, verbose=False)

    test_auc = roc_auc_score(y_test, model.predict_proba(Xte)[:, 1])
    print(f"Held-out test AUC: {test_auc:.4f}")

    # ── export artifacts ──
    model.get_booster().save_model(os.path.join(ART_DIR, "model.json"))
    joblib.dump(pipe, os.path.join(ART_DIR, "feature_pipeline.pkl"))

    feat_names = list(pipe.named_steps["pre"].get_feature_names_out())
    importances = model.feature_importances_.tolist()
    ranked = sorted(
        ({"feature": f, "importance": round(i, 5)} for f, i in zip(feat_names, importances)),
        key=lambda d: d["importance"],
        reverse=True,
    )
    with open(os.path.join(ART_DIR, "feature_importance.json"), "w") as fh:
        json.dump({"features": ranked[:30]}, fh, indent=2)

    with open(os.path.join(ART_DIR, "training_metadata.json"), "w") as fh:
        json.dump(
            {
                "n_rows": int(len(X)),
                "n_features": len(feat_names),
                "best_params": best,
                "val_auc": round(study.best_value, 4),
                "test_auc": round(float(test_auc), 4),
                "trials": args.trials,
            },
            fh,
            indent=2,
        )

    # SHAP explainer (see shap_analysis.py for plots)
    from shap_analysis import build_explainer

    build_explainer(model, Xfull, ART_DIR)
    print(f"Artifacts written to {ART_DIR}")


if __name__ == "__main__":
    main()
