import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const registered = location.state?.registered || false;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://landadministration-production.up.railway.app/user/login", formData);
      const token = response.data;
      if (token === "fail") {
      setError("Invalid username or password.");
    } else {
      localStorage.setItem("token", token);
      onLogin();
      navigate("/");
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #c4e0ff, #d9b6ff)",
      }}
    >
      <div
        className="bg-white shadow p-4 rounded"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {registered && (
          <div className="alert alert-success text-center py-2">
            Signed up successfully! You can now log in.
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100 mt-2" type="submit">
            Login
          </button>
        </form>
        <button
            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              window.location.href = "http://landadministration-production.up.railway.app/oauth2/authorization/google";
            }}
            style={{
              backgroundColor: "#ffffff",
              marginTop:"20px",
              color: "#000000",
              border: "1px solid #ddd",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              fontWeight: "500",
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              style={{ width: "20px", height: "20px" }}
            />
            Continue with Google
          </button>


        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <a href="/sign-up" style={{ textDecoration: "underline" }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
