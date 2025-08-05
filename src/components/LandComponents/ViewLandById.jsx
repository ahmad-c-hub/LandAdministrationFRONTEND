import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  const [role, setRole] = useState("ROLE_USER");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnassignConfirmModal, setShowUnassignConfirmModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [polygonCoords, setPolygonCoords] = useState([]);

  useEffect(() =>{
        axios
        .get(`https://landadministration-production.up.railway.app/user/get-role`)
        .then((response) => {
          setRole(response.data);
          setError("");
        })
      }, []);

  const navigate = useNavigate();

  const fetchLand = async () => {
    if (!landId || isNaN(landId)) {
      setError("Please enter a valid Land ID.");
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
    if (isNaN(parseInt(newOwnerId))) {
      setNewOwnerDetails(null);
      setNewOwnerError("Please enter a valid ID.");
      return;
    }

    if (land.currentOwner && parseInt(newOwnerId) === land.currentOwner.id) {
      setNewOwnerError("⚠️ Cannot transfer ownership to the current owner.");
      setNewOwnerDetails(null);
      setNewOwnerId("");
      setShowTransferModal(false);
      return;
    }

    const response = await axios.get(
      `https://landadministration-production.up.railway.app/land-owner/${newOwnerId}`
    );
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
      await axios.post(`https://landadministration-production.up.railway.app/land/unassign-owner/${land.id}`);
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

  const calculatePolygon = (lat, lng, area) => {
    const sideMeters = Math.sqrt(area || 100);
    const latDelta = sideMeters / 111320;
    const lngDelta = sideMeters / (111320 * Math.cos(lat * Math.PI / 180));
    return [
      [lat + latDelta / 2, lng - lngDelta / 2],
      [lat + latDelta / 2, lng + lngDelta / 2],
      [lat - latDelta / 2, lng + lngDelta / 2],
      [lat - latDelta / 2, lng - lngDelta / 2],
    ];
  };

  const handleViewMap = () => {
    const [lat, lng] = land.locationCoordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    const polygon = calculatePolygon(lat, lng, land.surfaceArea);
    setPolygonCoords(polygon);
    setShowPreviewModal(true);
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
            {role!=="ROLE_USER"?<button className="btn btn-outline-primary" onClick={() => setShowEditModal(true)}>
              📝 Edit Land
            </button>:null}
            {role!=="ROLE_USER"?<button className="btn btn-outline-danger" onClick={() => setShowConfirmModal(true)}>
              🗑️ Delete Land
            </button>:null}
            {role!=="ROLE_USER"?<button className="btn btn-outline-secondary" onClick={() => setShowTransferModal(true)}>
              👥➡️ Transfer Ownership
            </button>:null}
            {role!=="ROLE_USER"?<button
              className="btn btn-outline-warning"
              onClick={() => setShowUnassignConfirmModal(true)}
              disabled={!land.currentOwner}
            >
              🔓 Unassign Owner
            </button>:null}
            <button className="btn btn-outline-info" onClick={handleViewMap}>
              📍 Preview
            </button>
            <a
              href={`https://www.google.com/maps?q=${land.locationCoordinates}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-success"
            >
              🌐 Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>📍 Land Polygon Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {land && (
            <MapContainer
              center={land.locationCoordinates.split(",").map(coord => parseFloat(coord.trim()))}
              zoom={20}
              style={{ height: "400px", borderRadius: "8px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {polygonCoords.length > 0 && (
                <Polygon positions={polygonCoords} pathOptions={{ color: "red" }} />
              )}
            </MapContainer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>❌ Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
{land && (
  <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Edit Usage Type</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <select
        className="form-control"
        name="usageType"
        value={land.usageType || ""}
        onChange={handleChange}
      >
        <option value="">Select usage type</option>
        <option value="Agricultural">Agricultural</option>
        <option value="Residential">Residential</option>
        <option value="Farming">Farming</option>
        <option value="Commercial">Commercial</option>
      </select>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowEditModal(false)}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={land.usageType !== originalUsageType ? handleEditSubmit : displayEditError}
      >
        Save
      </Button>
    </Modal.Footer>
  </Modal>
)}

{/* Delete Confirm Modal */}
{land && (
<Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete land with ID {land.id}?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
    <Button variant="danger" onClick={deleteLand}>Delete</Button>
  </Modal.Footer>
</Modal>
)}

{/* Transfer Ownership Modal */}

{land && (
<Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Transfer Ownership</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <input
      type="number"
      placeholder="Enter new owner ID"
      className="form-control"
      value={newOwnerId}
      onChange={(e) => setNewOwnerId(e.target.value)}
    />
    {newOwnerError && <div className="text-danger mt-2">{newOwnerError}</div>}
    {newOwnerDetails && (
      <div className="mt-2">
        <strong>New Owner Name:</strong> {newOwnerDetails.fullName}
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button>
    <Button variant="info" onClick={handleTransferOwnership}>Find Owner</Button>
    {newOwnerDetails && (
      <Button variant="success" onClick={confirmTransfer}>Confirm Transfer</Button>
    )}
  </Modal.Footer>
</Modal>
)}

{/* Unassign Owner Modal */}
{land && (
<Modal show={showUnassignConfirmModal} onHide={() => setShowUnassignConfirmModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Unassign</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to unassign the current owner from land ID {land.id}?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUnassignConfirmModal(false)}>Cancel</Button>
    <Button variant="warning" onClick={unassignOwner}>Unassign</Button>
  </Modal.Footer>
</Modal>
)}

    </div>
  );
};

export default ViewLandById;
