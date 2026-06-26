"""SHAP explainability: fit a TreeExplainer, export it, and render global plots."""
from __future__ import annotations

import os

import joblib
import numpy as np


def build_explainer(model, X_background, art_dir: str):
    """Fit a TreeExplainer on the trained model and persist it for the API."""
    import shap

    explainer = shap.TreeExplainer(model)
    joblib.dump(explainer, os.path.join(art_dir, "shap_explainer.pkl"))

    # global importance plots (saved as PNGs for the notebook / docs)
    try:
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        sample = X_background[:2000]
        sv = explainer.shap_values(sample)
        shap.summary_plot(sv, sample, show=False)
        plt.tight_layout()
        plt.savefig(os.path.join(art_dir, "shap_summary.png"), dpi=120)
        plt.close()

        shap.summary_plot(sv, sample, plot_type="bar", show=False)
        plt.tight_layout()
        plt.savefig(os.path.join(art_dir, "shap_bar.png"), dpi=120)
        plt.close()
    except Exception as e:  # plotting is best-effort
        print(f"[shap] plot export skipped: {e}")

    return explainer


def local_waterfall(explainer, x_row: np.ndarray) -> dict:
    """Per-prediction contributions — the shape the API returns to the frontend."""
    sv = explainer.shap_values(x_row.reshape(1, -1))[0]
    base = float(np.atleast_1d(explainer.expected_value)[0])
    return {"base_value": base, "values": sv.tolist()}
