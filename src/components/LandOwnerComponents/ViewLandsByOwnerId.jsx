import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  Button,
  Form,
  Pagination,
  Spinner,
  Alert,
  Card
} from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ViewLandsByOwnerId = () => {
  const [ownerId, setOwnerId] = useState('');
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [lands, setLands] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const landsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [polygonCoords, setPolygonCoords] = useState([]);

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

  const handlePreview = (land) => {
    try {
      const [lat, lng] = land.locationCoordinates.split(',').map(coord => parseFloat(coord.trim()));
      const polygon = calculatePolygon(lat, lng, land.surfaceArea);
      setSelectedLand({ ...land, lat, lng });
      setPolygonCoords(polygon);
      setShowModal(true);
    } catch {
      alert('Invalid coordinates format.');
    }
  };

  const fetchLands = async () => {
    if (!ownerId.trim()) {
      setErrorMsg('Please enter a valid owner ID.');
      setLands([]);
      setOwnerInfo(null);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch lands
      const landsRes = await axios.get(`https://landadministration-production.up.railway.app/land-owner/lands/${ownerId}`);
      const fetchedLands = Array.isArray(landsRes.data?.content) ? landsRes.data.content : [];

      setLands(fetchedLands);
      setCurrentPage(1);

      if (fetchedLands.length === 0) {
        setErrorMsg('No lands found for this owner.');
        setOwnerInfo(null);
      } else {
        // Fetch owner details
        const ownerRes = await axios.get(`https://landadministration-production.up.railway.app/land-owner/${ownerId}`);
        setOwnerInfo(ownerRes.data);
      }

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'No lands found or server error.';
      setErrorMsg(`❌ ${msg}`);
      setLands([]);
      setOwnerInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLast = currentPage * landsPerPage;
  const indexOfFirst = indexOfLast - landsPerPage;
  const currentLands = lands.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil((lands.length || 0) / landsPerPage);

  return (
    <Container className="mt-5" style={{ background: '#e6f0ff', padding: '25px', borderRadius: '12px' }}>
      <h2 className="mb-4">🏘️ Lands by Owner ID</h2>

      <Form className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Enter Owner ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          className="me-2"
        />
        <Button onClick={fetchLands} variant="dark">Get Lands</Button>
      </Form>

      {loading && <Spinner animation="border" variant="primary" className="mb-3" />}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      {ownerInfo && (
        <Card className="mb-4 shadow">
          <Card.Body>
            <Card.Title>👤 Owner Details</Card.Title>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>ID:</strong> {ownerInfo.id}</li>
              <li className="list-group-item"><strong>Name:</strong> {ownerInfo.firstName} {ownerInfo.lastName}</li>
              <li className="list-group-item"><strong>Email:</strong> {ownerInfo.email}</li>
              <li className="list-group-item"><strong>Phone:</strong> {ownerInfo.phoneNb}</li>
              <li className="list-group-item"><strong>Date of Birth:</strong> {ownerInfo.dateOfBirth}</li>
            </ul>
          </Card.Body>
        </Card>
      )}

      {lands.length > 0 && (
        <>
          <Table bordered hover responsive className="text-center" style={{ background: 'white' }}>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Coordinates</th>
                <th>Surface Area</th>
                <th>Usage Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLands.map((land) => (
                <tr key={land.id}>
                  <td>{land.id}</td>
                  <td>{land.location}</td>
                  <td>{land.locationCoordinates}</td>
                  <td>{land.surfaceArea}</td>
                  <td>{land.usageType}</td>
                  <td>
                    <div className="d-flex flex-column gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handlePreview(land)}
                      >
                        📍 Preview
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => {
                          const [lat, lng] = land.locationCoordinates.split(',').map(coord => coord.trim());
                          window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                        }}
                      >
                        🌐 Google Maps
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅️ Previous
            </Pagination.Prev>
            <Pagination.Item disabled>Page {currentPage} of {totalPages}</Pagination.Item>
            <Pagination.Next
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡️
            </Pagination.Next>
          </Pagination>
        </>
      )}

      {showModal && selectedLand && (
        <div className="modal d-block" style={{ background: "#00000099" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <h5 className="mb-3">📍 Land Polygon Preview</h5>
              <ul className="list-group mb-3">
                <li className="list-group-item">Coordinates: {selectedLand.locationCoordinates}</li>
                <li className="list-group-item">Surface Area: {selectedLand.surfaceArea} m²</li>
              </ul>

              <MapContainer
                center={[selectedLand.lat, selectedLand.lng]}
                zoom={20}
                style={{ height: "400px", borderRadius: "8px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon positions={polygonCoords} pathOptions={{ color: "blue" }} />
              </MapContainer>

              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" onClick={() => setShowModal(false)}>❌ Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ViewLandsByOwnerId;
