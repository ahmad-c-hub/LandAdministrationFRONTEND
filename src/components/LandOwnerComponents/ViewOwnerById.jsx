import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Form, Table } from 'react-bootstrap';

const ViewOwnerById = () => {
  const [ownerId, setOwnerId] = useState('');
  const [landOwner, setLandOwner] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOwner = async () => {
    if (!ownerId.trim()) {
      setErrorMsg('Please enter a valid Owner ID.');
      setLandOwner(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/land-owner/${ownerId}`);
      setLandOwner(response.data);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg('Owner not found or server error.');
      setLandOwner(null);
    }
  };

  return (
    <div style={{ background: '#dceeff', minHeight: '100vh' }}>
      <Container className="text-center pt-5">
        <h2 className="mb-4">👤 View Owner by ID</h2>

        <Form className="d-flex justify-content-center mb-4">
          <Form.Control
            type="text"
            placeholder="Enter Owner ID"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="me-2 w-25"
          />
          <Button onClick={fetchOwner} variant="primary">Find Owner</Button>
        </Form>

        {errorMsg && <p className="text-danger fw-bold">{errorMsg}</p>}

        {landOwner && (
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
        )}
      </Container>

      <footer className="text-center text-white py-2" style={{ backgroundColor: 'black', marginTop: '60px' }}>
        All rights reserved 2025
      </footer>
    </div>
  );
};

export default ViewOwnerById;
