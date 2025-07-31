import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HistoryByLandId = () => {
  const [landId, setLandId] = useState('');
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 7;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(dateString));
  };

  const fetchHistory = () => {
    if (!landId) {
      setErrorMsg("Please enter a valid Land ID.");
      return;
    }

    axios.get(`https://landadministration-production.up.railway.app/ownership-history/land?page=${page}&size=${size}&id=${landId}`)
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
    if (landId) {
      fetchHistory();
    }
  }, [page]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🏞️ History by Land ID</h2>

      <Form className="mb-3 d-flex gap-2">
        <Form.Control
          type="number"
          placeholder="Enter Land ID"
          value={landId}
          onChange={(e) => setLandId(e.target.value)}
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
                  <td>{record.land.locationCoordinates}</td>
                  <td>
                    <Link to={`/display-land-owner?id=${record.landOwner.id}`} className="text-decoration-none">
                      👤 {record.landOwner.fullName}
                    </Link>
                  </td>
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

export default HistoryByLandId;
