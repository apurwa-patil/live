import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("✅ Verification email sent successfully! Please check your inbox.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMsg(`❌ ${data.message}`);
      }
    } catch (error) {
      setMsg("❌ Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form 
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md"
        onSubmit={handleResend}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-4 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Resend Verification Email
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          Enter your email address to receive a new verification link.
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

        <div className="mb-4">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
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
              Sending...
            </span>
          ) : (
            "Resend Verification Email"
          )}
        </motion.button>

        <div className="text-center space-y-2">
          <Link to="/login" className="text-blue-500 hover:underline text-sm block">
            ← Back to Login
          </Link>
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm block">
            ← Back to Home
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ResendVerification;
