import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const { token: paramToken } = useParams();

  useEffect(() => {
    setToken(paramToken || "");
  }, [paramToken]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMsg("❌ Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setMsg("❌ Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("✅ Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMsg(`❌ ${data.message}`);
        if (data.message.includes("Invalid or expired")) {
          setTokenValid(false);
        }
      }
    } catch (error) {
      setMsg("❌ Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-screen bg-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="space-y-3">
            <Link
              to="/forgot-password"
              className="block w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors text-center"
            >
              Request New Reset Link
            </Link>
            <Link
              to="/login"
              className="block w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form 
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md"
        onSubmit={handleResetPassword}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div className="text-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold mb-4 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Reset Password
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          Enter your new password below.
        </motion.p>
        
        {msg && (
          <motion.p 
            className={`text-center text-sm mb-4 ${msg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {msg}
          </motion.p>
        )}

        <div className="mb-3">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password" 
              className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              minLength="8"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm New Password" 
              className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              minLength="8"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {confirmPassword && newPassword && (
            <p className={`text-xs mt-1 ${confirmPassword === newPassword ? 'text-green-500' : 'text-red-500'}`}>
              {confirmPassword === newPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        <motion.button 
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-4"
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </motion.button>

        <div className="text-center">
          <Link to="/login" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Login
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ResetPassword;
