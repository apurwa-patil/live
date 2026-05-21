# train_folk_model.py

import pandas as pd
import torch
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import re

# -----------------------------
# 1. Load and Clean Dataset
# -----------------------------
df = pd.read_csv('folksong.csv')
df = df[['Title', 'Lyrics', 'Genre', 'Region', 'History']]
df = df.dropna(subset=['Lyrics', 'Genre']).reset_index(drop=True)

def preprocess_text(text):
    text = str(text)
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower()
    text = ' '.join(text.split())
    return text

df['processed_text'] = df['Lyrics'].apply(preprocess_text)

le = LabelEncoder()
df['label'] = le.fit_transform(df['Genre'])

X_train, X_test, y_train, y_test = train_test_split(
    df['processed_text'], df['label'], test_size=0.2, random_state=42
)

MODEL_NAME = "bert-base-multilingual-cased"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

train_encodings = tokenizer(list(X_train), truncation=True, padding=True, max_length=128)
test_encodings = tokenizer(list(X_test), truncation=True, padding=True, max_length=128)

class FolkSongDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels
    def __len__(self):
        return len(self.labels)
    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

train_dataset = FolkSongDataset(train_encodings, list(y_train))
test_dataset = FolkSongDataset(test_encodings, list(y_test))

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME, num_labels=len(le.classes_)
)

training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=4, 
    per_device_eval_batch_size=4,
    logging_dir='./logs',
    logging_steps=10
)

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    acc = accuracy_score(labels, preds)
    f1 = f1_score(labels, preds, average='weighted')
    return {'accuracy': acc, 'f1': f1}

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics
)

trainer.train()

preds_output = trainer.predict(test_dataset)
preds = preds_output.predictions.argmax(-1)
labels = preds_output.label_ids
accuracy = (preds == labels).mean()
print("✅ Test Accuracy:", accuracy)

model.save_pretrained('folk_genre_model')
tokenizer.save_pretrained('folk_genre_model')

print("✅ Model and tokenizer saved in 'folk_genre_model' folder!")
