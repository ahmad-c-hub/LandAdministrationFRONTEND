import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

const Profile = () => {
  const [logs, setLogs] = useState([]);
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("ROLE_USER");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchLogs = async (pageNumber) => {
    try {
      const res = await axios.get(
        `https://landadministration-production.up.railway.app/user-log/current-user?page=${pageNumber}&size=10`
      );
      setLogs(res.data.content);
      setTotalPages(res.data.totalPages);
      if (res.data.content.length > 0) {
        setUsername(res.data.content[0].username);
        setCountry(res.data.content[0].country);
        setNewUsername(res.data.content[0].username);
      }
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  };

  const fetchRole = () => {
    axios
      .get("https://landadministration-production.up.railway.app/user/get-role")
      .then((res) => setRole(res.data))
      .catch((err) => console.error("Failed to get role:", err));
  };

  useEffect(() => {
    fetchLogs(page);
    fetchRole();
  }, [page]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    if (newUsername.trim() === username) {
      setError("New username is the same as the current one.");
      return;
    }
    try {
      await axios.put(
        "https://landadministration-production.up.railway.app/user/update-current-user",
        {
          username: newUsername.trim(),
        }
      );
      setSuccess("✅ Username changed successfully. Redirecting to login...");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login", {
          state: {
            message: "🔒 Username changed. Please log in again.",
          },
        });
      }, 3000);
    } catch (err) {
      const backendError = err?.response?.data;
      if (typeof backendError === "string") {
        setError(backendError);
      } else if (backendError?.error) {
        setError(backendError.error);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setError("Both fields are required.");
      return;
    }
    try {
      await axios.put(
        "https://landadministration-production.up.railway.app/user/change-password",
        {
          oldPassword,
          newPassword,
        }
      );
      setShowPasswordModal(false);
      setSuccess("✅ Password changed successfully. Redirecting to login...");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login", {
          state: {
            message: "🔒 Password changed. Please log in again.",
          },
        });
      }, 3000);
    } catch (err) {
      setShowPasswordModal(false);
      const backendError = err?.response?.data;
      if (typeof backendError === "string") {
        setError(backendError);
      } else if (backendError?.error) {
        setError(backendError.error);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">👤 User Profile</h2>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success text-center" role="alert">
          {success}
        </div>
      )}

      <div className="card p-3 shadow-sm mb-4 d-flex align-items-center flex-row justify-content-between">
        <div className="d-flex align-items-center w-100">
          <strong className="me-2">Username:</strong>
          {editMode ? (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="form-control"
              style={{ maxWidth: "300px" }}
            />
          ) : (
            <span>
              {username}{" "}
              {role === "ROLE_USER" && country && (
                <span className="badge bg-secondary ms-2">{country}</span>
              )}
            </span>
          )}
        </div>

        {editMode ? (
          <div className="ms-3 d-flex">
            <button className="btn btn-success me-2" onClick={handleUsernameChange}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditMode(false);
                setError("");
                setNewUsername(username);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="d-flex ms-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setEditMode(true)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => setShowPasswordModal(true)}
            >
              🔒 Change Password
            </button>
          </div>
        )}
      </div>

      <div className="card p-3 shadow-sm">
        <h5>User Logs</h5>
        <Table striped bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.action}</td>
                <td>{formatTimestamp(log.timestamp)}</td>
                <td>
                  <code>{log.description}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            ⬅️ Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next ➡️
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "#00000099" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h5 className="mb-3">🔐 Change Password</h5>
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-3"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="d-flex justify-content-end">
                <button className="btn btn-success me-2" onClick={handlePasswordChange}>
                  Change
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setOldPassword("");
                    setNewPassword("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
