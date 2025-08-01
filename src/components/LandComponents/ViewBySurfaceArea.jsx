import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ViewBySurfaceArea = () => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sortedBy, setSortedBy] = useState("surfaceAreaAsc");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");

  const [selectedLand, setSelectedLand] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [polygonCoords, setPolygonCoords] = useState([]);

  const handleSearch = async (pageToLoad = 0) => {
    if (!min || !max || isNaN(min) || isNaN(max)) {
      setError("❌ Please enter valid numeric min and max surface areas.");
      return;
    }

    try {
      const response = await axios.get(
        `https://landadministration-production.up.railway.app/land/surface-area-paged/${min}/${max}/${sortedBy}`,
        {
          params: {
            page: pageToLoad,
            size: 10,
          },
        }
      );
      setResults(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(pageToLoad);
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch surface area filtered lands.");
      setResults([]);
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📏 View Lands by Surface Area</h2>

      {/* Input Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Min Surface Area"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Max Surface Area"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortedBy}
            onChange={(e) => setSortedBy(e.target.value)}
          >
            <option value="surfaceAreaAsc">Sort by Surface Area ↑</option>
            <option value="surfaceAreaDesc">Sort by Surface Area ↓</option>
            <option value="id">Sort by ID</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={() => handleSearch(0)}>
            Search
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Results Table */}
      {results.length > 0 && (
        <>
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Coordinates</th>
                  <th>Surface Area</th>
                  <th>Usage Type</th>
                  <th>Current Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((land) => (
                  <tr key={land.id}>
                    <td>{land.id}</td>
                    <td>{land.location}</td>
                    <td>{land.locationCoordinates}</td>
                    <td>{land.surfaceArea}</td>
                    <td>{land.usageType}</td>
                    <td>
                      {land.currentOwner ? (
                        <Link to={`/display-land-owner?id=${land.currentOwner.id}`}>
                          👤 {land.currentOwner.fullName}
                        </Link>
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
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => handleSearch(page - 1)}
              disabled={page === 0}
            >
              ◀ Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={() => handleSearch(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              Next ▶
            </button>
          </div>

          {/* Map Modal */}
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
                      <Polygon positions={polygonCoords} pathOptions={{ color: "red" }} />
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
        </>
      )}
    </div>
  );
};

export default ViewBySurfaceArea;
