import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || token.split(".").length !== 3) {
    return <Navigate to="/login" replace />;
  }

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    console.error("JWT Decode Error:", e.message);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
