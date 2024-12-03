// frontend/src/components/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
        <video autoPlay muted loop id="video">
        <source src="typing.mp4" type="video/mp4" />
            </video>
      <div className="content">
        <h1>Welcome to ReflexForge</h1>
        <p>Test and improve your clicking speed, reaction time, and aim precision</p>
        <div className="button-container">
          <button onClick={() => navigate('/signup')} className="signup-btn">
            Sign Up
          </button>
          <button onClick={() => navigate('/login')} className="login-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;