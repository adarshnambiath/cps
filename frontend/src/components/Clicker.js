// frontend/src/components/Clicker.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Clicker.css";
import MenuButton from "./menuButton";

const Clicker = ({ userId }) => {
  const [clickCount, setClickCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [rippleStyle, setRippleStyle] = useState({});
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef(null);
  const clickCountRef = useRef(0);

  useEffect(() => {
    clickCountRef.current = clickCount;
  }, [clickCount]);

  useEffect(() => {
    if (isActive && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            setIsGameOver(true);
            updateHighScore();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  const updateHighScore = async () => {
    try {
      const score = clickCountRef.current / 10;
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/auth/updateHighScore", 
        { userId, game: "clicker", score },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error("Error updating high score:", error.message);
    }
  };

  const handleButtonClick = (e) => {
    if (!isActive && !isGameOver) {
      setIsActive(true);
      setClickCount(1);
      setTimeLeft(10);
    } else if (isActive) {
      setClickCount(prev => prev + 1);
    }

    const rect = e.target.getBoundingClientRect();
    setRippleStyle({
      left: `${e.clientX - rect.left}px`,
      top: `${e.clientY - rect.top}px`,
      opacity: 1,
    });
    setTimeout(() => setRippleStyle({ opacity: 0 }), 500);
  };

  const handleTryAgain = () => {
    setClickCount(0);
    setTimeLeft(10);
    setIsGameOver(false);
    setIsActive(false);
  };

  return (
    <div className="clicker-container">
      <MenuButton />
      <h1>Click Speed Test</h1>
      <div className="button-wrapper">
        <button
          className="clicker-button"
          onClick={handleButtonClick}
          disabled={isGameOver}
        >
          {isGameOver
            ? `Your speed is ${clickCount / 10} clicks per second`
            : isActive
            ? "Click Me as Fast as You Can!"
            : "Start Clicking"}
          <span className="ripple" style={rippleStyle}></span>
        </button>
      </div>
      {isGameOver && (
        <button className="try-again-button" onClick={handleTryAgain}>
          Try Again
        </button>
      )}
      {!isGameOver && <p>Time Left: {timeLeft} seconds</p>}
    </div>
  );
};

export default Clicker;