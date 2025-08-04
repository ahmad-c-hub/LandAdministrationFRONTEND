import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

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
      // Update state locally
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read.");
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
            </div>
            {!n.read && (
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => markAsRead(n.id)}
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsComponent;
