import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SearchLands = () => {
  const [location, setLocation] = useState("");
  const [usageType, setUsageType] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [sortedBy, setSortedBy] = useState("id");

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLand, setSelectedLand] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [polygonCoords, setPolygonCoords] = useState([]);

  const fetchLands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/land/search", {
        params: {
          location: location || undefined,
          usageType: usageType || undefined,
          ownerName: ownerName || undefined,
          sortedBy,
          page,
          size: 10,
        },
      });
      setResults(response.data.content);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong while fetching lands.");
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

  useEffect(() => {
    fetchLands();
  }, [page, sortedBy]);

  const handleSearch = () => {
    setPage(0);
    fetchLands();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🔍 Search Lands</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={usageType}
            onChange={(e) => setUsageType(e.target.value === "none" ? "" : e.target.value)}
          >
            <option value="none">None</option>
            <option value="Residential">Residential</option>
            <option value="Farming">Farming</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={sortedBy}
            onChange={(e) => setSortedBy(e.target.value)}
          >
            <option value="id">Sort by ID</option>
            <option value="location">Sort by Location</option>
            <option value="surfaceAreaAsc">Surface Area ↑</option>
            <option value="surfaceAreaDesc">Surface Area ↓</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {results.length > 0 && (
        <>
          <div className="table-responsive mt-4">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Coordinates</th>
                  <th>Surface Area</th>
                  <th>Usage Type</th>
                  <th>Owner Name</th>
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

          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 0}
            >
              ◀ Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page + 1 >= totalPages}
            >
              Next ▶
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

export default SearchLands;
