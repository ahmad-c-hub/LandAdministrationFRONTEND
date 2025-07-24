import React, {useEffect, useState} from 'react';
import {Table, Container} from "react-bootstrap"
import axios from 'axios';

const ListHistory = () => {
    const [history, setHistory] = useState([]);
    useEffect(() => {
    axios
      .get(`http://localhost:8080/ownership-history/recordss`)
      .then((response) => {
        console.log(response.data);
        setHistory(response.data);
      })
      .catch((error) => console.error("Error fetching history:", error));
  }, []);
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
            <tr key={`${record.land.id}_${record.landOwner.id}`}>
              <td>{record.land.id}</td>
              <td>{record.land.location}</td>
              <td>{record.land.locationCoordinates}</td>
              <td>{record.landOwner.fullName}</td>
              <td>{record.landOwner.id}</td>
              <td>{record.ownershipStart}</td>
              <td>{record.ownershipEnd}</td>
              <td>{record.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default ListHistory