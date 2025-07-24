import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const DeleteLand = () => {
  const [landId, setLandId] = useState("");
  const [land, setLand] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLand = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/land/get/${landId}`);
      setLand(res.data);
      setShowModal(true);
      setError("");
    } catch (err) {
      console.error(err);
      setLand(null);
      setError("❌ Land ID not found.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:8080/land/delete/${landId}`);
      setMessage(`✅ Land with ID ${res.data.id} was deleted successfully.`);
      setLand(null);
      setLandId("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to delete land.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Delete Land</h2>

      {/* Input Box */}
      <div className="bg-white p-4 rounded shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <label htmlFor="landId" className="form-label">
          Enter Land ID
        </label>
        <input
          type="number"
          className="form-control mb-3"
          id="landId"
          placeholder="Land ID"
          value={landId}
          onChange={(e) => setLandId(e.target.value)}
        />
        <button className="btn btn-danger" onClick={fetchLand}>
          Find Land
        </button>
      </div>

      {/* Error / Message */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {message && <div className="alert alert-success mt-3">{message}</div>}

      {/* Confirm Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {land && (
            <>
              <p><strong>Location:</strong> {land.location}</p>
              <p><strong>Coordinates:</strong> {land.locationCoordinates}</p>
              <p><strong>Surface Area:</strong> {land.surfaceArea}</p>
              <p><strong>Usage Type:</strong> {land.usageType}</p>
              <p>
                <strong>Current Owner:</strong>{" "}
                {land.currentOwner ? land.currentOwner.fullName : "N/A"}
              </p>
              <div className="alert alert-warning text-center mt-3">
                Are you sure you want to delete this land?
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteLand;
