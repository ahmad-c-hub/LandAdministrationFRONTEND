import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LandList = () => {
  const [lands, setLands] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [sortedBy, setSortedBy] = useState("id");
  const [showModal, setShowModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [polygonCoords, setPolygonCoords] = useState([]);

  const fetchLands = async (page, sort) => {
    try {
      const res = await axios.get(
        `https://landadministration-production.up.railway.app/land/records-paged/${sort}?page=${page}&size=${size}`
      );
      setLands(res.data.content);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to fetch land records.");
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

  const handleViewMap = (land) => {
    const [lat, lng] = land.locationCoordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    const polygon = calculatePolygon(lat, lng, land.surfaceArea);
    setSelectedLand({ ...land, lat, lng });
    setPolygonCoords(polygon);
    setShowModal(true);
  };

  useEffect(() => {
    fetchLands(page, sortedBy);
  }, [page, sortedBy]);

  return (
    <div className="container mt-4">
      <h3>📋 Land Records</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="me-2">Sort by:</label>
        <select
          value={sortedBy}
          onChange={(e) => {
            setSortedBy(e.target.value);
            setPage(0);
          }}
          className="form-select w-auto d-inline-block"
        >
          <option value="id">ID</option>
          <option value="location">Location</option>
          <option value="surfaceAreaAsc">Surface Area ↑</option>
          <option value="surfaceAreaDesc">Surface Area ↓</option>
        </select>
      </div>

      {lands.length === 0 ? (
        <p>No land records available.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Coordinates</th>
              <th>Surface Area</th>
              <th>Usage Type</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lands.map((land) => (
              <tr key={land.id}>
                <td>{land.id}</td>
                <td>{land.location}</td>
                <td>{land.locationCoordinates}</td>
                <td>{land.surfaceArea}</td>
                <td>{land.usageType}</td>
                <td>
                  {land.currentOwner ? (
                    <a
                      href={`/display-land-owner?id=${land.currentOwner.id}`}
                      className="text-decoration-none"
                    >
                      👤 {land.currentOwner.fullName}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleViewMap(land)}
                  >
                    📍 Preview
                  </button>
                  <a
                    href={`https://www.google.com/maps?q=${land.locationCoordinates}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success"
                  >
                    🌐 Google Maps
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          className="btn btn-outline-primary"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          ⬅️ Previous
        </button>
        <span className="align-self-center">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ➡️
        </button>
      </div>

      {showModal && selectedLand && (
        <div className="modal d-block" style={{ background: "#00000099" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <h5 className="mb-3">📍 Land Polygon Preview</h5>
              <ul className="list-group mb-3">
                <li className="list-group-item">
                  Coordinates: {selectedLand.locationCoordinates}
                </li>
                <li className="list-group-item">
                  Surface Area: {selectedLand.surfaceArea} m²
                </li>
              </ul>

              <MapContainer
                center={[selectedLand.lat, selectedLand.lng]}
                zoom={20}
                style={{ height: "400px", borderRadius: "8px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {polygonCoords.length > 0 && (
                  <Polygon
                    positions={polygonCoords}
                    pathOptions={{ color: "red" }}
                  />
                )}
              </MapContainer>

              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  ❌ Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandList;
