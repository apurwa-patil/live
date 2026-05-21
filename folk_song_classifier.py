from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import requests
import tempfile
import warnings

try:
    import speech_recognition as sr
except ImportError:
    sr = None

warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'folk_antigravity', 'models')

vectorizer = None
clf = None
encoder = None
metadata_map = None


def load_models():
    global vectorizer, clf, encoder, metadata_map
    try:
        vectorizer = joblib.load(os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl'))
        clf = joblib.load(os.path.join(MODEL_DIR, 'title_classifier.pkl'))
        encoder = joblib.load(os.path.join(MODEL_DIR, 'title_encoder.pkl'))
        metadata_map = joblib.load(os.path.join(MODEL_DIR, 'metadata_map.pkl'))
        return True
    except Exception as exc:
        print(f"Failed to load models: {exc}")
        vectorizer = clf = encoder = metadata_map = None
        return False


def clean_text(text):
    if pd.isna(text) or not text:
        return ""
    return str(text).strip()


def fallback_prediction(text):
    text_lower = text.lower().strip()
    folk_song_patterns = {
        'powada': ['शिवाजी', 'संभाजी', 'मावळे', 'शौर्य', 'लढाई', 'राज्य', 'वीर', 'युद्ध'],
        'lavani': ['नाच', 'गान', 'मैदान', 'रंग', 'प्रेम', 'नट', 'नटी', 'गोठ'],
        'bharud': ['समाज', 'सद्गुरू', 'उपदेश', 'मानव', 'जीवन', 'कर्म', 'धर्म'],
        'gondhal': ['देव', 'देवी', 'पूजा', 'आरती', 'मंत्र', 'शक्ती', 'भक्त'],
        'bhaleri': ['शेती', 'पाऊस', 'खेत', 'पिके', 'गाव', 'शेतकरी', 'वारी']
    }

    scores = {genre: sum(1 for keyword in keywords if keyword in text_lower) for genre, keywords in folk_song_patterns.items()}
    best_genre = max(scores.items(), key=lambda x: x[1])[0] if any(scores.values()) else 'powada'

    regions = {
        'पुणे': 'Western Maharashtra', 'सातारा': 'Western Maharashtra',
        'कोल्हापूर': 'Southern Maharashtra', 'सांगली': 'Southern Maharashtra',
        'नाशिक': 'Northern Maharashtra', 'अहमदनगर': 'Northern Maharashtra',
        'औरंगाबाद': 'Marathwada', 'नांदेड': 'Marathwada', 'लातूर': 'Marathwada', 'बीड': 'Marathwada',
        'विदर्भ': 'Vidarbha', 'नागपूर': 'Vidarbha', 'अमरावती': 'Vidarbha',
        'कोकण': 'Konkan', 'रत्नागिरी': 'Konkan', 'सिंधुदुर्ग': 'Konkan'
    }

    detected_region = 'Unknown Region'
    for place, region in regions.items():
        if place in text_lower:
            detected_region = region
            break

    words = text.split(' ')[:4]
    title = ' '.join(words) if words else 'Unknown Title'
    if len(title) > 30:
        title = title[:30] + '...'

    contexts = {
        'powada': 'Heroic ballad praising Maratha warriors and their valor in establishing Swarajya.',
        'lavani': 'Traditional folk dance-drama form expressing love, social commentary, and entertainment.',
        'bharud': 'Spiritual and social commentary by saint-poets, often containing philosophical teachings.',
        'gondhal': 'Ritualistic folk performance performed to please deities and seek blessings.',
        'bhaleri': 'Agricultural folk songs sung by farmers during planting and harvesting seasons.'
    }

    return {
        'Title': title,
        'Genre': best_genre.title(),
        'Region': detected_region,
        'History': contexts.get(best_genre, 'Traditional Marathi folk song with cultural significance.')
    }


def predict_song_type(text):
    if not text or not text.strip():
        return {
            'Title': 'Unknown',
            'Genre': 'Unknown',
            'Region': 'Unknown',
            'History': 'No lyrics provided.'
        }

    cleaned_text = clean_text(text)
    if vectorizer and clf and encoder and metadata_map:
        try:
            text_vec = vectorizer.transform([cleaned_text])
            pred = clf.predict(text_vec)[0]
            predicted_title = encoder.inverse_transform([pred])[0]
            results = {'Title': predicted_title}
            if predicted_title in metadata_map:
                metadata = metadata_map[predicted_title]
                results['Genre'] = metadata.get('Genre', 'Unknown')
                results['Region'] = metadata.get('Region', 'Unknown')
                results['History'] = metadata.get('History', 'Unknown')
            else:
                results['Genre'] = 'Unknown'
                results['Region'] = 'Unknown'
                results['History'] = 'Unknown'
            return results
        except Exception as exc:
            print(f"Prediction model error: {exc}")

    return fallback_prediction(cleaned_text)


def google_transliterate(text):
    url = "https://inputtools.google.com/request"
    params = {
        'text': text,
        'itc': 'mr-t-i0-und',
        'num': 5
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        result = response.json()
        if result and result[0] == 'SUCCESS':
            return result[1][0][1][0]
        return None
    except Exception as exc:
        print(f"Transliteration failed: {exc}")
        return None


def transcribe_audio_file(path):
    if sr is None:
        raise RuntimeError('speech_recognition library is not installed')

    recognizer = sr.Recognizer()
    audio_data = None

    try:
        with sr.AudioFile(path) as source:
            audio_data = recognizer.record(source)
    except Exception:
        try:
            from pydub import AudioSegment
            audio_segment = AudioSegment.from_file(path)
            wav_path = f"{path}.wav"
            audio_segment.export(wav_path, format="wav")
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
            os.remove(wav_path)
        except Exception as exc:
            raise RuntimeError(f"Audio transcription failed: {exc}")

    if audio_data is None:
        raise RuntimeError('Unable to read audio file for transcription')

    try:
        return recognizer.recognize_google(audio_data, language='mr-IN')
    except sr.UnknownValueError:
        raise RuntimeError('Could not understand audio. Please speak clearly.')
    except sr.RequestError as exc:
        raise RuntimeError(f'Speech service error: {exc}')


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_loaded': bool(vectorizer and clf and encoder and metadata_map)
    })


@app.route('/models/status', methods=['GET'])
def models_status():
    return jsonify({
        'vectorizer_loaded': vectorizer is not None,
        'classifier_loaded': clf is not None,
        'encoder_loaded': encoder is not None,
        'metadata_loaded': metadata_map is not None,
        'all_models_loaded': bool(vectorizer and clf and encoder and metadata_map)
    })


@app.route('/transliterate', methods=['POST'])
def transliterate():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '')
    if not isinstance(text, str) or not text.strip():
        return jsonify({'error': 'No text provided'}), 400

    marathi_text = google_transliterate(text)
    if marathi_text:
        return jsonify({'success': True, 'marathi_text': marathi_text})
    return jsonify({'success': False, 'error': 'Transliteration failed'}), 500


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True) or {}
    lyrics = data.get('lyrics', '')
    input_type = data.get('inputType', 'direct')

    if not isinstance(lyrics, str) or not lyrics.strip():
        return jsonify({'success': False, 'error': 'No lyrics provided'}), 400

    processed_text = lyrics
    if input_type == 'roman':
        converted = google_transliterate(lyrics)
        if converted:
            processed_text = converted
        else:
            return jsonify({'success': False, 'error': 'Roman transliteration failed'}), 500

    prediction = predict_song_type(processed_text)
    return jsonify({'success': True, 'prediction': prediction, 'processedText': processed_text})


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file provided'}), 400

    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400

    if not uploaded_file.filename.lower().endswith('.txt'):
        return jsonify({'success': False, 'error': 'Only .txt files are supported'}), 400

    try:
        content = uploaded_file.read().decode('utf-8', errors='ignore')
    except Exception as exc:
        return jsonify({'success': False, 'error': f'Error reading file: {exc}'}), 500

    if not content.strip():
        return jsonify({'success': False, 'error': 'File is empty or contains no readable text'}), 400

    prediction = predict_song_type(content)
    return jsonify({'success': True, 'prediction': prediction, 'originalText': content})


@app.route('/speech', methods=['POST'])
def speech_route():
    if 'audio' not in request.files:
        return jsonify({'success': False, 'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'success': False, 'error': 'No audio file selected'}), 400

    if sr is None:
        return jsonify({'success': False, 'error': 'speech_recognition is not installed'}), 500

    suffix = os.path.splitext(audio_file.filename)[1] or '.wav'
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        temp_path = tmp.name
        audio_file.save(temp_path)

    try:
        text = transcribe_audio_file(temp_path)
        prediction = predict_song_type(text)
        return jsonify({'success': True, 'transcribed_text': text, 'prediction': prediction})
    except Exception as exc:
        return jsonify({'success': False, 'error': str(exc)}), 500
    finally:
        try:
            os.remove(temp_path)
        except Exception:
            pass


if __name__ == '__main__':
    print('🎵 Starting Marathi Folk Song Classifier Service...')
    loaded = load_models()
    if loaded:
        print('✅ Models loaded successfully')
    else:
        print('⚠️ Models failed to load; using fallback prediction')

    app.run(host='127.0.0.1', port=5001, debug=True)
