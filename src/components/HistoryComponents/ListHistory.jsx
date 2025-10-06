import React, { useEffect, useState } from 'react';
import { Table, Container, Button } from "react-bootstrap";
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListHistory = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState("ROLE_USER");
  const size = 7;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(dateString));
  };

  useEffect(() => {
    fetchHistory();
    fetchRole();
  }, [page]);

  const fetchHistory = () => {
    axios
      .get(`http://localhost:8080/ownership-history/recordss?page=${page}&size=${size}`)
      .then((response) => {
        setHistory(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching history:", error));
  };

  const fetchRole = () => {
    axios
      .get("http://localhost:8080/user/get-role")
      .then((res) => setRole(res.data))
      .catch((err) => console.error("Failed to get role:", err));
  };

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Ownership History</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Land ID</th>
            <th>Land Location</th>
            <th>Land Coordinates</th>
            <th>Owner Name</th>
            <th>Owner ID</th>
            {role === "ROLE_ADMIN" && <th>Country</th>}
            <th>Start Date</th>
            <th>End Date</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => (
            <tr key={`${record.land.id}_${record.landOwner.id}_${record.createdAt}`}>
              <td>{record.land.id}</td>
              <td>{record.land.location}</td>
              <td>
                <a
                  href={`https://www.google.com/maps?q=${record.land.locationCoordinates}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-success"
                >
                  {record.land.locationCoordinates}
                </a>
              </td>
              <td>
                <Link
                  to={`/display-land-owner?id=${record.landOwner.id}`}
                  className="text-decoration-none"
                >
                  👤 {record.landOwner.fullName}
                </Link>
              </td>
              <td>{record.landOwner.id}</td>
              {role === "ROLE_ADMIN" && (
                <td>{record.land.country || record.landOwner.country || "N/A"}</td>
              )}
              <td>{formatDate(record.ownershipStart)}</td>
              <td>{formatDate(record.ownershipEnd)}</td>
              <td>{formatDate(record.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-3 gap-3">
        <Button variant="secondary" disabled={page === 0} onClick={handlePrevious}>
          ⬅ Previous
        </Button>
        <span className="align-self-center">Page {page + 1} of {totalPages}</span>
        <Button variant="secondary" disabled={page === totalPages - 1} onClick={handleNext}>
          Next ➡
        </Button>
      </div>
    </Container>
  );
};

export default ListHistory;
