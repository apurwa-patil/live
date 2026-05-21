#!/usr/bin/env python
import requests
import json
import time

BASE_URL = "http://localhost:5000"

print("=" * 70)
print("FOLK SONG PREDICTION API TEST")
print("=" * 70)

# Make sure backend is running
print("\n1. Testing backend connectivity...")
try:
    # Just check if the server is up by making a simple request
    response = requests.post(
        f"{BASE_URL}/api/folk-prediction/predict",
        json={"text": "test", "inputType": "direct"},
        timeout=5
    )
    print(f"   ✓ Backend is running (Status: {response.status_code})")
except requests.ConnectionError:
    print("   ✗ Backend is NOT running. Please start: npm --prefix backend start")
    exit(1)
except Exception as e:
    print(f"   ! Warning: {e}")

# Test predictions
print("\n2. Testing predictions with Marathi text...")

test_cases = [
    {
        "name": "Lavani-like text",
        "text": "माझे गाव कोल्हापूर आहे, तेथे सुंदर नारी आहे",
        "expected": "Should match a Lavani song"
    },
    {
        "name": "Bhajan-like text",
        "text": "ज्याची कीर्ति सार्‍या जगतांत, मृत्यु लोकांत दख्खन देशांत",
        "expected": "Should match an Abhang or devotional song"
    },
    {
        "name": "Powada-like text",
        "text": "घोडदौड चढून तरंगे, शिवा राये सिंहगड",
        "expected": "Should match a Powada (ballad)"
    },
]

for i, test_case in enumerate(test_cases, 1):
    print(f"\n   Test {i}: {test_case['name']}")
    print(f"   Input: '{test_case['text']}'")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/folk-prediction/predict",
            json={"text": test_case['text'], "inputType": "direct"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                prediction = data.get("data", {})
                print(f"   ✓ Prediction: {prediction.get('Title')}")
                print(f"     - Genre: {prediction.get('Genre')}")
                print(f"     - Region: {prediction.get('Region')}")
            else:
                print(f"   ✗ Prediction failed: {data.get('message')}")
        else:
            print(f"   ✗ HTTP Error {response.status_code}: {response.text}")
    except requests.Timeout:
        print(f"   ✗ Request timeout (30s)")
    except Exception as e:
        print(f"   ✗ Error: {e}")

print("\n" + "=" * 70)
print("Test complete!")
print("=" * 70)
