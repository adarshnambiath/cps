// frontend/src/components/Outmode.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Mode.css";
import MenuButton from "./menuButton";

const Outmode = () => {
  return (
    <div className="mode-wrapper">
      <video autoPlay muted loop id="video-background">
        <source src="/back.mp4" type="video/mp4" />
      </video>
      <MenuButton />
      <div className="container2">
        <Link to="/previous-scores">
          <button className="btn-prev-score">Leaderboards</button>
        </Link>
        <Link to="/graph">
          <button className="btn-prev-score">Graph</button>
        </Link>
      </div>
    </div>
  );
};

export default Outmode;