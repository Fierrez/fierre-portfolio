// filepath: /C:/Users/M Nabil Dzikrika R/Documents/Portfolio/Portfolio-1/portfolio-deploy-2/src/components/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/?logout=true";
  }, [navigate]);

  return null;
};

export default Logout;
