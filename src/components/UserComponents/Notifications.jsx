import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Spinner } from "react-bootstrap";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showOldOwnerModal, setShowOldOwnerModal] = useState(false);
  const [showNewOwnerModal, setShowNewOwnerModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [oldOwner, setOldOwner] = useState(null);
  const [newOwner, setNewOwner] = useState(null);
  const [landLoading, setLandLoading] = useState(false);
  const [oldOwnerIdStated, setOldOwnerIdStated] = useState()

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
      fiveDaysAgo.setDate(fiveDaysAgo.getDate());

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

  const extractNewOwnerIdFromMessage = (message) => {
  const match = message.match(/New Owner\s*:\s*(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const extractOldOwnerIdFromMessage = (message) => {
  const match = message.match(/Old Owner\s*:\s*(\w+)/);
  if (!match) return null;

  if (match[1] === 'N/A') {
    return 'N/A';
  }

  return parseInt(match[1], 10);
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

   const fetchOldOwnerById = async (ownerId) => {
    try {
      const res = await axios.get(
        `https://landadministration-production.up.railway.app/land-owner/${ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOldOwner(res.data);
      setShowOldOwnerModal(true);
    } catch (err) {
      alert("Failed to fetch owner details.");
    }
  };
  
  const fetchNewOwnerById = async (ownerId) => {
    try {
      const res = await axios.get(
        `https://landadministration-production.up.railway.app/land-owner/${ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewOwner(res.data);
      setShowNewOwnerModal(true);
    } catch (err) {
      alert("Failed to fetch owner details.");
    }
  };
  


  const handleViewLandDetails = (message) => {
    const landId = extractLandIdFromMessage(message);
    if (landId) {
      fetchLandById(landId);
    }
  };

  const handleViewOldOwnerDetails = (message) => {
    const ownerId = extractOldOwnerIdFromMessage(message);
    if(ownerId!=='N/A'){
      fetchOldOwnerById(ownerId);
    }
  }

  const handleViewNewOwnerDetails = (message) => {
    const ownerId = extractNewOwnerIdFromMessage(message);
    if(ownerId){
      fetchNewOwnerById(ownerId);
    }
  }

  

  return (
    <div className="container mt-4">
      <h3>🔔 Recent Notifications (Today)</h3>

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
                  <div className="d-flex flex-wrap gap-2 mt-2">
  {n.message.includes("Land") && (
    <Button
      size="sm"
      variant="info"
      onClick={() => handleViewLandDetails(n.message)}
    >
      View Land Details
    </Button>
  )}
  {n.message.includes("New Ownership for Land") && (
    <Button
      size="sm"
      variant="primary"
      onClick={() => handleViewNewOwnerDetails(n.message)}
    >
      View New Owner Details
    </Button>
  )}
  {n.message.includes("New Ownership for Land") && !n.message.includes("N/A") && (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => handleViewOldOwnerDetails(n.message)}
    >
      View Old Owner Details
    </Button>
  )}
</div>

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
        {/* New Owner Details Modal */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewOwnerModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showNewOwnerModal} onHide={() => setShowNewOwnerModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Owner Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!newOwner? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <p><strong>Name:</strong> {newOwner.fullName}</p>
            <p ><strong>ID:</strong> {newOwner.id}</p>
            <p><strong>Phone:</strong> {newOwner.phoneNumber}</p>
            <p><strong>Email:</strong> {newOwner.emailAddress}</p>
            <p><strong>Number of Lands:</strong> {newOwner.numberOfLands}</p>
            <p><strong>Age:</strong> {newOwner.age}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewOwnerModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Old Owner Details Modal */}
      <Modal show={showOldOwnerModal} onHide={() => setShowOldOwnerModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Old Owner Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!oldOwner ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <p><strong>Name:</strong> {oldOwner.fullName}</p>
            <p ><strong>ID:</strong> {oldOwner.id}</p>
            <p><strong>Phone:</strong> {oldOwner.phoneNumber}</p>
            <p><strong>Email:</strong> {oldOwner.emailAddress}</p>
            <p><strong>Number of Lands:</strong> {oldOwner.numberOfLands}</p>
            <p><strong>Age:</strong> {oldOwner.age}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOldOwnerModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications;
