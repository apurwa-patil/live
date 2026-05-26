
import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Upload,
  Mic,
  Music,
  Brain,
  Square,
  Tag,
  MapPin,
  ScrollText,
  Link, Landmark, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import CulturalPlatformFooter from "../components/CulturalPlatformFooter";

const API_BASE = process.env.REACT_APP_FOLK_API || "http://127.0.0.1:5001/api";

export default function FolkSongPrediction() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("mr");
  const [lyrics, setLyrics] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [recording, setRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const lyricsFileInput = useRef(null);
  const recognitionRef = useRef(null);

  const toggleLanguage = () => {
    setLanguage(language === "mr" ? "en" : "mr");
  };

  const setError = (message) => {
    setStatus(message);
    setResult(null);
  };

  const handlePredict = async () => {
    const text = lyrics.trim();
    if (!text) {
      setError(language === "mr" ? "कृपया काही मजकूर टाका." : "Please enter text.");
      return;
    }

    setLoading(true);
    setStatus(language === "mr" ? "विश्लेषण चालू आहे..." : "Analyzing...");
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/predict`, {
        text,
        inputType: "direct",
      });

      if (response.data?.error) setError(response.data.error);
      else {
        setResult(response.data);
        setStatus(language === "mr" ? "भाकीत पूर्ण झाले." : "Prediction completed.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransliterate = async () => {
    const text = lyrics.trim();
    if (!text) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/transliterate`, { text });
      if (res.data?.marathi_text) {
        setLyrics(res.data.marathi_text);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLyricsFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData);
if (res.data?.error) {
  setError(res.data.error);
} else {
  setResult(res.data);
  setStatus(
    language === "mr"
      ? "भाकीत पूर्ण झाले."
      : "Prediction completed."
  );
}    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.lang = language === "mr" ? "mr-IN" : "en-US";

        rec.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setLyrics(text);
          setTranscribedText(text);
        };

        rec.onend = () => setRecording(false);

        rec.start();
        recognitionRef.current = rec;
        setRecording(true);
        return;
      }
    } catch (e) {
      setError("Mic error");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">




      <header className="bg-[#d32f2f] text-white flex flex-col md:flex-row justify-between items-center px-6 md:px-14 py-5 shadow-lg text-center">
        <div className="mt-3 md:mt-0">
  <button
    onClick={toggleLanguage}
    className="bg-white text-[#d32f2f] px-4 py-2 rounded-lg font-semibold shadow-md"
  >
    {language === "mr" ? "English" : "मराठी"}
  </button>
</div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide">🎵 महाराष्ट्र सांस्कृतिक मंच</h1>
          <p className="text-sm md:text-base font-light">Cultural AI Platform for Maharashtra</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-5 mt-3 md:mt-0 text-base md:text-lg font-medium">
          <Link to="/predict" className="hover:underline flex items-center gap-1">
            <Music size={18} /> लोकगीते / Folk Songs
          </Link>

          <Link to="/timeline" className="hover:underline flex items-center gap-1">
            <Clock size={18} /> कालरेषा / Timeline
          </Link>

          <Link to="/cultureexplorer" className="hover:underline flex items-center gap-1">
            <Landmark size={18} /> संस्कृती अन्वेषक / Culture Explorer
          </Link>

          <Link
            to="/communityform"
            className="bg-white text-[#d32f2f] font-semibold px-5 py-2 rounded-lg hover:bg-[#ffe1e1] transition shadow-md"
          >
            योगदान द्या / Contribute
          </Link>
        </nav>
      </header>

      
       
      <main className="flex-1 p-6 flex justify-center">

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl">

          {/* LEFT PANEL */}
          <motion.div className="bg-white rounded-3xl shadow-lg p-6">

            <h2 className="flex items-center gap-2 text-orange-600 text-xl font-bold">
              <Music /> {language === "mr" ? "गीत इनपुट" : "Song Input"}
            </h2>

            <textarea
              className="w-full mt-4 border rounded-2xl p-4 h-40"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Enter lyrics..."
            />

            <button
              onClick={() => lyricsFileInput.current?.click()}
              className="mt-3 w-full border rounded-xl p-3 flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {language === "mr" ? "फाइल अपलोड" : "Upload File"}
            </button>

            <input
              type="file"
              accept=".txt"
              hidden
              ref={lyricsFileInput}
              onChange={handleLyricsFileUpload}
            />

            <div className="grid grid-cols-2 gap-3 mt-4">

              <button
                onClick={handleTransliterate}
                className="border rounded-xl p-3"
              >
                English ↔ Marathi
              </button>

              <button
                onClick={recording ? stopRecording : startRecording}
                className="border rounded-xl p-3 flex items-center justify-center gap-2"
              >
                {recording ? <Square size={18} /> : <Mic size={18} />}
                {recording ? "Stop" : "Mic"}
              </button>

            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 rounded-2xl font-bold"
            >
              {language === "mr" ? "गीत विश्लेषण करा" : "Analyze Song"}
            </button>

          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div className="bg-white rounded-3xl shadow-lg p-6">

            <h2 className="flex items-center gap-2 text-orange-600 text-xl font-bold">
              <Brain /> {language === "mr" ? "विश्लेषण" : "Result"}
            </h2>

            {status && (
              <div className="mt-4 bg-orange-50 p-3 rounded-xl">
                {status}
              </div>
            )}

            {!result ? (
              <p className="mt-6 text-gray-500">
                {language === "mr"
                  ? "परिणाम येथे दिसतील"
                  : "Results will appear here"}
              </p>
            ) : (
              <div className="mt-4 space-y-3">

                {result.title && (
                  <div className="p-4 bg-orange-50 rounded-xl flex items-center gap-2">
                    <Music size={18} />
                    <b>{result.title}</b>
                  </div>
                )}

                <div className="p-4 bg-orange-50 rounded-xl flex items-center gap-2">
                  <Tag size={18} />
                  <b>{result.genre}</b>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl flex items-center gap-2">
                  <MapPin size={18} />
                  <b>{result.region}</b>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl flex items-start gap-2">
                  <ScrollText size={18} className="mt-1" />
                  <p className="text-gray-800 font-semibold">
                    {result.History || result.context}
                  </p>
                </div>

              </div>

              
            )}
       


          </motion.div>

        </div>
      </main>

      <CulturalPlatformFooter />
    </div>
  );
}
