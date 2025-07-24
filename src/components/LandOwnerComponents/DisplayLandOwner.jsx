import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';

const DisplayLandOwner = () => {
  const [landOwner, setLandOwner] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const REST_API_BASE_URL = `http://localhost:8080/land-owner/${id}`;

  useEffect(() => {
    axios.get(REST_API_BASE_URL)
      .then((response) => {
        setLandOwner(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🧑‍🌾 Land Owner Details</h2>
      
      <div className="card mx-auto shadow-lg" style={{ maxWidth: '500px', border: '2px solid #333' }}>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>👤 Name:</strong> {landOwner.fullName}</li>
            <li className="list-group-item"><strong>🆔 ID:</strong> {landOwner.id}</li>
            <li className="list-group-item"><strong>📞 Phone:</strong> {landOwner.phoneNumber}</li>
            <li className="list-group-item"><strong>📧 Email:</strong> {landOwner.emailAddress}</li>
            <li className="list-group-item"><strong>📌 Number of Lands:</strong> {landOwner.numberOfLands}</li>
            <li className="list-group-item"><strong>🎂 Age:</strong> {landOwner.age}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisplayLandOwner;
