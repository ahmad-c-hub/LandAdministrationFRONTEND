import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.location.hash.substring(1);
  if (token) {
    localStorage.setItem("token", token);
    navigate("/dashboard");
  } else {
    console.error("Token not found in hash");
    navigate("/login");
  }
}, []);

  return null;
};

export default OAuth2Redirect;
