# test_model_deep.py

import joblib
import pandas as pd

vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
clf = joblib.load("models/title_classifier.pkl")
encoder = joblib.load("models/title_encoder.pkl")

df = pd.read_csv("Marathi_Folksongs.csv")

correct = 0

for i in range(20):
    text = df.iloc[i]['Lyrics']
    true_title = df.iloc[i]['Title']

    vec = vectorizer.transform([text])
    pred = clf.predict(vec)
    pred_title = encoder.inverse_transform(pred)[0]

    print("TRUE:", true_title)
    print("PRED:", pred_title)
    print("-"*40)

    if true_title == pred_title:
        correct += 1

print("Accuracy on known samples:", correct/20)