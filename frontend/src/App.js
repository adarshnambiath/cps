import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Mode from "./components/Mode";
import Signup from "./components/Signup";
import AimPracticePage from "./components/Aim";
import ReactionTimePage from "./components/Reaction";
import ClickingSpeedPage from "./components/Clicker";
import Score from "./components/Score";
import Outmode from "./components/Outmode";
import Graph from "./components/Graph";
import Landing from "./components/Landing";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:5001/api/auth/verifyToken", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setIsLoggedIn(true);
            setUserId(localStorage.getItem("userId"));
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const handleLogin = (id) => {
    localStorage.setItem("userId", id);
    setIsLoggedIn(true);
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserId(null);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/menu" /> : <Landing />} 
        />
        <Route 
          path="/login" 
          element={isLoggedIn ? 
            <Navigate to="/menu" /> : 
            <Login onLogin={handleLogin} onLogout={handleLogout} />
          } 
        />
        <Route 
          path="/signup" 
          element={isLoggedIn ? 
            <Navigate to="/menu" /> : 
            <Signup onLogin={handleLogin} />
          } 
        />
        <Route
          path="/menu"
          element={isLoggedIn ? 
            <Mode onLogout={handleLogout} /> : 
            <Navigate to="/login" state={{ from: "/menu" }} />
          }
        />
        <Route
          path="/aim-practice"
          element={isLoggedIn ? 
            <AimPracticePage userId={userId} /> : 
            <Navigate to="/login" state={{ from: "/aim-practice" }} />
          }
        />
        <Route
          path="/reaction-time"
          element={isLoggedIn ? 
            <ReactionTimePage userId={userId} /> : 
            <Navigate to="/login" state={{ from: "/reaction-time" }} />
          }
        />
        <Route
          path="/clicking-speed"
          element={isLoggedIn ? 
            <ClickingSpeedPage userId={userId} /> : 
            <Navigate to="/login" state={{ from: "/clicking-speed" }} />
          }
        />
        <Route
          path="/previous-scores"
          element={isLoggedIn ? 
            <Score /> : 
            <Navigate to="/login" state={{ from: "/previous-scores" }} />
          }
        />
        <Route
          path="/output-menu"
          element={isLoggedIn ? 
            <Outmode /> : 
            <Navigate to="/login" state={{ from: "/output-menu" }} />
          }
        />
        <Route
          path="/graph"
          element={isLoggedIn ? 
            <Graph /> : 
            <Navigate to="/login" state={{ from: "/graph" }} />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
