import streamlit as st
import joblib
import pandas as pd
import speech_recognition as sr
import io
import os
import numpy as np
import requests

# Set page config
st.set_page_config(
    page_title="Marathi Folk Song Classifier",
    page_icon="🎵",
    layout="wide"
)

# Custom CSS for rich aesthetics
st.markdown("""
<style>
    .main {
        background-color: #f8f9fa;
    }
    .stApp {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .main-title {
        font-family: 'Outfit', sans-serif;
        color: #1a2a6c;
        text-align: center;
        font-weight: 800;
        margin-bottom: 2rem;
        background: -webkit-linear-gradient(#b21f1f, #fdbb2d);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .prediction-card {
        background-color: white;
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        margin-top: 20px;
        margin-bottom: 20px;
        transition: transform 0.3s ease;
    }
    .prediction-card:hover {
        transform: translateY(-5px);
    }
    .pred-title {
        color: #b21f1f;
        font-weight: bold;
        font-size: 1.2rem;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .pred-value {
        font-size: 1.2rem;
        color: #333;
        margin-bottom: 20px;
        padding: 10px;
        background-color: #f8f9fa;
        border-left: 4px solid #fdbb2d;
        border-radius: 4px;
    }
    .stTextArea textarea {
        font-size: 1.1rem !important;
        border-radius: 10px;
    }
    .stButton>button {
        background: linear-gradient(45deg, #b21f1f, #fdbb2d);
        color: white;
        font-weight: bold;
        border: none;
        border-radius: 25px;
        padding: 10px 20px;
        transition: all 0.3s;
    }
    .stButton>button:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(178, 31, 31, 0.4);
    }
</style>
""", unsafe_allow_html=True)

st.markdown("<h1 class='main-title'>🎵 Marathi Folk Song Classifier</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align:center; font-size:1.2rem; margin-bottom: 2rem;'>Enter lyrics in Marathi (Devnagari script) to predict the Title, Genre, Region, and History of the folk song.</p>", unsafe_allow_html=True)

# Load Models
@st.cache_resource
def load_models():
    try:
        vectorizer = joblib.load('models/tfidf_vectorizer.pkl')
        clf = joblib.load('models/title_classifier.pkl')
        encoder = joblib.load('models/title_encoder.pkl')
        metadata_map = joblib.load('models/metadata_map.pkl')
        return vectorizer, clf, encoder, metadata_map
    except Exception as e:
        return None, None, None, None

vectorizer, clf, encoder, metadata_map = load_models()

if not vectorizer or not clf or not encoder or not metadata_map:
    st.error("Models are not loaded properly. Please run `python train_model.py` first.")
    st.stop()

# Google Transliteration Function
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

# Speech to Text Function (from transliteration app)
def speech_to_text():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.info("🎤 Speak now...")
        st.write("Listening... Please speak clearly in Marathi")
        audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)

    try:
        text = recognizer.recognize_google(audio, language="mr-IN")
        return text
    except sr.UnknownValueError:
        st.error("❌ Could not understand audio. Please try again.")
        return None
    except sr.RequestError as e:
        st.error(f"🌐 Speech service error: {e}")
        return None
    except Exception as e:
        st.error(f"🔧 Microphone error: {e}")
        return None

def show_predictions(results):
    st.markdown("<div class='prediction-card'>", unsafe_allow_html=True)
    st.markdown("<h3 style='color:#1a2a6c; margin-bottom: 20px;'>✨ Prediction Results</h3>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f"<div class='pred-title'>📜 Title</div><div class='pred-value'>{results['Title']}</div>", unsafe_allow_html=True)
        st.markdown(f"<div class='pred-title'>🎭 Genre</div><div class='pred-value'>{results['Genre']}</div>", unsafe_allow_html=True)
    with col2:
        st.markdown(f"<div class='pred-title'>📍 Region</div><div class='pred-value'>{results['Region']}</div>", unsafe_allow_html=True)
        st.markdown(f"<div class='pred-title'>📖 History/Context</div><div class='pred-value'>{results['History']}</div>", unsafe_allow_html=True)
        
    st.markdown("</div>", unsafe_allow_html=True)

def process_text(text):
    if not text.strip():
        st.warning("Please enter some text to predict.")
        return
        
    with st.spinner("Analyzing lyrics..."):
        text_vec = vectorizer.transform([text.strip()])
        pred = clf.predict(text_vec)[0]
        
        # Decode the Title
        predicted_title = encoder.inverse_transform([pred])[0]
        
        results = {'Title': predicted_title}
        
        # Lookup consistent Genre, Region, History mapping
        if predicted_title in metadata_map:
            metadata = metadata_map[predicted_title]
            results['Genre'] = metadata['Genre']
            results['Region'] = metadata['Region']
            results['History'] = metadata['History']
        else:
            results['Genre'] = 'Unknown'
            results['Region'] = 'Unknown'
            results['History'] = 'Unknown'
            
        show_predictions(results)

# Input Methods
st.markdown("### Choose Input Method:")
tabs = st.tabs(["✍️ Roman to Marathi", "📝 Direct Marathi", "📁 File Upload", "🎤 Voice Input"])

with tabs[0]:
    st.markdown("#### Type in Roman Script (e.g. 'majha gaav kolhapur aahe')")
    roman_text = st.text_area("Type Marathi lyrics in Roman script:", height=200, placeholder="e.g. jyachi kirti sarva jagant \n mrutyu lokant dakhan deshant ...")
    
    col1, col2 = st.columns([1, 1])
    with col1:
        if st.button("🔄 Convert to Marathi", use_container_width=True, key="btn_convert"):
            if roman_text.strip():
                with st.spinner("Converting to Marathi..."):
                    marathi_text = google_transliterate(roman_text)
                    if marathi_text:
                        st.session_state.transliterated_text = marathi_text
                        st.success("✅ Conversion successful!")
                    else:
                        st.error("❌ Conversion failed. Please try again.")
            else:
                st.warning("Please enter some text in Roman script.")
    
    with col2:
        if 'transliterated_text' in st.session_state and st.session_state.transliterated_text:
            if st.button("🔮 Predict from Converted Text", use_container_width=True, key="btn_predict_transliterated"):
                process_text(st.session_state.transliterated_text)
    
    # Show transliterated text if available
    if 'transliterated_text' in st.session_state and st.session_state.transliterated_text:
        st.markdown("#### 📝 Converted Marathi Text:")
        st.text_area("Devanagari Output:", value=st.session_state.transliterated_text, height=150, disabled=True)

with tabs[1]:
    st.markdown("#### Enter Marathi Lyrics Directly")
    user_text = st.text_area("Paste the Marathi lyrics here:", height=200, placeholder="उदा. ज्याची कीर्ति सार्‍या जगतांत \n मृत्यु लोकांत दख्खन देशांत ...")
    if st.button("Predict from Text", use_container_width=True, key="btn_text"):
        process_text(user_text)

with tabs[2]:
    st.markdown("#### Upload a File")
    uploaded_file = st.file_uploader("Upload a .txt file with lyrics", type=['txt'])
    if uploaded_file is not None:
        try:
            content = uploaded_file.getvalue().decode('utf-8')
            st.text_area("File Content (Preview):", value=content, height=150, disabled=True)
            if st.button("Predict from File", use_container_width=True, key="btn_file"):
                process_text(content)
        except Exception as e:
            st.error(f"Error reading file. Make sure it is encoded in UTF-8. ({str(e)})")

with tabs[3]:
    st.markdown("#### Record Voice (Marathi)")
    st.info("💡 Make sure you have a working microphone and grant browser permissions.")
    st.write("Speak the lyrics clearly in Marathi for best accuracy.")
    
    if st.button("🎤 Start Recording", use_container_width=True, key="btn_record"):
        with st.spinner("🎙 Recording... Speak now!"):
            spoken_text = speech_to_text()
            
        if spoken_text:
            st.success("✅ Transcription successful!")
            st.session_state.voice_text = spoken_text
        else:
            st.warning("⚠️ No speech detected. Please try again.")
            st.session_state.voice_text = None
    
    # Show transcribed text if available in session state
    if 'voice_text' in st.session_state and st.session_state.voice_text:
        st.subheader("📝 Recognized Speech:")
        st.text_area("Transcribed Text:", value=st.session_state.voice_text, height=150, disabled=True)
        
        # Predict button is now always visible when there's transcribed text
        if st.button("🔮 Predict from Voice", use_container_width=True, key="btn_predict_voice"):
            process_text(st.session_state.voice_text)

st.markdown("<br><hr><p style='text-align:center; color:#888;'><small>Built with Streamlit & Scikit-Learn</small></p>", unsafe_allow_html=True)
