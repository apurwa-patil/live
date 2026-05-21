import requests

url = "http://localhost:5000/api/folk-prediction/predict"

data = {
    "text": "शिवाजी महाराज",
    "inputType": "direct"
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response:", response.json())