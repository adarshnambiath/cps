import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Mode.css";

const Mode = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/landing");
  };

  return (
    <div className="mode-wrapper">
      <video autoPlay muted loop id="video-background">
        <source src="/back.mp4" type="video/mp4" />
      </video>
      <button className="btn-logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="container">
        <Link to="/clicking-speed">
          <button className="btn-cps">Clicks Per Second</button>
        </Link>
        <Link to="/aim-practice">
          <button className="btn-aim">Aim Practice</button>
        </Link>
        <Link to="/reaction-time">
          <button className="btn-react">Reaction Time</button>
        </Link>
        <Link to="/output-menu">
          <button className="btn-prev-score">Data</button>
        </Link>
      </div>
    </div>
  );
};

export default Mode;