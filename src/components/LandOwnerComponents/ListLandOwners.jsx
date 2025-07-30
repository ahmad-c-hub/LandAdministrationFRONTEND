import React, { useEffect, useState } from "react";
import { Table, Container, Pagination } from "react-bootstrap";
import axios from "axios";

const ListLandOwners = () => {
  const [landOwners, setLandOwners] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState("ROLE_USER");

  useEffect(() =>{
    axios
        .get("https://landadministration-production.up.railway.app/user/get-role")
        .then((res) => setRole(res.data))
        .catch((err) => console.error("Failed to get role:", err));
  });

  useEffect(() => {
    axios
      .get(`https://landadministration-production.up.railway.app/land-owner/owners?page=${page}&size=10`)
      .then((response) => {
        setLandOwners(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching landowners:", error));
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Land Owners</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>Number of Lands</th>
            <th>Age</th>
            {role==='ROLE_ADMIN'? <th>Country</th> :null}
          </tr>
        </thead>
        <tbody>
          {landOwners.map((owner) => (
            <tr key={owner.id}>
              <td>{owner.id}</td>
              <td>{owner.fullName}</td>
              <td>{owner.phoneNumber}</td>
              <td>{owner.emailAddress}</td>
              <td>{owner.numberOfLands}</td>
              <td>{owner.age}</td>
              {role==='ROLE_ADMIN'? <td>{owner.country}</td> :null}
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item key={idx} active={idx === page} onClick={() => handlePageChange(idx)}>
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages} />
      </Pagination>
    </Container>
  );
};

export default ListLandOwners;
