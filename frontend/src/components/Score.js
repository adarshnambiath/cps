import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/score.css";
import MenuButton from "./menuButton";

const Score = () => {
  const [highScores, setHighScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/auth/highScores", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setHighScores(response.data);
      } catch (error) {
        console.error("Error fetching high scores:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch scores");
      }
    };

    fetchHighScores();
  }, []);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const renderScores = (scores, key) => {
    const filteredScores = scores.filter(score => score[key] !== -1);
    const topScores = filteredScores.slice(0, 5);
    while (topScores.length < 5) {
      topScores.push({ _id: `empty-${topScores.length}`, username: "-", [key]: "-" });
    }
    return topScores.map((user) => (
      <li key={user._id}>
        {user.username}: {user[key]} {key === "highScoreReaction" ? "ms" : key === "highScoreClicker" ? "clicks per second" : "points"}
      </li>
    ));
  };

  return (
      <div className="scoreContainer">
    <MenuButton />
      <h1>Leaderboards</h1>
      <div className="co">
      <div className="c">
        <h2>Click Speed Test</h2>
        <ol>
          {renderScores(highScores.sort((a, b) => b.highScoreClicker - a.highScoreClicker), "highScoreClicker")}
        </ol>
      </div>
      <div className="c">
        <h2>Reaction Time Test</h2>
        <ol>
          {renderScores(highScores.sort((a, b) => a.highScoreReaction - b.highScoreReaction), "highScoreReaction")}
        </ol>
      </div>
      <div className="c">
        <h2>Aim Practice Test</h2>
        <ol>
          {renderScores(highScores.sort((a, b) => b.highScoreAim - a.highScoreAim), "highScoreAim")}
        </ol>
      </div>
      </div>
    </div>
    
  );
};

export default Score;