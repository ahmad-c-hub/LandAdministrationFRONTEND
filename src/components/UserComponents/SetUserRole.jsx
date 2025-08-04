import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

const SetUserRole = () => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("ROLE_USER");
  const [currRole, setCurrRole] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.put(`https://landadministration-production.up.railway.app/user/set-role/${userId}/${role}`);
      setMessage(res.data);
    } catch (err) {
      setError("Failed to update role. Please make sure the user ID and role are valid.");
    }
  };
  useEffect(() =>{
        axios
        .get(`https://landadministration-production.up.railway.app/user/get-role`)
        .then((response) => {
          setCurrRole(response.data);
          setError("");
        })
      })

  return (
    <Container className="mt-4">
      <h3>Set User Role</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="userId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ROLE_USER">ROLE_USER</option>
                {currRole==='ROLE_ADMIN'?<option value="ROLE_ADMIN">ROLE_ADMIN</option>:null}
                <option value="ROLE_COUNTRY_ADMIN">ROLE_COUNTRY_ADMIN</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button type="submit" variant="primary">Update Role</Button>
          </Col>
        </Row>
      </Form>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </Container>
  );
};

export default SetUserRole;
