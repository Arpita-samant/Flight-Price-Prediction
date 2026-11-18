
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load trained ML model
model = joblib.load("ml/model.pkl")

@app.route("/")
def home():
    return "Flight Price Prediction API is running!"

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Convert input into DataFrame
        input_data = pd.DataFrame([{
            "airline": data["airline"],
            "source_city": data["source_city"],
            "destination_city": data["destination_city"],
            "departure_time": data["departure_time"],
            "arrival_time": data["arrival_time"],
            "stops": data["stops"],
            "class": data["class"],
            "duration": float(data["duration"]),
            "days_left": int(data["days_left"])
        }])

        # Predict flight price
        prediction = model.predict(input_data)[0]

        return jsonify({
            "predicted_price": round(float(prediction), 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
