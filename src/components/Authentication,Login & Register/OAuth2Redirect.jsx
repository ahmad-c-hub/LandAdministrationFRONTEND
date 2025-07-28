import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const token = hash.startsWith("#") ? hash.substring(1) : null;

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); // or to dashboard or profile
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default OAuth2Redirect;
