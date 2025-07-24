import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("https://landadministration-production.up.railway.app/user/register", {
        username: formData.username,
        password: formData.password,
      });

      setSuccess("Signed up successfully. You can now login.");
      setTimeout(() => navigate("/login"), 2000); // optional delay before redirect
    } catch (err) {
      const message =
        err.response?.data?.error || err.response?.data || err.message || "Registration failed.";
      setError(message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #fff1b8, #e3c4ff)",
      }}
    >
      <div
        className="bg-white shadow p-4 rounded"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Register</h2>
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

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-1 text-center" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-1 text-center" role="alert">
              {success}
            </div>
          )}

          <button className="btn btn-primary w-100 mt-2" type="submit">
            Sign Up
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "underline" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
