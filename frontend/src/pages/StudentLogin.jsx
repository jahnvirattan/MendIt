import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!rollNumber.trim() || !password.trim()) {
      setError("Please enter your roll number and password.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rollNumber: rollNumber.trim(),
          password,
          rememberMe,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }
      // Save student information for display
      sessionStorage.setItem("student", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Branding Section */}
      <div className="login-branding">
        <div className="brand-logo">
          <div className="logo-icon">🌿</div>
          <h1>MendIt</h1>
          <p>Report · Resolve · Feel Better</p>
        </div>

        <div className="brand-message">
          <h3>A Cleaner Campus,</h3>
          <h3>A Healthier You</h3>
        </div>

        <div className="brand-footer">
          <p>Making our campus a better place,</p>
          <p>one complaint at a time.</p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="login-container">
        <div className="login-tabs">
          <button className="active-tab">Login</button>

          <button type="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        <div className="login-heading">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Roll Number */}
          <div className="login-input">
            <span>♙</span>
            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="login-input">
            <span>♙</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Remember Me */}
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="login-error">{error}</p>}

          {/* Login Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div className="login-divider">
          <span></span>
          or
          <span></span>
        </div>

        <p className="register-text">
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
