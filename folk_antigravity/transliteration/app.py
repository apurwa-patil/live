# #transliteration only************************
# import streamlit as st
# import requests

# st.set_page_config(page_title="Marathi Folk Song Predictor")

# st.title("🎵 Marathi Folk Song Classification")

# # -------------------------
# # Google Transliteration
# # -------------------------
# def google_transliterate(text):
#     url = "https://inputtools.google.com/request"
#     params = {
#         "text": text,
#         "itc": "mr-t-i0-und",
#         "num": 5
#     }

#     response = requests.get(url, params=params)
#     result = response.json()

#     if result[0] == "SUCCESS":
#         return result[1][0][1][0]
#     else:
#         return None


# # -------------------------
# # User Input
# # -------------------------
# roman_text = st.text_area("Type Marathi Lyrics in Roman Script:")

# if st.button("Convert & Predict"):

#     if not roman_text.strip():
#         st.warning("Please enter text.")
#     else:
#         marathi_text = google_transliterate(roman_text)

#         if marathi_text:
#             st.subheader("📝 Converted Marathi Text:")
#             st.text_area("Devanagari Output:", value=marathi_text, height=150)

#             # 🔥 Replace below with your actual model prediction
#             # prediction = model.predict([marathi_text])

#             st.success("Prediction module can be connected here.")
#         else:
#             st.error("Transliteration failed.")


import streamlit as st
import requests
import speech_recognition as sr
from pypdf import PdfReader
from docx import Document
import io

st.set_page_config(page_title="Marathi Folk Song Classification")

st.title("🎵 Marathi Folk Song Classification System")

# -------------------------------------------------
# Google Transliteration
# -------------------------------------------------
def google_transliterate(text):
    url = "https://inputtools.google.com/request"
    params = {
        "text": text,
        "itc": "mr-t-i0-und",
        "num": 5
    }
    response = requests.get(url, params=params)
    result = response.json()

    if result[0] == "SUCCESS":
        return result[1][0][1][0]
    return None


# -------------------------------------------------
# Speech to Text
# -------------------------------------------------
def speech_to_text():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.info("Speak now...")
        audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio, language="mr-IN")
        return text
    except:
        return None


# -------------------------------------------------
# File Text Extraction
# -------------------------------------------------
def extract_text_from_file(uploaded_file):
    if uploaded_file.type == "text/plain":
        return uploaded_file.read().decode("utf-8")

    elif uploaded_file.type == "application/pdf":
        pdf = PdfReader(uploaded_file)
        text = ""
        for page in pdf.pages:
            text += page.extract_text() + "\n"
        return text

    elif uploaded_file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = Document(uploaded_file)
        return "\n".join([para.text for para in doc.paragraphs])

    return None


# -------------------------------------------------
# INPUT MODE SELECTION
# -------------------------------------------------
mode = st.radio(
    "Choose Input Method:",
    ["✍ Roman Text", "🎙 Microphone", "📄 File Upload"]
)

final_text = None

# -------------------------------------------------
# MODE 1 — Roman Text
# -------------------------------------------------
if mode == "✍ Roman Text":

    roman_text = st.text_area("Type Marathi in Roman Script:")

    if st.button("Convert & Predict"):
        if roman_text.strip():
            marathi_text = google_transliterate(roman_text)
            if marathi_text:
                st.subheader("Converted Marathi Text:")
                st.text_area("Output:", marathi_text, height=150)
                final_text = marathi_text
        else:
            st.warning("Please enter text.")


# -------------------------------------------------
# MODE 2 — Microphone
# -------------------------------------------------
elif mode == "🎙 Microphone":

    if st.button("Start Recording"):
        spoken_text = speech_to_text()
        if spoken_text:
            st.subheader("Recognized Speech:")
            st.text_area("Speech Output:", spoken_text, height=150)
            final_text = spoken_text
        else:
            st.error("Could not recognize speech.")


# -------------------------------------------------
# MODE 3 — File Upload
# -------------------------------------------------
elif mode == "📄 File Upload":

    uploaded_file = st.file_uploader("Upload TXT, PDF, or DOCX file")

    if uploaded_file is not None:
        extracted_text = extract_text_from_file(uploaded_file)
        if extracted_text:
            st.subheader("Extracted Text:")
            st.text_area("File Content:", extracted_text, height=200)
            final_text = extracted_text
        else:
            st.error("Could not extract text.")


# -------------------------------------------------
# Prediction Placeholder
# -------------------------------------------------
if final_text:
    st.success("Text ready for prediction.")
    # prediction = model.predict([final_text])
    # st.write("Predicted Genre:", prediction)
