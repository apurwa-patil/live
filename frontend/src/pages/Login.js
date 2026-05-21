import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) navigate("/communityform", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    
    try {
      const result = await login(email, password);
      if (result.success) {
        setMsg("✅ Login Successful!");
        setTimeout(() => navigate("/communityform", { replace: true }), 1000);
      } else {
        setMsg(`❌ ${result.error}`);
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
        className="bg-white shadow-lg p-8 rounded-lg w-96"
        onSubmit={handleLogin}
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
          Login
        </motion.h2>
        
        {msg && (
          <motion.p 
            className={`text-center ${msg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {msg}
          </motion.p>
        )}

        <div className="mb-3">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-4">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
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

        <motion.button 
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </motion.button>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline text-sm">
            Forgot Password?
          </Link>
        </div>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">Register</Link>
        </p>

        <p className="mt-2 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700">← Back to Home</Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default Login;
