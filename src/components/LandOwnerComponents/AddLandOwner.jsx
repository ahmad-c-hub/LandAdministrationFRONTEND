import React, { useState } from "react";
import axios from "axios";

const AddLandOwner = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNb: "",
    emailAddress: "",
    dateOfBirth: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://landadministration-production.up.railway.app/land-owner/add",
        formData
      );
      setSuccessMessage("✅ Land owner added successfully!");
      setErrorMessage("");
      setFormData({
        firstName: "",
        lastName: "",
        phoneNb: "",
        emailAddress: "",
        dateOfBirth: "",
      });
    } catch (err) {
      setSuccessMessage("");
      const msg = err?.response?.data;
      if (typeof msg === "string") setError(msg);
      else if (msg?.error) setError(msg.error);
      else setError("An unknown error occurred.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🧑 Add New Land Owner</h2>

      <div className="card p-4 shadow-sm" style={{ backgroundColor: "#e6f0ff" }}>
        <div className="mb-3">
          <label>🧍 First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter first name"
          />
        </div>

        <div className="mb-3">
          <label>🧍 Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter last name"
          />
        </div>

        <div className="mb-3">
          <label>📞 Phone Number</label>
          <input
            type="text"
            name="phoneNb"
            value={formData.phoneNb}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter phone number"
          />
        </div>

        <div className="mb-3">
          <label>📧 Email Address</label>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-3">
          <label>🎂 Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            max="2025-07-28"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button className="btn btn-success w-100" onClick={handleSubmit}>
          ➕ Add Land Owner
        </button>

        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AddLandOwner;
