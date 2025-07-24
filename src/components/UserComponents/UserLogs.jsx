import React, { useEffect, useState } from 'react';
import { Table, Container, Pagination, Spinner, Alert } from "react-bootstrap";
import axios from 'axios';

const UserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://landadministration-production.up.railway.app/user-log/records?page=${page}&size=${size}`);
      setLogs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError("Failed to fetch user logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Container className="mt-4">
      <h3>User Logs</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Role</th>
                <th>Action</th>
                <th>Timestamp</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{page * size + index + 1}</td>
                    <td>{log.username}</td>
                    <td>{log.role}</td>
                    <td>{log.action}</td>
                    <td>{log.timestamp}</td>
                    <td><code>{log.description}</code></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No logs found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
            {[...Array(totalPages).keys()].map((p) => (
              <Pagination.Item key={p} active={p === page} onClick={() => handlePageChange(p)}>
                {p + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default UserLogs;
