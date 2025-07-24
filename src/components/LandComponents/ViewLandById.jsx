import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ViewLandById = () => {
  const [landId, setLandId] = useState("");
  const [land, setLand] = useState(null);
  const [error, setError] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [deletionMessage, setDeletionMessage] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const fetchLand = async () => {
    try {
      const response = await axios.get(`http://landadministration-production.up.railway.app/land/get/${landId}`);
      setLand(response.data);
      setError("");
      setEditMessage("");
      setDeletionMessage("");
      setTransferMessage("");
    } catch (err) {
      console.error(err);
      setLand(null);
      setError("❌ Land not found.");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://landadministration-production.up.railway.app/land/update-usage-type/${land.id}/${land.usageType}`, land);
      setShowEditModal(false);
      setEditMessage(`✅ Land with ID ${land.id} updated successfully.`);
    } catch (err) {
      console.error(err);
      setEditMessage("❌ Failed to update land.");
      setShowEditModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLand((prev) => ({ ...prev, [name]: value }));
  };

  const deleteLand = async () => {
    try {
      await axios.delete(`http://landadministration-production.up.railway.app/land/delete/${land.id}`);
      setDeletionMessage(`✅ Land with ID ${land.id} deleted successfully.`);
      setLand(null);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("❌ Error deleting land:", error);
      setDeletionMessage("❌ Failed to delete land.");
      setShowConfirmModal(false);
    }
  };

  const handleTransferOwnership = async () => {
    try {
      await axios.post(`http://landadministration-production.up.railway.app/land-owner/${land.id}/assign-owner/${newOwnerId}`);

      setTransferMessage(`✅ Ownership of land ${land.id} transferred to owner ${newOwnerId}.`);
      setShowTransferModal(false);
      fetchLand();
      setNewOwnerId("");
    } catch (err) {
      console.error(err);
      setTransferMessage("❌ Failed to transfer ownership.");
      setShowTransferModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Land by ID</h2>

      {/* Input for ID */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Enter Land ID"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchLand}>
            Find Land
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {deletionMessage && <div className="alert alert-success text-center">{deletionMessage}</div>}
      {editMessage && <div className="alert alert-success text-center">{editMessage}</div>}
      {transferMessage && <div className="alert alert-success text-center">{transferMessage}</div>}

      {/* Land Info */}
      {land && (
        <div className="card p-4 shadow-sm mb-4">
          <h3>Land Info</h3>
          <hr />
          <p><strong>ID:</strong> {land.id}</p>
          <p><strong>Location:</strong> {land.location}</p>
          <p><strong>Coordinates:</strong> {land.locationCoordinates}</p>
          <p><strong>Surface Area:</strong> {land.surfaceArea}</p>
          <p><strong>Usage Type:</strong> {land.usageType}</p>
          <p><strong>Current Owner:</strong> {land.currentOwner ? land.currentOwner.fullName : "N/A"}</p>

          <div className="mt-4 d-flex gap-3">
            <button className="btn btn-outline-primary" onClick={() => setShowEditModal(true)}>
              📝 Edit Land
            </button>
            <button className="btn btn-outline-danger" onClick={() => setShowConfirmModal(true)}>
              🗑️ Delete Land
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setShowTransferModal(true)}>
              👥➡️ Transfer Ownership
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Land</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {land && (
            <div className="mb-3">
              <label className="form-label">Usage Type</label>
              <input
                type="text"
                className="form-control"
                name="usageType"
                value={land.usageType}
                onChange={handleChange}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this land?
          <div className="mt-3">
            <p><strong>ID:</strong> {land?.id}</p>
            <p><strong>Location:</strong> {land?.location}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteLand}>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Transfer Ownership Modal */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Transfer Ownership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">New Owner ID</label>
            <input
              type="number"
              className="form-control"
              value={newOwnerId}
              onChange={(e) => setNewOwnerId(e.target.value)}
              placeholder="Enter new owner ID"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleTransferOwnership}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewLandById;
