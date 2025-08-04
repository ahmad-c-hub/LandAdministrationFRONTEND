import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Spinner } from "react-bootstrap";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [landLoading, setLandLoading] = useState(false);

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

      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const filtered = res.data.filter((n) => new Date(n.issuedAt) >= fiveDaysAgo);
      setNotifications(filtered);
    } catch (err) {
      setErrorMsg("❌ Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const extractLandIdFromMessage = (message) => {
    const match = message.match(/New Land\s*:\s*(\d+)/);
    return match ? match[1] : null;
  };

  const fetchLandById = async (landId) => {
    setLandLoading(true);
    try {
      const res = await axios.get(
        `https://landadministration-production.up.railway.app/land/get/${landId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedLand(res.data);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch land details.");
    } finally {
      setLandLoading(false);
    }
  };

  const handleViewLandDetails = (message) => {
    const landId = extractLandIdFromMessage(message);
    if (landId) {
      fetchLandById(landId);
    }
  };

  return (
    <div className="container mt-4">
      <h3>🔔 Recent Notifications (Last 5 Days)</h3>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger">{errorMsg}</div>
      ) : notifications.length === 0 ? (
        <p className="text-muted">No recent notifications.</p>
      ) : (
        <div className="d-flex flex-column gap-3 mt-3">
          {notifications.map((n) => (
            <Card key={n.id} className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title className="mb-1">{n.title}</Card.Title>
                    <Card.Text className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
                      {n.message}
                    </Card.Text>
                    <Card.Subtitle className="text-muted small">
                      From: System •{" "}
                      {new Date(n.issuedAt).toLocaleString()}
                    </Card.Subtitle>
                  </div>
                  {n.message.includes("New Land") && (
                    <Button
                      size="sm"
                      variant="info"
                      className="ms-3"
                      onClick={() => handleViewLandDetails(n.message)}
                    >
                      View Land Details
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Land Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🏞️ Land Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {landLoading || !selectedLand ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <p><strong>ID:</strong> {selectedLand.id}</p>
              <p><strong>Location:</strong> {selectedLand.location}</p>
              <p><strong>Coordinates</strong> {selectedLand.locationCoordinates}</p>
              <p><strong>Usage Type:</strong> {selectedLand.usageType}</p>
              <p><strong>Surface Area:</strong> {selectedLand.surfaceArea}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications;
