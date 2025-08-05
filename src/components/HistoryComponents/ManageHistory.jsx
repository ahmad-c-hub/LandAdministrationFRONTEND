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
    </div>
  );
};

export default ManageHistory;
