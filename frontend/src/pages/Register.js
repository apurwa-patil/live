import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  const navigate = useNavigate();
  const { register, isLoggedIn } = useAuth();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500";
    if (passwordStrength.score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return "Weak";
    if (passwordStrength.score <= 3) return "Medium";
    return "Strong";
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/communityform", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setMsg("❌ Passwords do not match.");
      return;
    }
    
    if (passwordStrength.score < 3) {
      setMsg("❌ Password is too weak. Please choose a stronger password.");
      return;
    }
    
    setIsLoading(true);
    setMsg("");
    
    try {
      const fullName = `${firstName} ${middleName} ${lastName}`.trim();
      const result = await register(fullName, email, password, age, gender);
      
      if (result.success) {
        setMsg("✅ Registration Successful! Please check your email for verification.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } else {
        setMsg(`❌ ${result.error}`);
      }
    } catch (error) {
      setMsg("❌ Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gray-100 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form 
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md"
        onSubmit={handleRegister}
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
          Register
        </motion.h2>
        
        {msg && (
          <motion.p 
            className={`text-center text-sm ${msg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {msg}
          </motion.p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <input 
            type="text" 
            placeholder="First Name" 
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Middle Name" 
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={middleName} 
            onChange={(e) => setMiddleName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />
        </div>

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

        <div className="mb-3">
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
          
          {password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Password Strength: {getPasswordStrengthText()}</span>
                <span className="text-xs text-gray-600">{passwordStrength.score}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500">Requirements:</p>
                  <ul className="text-xs text-gray-500">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-red-500 mr-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-3">
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {confirmPassword && password && (
            <p className={`text-xs mt-1 ${confirmPassword === password ? 'text-green-500' : 'text-red-500'}`}>
              {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <input 
            type="number" 
            placeholder="Age" 
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            min="1" 
            max="120" 
            required 
          />
          <select 
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
            value={gender} 
            onChange={(e) => setGender(e.target.value)} 
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
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
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </motion.button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">Login</Link>
        </p>

        <p className="mt-2 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700">← Back to Home</Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default Register;
