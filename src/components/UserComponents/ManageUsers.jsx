import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 fw-bold">🔐 Manage Users</h2>

      <Card className="mb-4 p-3 shadow" style={{ backgroundColor: '#e0f7fa' }}>
        <Card.Body>
          <Card.Text className="mb-3">
            Assign or change the role of any user (e.g., make someone an admin).
          </Card.Text>
          <Button
            variant="primary"
            onClick={() => navigate('/set-role')}
          >
            🔧 Set User Role
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4 p-3 shadow" style={{ backgroundColor: '#fff3e0' }}>
        <Card.Body>
          <Card.Text className="mb-3">
            View a detailed log of all user actions (e.g., logins, updates).
          </Card.Text>
          <Button
            variant="warning"
            onClick={() => navigate('/user-logs')}
          >
            📜 View User Logs
          </Button>
          <Button  style={{marginLeft:"20px"}} variant="warning" onClick={() => navigate("/view-logs-by-id")}>
  🔍 View Logs by User ID
</Button>

        </Card.Body>
      </Card>

      <Card className="mb-4 p-3 shadow" style={{ backgroundColor: '#e8f5e9' }}>
        <Card.Body>
          <Card.Text className="mb-3">
            Get a list of all registered users and their information.
          </Card.Text>
          <Button
            variant="success"
            onClick={() => navigate('/all-users')}
          >
            👥 View All Users
          </Button>

          <Button
            style={{marginLeft:"20px"}}
            variant="success"
            onClick={() => navigate('/get-user')}
          >
            👥 View User By Id
          </Button>
           
        </Card.Body>
      </Card>

      <Card className="mb-4 p-3 shadow">
        <Card.Body>
            <Card.Text>Remove a user permanently by entering their ID.</Card.Text>
            <Button variant="danger" onClick={() => navigate("/delete-user")}>🗑️ Delete User</Button>
        </Card.Body>
    </Card>

    </Container>
  );
};

export default ManageUsers;
