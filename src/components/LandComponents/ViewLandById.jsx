import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ViewLandById = () => {
  const [landId, setLandId] = useState("");
  const [land, setLand] = useState(null);
  const [originalUsageType, setOriginalUsageType] = useState("");
  const [error, setError] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [deletionMessage, setDeletionMessage] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("");
  const [newOwnerDetails, setNewOwnerDetails] = useState(null);
  const [newOwnerError, setNewOwnerError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnassignConfirmModal, setShowUnassignConfirmModal] = useState(false);

  const navigate = useNavigate();

  const fetchLand = async () => {
    if(!landId || isNaN(landId)){
      setError("Please enter a number!");
      return;
    }
    try {
      const response = await axios.get(`https://landadministration-production.up.railway.app/land/get/${landId}`);
      setLand(response.data);
      setOriginalUsageType(response.data.usageType);
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
      await axios.put(`https://landadministration-production.up.railway.app/land/update-usage-type/${land.id}/${land.usageType}`, land);
      setShowEditModal(false);
      setEditMessage(`✅ Land with ID ${land.id} updated successfully.`);
      setOriginalUsageType(land.usageType);
    } catch (err) {
      console.error(err);
      setEditMessage("❌ Failed to update land.");
      setShowEditModal(false);
    }
  };

  const displayEditError = () => {
    setShowEditModal(false);
    setEditMessage("⚠️ Cannot update to same Usage Type.");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLand((prev) => ({ ...prev, [name]: value }));
  };

  const deleteLand = async () => {
    try {
      await axios.delete(`https://landadministration-production.up.railway.app/land/delete/${land.id}`);
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
    if (land.currentOwner && parseInt(newOwnerId) === land.currentOwner.id) {
      setNewOwnerError("⚠️ Cannot transfer ownership to the current owner.");
      setNewOwnerDetails(null);
      setNewOwnerId("");
      setShowTransferModal(false);
      return;
    }

    const response = await axios.get(`https://landadministration-production.up.railway.app/land-owner/${newOwnerId}`);
    setNewOwnerDetails(response.data);
    setNewOwnerError("");
  } catch (err) {
    console.error(err);
    setNewOwnerDetails(null);
    setNewOwnerError("❌ No owner found with this ID.");
  }
};


  const confirmTransfer = async () => {
    try {
      await axios.post(`https://landadministration-production.up.railway.app/land-owner/${land.id}/assign-owner/${newOwnerId}`);
      setShowTransferModal(false);
      setTransferMessage(`✅ Ownership of land ${land.id} transferred to ${newOwnerDetails.fullName}.`);
      setNewOwnerId("");
      setNewOwnerDetails(null);
      fetchLand();
    } catch (err) {
      console.error(err);
      setShowTransferModal(false);
      setTransferMessage("❌ Failed to transfer ownership.");
    }
  };

  const unassignOwner = async () => {
    try {
      const response = await axios.post(`https://landadministration-production.up.railway.app/land/unassign-owner/${land.id}`);
      setShowUnassignConfirmModal(false);
      setTransferMessage(`✅ Owner unassigned successfully from land ID ${land.id}.`);
      setNewOwnerId("");
      setNewOwnerDetails(null);
      fetchLand();
    } catch (err) {
      setShowUnassignConfirmModal(false);
      console.error(err);
      setTransferMessage("❌ Failed to unassign owner.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Land by ID</h2>

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

      {error && <div className="alert alert-danger">{error}</div>}
      {deletionMessage && <div className="alert alert-success text-center">{deletionMessage}</div>}
      {editMessage && <div className="alert alert-success text-center">{editMessage}</div>}
      {transferMessage && <div className="alert alert-success text-center">{transferMessage}</div>}

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

          <div className="mt-4 d-flex flex-wrap gap-3">
            <button className="btn btn-outline-primary" onClick={() => setShowEditModal(true)}>
              📝 Edit Land
            </button>
            <button className="btn btn-outline-danger" onClick={() => setShowConfirmModal(true)}>
              🗑️ Delete Land
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setShowTransferModal(true)}>
              👥➡️ Transfer Ownership
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={() => setShowUnassignConfirmModal(true)}
              disabled={!land.currentOwner}
            >
              🔓 Unassign Owner
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
              <select
                className="form-select"
                name="usageType"
                value={land.usageType}
                onChange={handleChange}
              >
                <option value="">Select Usage Type</option>
                <option value="Farming">Farming</option>
                <option value="Residential">Residential</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button
            variant="success"
            onClick={() =>
              land.usageType !== originalUsageType
                ? handleEditSubmit()
                : displayEditError()
            }
          >
            Save Changes
          </Button>
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

      {/* Confirm Unassign Modal */}
      <Modal show={showUnassignConfirmModal} onHide={() => setShowUnassignConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unassign Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to unassign the current owner from this land?
          <div className="mt-3">
            <p><strong>ID:</strong> {land?.id}</p>
            <p><strong>Current Owner:</strong> {land?.currentOwner?.fullName}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnassignConfirmModal(false)}>Cancel</Button>
          <Button variant="warning" onClick={unassignOwner}>Unassign</Button>
        </Modal.Footer>
      </Modal>


      {/* Transfer Ownership Modal */}
      <Modal show={showTransferModal} onHide={() => {
        setShowTransferModal(false);
        setNewOwnerId("");
        setNewOwnerDetails(null);
        setNewOwnerError("");
      }} centered>
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
              onChange={(e) => {
                setNewOwnerId(e.target.value);
                setNewOwnerDetails(null);
                setNewOwnerError("");
              }}
              placeholder="Enter new owner ID"
            />
          </div>

          {newOwnerError && (
            <div className="alert alert-danger">{newOwnerError}</div>
          )}

          {newOwnerDetails && (
            <div className="alert alert-warning">
              Are you sure you want to transfer to:
              <br />
              <strong>{newOwnerDetails.fullName}</strong><br />
              📧 {newOwnerDetails.emailAddress}<br />
              📞 {newOwnerDetails.phoneNumber}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!newOwnerDetails ? (
            <>
              <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleTransferOwnership}>Next</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button>
              <Button variant="success" onClick={confirmTransfer}>✅ Confirm Transfer</Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewLandById;
