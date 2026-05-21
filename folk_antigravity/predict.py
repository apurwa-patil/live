import json
import os
import sys

import joblib
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def load_models():
    try:
        vectorizer = joblib.load(os.path.join(BASE_DIR, "models", "tfidf_vectorizer.pkl"))
        clf = joblib.load(os.path.join(BASE_DIR, "models", "title_classifier.pkl"))
        encoder = joblib.load(os.path.join(BASE_DIR, "models", "title_encoder.pkl"))
        metadata_map = joblib.load(os.path.join(BASE_DIR, "models", "metadata_map.pkl"))
        return vectorizer, clf, encoder, metadata_map
    except Exception as exc:
        raise RuntimeError(f"Failed to load prediction models: {exc}")


def google_transliterate(text):
    url = "https://inputtools.google.com/request"
    params = {
        "text": text,
        "itc": "mr-t-i0-und",
        "num": 5,
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        result = response.json()
        if result and result[0] == "SUCCESS":
            return result[1][0][1][0]
        return None
    except Exception:
        return None


def predict_text(text, vectorizer, clf, encoder, metadata_map):
    text_vec = vectorizer.transform([text.strip()])
    pred = clf.predict(text_vec)[0]
    predicted_title = encoder.inverse_transform([pred])[0]

    result = {
        "Title": predicted_title,
        "Genre": "Unknown",
        "Region": "Unknown",
        "History": "Unknown",
    }

    if predicted_title in metadata_map:
        metadata = metadata_map[predicted_title]
        result["Genre"] = metadata.get("Genre", "Unknown")
        result["Region"] = metadata.get("Region", "Unknown")
        result["History"] = metadata.get("History", "Unknown")

    return result


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception as exc:
        print(json.dumps({"success": False, "message": f"Failed to read input JSON: {exc}"}))
        return

    text = payload.get("text", "")
    input_type = payload.get("inputType", "direct")

    if not isinstance(text, str) or not text.strip():
        print(json.dumps({"success": False, "message": "Empty input"}))
        return

    try:
        vectorizer, clf, encoder, metadata_map = load_models()
    except Exception as exc:
        print(json.dumps({"success": False, "message": f"Model loading failed: {str(exc)}"}))
        return

    processed_text = text
    if input_type == "roman":
        converted = google_transliterate(text)
        if converted:
            processed_text = converted

    result = predict_text(processed_text, vectorizer, clf, encoder, metadata_map)
    result["originalText"] = text
    result["processedText"] = processed_text

    print(json.dumps({"success": True, "data": result}))


if __name__ == "__main__":
    main()
