import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">

      {/* Hero Section */}
      <div className="text-center bg-primary text-white p-5 rounded shadow">
        <h1 className="display-4">Welcome to Land Administration System</h1>
        <p className="lead">Efficiently manage and visualize land records.</p>
        <button
          className="btn btn-light btn-lg mt-3"
          onClick={() => navigate("/dashboard")}

        >
          View Dashboard
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Key Features</h2>
        <div className="row g-4" style={{marginBottom:"20px"}}>
          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm" style={{backgroundColor:"orange"}}>
              <div className="card-body">
                <i className="bi bi-geo-alt-fill display-4 text-primary mb-3"></i>
                <h5 className="card-title">Mapped Land Data</h5>
                <p className="card-text">View land locations directly on the map using coordinates.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm" style={{backgroundColor:"orange"}}>
              <div className="card-body">
                <i className="bi bi-person-badge-fill display-4 text-primary mb-3"></i>
                <h5 className="card-title">Owner Management</h5>
                <p className="card-text">Track, manage, and update landowner details with ease.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm" style={{backgroundColor:"orange"}}>
              <div className="card-body">
                <i className="bi bi-shield-lock-fill display-4 text-primary mb-3"></i>
                <h5 className="card-title">Secure Authentication</h5>
                <p className="card-text">JWT-based access ensures only authorized users view sensitive data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
