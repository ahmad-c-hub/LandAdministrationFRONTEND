import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Alert } from 'react-bootstrap';

const ManageHistory = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleDelete = () => {
    axios
      .delete('https://landadministration-production.up.railway.app/ownership-history/delete-all')
      .then((response) => {
        setSuccessMsg(response.data);
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error deleting history:", error);
        setShowModal(false);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📜 Manage Ownership History</h2>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#d4edda" }}>
        <p className="mb-3">Browse through the complete ownership history records in the system.</p>
        <button className="btn btn-success" onClick={() => navigate("/history/all-records")}>
          📄 View All History
        </button>
      </div>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#d1ecf1" }}>
        <p className="mb-3">Look up history records by entering a specific land ID.</p>
        <button className="btn btn-primary" onClick={() => navigate("/history/records-by-land-id")}>
          🏞️ View History by Land ID
        </button>
      </div>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#fff3cd" }}>
        <p className="mb-3">Look up all land history owned by a specific owner using their ID.</p>
        <button className="btn btn-warning text-dark" onClick={() => navigate("/history/records-by-owner-id")}>
          👤 View History by Owner ID
        </button>
      </div>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#f8d7da" }}>
        <p className="mb-3">⚠️ Permanently delete all ownership history records from the system.</p>
        <button className="btn btn-danger" onClick={() => setShowModal(true)}>
          🗑️ Delete All History
        </button>

        {successMsg && <Alert variant="success" className="mt-3">{successMsg}</Alert>}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>all</strong> ownership history records? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Yes, Delete All
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageHistory;
