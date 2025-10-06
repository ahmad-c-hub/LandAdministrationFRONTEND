import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Form } from 'react-bootstrap';
import axios from 'axios';

const HistoryByOwnerId = () => {
  const [ownerId, setOwnerId] = useState('');
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(dateString));
  };

  const fetchHistory = () => {
    if (!ownerId) {
      setErrorMsg("Please enter a valid Owner ID.");
      return;
    }

    axios.get(`http://localhost:8080/ownership-history/owner?page=${page}&size=${size}&id=${ownerId}`)
      .then(response => {
        setHistory(response.data.content);
        setTotalPages(response.data.totalPages);
        setErrorMsg('');
      })
      .catch(error => {
        console.error(error);
        const msg = error?.response?.data;
        if (typeof msg === "string") setErrorMsg(msg);
        else if (msg?.error) setErrorMsg(msg.error);
        else setErrorMsg("An unknown error occurred.");
        setHistory([]);
        setTotalPages(0);
      });
  };

  const handlePrevious = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (ownerId) {
      fetchHistory();
    }
  }, [page]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">👤 History by Owner ID</h2>

      <Form className="mb-3 d-flex gap-2">
        <Form.Control
          type="number"
          placeholder="Enter Owner ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
        />
        <Button onClick={() => { setPage(0); fetchHistory(); }}>
          Search
        </Button>
      </Form>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      {history.length > 0 && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Land ID</th>
                <th>Location</th>
                <th>Coordinates</th>
                <th>Owner Name</th>
                <th>Owner ID</th>
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
                  <td>{record.landOwner.fullName}</td>
                  <td>{record.landOwner.id}</td>
                  <td>{formatDate(record.ownershipStart)}</td>
                  <td>{formatDate(record.ownershipEnd)}</td>
                  <td>{formatDate(record.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="secondary" disabled={page === 0} onClick={handlePrevious}>
              ⬅ Previous
            </Button>
            <span className="align-self-center">Page {page + 1} of {totalPages}</span>
            <Button variant="secondary" disabled={page === totalPages - 1} onClick={handleNext}>
              Next ➡
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default HistoryByOwnerId;
