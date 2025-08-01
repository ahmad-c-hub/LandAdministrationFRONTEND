import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Button } from "react-bootstrap";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = (pageNumber) => {
    axios
      .get(`https://landadministration-production.up.railway.app/user/get-users?page=${pageNumber}&size=10`)
      .then((response) => {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setErrorMsg("");
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(
            `${error.response.status} ${error.response.statusText} : ${
              error.response.data.message || "Unauthorized or Forbidden"
            }`
          );
        } else if (error.request) {
          setErrorMsg("No response from server.");
        } else {
          setErrorMsg("Request error: " + error.message);
        }
        setUsers([]);
        setTotalPages(0);
      });
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4 text-center">👥 List of Users</h2>

      {errorMsg && (
        <Alert variant="danger" className="text-center fw-bold">
          {errorMsg}
        </Alert>
      )}

      {users.length > 0 && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Is Google User</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.googleUser ? "Yes" : "No"}</td>
                  <td>{user.country || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Simplified Prev/Next Pagination UI */}
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <Button
              variant="outline-primary"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              ◀ Prev
            </Button>

            <span>
              Page {page + 1} of {totalPages}
            </span>

            <Button
              variant="outline-primary"
              onClick={() => handlePageChange(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              Next ▶
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default ListUsers;
