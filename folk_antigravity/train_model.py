import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.preprocessing import LabelEncoder
import joblib
import warnings
import os

warnings.filterwarnings('ignore')

def clean_text(text):
    if pd.isna(text): return ""
    return str(text).strip()

print("Loading dataset...")
df = pd.read_csv('Marathi_Folksongs.csv')
if 'Unnamed: 0' in df.columns:
    df.rename(columns={'Unnamed: 0': 'Title'}, inplace=True)
elif df.columns[0] != 'Title' and df.columns[1] == 'Lyrics':
    df.rename(columns={df.columns[0]: 'Title'}, inplace=True)

# Create a mapping for consistent metadata lookup
print("Creating metadata mapping...")
df['Title'] = df['Title'].fillna('Unknown Title').apply(clean_text)
df['Genre'] = df['Genre'].fillna('Unknown Genre').apply(clean_text)
df['Region'] = df['Region'].fillna('Unknown Region').apply(clean_text)
df['History'] = df['History'].fillna('Unknown History').apply(clean_text)

metadata_map = {}
for _, row in df.iterrows():
    title = row['Title']
    if title not in metadata_map and title:
        metadata_map[title] = {
            'Genre': row['Genre'],
            'Region': row['Region'],
            'History': row['History']
        }

print("Augmenting data by splitting lyrics into chunks...")
augmented_data = []

for _, row in df.iterrows():
    title = row['Title']
    lyrics = clean_text(row.get('Lyrics', ''))
    
    if not lyrics or not title:
        continue
        
    lines = [line.strip() for line in lyrics.split('\n') if line.strip()]
    
    # Create chunks of 2-3 lines
    chunk_size = 3
    for i in range(0, max(1, len(lines)), chunk_size):
        chunk = " \n ".join(lines[i:i+chunk_size])
        if chunk:
            augmented_data.append({
                'Title': title,
                'Lyrics_Chunk': chunk
            })
            
    # Add full lyrics as well
    augmented_data.append({
        'Title': title,
        'Lyrics_Chunk': lyrics
    })

aug_df = pd.DataFrame(augmented_data)
# Remove duplicate chunks
aug_df.drop_duplicates(subset=['Title', 'Lyrics_Chunk'], inplace=True)

print(f"Original dataset songs: {len(metadata_map)}")
print(f"Augmented dataset size for training: {len(aug_df)}")

# Target is ONLY Title now
le = LabelEncoder()
aug_df['Title'] = aug_df['Title'].astype(str)
Y = le.fit_transform(aug_df['Title'])
X = aug_df['Lyrics_Chunk'].values

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.15, random_state=42)

print("Building and training pipeline...")
# Using Character n-grams which work extremely well for Indian languages like Marathi
vectorizer = TfidfVectorizer(max_features=25000, analyzer='char_wb', ngram_range=(3, 5))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# LinearSVC is much faster and often more accurate for sparse high-dimensional text data
classifier = LinearSVC(random_state=42, class_weight='balanced', C=1.0)

print("Training LinearSVC model...")
classifier.fit(X_train_vec, y_train)

print("Evaluating model...")
accuracy = classifier.score(X_test_vec, y_test)
print(f"Title Accuracy on evaluation set: {accuracy:.4f}")

print("Saving models to disk...")
os.makedirs('models', exist_ok=True)

joblib.dump(vectorizer, 'models/tfidf_vectorizer.pkl')
joblib.dump(classifier, 'models/title_classifier.pkl')
joblib.dump(le, 'models/title_encoder.pkl')
joblib.dump(metadata_map, 'models/metadata_map.pkl')

print("Training complete and models saved successfully!")
