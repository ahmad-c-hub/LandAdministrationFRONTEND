import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GitHubPagesFix = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    if (redirect) {
      const decoded = decodeURIComponent(redirect);
      navigate(decoded, { replace: true });
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default GitHubPagesFix;
