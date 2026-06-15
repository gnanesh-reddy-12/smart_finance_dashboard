import os
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
BACKEND = Path(__file__).resolve().parent
FRONTEND_DIST = ROOT / "frontend" / "dist"

app = Flask(__name__)

def _cors_origins() -> list[str]:
    origins = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    vercel_url = os.environ.get("VERCEL_URL")
    if vercel_url:
        origins.append(f"https://{vercel_url}")
    return [o.strip() for o in origins if o.strip()]

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin and origin.strip() in _cors_origins():
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route("/api/<path:_path>", methods=["OPTIONS"])
def api_options(_path):
    return "", 204

@app.post("/api/predict_income")
def predict_income():
    # Load model if not loaded yet (or loaded once at module level)
    model_path = ROOT / "ml_pipeline" / "best_model.pkl"
    if not model_path.exists():
        return jsonify({"error": "Model not trained yet. Please run the training script first."}), 500
    
    try:
        model = joblib.load(model_path)
    except Exception as e:
        return jsonify({"error": f"Failed to load model: {str(e)}"}), 500

    payload = request.get_json(silent=True) or {}
    
    # Extract features matching the model's expected input
    try:
        input_df = pd.DataFrame([{
            'age': int(payload.get('age', 30)),
            'workclass': payload.get('workclass', 'Private'),
            'fnlwgt': int(payload.get('fnlwgt', 150000)),
            'education': payload.get('education', 'Bachelors'),
            'educational-num': int(payload.get('educational-num', payload.get('educational_num', 9))),
            'marital-status': payload.get('marital-status', payload.get('marital_status', 'Never-married')),
            'occupation': payload.get('occupation', 'Adm-clerical'),
            'relationship': payload.get('relationship', 'Unmarried'),
            'race': payload.get('race', 'White'),
            'gender': payload.get('gender', 'Male'),
            'capital-gain': int(payload.get('capital-gain', payload.get('capital_gain', 0))),
            'capital-loss': int(payload.get('capital-loss', payload.get('capital_loss', 0))),
            'hours-per-week': int(payload.get('hours-per-week', payload.get('hours_per_week', 40))),
            'native-country': payload.get('native-country', payload.get('native_country', 'United-States'))
        }])
        
        prediction = model.predict(input_df)[0]
        confidence = float(max(model.predict_proba(input_df)[0])) if hasattr(model, 'predict_proba') else 0.85
        
        return jsonify({
            "prediction": str(prediction), 
            "confidence": confidence,
            "ok": True
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404

    if not FRONTEND_DIST.exists():
        return jsonify(
            {
                "message": "React build not found. Run: cd frontend && npm install && npm run build. For dev use: npm run dev (port 5173).",
            }
        ), 503

    if path and (FRONTEND_DIST / path).is_file():
        return send_from_directory(FRONTEND_DIST, path)

    return send_from_directory(FRONTEND_DIST, "index.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
