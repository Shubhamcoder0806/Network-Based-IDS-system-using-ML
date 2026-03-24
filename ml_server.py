from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

# Attempt to load the trained model and scaler.
# If these files are not available, we fall back to a simple rule-based prediction.
model = None
scaler = None

try:
    model = pickle.load(open("ids_random_forest_model.pkl", "rb"))
    scaler = pickle.load(open("ids_scaler.pkl", "rb"))
    print("Loaded model and scaler from disk.")
except Exception as e:
    print("Model/scaler load failed, using fallback heuristic:", e)


def predict_label(features):
    if not isinstance(features, list) or len(features) == 0:
        raise ValueError("features must be a non-empty list")

    if model is not None and scaler is not None:
        scaled = scaler.transform([features])
        pred = model.predict(scaled)[0]
        return "Attack" if pred == 1 else "Normal"

    # Fallback: simple heuristic if model missing
    packet_size = float(features[0]) if len(features) > 0 else 0
    if packet_size > 750:
        return "Attack"
    return "Normal"


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(force=True, silent=True)
    if not payload or "features" not in payload:
        return jsonify({"error": "Missing features in request body"}), 400

    try:
        features = payload["features"]
        label = predict_label(features)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify({"prediction": label})


@app.route("/ingest", methods=["POST"])
def ingest():
    payload = request.get_json(force=True, silent=True)
    if not payload or "features" not in payload:
        return jsonify({"error": "Missing features in request body"}), 400

    try:
        features = payload["features"]
        label = predict_label(features)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400

    # In a full system, this would append to DB / queue / websocket
    return jsonify({"prediction": label, "features": features})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
