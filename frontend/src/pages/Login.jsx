import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState("student");
  const [rollNumber, setRollNumber] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setError("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const loginId =
      activeRole === "student" ? rollNumber.trim() : adminEmail.trim();

    if (!loginId || !password.trim()) {
      setError(
        `Please enter your ${
          activeRole === "student" ? "roll number" : "email"
        } and password.`,
      );
      return;
    }

    try {
      setLoading(true);

      const loginURL =
        activeRole === "student"
          ? "http://localhost:8080/api/auth/login"
          : "http://localhost:8080/api/admin/login";

      const payload =
        activeRole === "student"
          ? {
              rollNumber: loginId,
              password,
              rememberMe,
            }
          : {
              email: loginId,
              password,
            };

      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Store the logged-in user
      const userData = data.data?.user || data;

      sessionStorage.setItem(
        activeRole === "student" ? "student" : "admin",
        JSON.stringify(userData),
      );

      // Navigate to the correct dashboard
      navigate(
        activeRole === "student" ? "/studentDashboard" : "/adminDashboard",
      );
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
          <div className="logo-icon">
            <img src="./logo_mendit.png" alt="logo" />
          </div>
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
        {/* Login Tabs */}
        <div className="login-tabs">
          <button
            type="button"
            className={activeRole === "student" ? "active-tab" : ""}
            onClick={() => handleRoleChange("student")}
          >
            <i className="fa-solid fa-user-graduate"></i> Student
          </button>

          <button
            type="button"
            className={activeRole === "admin" ? "active-tab" : ""}
            onClick={() => handleRoleChange("admin")}
          >
            <i className="fa-solid fa-user-tie"></i> Admin
          </button>
        </div>

        {/* Login Heading */}
        <div className="login-heading">
          <h2>{activeRole === "student" ? "Welcome Back!" : "Admin Login"}</h2>

          <p>
            {activeRole === "student"
              ? "Sign in to continue"
              : "Sign in to manage your campus"}
          </p>
        </div>

        <form onSubmit={handleLogin} autoComplete="on">
          {/* Student Roll Number / Admin Email */}
          <div className="login-input">
            <span>
              <i className="fa-solid fa-id-card"></i>
            </span>

            <input
              type={activeRole === "student" ? "text" : "email"}
              name={activeRole === "student" ? "rollNumber" : "adminEmail"}
              placeholder={
                activeRole === "student" ? "Roll Number" : "Official Email"
              }
              value={activeRole === "student" ? rollNumber : adminEmail}
              onChange={(e) =>
                activeRole === "student"
                  ? setRollNumber(e.target.value)
                  : setAdminEmail(e.target.value)
              }
              autoComplete="on"
              required
            />
          </div>

          {/* Password */}
          <div className="login-input">
            <span>
              <i className="fa-solid fa-lock"></i>
            </span>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>
          </div>

          {/* Remember Me and Forgot Password */}
          {/* <div className="login-options">
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
          </div> */}

          {/* Error Message */}
          {error && <p className="login-error">{error}</p>}

          {/* Login Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Section */}
        <div className="login-divider">
          <span></span>
          or
          <span></span>
        </div>

        <p className="register-text">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() =>
              navigate("/register", {
                state: { role: activeRole },
              })
            }
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
