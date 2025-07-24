import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Pagination } from "react-bootstrap";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0); // Backend is 0-indexed
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = (pageNumber) => {
    axios
      .get(`http://landadministration.railway.internal/user/get-users?page=${pageNumber}&size=10`)
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

  const renderPagination = () => {
    const items = [];
    for (let number = 0; number < totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => handlePageChange(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0} />
        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
        {items}
        <Pagination.Next
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page === totalPages - 1}
        />
      </Pagination>
    );
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">List of Users</h2>

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
                <th>#</th>
                <th>Username</th>
                <th>Role</th>
                <th>Is Google User</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.username}>
                  <td>{page * 5 + index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.googleUser ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default ListUsers;
