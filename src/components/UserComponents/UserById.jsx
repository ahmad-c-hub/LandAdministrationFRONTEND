import React, { useState } from "react";
import axios from "axios";

const UserById = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const fetchUserById = () => {
    if (!userId.trim()) {
      setError("Please enter a valid user ID.");
      setUser(null);
      return;
    }

    const URL = `https://landadministration-production.up.railway.app/user/get-user/${userId}`;
    axios
      .get(URL)
      .then((response) => {
        setUser(response.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        setError("User ID does not exist.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🔍 Search User by ID</h2>

      <div className="d-flex justify-content-center mb-4">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="form-control w-25 me-3"
        />
        <button className="btn btn-primary" onClick={fetchUserById}>
          Search
        </button>
      </div>

      {error && (
        <div className="text-center text-danger fw-bold mb-3">{error}</div>
      )}

      {user && (
        <div className="mx-auto p-4 border rounded bg-light" style={{ maxWidth: "500px" }}>
          <h4 className="mb-3">👤 User Information</h4>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Is Google User:</strong> {user.googleUser ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default UserById;
