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
      axios
        .get("https://landadministration-production.up.railway.app/user/get-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRole(response.data);
        })
        .catch((error) => {
          console.error("Failed to get role:", error);
        });
    }
  }, [token]);

  const handleLogoutClick = async () => {
    try {
      await fetch("https://landadministration-production.up.railway.app/user/logout", {
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

    try {
      await axios.put(
        `https://landadministration-production.up.railway.app/user/set-country?country=${encodeURIComponent(newCountry)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to set country:", error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link to="/" className="navbar-brand">
          Land Administration
        </Link>

        {token ? (
          <div className="d-flex gap-3 align-items-center">
            {role === "ROLE_ADMIN" && (
              <select
                className="form-select form-select-sm me-2"
                style={{ width: "180px" }}
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

            <Link to="/dashboard" className="btn btn-outline-light btn-sm">
              📊 Dashboard
            </Link>
            <Link to="/profile" className="btn btn-outline-light btn-sm">
              👤 Profile
            </Link>
            <button onClick={handleLogoutClick} className="btn btn-danger">
              Log out
            </button>
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
