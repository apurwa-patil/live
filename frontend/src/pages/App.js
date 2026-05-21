
import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FolkSongPrediction from "./pages/FolkSongPrediction";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>Welcome to FolkSong App</h1>
              <Link to="/predict">
                <button
                  style={{
                    padding: "10px 20px",
                    marginTop: "20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                  }}
                >
                  Go to Prediction Module
                </button>
              </Link>
            </div>
          }
        />

        {/* Prediction Module */}
        <Route path="/predict" element={<FolkSongPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;


<Route
  path="/"
  element={
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to FolkSong App</h1>
      <Link to="/predict">
        <button
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
          }}
        >
          Explore Folk Songs
        </button>
      </Link>
    </div>
  }
/>
