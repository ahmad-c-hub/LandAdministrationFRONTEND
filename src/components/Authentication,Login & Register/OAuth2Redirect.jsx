import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [country, setCountry] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    // Call backend to get user info
    axios
      .get("http://landadministration-production.up.railway.app/user/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        if (user.country===null) {
          // If country is missing, prompt user to select
          setShowModal(true);
        } else {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Failed to get current user", err);
        navigate("/login");
      });
  }, []);

  const handleConfirm = async () => {
    try {
      await axios.put(
        "http://landadministration-production.up.railway.app/user/set-country",
        {},
        {
          params: { country },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShowModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to set country:", error);
      alert("Could not save country. Please try again.");
    }
  };

  return (
    <>
      <p>Redirecting...</p>
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Select Your Country</h3>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={modalStyles.select}
            >
              <option value="">--Select--</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Syria">Syria</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Canada">Canada</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
            </select>
            <button onClick={handleConfirm} disabled={!country} style={modalStyles.button}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  select: {
    padding: "0.5rem",
    marginBottom: "1rem",
    width: "100%",
  },
  button: {
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
};

export default OAuth2RedirectHandler;
