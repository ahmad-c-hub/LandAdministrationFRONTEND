import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Header.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [role, setRole] = useState("ROLE_USER");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");

  useEffect(() => {
    if (token) {
      // Fetch user role
      axios
        .get("http://localhost:8080/user/get-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setRole(res.data))
        .catch((err) => console.error("Failed to get role:", err));

      // Fetch current country
      axios
        .get("http://localhost:8080/user/get-country", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const country = res.data;
          setSelectedCountry(country === "" ? "All Countries" : country);
        })
        .catch((err) => {
          console.error("Failed to get country:", err);
          setSelectedCountry("All Countries");
        });
    }
  }, [token]);

  const handleLogoutClick = async () => {
    try {
      await fetch("http://localhost:8080/user/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCountryChange = async (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);

    const paramToSend = newCountry === "All Countries" ? "" : newCountry;

    try {
      await axios.put(
        `http://localhost:8080/user/set-country?country=${encodeURIComponent(paramToSend)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to set country:", error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-dark bg-dark px-3 flex-wrap flex-md-nowrap">
        <Link to="/" className="navbar-brand">
          Land Administration
        </Link>

        {token ? (
          <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0 align-items-center justify-content-end button-container">
            {role === "ROLE_ADMIN" && (
              <select
                className="form-select form-select-sm country-dropdown"
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <option>All Countries</option>
                <option>Lebanon</option>
                <option>Canada</option>
                <option>United Arab Emirates</option>
                <option>Saudi Arabia</option>
                <option>Syria</option>
              </select>
            )}
            <div className="d-flex w-100 w-md-auto justify-content-between gap-2 button-row">
              <Link to="/dashboard" className="btn btn-outline-light btn-sm flex-fill">
                📊 Dashboard
              </Link>
              <Link to="/profile" className="btn btn-outline-light btn-sm flex-fill">
                👤 Profile
              </Link>
              <button onClick={handleLogoutClick} className="btn btn-danger btn-sm flex-fill">
                Log out
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="btn btn-primary">
            Log in
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
