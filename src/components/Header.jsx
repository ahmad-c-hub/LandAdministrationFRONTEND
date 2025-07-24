import React from "react";
import { useNavigate } from "react-router-dom";
import "../Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLoginClick = () => {
    navigate("/login");
  };

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

  return (
    <header>
      <nav className="navbar navbar-dark bg-dark px-3">
        <a className="navbar-brand" href="/">
          Land Administration
        </a>
        {token ? (
          <div className="d-flex gap-3 align-items-center">
            <Link to="/dashboard" className="btn btn-outline-light btn-sm">
          📊  Dashboard
        </Link>
            <Link to="/profile" className="btn btn-outline-light btn-sm">
          👤 Profile
        </Link>
          <button onClick={handleLogoutClick} className="btn btn-danger">
            Log out
          </button>
          </div>
          
          
        ) : (
          <button onClick={handleLoginClick} className="btn btn-primary">
            Log in
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
