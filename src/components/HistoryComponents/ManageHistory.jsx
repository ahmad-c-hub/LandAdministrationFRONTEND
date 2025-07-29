import React from 'react';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const ManageHistory = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📜 Manage Ownership History</h2>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#d4edda" }}>
        <p className="mb-3">Browse through the complete ownership history records in the system.</p>
        <button className="btn btn-success" onClick={() => navigate("/history/all-records")}>📄 View All History</button>
      </div>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#d1ecf1" }}>
        <p className="mb-3">Look up history records by entering a specific land ID.</p>
        <button className="btn btn-primary">🏞️ View History by Land ID</button>
      </div>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#fff3cd" }}>
        <p className="mb-3">Look up all land history owned by a specific owner using their ID.</p>
        <button className="btn btn-warning text-dark">👤 View History by Owner ID</button>
      </div>

      <div className="p-4 mb-3 rounded" style={{ backgroundColor: "#f8d7da" }}>
        <p className="mb-3">⚠️ Permanently delete all ownership history records from the system.</p>
        <button className="btn btn-danger">🗑️ Delete All History</button>
      </div>
    </div>
  );
};

export default ManageHistory;
