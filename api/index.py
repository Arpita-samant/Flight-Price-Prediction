import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load trained ML model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join(BASE_DIR, "..", "backend", "ml", "model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print(f"ML Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Warning: Could not load model from {MODEL_PATH}: {e}")
    model = None

@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "OPTIONS"])
@app.route("/<path:path>", methods=["GET", "POST", "OPTIONS"])
def handler(path):
    if request.method == "OPTIONS":
        return "", 204

    clean_path = path.strip("/")

    # Health check
    if clean_path in ["", "api", "api/health", "health"]:
        return jsonify({
            "status": "online",
            "service": "Flight Price Prediction Vercel API",
            "model_loaded": model is not None
        })

    # Predict endpoint
    if clean_path in ["predict", "api/predict"]:
        try:
            if model is None:
                return jsonify({"error": "ML model is not loaded on server."}), 500

            data = request.get_json(force=True, silent=True)
            if not data:
                return jsonify({"error": "No JSON payload provided."}), 400

            input_data = pd.DataFrame([{
                "airline": data.get("airline"),
                "source_city": data.get("source_city"),
                "destination_city": data.get("destination_city"),
                "departure_time": data.get("departure_time"),
                "arrival_time": data.get("arrival_time"),
                "stops": data.get("stops"),
                "class": data.get("class"),
                "duration": float(data.get("duration", 2.0)),
                "days_left": int(data.get("days_left", 15))
            }])

            prediction = model.predict(input_data)[0]

            return jsonify({
                "predicted_price": round(float(prediction), 2),
                "status": "success"
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    return jsonify({"error": f"Endpoint '{clean_path}' not found."}), 404

if __name__ == "__main__":
    app.run(port=5000, debug=True)
