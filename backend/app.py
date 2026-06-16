import os
import json
import logging
from pathlib import Path

from flask import Flask, jsonify, request
import joblib
import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "ml_pipeline" / "best_model.pkl"
METRICS_PATH = ROOT / "ml_pipeline" / "model_metrics.json"

app = Flask(__name__)

# --- Startup: load model once ---
def _load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run train_model.py first.")
    return joblib.load(MODEL_PATH)

def _load_metrics() -> dict:
    if METRICS_PATH.exists():
        with open(METRICS_PATH) as f:
            return json.load(f)
    return {}

try:
    _model = _load_model()
    _metrics = _load_metrics()
    logger.info("Model loaded successfully.")
except Exception as e:
    _model = None
    _metrics = {}
    logger.error(f"Model load failed: {e}")

# --- Feature config ---
EXPECTED_FEATURES = [
    'age', 'workclass', 'education', 'educational-num',
    'marital-status', 'occupation', 'relationship',
    'gender', 'capital-gain', 'capital-loss',
    'hours-per-week', 'native-country'
]

DEFAULTS = {
    'age': 30,
    'workclass': 'Private',
    'education': 'Bachelors',
    'educational-num': 13,
    'marital-status': 'Never-married',
    'occupation': 'Adm-clerical',
    'relationship': 'Unmarried',
    'gender': 'Male',
    'capital-gain': 0,
    'capital-loss': 0,
    'hours-per-week': 40,
    'native-country': 'United-States'
}

INT_FIELDS = {'age', 'educational-num', 'capital-gain', 'capital-loss', 'hours-per-week'}

FIELD_ALIASES = {
    'educational_num': 'educational-num',
    'marital_status': 'marital-status',
    'capital_gain': 'capital-gain',
    'capital_loss': 'capital-loss',
    'hours_per_week': 'hours-per-week',
    'native_country': 'native-country',
}

VALIDATION_RULES = {
    'age': (17, 90),
    'hours-per-week': (1, 99),
    'capital-gain': (0, 99999),
    'capital-loss': (0, 4356),
    'educational-num': (1, 16),
}

# --- Module-level CORS constant (not called per-request) ---
def _build_cors_origins() -> list:
    raw = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    origins = [o.strip() for o in raw.split(",") if o.strip()]
    vercel_url = os.environ.get("VERCEL_URL")
    if vercel_url:
        origins.append(f"https://{vercel_url}")
    return origins

CORS_ORIGINS = _build_cors_origins()

# --- Rate limiting ---
try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=[],
        storage_uri="memory://"
    )
    RATE_LIMITING_ENABLED = True
except ImportError:
    limiter = None
    RATE_LIMITING_ENABLED = False
    logger.warning("flask-limiter not installed. Rate limiting disabled.")

# --- Helpers ---
def _resolve_payload(payload: dict) -> dict:
    resolved = {}
    for key, value in payload.items():
        canonical = FIELD_ALIASES.get(key, key)
        resolved[canonical] = value
    return resolved

def _validate(data: dict) -> list:
    errors = []
    for field, (lo, hi) in VALIDATION_RULES.items():
        val = data.get(field)
        if val is not None:
            try:
                if not (lo <= int(val) <= hi):
                    errors.append(f"{field} must be between {lo} and {hi}.")
            except (TypeError, ValueError):
                errors.append(f"{field} must be a number.")
    return errors

def _build_dataframe(data: dict) -> pd.DataFrame:
    row = {}
    for feature in EXPECTED_FEATURES:
        raw = data.get(feature, DEFAULTS[feature])
        row[feature] = int(raw) if feature in INT_FIELDS else str(raw).strip()
    return pd.DataFrame([row])

# --- CORS ---
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin", "")
    if origin in CORS_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route("/api/<path:_path>", methods=["OPTIONS"])
def api_options(_path):
    return "", 204

# --- Routes ---
@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok" if _model is not None else "degraded",
        "model_loaded": _model is not None,
    })

@app.get("/api/metrics")
def metrics():
    if not _metrics:
        return jsonify({"error": "Metrics not found. Run train_model.py first."}), 404
    return jsonify(_metrics)

@app.post("/api/predict_income")
def predict_income():
    if _model is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    payload = _resolve_payload(request.get_json(silent=True) or {})

    errors = _validate(payload)
    if errors:
        return jsonify({"error": "Validation failed.", "details": errors}), 422

    try:
        input_df = _build_dataframe(payload)
        prediction = str(_model.predict(input_df)[0])
        confidence = (
            float(max(_model.predict_proba(input_df)[0]))
            if hasattr(_model, "predict_proba")
            else None
        )
        return jsonify({"prediction": prediction, "confidence": confidence, "ok": True})

    except Exception as e:
        logger.exception("Prediction failed.")
        return jsonify({"error": "Prediction failed.", "detail": str(e)}), 400

# Apply rate limit only if flask-limiter is available
if RATE_LIMITING_ENABLED:
    limiter.limit("100 per minute")(predict_income)

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    )