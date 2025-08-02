import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const ManageLands = () => {
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
      <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
        🌍 Manage Lands
      </h2>

      {/* Card 1: Search for Lands */}
      <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: "#d3f8e2" }}>
        <p>Search for lands by filters such as location, type, or owner.</p>
        <button className="btn btn-primary" onClick={() => navigate("/lands/search")}>
          🔍 Search Lands
        </button>
      </div>

      {/* Card 2: View by Surface Area */}
      <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: "#fff3cd" }}>
        <p>View lands that fall between a minimum and maximum surface area.</p>
        <button className="btn btn-warning" onClick={() => navigate("/lands/by-surface-area")}>
          📏 View by Surface Area
        </button>
      </div>

      {/* Card 3: View All / View by ID */}
      <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: "#d1f7ff" }}>
        <p>See all land records or look up a specific land by ID.</p>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-success" onClick={() => navigate("/lands")}>
            🌐 View All Lands
          </button>
          <button className="btn btn-success" onClick={() => navigate("/lands/by-id")}>
            🆔 View Land by ID
          </button>
        </div>
      </div>

      {role!=='ROLE_USER'?
      <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: "#d1f7ff" }}>
        <p>Add a land record by entering info about the land you wish to add.</p>
        <button className="btn btn-success" onClick={() => navigate("/lands/add-land")}>
           ➕ Add Land
          </button>
      </div>
      :null}

    </div>
  );
};

export default ManageLands;
