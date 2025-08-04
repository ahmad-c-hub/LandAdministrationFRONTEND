import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

const SetUserRole = () => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("ROLE_USER");
  const [currRole, setCurrRole] = useState(""); // current user's role
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");

  // Fetch current user's role on mount
  useEffect(() => {
    axios
      .get("https://landadministration-production.up.railway.app/user/get-role", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setCurrRole(res.data))
      .catch(() => setError("Unable to retrieve current user role."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (currRole === "ROLE_COUNTRY_ADMIN" && !reason.trim()) {
      setError("Please provide a reason to request role change.");
      return;
    }

    try {
      const res = await axios.put(
        `https://landadministration-production.up.railway.app/user/set-role/${userId}/${role}${
          currRole === "ROLE_COUNTRY_ADMIN" ? `?reason=${encodeURIComponent(reason)}` : ""
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(res.data);
    } catch (err) {
      const msg =
        err?.response?.data ||
        "Failed to update role. Check user ID, role, or permission.";
      setError(typeof msg === "string" ? msg : "Unexpected error occurred.");
    }
  };

  return (
    <Container className="mt-4">
      <h3>👤 Set User Role</h3>

      {currRole !== "ROLE_ADMIN" && currRole !== "ROLE_COUNTRY_ADMIN" ? (
        <Alert variant="danger">
          ❌ You are not authorized to access this page.
        </Alert>
      ) : (
        <>
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
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="ROLE_USER">ROLE_USER</option>
                    <option value="ROLE_COUNTRY_ADMIN">ROLE_COUNTRY_ADMIN</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4} className="d-flex align-items-end">
                <Button type="submit" variant="primary" className="w-100">
                  ✅ {currRole === "ROLE_ADMIN" ? "Update Role" : "Request Change"}
                </Button>
              </Col>
            </Row>

            {/* Reason shown only for COUNTRY_ADMIN */}
            {currRole === "ROLE_COUNTRY_ADMIN" && (
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="reason">
                    <Form.Label>Reason for Role Change Request</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter your justification..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>

          {message && <Alert variant="success" className="mt-3">{message}</Alert>}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </>
      )}
    </Container>
  );
};

export default SetUserRole;
