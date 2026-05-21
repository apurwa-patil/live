#!/usr/bin/env python
import json
import sys
import os

# Get absolute path to script directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Test 1: Check if models exist
print("=" * 60)
print("TEST 1: Checking model files...")
model_dir = os.path.join(script_dir, 'folk_antigravity', 'models')
model_files = [
    os.path.join(model_dir, 'tfidf_vectorizer.pkl'),
    os.path.join(model_dir, 'title_classifier.pkl'),
    os.path.join(model_dir, 'title_encoder.pkl'),
    os.path.join(model_dir, 'metadata_map.pkl'),
]

for f in model_files:
    exists = os.path.exists(f)
    print(f"  {os.path.basename(f)}: {'✓' if exists else '✗'}")

# Test 2: Load models
print("\n" + "=" * 60)
print("TEST 2: Loading models...")
try:
    import joblib
    vectorizer = joblib.load(os.path.join(model_dir, 'tfidf_vectorizer.pkl'))
    clf = joblib.load(os.path.join(model_dir, 'title_classifier.pkl'))
    encoder = joblib.load(os.path.join(model_dir, 'title_encoder.pkl'))
    metadata_map = joblib.load(os.path.join(model_dir, 'metadata_map.pkl'))
    print("  ✓ Models loaded successfully")
    print(f"    - Vectorizer type: {type(vectorizer)}")
    print(f"    - Classifier type: {type(clf)}")
    print(f"    - Encoder classes: {len(encoder.classes_)}")
    print(f"    - Metadata entries: {len(metadata_map)}")
except Exception as e:
    print(f"  ✗ Failed to load models: {e}")
    sys.exit(1)

# Test 3: Test prediction with sample text
print("\n" + "=" * 60)
print("TEST 3: Testing prediction with sample Marathi lyrics...")

sample_texts = [
    "माझे गाव कोल्हापूर आहे",
    "ज्याची कीर्ति सार्‍या जगतांत",
    "घोडदौड चढून तरंगे",
]

for text in sample_texts:
    try:
        text_vec = vectorizer.transform([text.strip()])
        pred = clf.predict(text_vec)[0]
        predicted_title = encoder.inverse_transform([pred])[0]
        
        result = {
            "Title": predicted_title,
            "Genre": "Unknown",
            "Region": "Unknown",
            "History": "Unknown"
        }
        
        if predicted_title in metadata_map:
            metadata = metadata_map[predicted_title]
            result["Genre"] = metadata.get("Genre", "Unknown")
            result["Region"] = metadata.get("Region", "Unknown")
            result["History"] = metadata.get("History", "Unknown")
        
        print(f"\n  Input: '{text}'")
        print(f"  Prediction: {result['Title']}")
        print(f"  Genre: {result['Genre']}")
        print(f"  Region: {result['Region']}")
    except Exception as e:
        print(f"  ✗ Prediction failed: {e}")

print("\n" + "=" * 60)
print("Done!")
