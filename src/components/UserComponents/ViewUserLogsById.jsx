import React, { useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Table, Pagination, Alert } from "react-bootstrap";

const ViewUserLogsById = () => {
  const [userId, setUserId] = useState("");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLogs = async (pageNum = 0) => {
    try {
      const response = await axios.get(`https://landadministration-production.up.railway.app/user-log/records/${userId}?page=${pageNum}&size=10`);
      setLogs(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(pageNum);
      setError("");
    } catch (err) {
        const status = err.response?.status;
        if (status === 400 || status === 404) {
        setError("User ID does not exist.");
        } else {
        setError("⚠️ Failed to fetch logs. Please try again.");
        }
        setLogs([]);
        setTotalPages(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim() !== "") {
      fetchLogs();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchLogs(newPage)
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow p-4" style={{ backgroundColor: "#f5f5f5" }}>
        <Card.Title className="text-center mb-4">🔍 View Logs by User ID</Card.Title>
        <Form onSubmit={handleSubmit} className="d-flex justify-content-center mb-4">
          <Form.Control
            type="number"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ maxWidth: "200px", marginRight: "10px" }}
          />
          <Button type="submit" variant="info">Fetch Logs</Button>
        </Form>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        {logs.length > 0 && (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.username}</td>
                    <td>{log.role}</td>
                    <td>{log.action}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td><code>{log.description}</code></td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination className="justify-content-center">
                  <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
                  {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item key={i} active={i === page} onClick={() => fetchLogs(i)}>
                      {i + 1}
                      </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
            </Pagination>
          </>
        )}
      </Card>
    </Container>
  );
};

export default ViewUserLogsById;
