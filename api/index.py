import os
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
META_PATH = os.path.join(BASE_DIR, "model_meta.json")
WEIGHTS_PATH = os.path.join(BASE_DIR, "model_weights.npz")

model_loaded = False
meta = None
left = None
right = None
feature = None
threshold = None
val = None
offsets = None

try:
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)

    weights = np.load(WEIGHTS_PATH)
    left = weights["left"]
    right = weights["right"]
    feature = weights["feature"]
    threshold = weights["threshold"]
    val = weights["val"]
    offsets = meta["offsets"]
    model_loaded = True
    print("Fast Random Forest model loaded successfully into memory.")
except Exception as e:
    print(f"Warning: Could not load model weights: {e}")

def run_prediction(data):
    # One-hot encode categorical features matching model training pipeline
    feats = []
    for col, cats in zip(meta["cat_cols"], meta["categories"]):
        val_str = str(data.get(col, ""))
        for c in cats:
            feats.append(1.0 if val_str == c else 0.0)

    # Append numerical features (duration, days_left)
    for col in meta["num_cols"]:
        feats.append(float(data.get(col, 0.0)))

    x = np.array(feats, dtype=np.float32)

    # Parallel tree traversal across all Random Forest estimators
    total = 0.0
    n = len(offsets)
    for off in offsets:
        node = off
        while left[node] != -1:
            if x[feature[node]] <= threshold[node]:
                node = off + left[node]
            else:
                node = off + right[node]
        total += val[node]

    return round(float(total / n), 2)

@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "OPTIONS"])
@app.route("/<path:path>", methods=["GET", "POST", "OPTIONS"])
def handler(path):
    if request.method == "OPTIONS":
        return "", 204

    clean_path = path.strip("/")

    # Health check endpoints
    if clean_path in ["", "api", "api/health", "health"]:
        return jsonify({
            "status": "online",
            "service": "Flight Price Prediction Vercel ML API",
            "model_loaded": model_loaded
        })

    # Predict endpoints
    if clean_path in ["predict", "api/predict"]:
        if not model_loaded:
            return jsonify({"error": "ML model is not loaded."}), 500

        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"error": "No JSON payload provided."}), 400

        try:
            predicted_price = run_prediction(data)
            return jsonify({
                "predicted_price": predicted_price,
                "status": "success"
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # History endpoints
    if clean_path in ["history", "api/history"]:
        return jsonify({
            "status": "success",
            "count": 0,
            "history": [],
            "source": "serverless",
            "message": "Serverless history endpoint online."
        })

    return jsonify({"error": f"Endpoint '{clean_path}' not found."}), 404

if __name__ == "__main__":
    app.run(port=5000, debug=True)
