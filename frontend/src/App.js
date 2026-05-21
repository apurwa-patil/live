import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FolkSongPrediction from "./pages/FolkSongPrediction";
import Timeline from "./pages/Timeline";
import CommunityForm from "./pages/CommunityForm";
import CultureExplorer from "./pages/CultureExplorer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import StoryTeller from "./pages/StoryTeller";
 import Contribution from "./pages/Contribution"; 
function App() {
  return (
    <AuthProvider>
      <Router>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predict" element={<FolkSongPrediction />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/cultureexplorer" element={<CultureExplorer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/communityform"element={<PrivateRoute><CommunityForm /></PrivateRoute>  }/>
          <Route path="/storytelling" element={<StoryTeller />} />
          <Route path="/contribution" element={<Contribution />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
