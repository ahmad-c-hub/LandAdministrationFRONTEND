import React, { useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OPENCAGE_API_KEY = "1b5b08ebb3ac4395a01d93107243c430";

const AddLand = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [surfaceArea, setSurfaceArea] = useState("");
  const [usageType, setUsageType] = useState("Residential");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [location, setLocation] = useState("");
  const [polygonCoords, setPolygonCoords] = useState([]);

  const validateCoordinates = (lat, lng) => {
    return (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
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

  const handleAddClick = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const area = parseFloat(surfaceArea || "100");

    if (latitude === "" || longitude === "" || surfaceArea === "") {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateCoordinates(lat, lng)) {
      setError("Invalid latitude or longitude values.");
      return;
    }

    const coord = `${lat}, ${lng}`;
    try {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${coord}&key=${OPENCAGE_API_KEY}`
      );
      const components = res.data.results[0]?.components;
      const city = components?.village || components?.town || components?.city || "Unknown";
      const state = components?.state || "";
      const country = components?.country || "";
      const fullLocation = [city, state, country].filter(Boolean).join(", ");
      setLocation(fullLocation);
    } catch (e) {
      setLocation("Unknown");
    }

    const polygon = calculatePolygon(lat, lng, area);
    setPolygonCoords(polygon);
    setShowModal(true);
    setError("");
  };

  const handleSave = async () => {
    try {
      await axios.post("https://landadministration-production.up.railway.app/land/add", {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        surfaceArea: surfaceArea ? parseFloat(surfaceArea) : 0,
        usage_type: usageType,
      });

      setSuccess("✅ Land added successfully.");
      setShowModal(false);
      setError("");

      // Reset form
      setLatitude("");
      setLongitude("");
      setSurfaceArea("");
      setUsageType("Residential");
    } catch (err) {
      const msg = err?.response?.data;
      if (typeof msg === "string") setError(msg);
      else if (msg?.error) setError(msg.error);
      else setError("An unknown error occurred.");
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🌍 Add New Land</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group mb-3">
        <label>🧭 Latitude (-90 to 90)</label>
        <input
          type="number"
          step="0.00001"
          min="-90"
          max="90"
          className="form-control"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label>🧭 Longitude (-180 to 180)</label>
        <input
          type="number"
          step="0.00001"
          min="-180"
          max="180"
          className="form-control"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label>📐 Surface Area </label>
        <input
          type="number"
          className="form-control"
          value={surfaceArea}
          onChange={(e) => setSurfaceArea(e.target.value)}
        />
      </div>

      <div className="form-group mb-4">
        <label>🏡 Usage Type</label>
        <select
          className="form-control"
          value={usageType}
          onChange={(e) => setUsageType(e.target.value)}
        >
          <option value="Residential">Residential</option>
          <option value="Farming">Farming</option>
          <option value="Agricultural">Agricultural</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <button className="btn btn-success" onClick={handleAddClick}>
        ➕ Add Land
      </button>

      {showModal && (
        <div className="modal d-block" style={{ background: "#00000099" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <h5 className="mb-3">📝 Confirm Land Details</h5>
              <ul className="list-group mb-3">
                <li className="list-group-item">Location: {location}</li>
                <li className="list-group-item">
                  🧭 Coordinates: {latitude},{longitude}
                </li>
                <li className="list-group-item">
                  📐 Surface Area: {surfaceArea || "100 (default)"}
                </li>
                <li className="list-group-item">🏡 Usage Type: {usageType}</li>
              </ul>

              <MapContainer
                center={[parseFloat(latitude), parseFloat(longitude)]}
                zoom={20}
                style={{ height: "400px", borderRadius: "8px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {polygonCoords.length > 0 && <Polygon positions={polygonCoords} pathOptions={{ color: "red" }} />}
              </MapContainer>

              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-success me-2" onClick={handleSave}>
                  ✅ Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLand;
