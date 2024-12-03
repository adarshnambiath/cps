import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Reaction.css";
import MenuButton from "./menuButton";

const Reaction = ({ userId }) => {
  const [isGameActive, setIsGameActive] = useState(false);
  const [color, setColor] = useState("#6a85dc"); 
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let timer;
    if (isGameActive) {
      timer = setTimeout(() => {
        setColor("#f07171");
        setStartTime(Date.now()); 
      }, Math.random() * 3000 + 1000);
    }

    return () => clearTimeout(timer);
  }, [isGameActive]);

  const handleClick = async () => {
    if (color === "#f07171") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setIsGameActive(false);
      setColor("#6a85dc");
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:5001/api/auth/updateHighScore", {
          userId,
          game: "reaction",
          score: time,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error updating high score:", error.message);
      }
    } else {
      alert("You clicked too soon! Wait for the box to turn red.");
    }
  };

  return (
    <div className="reaction-container">
    <MenuButton />
      <h1>
        Click the Box When it Changes from{" "}
        <span style={{ color: "#6a85dc" }}>Blue</span> to{" "}
        <span style={{ color: "#f07171" }}>Red</span>
      </h1>
      {!isGameActive && (
        <button
          className="btn-reaction-start"
          onClick={() => setIsGameActive(true)}
          style={{ marginTop: "20px" }}
        >
          Start Game
        </button>
      )}
      <button
        className="reaction-gallery"
        style={{
          backgroundColor: color,
          color: color === "#f07171" ? "#f5a3a3" : "#a7bbff",
        }}
        onClick={handleClick}
      >
        {isGameActive ? "Click Me!" : "Click Above to Initiate"}
      </button>
      {reactionTime !== null && (
        <p className="reaction-result">
          Your reaction time is {reactionTime} milliseconds!
        </p>
      )}
    </div>
  );
};

export default Reaction;