// frontend/src/components/Aim.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/Aim.css";
import MenuButton from "./menuButton";

const Aim = ({ userId }) => {
  const aimGalleryRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);
  const [testStarted, setTestStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const positionTimerRef = useRef(null);
  const scoreRef = useRef(0);
  const countdownTimerRef = useRef(null);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (aimGalleryRef.current) {
      setPosition(getCenterPosition());
    }
    return () => {
      clearInterval(positionTimerRef.current);
      clearInterval(countdownTimerRef.current);
    };
  }, [aimGalleryRef.current]);

  const getCenterPosition = () => {
    if (aimGalleryRef.current) {
      const galleryWidth = aimGalleryRef.current.clientWidth;
      const galleryHeight = aimGalleryRef.current.clientHeight;
      return {
        x: galleryWidth / 2 - 50,
        y: galleryHeight / 2 - 50,
      };
    }
    return { x: 0, y: 0 };
  };

  const getRandomPosition = () => {
    if (aimGalleryRef.current) {
      const galleryWidth = aimGalleryRef.current.clientWidth;
      const galleryHeight = aimGalleryRef.current.clientHeight;
      const x = Math.floor(Math.random() * (galleryWidth - 100));
      const y = Math.floor(Math.random() * (galleryHeight - 100));
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  const resetTargetPosition = () => {
    setPosition(getRandomPosition());
  };

  const updateHighScore = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/auth/updateHighScore", 
        {
          userId,
          game: "aim",
          score: scoreRef.current,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating high score:", error.message);
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setGameOver(false);
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(7);
    resetTargetPosition();

    positionTimerRef.current = setInterval(resetTargetPosition, 750);

    countdownTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownTimerRef.current);
          clearInterval(positionTimerRef.current);
          setTestStarted(false);
          setGameOver(true);
          updateHighScore();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleTargetClick = () => {
    if (testStarted) {
      setScore((prev) => prev + 1);
      resetTargetPosition();
      clearInterval(positionTimerRef.current);
      positionTimerRef.current = setInterval(resetTargetPosition, 750);
    }
  };

  return (
    <div className="aim-container">
      <MenuButton />
      <h1>Click the Target</h1>
      {testStarted ? (
        <>
          <h2>Score: {score}</h2>
          <h2>Time Left: {timeLeft}</h2>
        </>
      ) : (
        <>
          {gameOver ? (
            <>
              <h2>Time's up! Your score: {score}</h2>
              <button className="btn-restart" onClick={startTest}>
                Restart Test
              </button>
            </>
          ) : (
            <>
              <button className="btn-restart" onClick={startTest}>
                Start Test
              </button>
            </>
          )}
        </>
      )}
      <div
        className="aim-gallery"
        ref={aimGalleryRef}
        style={{
          position: "relative",
          width: "80vw",
          height: "80vh",
        }}
      >
        <img
          className="target"
          src="target.png"
          alt="target"
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: "100px",
            height: "100px",
          }}
          onClick={handleTargetClick}
        />
      </div>
    </div>
  );
};

export default Aim;