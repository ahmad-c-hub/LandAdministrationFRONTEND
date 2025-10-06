import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Form, Table, Modal, Alert } from 'react-bootstrap';

const ViewOwnerById = () => {
  const [ownerId, setOwnerId] = useState('');
  const [landOwner, setLandOwner] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({ phoneNb: '', emailAddress: '' });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [role, setRole] = useState("ROLE_USER");

  useEffect(() =>{
        axios
        .get(`http://localhost:8080/user/get-role`)
        .then((response) => {
          setRole(response.data);
        })
      })

  const fetchOwner = async () => {
    if (!ownerId || isNaN(ownerId)) {
      setErrorMsg('Please enter a valid Owner ID.');
      setLandOwner(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/land-owner/${ownerId}`);
      setLandOwner(response.data);
      setErrorMsg('');
      setSuccessMsg('');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Owner not found or server error.');
      setLandOwner(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSubmit = async () => {
    if (!editData.phoneNb && !editData.emailAddress) {
      setEditError('Please provide at least one field to update.');
      return;
    }

    const updatedOwner = {
      ...landOwner,
      phoneNb: editData.phoneNb || landOwner.phoneNb,
      emailAddress: editData.emailAddress || landOwner.emailAddress,
    };

    try {
      await axios.put(
        `http://localhost:8080/land-owner/update-owner?id=${landOwner.id}`,
        updatedOwner
      );
      setEditSuccess('✅ Owner updated successfully.');
      setEditError('');
      setShowEditModal(false);
      fetchOwner(); // Refresh data
      setEditData({ phoneNb: '', emailAddress: '' });
    } catch (error) {
      setEditError(error.response?.data?.message || '❌ Failed to update owner.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/land-owner/delete-owner?id=${landOwner.id}`
      );
      setSuccessMsg(`✅ Owner with ID ${landOwner.id} deleted successfully.`);
      setErrorMsg('');
      setShowDeleteModal(false);
      setLandOwner(null);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || '❌ Failed to delete owner.');
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{ background: '#dceeff', minHeight: '100vh' }}>
      <Container className="text-center pt-5">
        <h2 className="mb-4">👤 View Owner by ID</h2>

        <Form className="d-flex justify-content-center mb-4">
          <Form.Control
            type="number"
            placeholder="Enter Owner ID"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="me-2 w-25"
          />
          <Button onClick={fetchOwner} variant="primary">Find Owner</Button>
        </Form>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        {editSuccess && <Alert variant="success">{editSuccess}</Alert>}

        {landOwner && (
          <>
            <Table bordered hover className="mx-auto w-75 bg-white shadow-sm">
              <tbody>
                <tr>
                  <th className="table-dark">👤 Name</th>
                  <td>{landOwner.fullName}</td>
                </tr>
                <tr>
                  <th className="table-dark">🆔 ID</th>
                  <td>{landOwner.id}</td>
                </tr>
                <tr>
                  <th className="table-dark">📞 Phone</th>
                  <td>{landOwner.phoneNumber}</td>
                </tr>
                <tr>
                  <th className="table-dark">📧 Email</th>
                  <td>{landOwner.emailAddress}</td>
                </tr>
                <tr>
                  <th className="table-dark">📌 Number of Lands</th>
                  <td>{landOwner.numberOfLands}</td>
                </tr>
                <tr>
                  <th className="table-dark">🎂 Age</th>
                  <td>{landOwner.age}</td>
                </tr>
              </tbody>
            </Table>

            {role!=="ROLE_USER"?<div className="d-flex justify-content-center gap-3 mt-3">
              <Button variant="warning" onClick={() => setShowEditModal(true)}>✏️ Edit Owner</Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>🗑️ Delete Owner</Button>
            </div>:null}
          </>
        )}
      </Container>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => {
        setShowEditModal(false);
        setEditError('');
        setEditData({ phoneNb: '', emailAddress: '' });
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger">{editError}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>📞 Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNb"
              placeholder="Enter new phone number"
              value={editData.phoneNb}
              onChange={handleEditChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>📧 Email Address</Form.Label>
            <Form.Control
              type="email"
              name="emailAddress"
              placeholder="Enter new email address"
              value={editData.emailAddress}
              onChange={handleEditChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are You Sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this owner?</p>
          <p><strong>ID:</strong> {landOwner?.id}</p>
          <p><strong>Name:</strong> {landOwner?.fullName}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ViewOwnerById;
