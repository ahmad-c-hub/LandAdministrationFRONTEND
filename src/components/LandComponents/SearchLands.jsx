import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchLands = () => {
  const [location, setLocation] = useState("");
  const [usageType, setUsageType] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [sortedBy, setSortedBy] = useState("id");

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLands = async () => {
    try {
      const response = await axios.get("http://landadministration.railway.internal/land/search", {
        params: {
          location: location || undefined,
          usageType: usageType || undefined,
          ownerName: ownerName || undefined,
          sortedBy,
          page,
          size: 10,
        },
      });
      setResults(response.data.content);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong while fetching lands.");
      setResults([]);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchLands();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🔍 Search Lands</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Usage Type"
            value={usageType}
            onChange={(e) => setUsageType(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={sortedBy}
            onChange={(e) => setSortedBy(e.target.value)}
          >
            <option value="id">Sort by ID</option>
            <option value="location">Sort by Location</option>
            <option value="surfaceAreaAsc">Surface Area ↑</option>
            <option value="surfaceAreaDesc">Surface Area ↓</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Results */}
      {results.length > 0 && (
        <>
          <div className="table-responsive mt-4">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Coordinates</th>
                  <th>Surface Area</th>
                  <th>Usage Type</th>
                  <th>Owner Name</th>
                </tr>
              </thead>
              <tbody>
                {results.map((land) => (
                  <tr key={land.id}>
                    <td>{land.id}</td>
                    <td>{land.location}</td>
                    <td>{land.locationCoordinates}</td>
                    <td>{land.surfaceArea}</td>
                    <td>{land.usageType}</td>
                    <td>{land.currentOwner!==null ? land.currentOwner.fullName : "N/A" }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 0}
            >
              ◀ Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page + 1 >= totalPages}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchLands;
