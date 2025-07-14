import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        formData,
        { withCredentials: true }
      );

      login(response.data.email, response.data.isAdmin);

      if (response.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/reportortrack");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <a href="/" className="login-home-link">
        <svg viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        Home
      </a>

      <div className="login-header">
        <h1>CivicFix</h1>
        <p>Community Issue Resolution Platform</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-form-title">Login In to Your Account</h2>
        {error && <div className="login-error-message">{error}</div>}

        <div className="login-form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-submit-button">
          Continue to Dashboard
        </button>

        <div className="login-auth-footer">
          <p>
            New to CivicFix? <a href="/signup">Create account</a>
          </p>
          <p>
            <a href="/forgot-password">Forgot password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
