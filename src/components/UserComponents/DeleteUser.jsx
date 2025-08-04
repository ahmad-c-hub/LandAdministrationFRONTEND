import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Modal, Card } from "react-bootstrap";

const DeleteUser = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = async () => {
    try {
        const res = await axios.get(`https://landadministration-production.up.railway.app/user/get-user/${userId}`);
        setUser(res.data);
        setErrorMsg("");
        setShowModal(true);
    } catch (err) {
      setUser(null);
      setErrorMsg("User not found with that ID.");
      setShowModal(false);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`https://landadministration-production.up.railway.app/user/delete/${userId}`);
      setDeleted(true);
      setShowModal(false);
      setUser(null);
    } catch (err) {
      setErrorMsg("Failed to delete user.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Delete User</h2>

      <Card className="p-4 shadow">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Enter User ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Form.Group>
          <Button variant="danger" onClick={fetchUser}>Find User</Button>
        </Form>
      </Card>

      {errorMsg && <Alert variant="danger" className="mt-3">{errorMsg}</Alert>}
      {deleted && <Alert variant="success" className="mt-3">User deleted successfully.</Alert>}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Google User:</strong> {user?.googleUser ? "Yes" : "No"}</p>
          <Alert variant="warning">Are you sure you want to delete this user?</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteUser}>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteUser;
