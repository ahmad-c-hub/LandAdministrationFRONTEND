import React, { useEffect, useState } from 'react';
import { Table, Container, Pagination, Spinner, Alert } from "react-bootstrap";
import axios from 'axios';

const UserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`https://landadministration-production.up.railway.app/user-log/records?page=${page}&size=${size}`);
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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <Container className="mt-4">
      <h3 className="text-center mb-4">User Logs</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
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
                <th>Country</th>
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
                    <td>{formatTimestamp(log.timestamp)}</td>
                    <td><code>{log.description}</code></td>
                    <td>log.country</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No logs found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              ⬅ Prev
            </button>

            <span>Page {page + 1} of {totalPages}</span>

            <button
              className="btn btn-outline-secondary"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </Container>
  );
};

export default UserLogs;
