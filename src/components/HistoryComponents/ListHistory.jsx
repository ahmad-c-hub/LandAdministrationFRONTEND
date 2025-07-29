import React, { useEffect, useState } from 'react';
import { Table, Container, Button } from "react-bootstrap";
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListHistory = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 7;

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = () => {
    axios
      .get(`https://landadministration-production.up.railway.app/ownership-history/recordss?page=${page}&size=${size}`)
      .then((response) => {
        console.log(response.data);
        setHistory(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching history:", error));
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
            <th>Ownership Start Date</th>
            <th>Ownership End Date</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => (
            <tr key={`${record.land.id}_${record.landOwner.id}_${record.createdAt}`}>
              <td>{record.land.id}</td>
              <td>{record.land.location}</td>
              <td>{record.land.locationCoordinates}</td>
              <td>
                <Link
                      to={`/display-land-owner?id=${record.landOwner.id}`}
                      className="text-decoration-none"
                    >
                      👤 {record.landOwner.fullName}
                    </Link>
              </td>
              <td>{record.landOwner.id}</td>
              <td>{record.ownershipStart}</td>
              <td>{record.ownershipEnd || "N/A"}</td>
              <td>{record.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Buttons */}
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
