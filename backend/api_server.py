from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import requests
import speech_recognition as sr
import io
import os
import sys
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))
MODEL_DIR = os.path.join(ROOT_DIR, 'folk_antigravity', 'models')
TRAIN_SCRIPT_DIR = ROOT_DIR

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# Helper to load model files from the correct directory
def load_model(filename):
    return joblib.load(os.path.join(MODEL_DIR, filename))

# Load ML models
print("Loading ML models...")
try:
    vectorizer = load_model('tfidf_vectorizer.pkl')
    clf = load_model('title_classifier.pkl')
    encoder = load_model('title_encoder.pkl')
    metadata_map = load_model('metadata_map.pkl')
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    print("Attempting to train models...")
    try:
        # Try to train models if they don't exist
        sys.path.insert(0, TRAIN_SCRIPT_DIR)
        import train_model
        original_cwd = os.getcwd()
        os.chdir(TRAIN_SCRIPT_DIR)
        train_model.train_all_models()
        os.chdir(original_cwd)

        # If training saved models to root/models, copy them to the expected folder.
        root_model_dir = os.path.join(TRAIN_SCRIPT_DIR, 'models')
        if os.path.isdir(root_model_dir):
            for fname in ['tfidf_vectorizer.pkl', 'title_classifier.pkl', 'title_encoder.pkl', 'metadata_map.pkl']:
                src = os.path.join(root_model_dir, fname)
                dst = os.path.join(MODEL_DIR, fname)
                if os.path.isfile(src):
                    with open(src, 'rb') as fsrc, open(dst, 'wb') as fdst:
                        fdst.write(fsrc.read())

        vectorizer = load_model('tfidf_vectorizer.pkl')
        clf = load_model('title_classifier.pkl')
        encoder = load_model('title_encoder.pkl')
        metadata_map = load_model('metadata_map.pkl')
        print("Models trained and loaded successfully!")
    except Exception as train_error:
        print(f"Model training also failed: {train_error}")
        vectorizer = clf = encoder = metadata_map = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def google_transliterate(text):
    """Convert Roman script to Marathi Devanagari using Google Transliteration API"""
    url = "https://inputtools.google.com/request"
    params = {
        "text": text,
        "itc": "mr-t-i0-und",
        "num": 5
    }
    try:
        response = requests.get(url, params=params)
        result = response.json()
        
        if result[0] == "SUCCESS":
            return result[1][0][1][0]
        return None
    except:
        return None

def speech_to_text(audio_data):
    """Convert speech to text using Google Speech Recognition"""
    recognizer = sr.Recognizer()
    
    try:
        text = recognizer.recognize_google(audio_data, language="mr-IN")
        return text
    except sr.UnknownValueError:
        return None
    except sr.RequestError as e:
        return None
    except Exception as e:
        return None

def process_lyrics(text):
    """Process lyrics and return predictions"""
    if not vectorizer or not clf or not encoder or not metadata_map:
        return {"error": "Models not loaded properly"}
    
    if not text.strip():
        return {"error": "Please enter some text to predict"}
    
    try:
        text_vec = vectorizer.transform([text.strip()])
        pred = clf.predict(text_vec)[0]
        
        # Decode the Title
        predicted_title = encoder.inverse_transform([pred])[0]
        
        results = {'title': predicted_title}
        
        # Lookup consistent Genre, Region, History mapping
        if predicted_title in metadata_map:
            metadata = metadata_map[predicted_title]
            results['genre'] = metadata['Genre']
            results['region'] = metadata['Region']
            results['context'] = metadata['History']
        else:
            results['genre'] = 'Unknown'
            results['region'] = 'Unknown'
            results['context'] = 'Unknown'
            
        return results
    except Exception as e:
        return {"error": f"Processing error: {str(e)}"}

@app.route('/api/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    text = data['text']
    result = process_lyrics(text)
    
    if 'error' in result:
        return jsonify(result), 500
    
    return jsonify(result)

@app.route('/api/transliterate', methods=['POST'])
def transliterate():
    """Transliterate Roman script to Marathi"""
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    roman_text = data['text']
    marathi_text = google_transliterate(roman_text)
    
    if marathi_text:
        return jsonify({"marathi_text": marathi_text})
    else:
        return jsonify({"error": "Transliteration failed"}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Read file content
            content = file.read().decode('utf-8')
            result = process_lyrics(content)
            
            if 'error' in result:
                return jsonify(result), 500
            
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": f"File processing error: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid file type. Only .txt files allowed"}), 400

@app.route('/api/speech', methods=['POST'])
def speech_to_text_api():
    """Handle speech to text conversion"""
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({"error": "No audio file selected"}), 400
    
    try:
        # Save audio file temporarily
        import tempfile
        import os
        
        # Create temp file with proper handling
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        try:
            # Use speech_recognition with saved file
            recognizer = sr.Recognizer()
            
            try:
                with sr.AudioFile(tmp_path) as source:
                    audio = recognizer.record(source)
                text = recognizer.recognize_google(audio, language="mr-IN")
            except Exception as audio_error:
                # If direct WAV fails, try to detect and convert format
                try:
                    from pydub import AudioSegment
                    
                    # Try to load as different formats
                    formats_to_try = ['wav', 'webm', 'mp3', 'ogg']
                    audio_segment = None
                    
                    for fmt in formats_to_try:
                        try:
                            audio_segment = AudioSegment.from_file(tmp_path, format=fmt)
                            break
                        except:
                            continue
                    
                    if audio_segment is None:
                        raise Exception("Unsupported audio format")
                    
                    # Convert to standard WAV format
                    wav_path = tmp_path.replace('.wav', '_converted.wav')
                    audio_segment.export(wav_path, format="wav", parameters=["-ar", "16000"])
                    
                    with sr.AudioFile(wav_path) as source:
                        audio = recognizer.record(source)
                    text = recognizer.recognize_google(audio, language="mr-IN")
                    
                    # Clean up converted file
                    if os.path.exists(wav_path):
                        os.unlink(wav_path)
                        
                except ImportError:
                    return jsonify({"error": "Audio format conversion failed. Please try a shorter recording."}), 400
                except Exception as conversion_error:
                    return jsonify({"error": f"Audio conversion failed: {str(conversion_error)}"}), 400
            
        finally:
            # Always clean up the original temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        
        if text:
            # Process the transcribed text
            result = process_lyrics(text)
            
            if 'error' in result:
                return jsonify(result), 500
            
            result['transcribed_text'] = text
            return jsonify(result)
        else:
            return jsonify({"error": "Could not understand audio. Please speak clearly and try again."}), 400
            
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio. Please speak clearly and try again."}), 400
    except Exception as e:
        return jsonify({"error": f"Audio processing error: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "models_loaded": vectorizer is not None and clf is not None and encoder is not None and metadata_map is not None
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
