import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

# Import database module for MySQL integration
from db import (
    save_prediction,
    get_prediction_history,
    check_db_health,
    clear_prediction_history
)

app = Flask(__name__)
CORS(app)

# Load trained ML model relative to script directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print(f"ML Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Warning: Could not load model from {MODEL_PATH}: {e}")
    model = None

@app.route("/")
def home():
    """
    Root endpoint showing API status, ML model availability, and MySQL health.
    """
    db_health = check_db_health()
    return jsonify({
        "status": "online",
        "service": "Flight Price Prediction Flask Backend",
        "model_loaded": model is not None,
        "database": db_health
    })

@app.route("/api/health")
def health():
    """
    Health check endpoint reporting ML model and MySQL status.
    """
    return jsonify({
        "status": "healthy",
        "model_ready": model is not None,
        "database": check_db_health()
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Predict flight price and, if successful, save the record to MySQL.
    Failed predictions are never saved.
    """
    try:
        if model is None:
            return jsonify({"error": "ML model is not loaded on server."}), 500

        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided."}), 400

        # Validate required inputs
        required_fields = ["airline", "source_city", "destination_city", "departure_time", "arrival_time", "stops"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: '{field}'"}), 400

        # Handle class/travel_class field compatibility
        travel_class = data.get("class", data.get("class_type", "Economy"))

        # Convert input into DataFrame matching model features
        input_data = pd.DataFrame([{
            "airline": data["airline"],
            "source_city": data["source_city"],
            "destination_city": data["destination_city"],
            "departure_time": data["departure_time"],
            "arrival_time": data["arrival_time"],
            "stops": data["stops"],
            "class": travel_class,
            "duration": float(data.get("duration", 2.0)),
            "days_left": int(data.get("days_left", 15))
        }])

        # Predict flight price with trained Random Forest Regressor
        prediction = model.predict(input_data)[0]
        predicted_price = round(float(prediction), 2)

        # Automatically save successful prediction into MySQL
        saved_to_db = save_prediction({
            "airline": data["airline"],
            "source_city": data["source_city"],
            "destination_city": data["destination_city"],
            "departure_time": data["departure_time"],
            "arrival_time": data["arrival_time"],
            "stops": data["stops"],
            "travel_class": travel_class,
            "duration": float(data.get("duration", 2.0)),
            "days_left": int(data.get("days_left", 15)),
            "predicted_price": predicted_price
        })

        return jsonify({
            "predicted_price": predicted_price,
            "status": "success",
            "saved_to_db": bool(saved_to_db)
        })

    except Exception as e:
        # Failed predictions reach this block and are NOT saved to MySQL
        return jsonify({"error": str(e), "status": "failed"}), 400

@app.route("/api/history", methods=["GET"])
def history():
    """
    Fetch stored prediction history from MySQL, sorted by newest first.
    """
    try:
        limit = int(request.args.get("limit", 50))
        history_records = get_prediction_history(limit=limit)

        if history_records is not None:
            return jsonify({
                "status": "success",
                "count": len(history_records),
                "history": history_records,
                "source": "mysql"
            }), 200
        else:
            # If MySQL is not reachable or table does not exist
            return jsonify({
                "status": "unavailable",
                "message": "MySQL database is currently unreachable or uninitialized.",
                "count": 0,
                "history": [],
                "source": "none"
            }), 200

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/history", methods=["DELETE"])
def clear_history():
    """
    Clear stored prediction history from MySQL.
    """
    try:
        cleared = clear_prediction_history()
        return jsonify({
            "status": "success" if cleared else "failed",
            "message": "Prediction history cleared successfully." if cleared else "Could not clear MySQL history."
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
