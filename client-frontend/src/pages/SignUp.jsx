import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 201 || res.status === 400) {
      alert(data.message);
      navigate("/login");
    } else {
      alert(data.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <a href="/" className="signup-home-link">
        <svg viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        Home
      </a>

      <div className="signup-header">
        <h1>CivicFix</h1>
        <p>Join Our Community Initiative</p>
      </div>

      <form className="signup-form" onSubmit={handleSignUp}>
        <h2>Create New Account</h2>

        <div className="signup-form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="signup-form-group">
          <label>Create Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-submit-btn">
          Get Started
        </button>

        <div className="signup-auth-footer">
          <p>
            Already have an account? <a href="/login">Sign in here</a>
          </p>
          <p>
            By joining, you agree to our <a href="/terms">Terms of Service</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
