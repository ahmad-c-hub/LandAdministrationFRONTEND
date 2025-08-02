import React,{useState} from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ManageOwners = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("ROLE_USER");
  useEffect(() =>{
        axios
        .get(`https://landadministration-production.up.railway.app/user/get-role`)
        .then((response) => {
          setRole(response.data);
          setErrorMsg("");
        })
      })
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🧑‍🌾 Manage Land Owners</h2>

      {/* View All Owners */}
      <div className="p-4 rounded mb-4" style={{ backgroundColor: "#D1FAE5" }}>
        <p>Browse through the full list of land owners registered in the system.</p>
        <Button variant="success" onClick={() => navigate("/owners")}>
          👥 View All Owners
        </Button>
      </div>

      {/* View Owner by ID */}
      <div className="p-4 rounded mb-4" style={{ backgroundColor: "#E0F2FE" }}>
        <p>Look up specific land owner details using their unique ID.</p>
        <Button variant="primary" onClick={() => navigate("/owners/owner-by-id")}>
          🔍 View Owner by ID
        </Button>
      </div>

      {/* Get Lands by Owner ID */}
      <div className="p-4 rounded mb-4" style={{ backgroundColor: "#FEF9C3" }}>
        <p>Retrieve all lands that belong to a particular owner by entering their ID.</p>
        <Button variant="warning" className="text-white" onClick={() => navigate("/owners/lands-by-owner-id")}>
          🌐 View Lands by Owner ID
        </Button>
      </div>

      {role!=="ROLE_USER"?<div className="p-4 rounded mb-4" style={{ backgroundColor: "#FEF9C3" }}>
        <p>Add an owner by entering their personal data</p>
        <Button variant="warning" className="text-white" onClick={() => navigate("/owners/add")}>
          🧑 Add Land Owner
        </Button>
      </div>:null}
    </div>
  );
};

export default ManageOwners;
