import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRole, setActiveRole] = useState("student");
  //activeRole = location.state?.role || "student";
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    adminId: "",
    email: "",
    mobile: "",
    department: "",
    semester: "",
    designation: "",
    invitationCode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (activeRole === "student") {
      if (
        !formData.rollNumber.trim() ||
        !formData.department.trim() ||
        !formData.semester
      ) {
        setError("Please complete all student details.");
        return;
      }
    } else {
      if (
        !formData.adminId.trim() ||
        !formData.designation.trim() ||
        !formData.invitationCode.trim()
      ) {
        setError("Please complete all admin details.");
        return;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload =
        activeRole === "student"
          ? {
              role: "student",
              fullName: formData.fullName.trim(),
              rollNumber: formData.rollNumber.trim(),
              email: formData.email.trim(),
              mobile: formData.mobile,
              department: formData.department,
              semester: formData.semester,
              password: formData.password,
            }
          : {
              role: "admin",
              fullName: formData.fullName.trim(),
              adminId: formData.adminId.trim(),
              email: formData.email.trim(),
              mobile: formData.mobile,
              designation: formData.designation,
              invitationCode: formData.invitationCode,
              password: formData.password,
            };

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left Branding Section */}
      <div className="register-branding">
        <div className="register-brand-logo">
          <div className="register-logo-icon">
            <img src="./MendItLogo.png" alt="logo" />
          </div>
          <h1>MendIt</h1>
          <p>Report · Resolve · Feel Better</p>
        </div>

        <div className="register-brand-message">
          <h3>A Cleaner Campus,</h3>
          <h3>A Healthier You</h3>
        </div>

        <div className="register-brand-footer">
          <p>Making our campus a better place,</p>
          <p>one complaint at a time.</p>
        </div>
      </div>

      {/* Right Registration Section */}
      <div className="register-container">
        {/* Role Tabs */}
        <div className="register-tabs">
          <button
            type="button"
            className={activeRole === "student" ? "active-tab" : ""}
            onClick={() => handleRoleChange("student")}
          >
            <i className="fa-solid fa-user-graduate"></i>
            Student
          </button>

          <button
            type="button"
            className={activeRole === "admin" ? "active-tab" : ""}
            onClick={() => handleRoleChange("admin")}
          >
            <i className="fa-solid fa-user-tie"></i>
            Admin
          </button>
        </div>

        {/* Heading */}
        <div className="register-heading">
          <h2>Create Account</h2>
          <p>
            {activeRole === "student"
              ? "Register as a student to get started"
              : "Register as an administrator"}
          </p>
        </div>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="register-field">
            <label>Full Name</label>
            <div className="register-input">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Student Roll Number / Admin ID */}
          <div className="register-field">
            <label>
              {activeRole === "student" ? "Roll Number" : "Admin ID"}
            </label>

            <div className="register-input">
              <i className="fa-solid fa-id-card"></i>
              <input
                type="text"
                name={activeRole === "student" ? "rollNumber" : "adminId"}
                placeholder={
                  activeRole === "student"
                    ? "Enter your roll number"
                    : "Enter your admin ID"
                }
                value={
                  activeRole === "student"
                    ? formData.rollNumber
                    : formData.adminId
                }
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="register-field">
            <label>
              {activeRole === "admin" ? "Official Email" : "Email Address"}
            </label>

            <div className="register-input">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="register-field">
            <label>Mobile Number</label>

            <div className="register-input">
              <i className="fa-solid fa-phone"></i>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Student Fields */}
          {activeRole === "student" && (
            <>
              <div className="register-field">
                <label>Department</label>

                <div className="register-input">
                  <i className="fa-solid fa-building-columns"></i>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="CE">Civil Engineering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="register-field">
                <label>Year / Semester</label>

                <div className="register-input">
                  <i className="fa-solid fa-graduation-cap"></i>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Admin Fields */}
          {activeRole === "admin" && (
            <>
              <div className="register-field">
                <label>Designation</label>

                <div className="register-input">
                  <i className="fa-solid fa-briefcase"></i>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  >
                    <option value="">Select Designation</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Facility Manager">Facility Manager</option>
                    <option value="Support Staff">Support Staff</option>
                  </select>
                </div>
              </div>

              <div className="register-field">
                <label>Admin Invitation Code</label>

                <div className="register-input">
                  <i className="fa-solid fa-key"></i>
                  <input
                    type="password"
                    name="invitationCode"
                    placeholder="Enter invitation code"
                    value={formData.invitationCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {/* Password */}
          <div className="register-field">
            <label>Password</label>

            <div className="register-input">
              <i className="fa-solid fa-lock"></i>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="register-field">
            <label>Confirm Password</label>

            <div className="register-input">
              <i className="fa-solid fa-lock"></i>

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="register-error">{error}</p>}

          {/* Success Message */}
          {success && <p className="register-success">{success}</p>}

          {/* Register Button */}
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="register-divider">
          <span></span>
          or
          <span></span>
        </div>

        <p className="register-login-text">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
