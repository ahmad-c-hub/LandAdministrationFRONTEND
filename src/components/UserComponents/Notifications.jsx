import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [currRole, setCurrRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [approvalReason, setApprovalReason] = useState("");

  const reasonOptions = [
    "Trusted contributor",
    "Strong leadership",
    "Policy exception",
    "Long-term contribution",
    "Recommended by regional lead"
  ];

  useEffect(() => {
    fetchRole();
    fetchNotifications();
  }, []);

  const fetchRole = async () => {
    try {
      const res = await axios.get(
        "https://landadministration-production.up.railway.app/user/get-role",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCurrRole(res.data);
    } catch (err) {
      console.error("Failed to fetch role");
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://landadministration-production.up.railway.app/notifications/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(res.data);
    } catch (err) {
      setErrorMsg("Failed to load notifications.");
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `https://landadministration-production.up.railway.app/notifications/${id}/mark-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read.");
    }
  };

  const openApprovalModal = (notification) => {
    setSelectedNotification(notification);
    setApprovalReason("");
    setShowModal(true);
  };

  const handleApprovalSubmit = async () => {
    if (!approvalReason || !selectedNotification) return;

    try {
      const messageLines = selectedNotification.message.split("\n")[0]; // REQUEST line
      const username = messageLines.split("user:")[1].split("to")[0].trim();
      const role = messageLines.split("role:")[1].trim();

      const approvalMessage = `ACCEPTED: Promote user: ${username} to role: ${role}\nREASON: ${approvalReason}`;

      await axios.post(
        "https://landadministration-production.up.railway.app/notifications/respond",
        { message: approvalMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowModal(false);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to approve request:", err);
      alert("Approval failed.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Notifications</h3>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {notifications.length === 0 && <p>No notifications yet.</p>}

      <ul className="list-group">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`list-group-item d-flex justify-content-between align-items-start ${
              n.read ? "" : "list-group-item-warning"
            }`}
          >
            <div>
              <strong>{n.title}</strong>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: "0.4rem" }}>
                {n.message}
              </p>
              <small>
                From: User #{n.senderId} •{" "}
                {new Date(n.issuedAt).toLocaleString()}
              </small>
              <div className="mt-2 d-flex gap-2">
                {!n.read && (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => markAsRead(n.id)}
                  >
                    Mark as Read
                  </button>
                )}

                {currRole === "ROLE_ADMIN" &&
                  n.message.startsWith("REQUEST: Promote user:") && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openApprovalModal(n)}
                    >
                      ✅ Accept Request
                    </button>
                  )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Approval Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Role Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to approve:
            <br />
            <strong>{selectedNotification?.message.split("\n")[0]}</strong>
          </p>
          <Form.Group className="mt-3">
            <Form.Label>Reason for Approval</Form.Label>
            <Form.Select
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              required
            >
              <option value="">-- Select a reason --</option>
              {reasonOptions.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleApprovalSubmit}
            disabled={!approvalReason}
          >
            ✅ Confirm Approval
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications;
