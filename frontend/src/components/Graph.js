import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from 'react-plotly.js';
import "../styles/Graph.css";
import MenuButton from "./menuButton";

const Graph = () => {
  const [scores, setScores] = useState({
    scoresReaction: [],
    scoresClicker: [],
    scoresAim: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/auth/scores", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setScores(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch scores");
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  const commonLayout = {
    paper_bgcolor: '#282828',
    plot_bgcolor: '#282828',
    font: {
      color: '#fff',
      family: 'Inter, Arial, sans-serif'
    },
    xaxis: {
      gridcolor: '#404040',
      zerolinecolor: '#404040',
      color: '#858585'
    },
    yaxis: {
      gridcolor: '#404040',
      zerolinecolor: '#404040',
      color: '#858585'
    },
    autosize: true,
    margin: { l: 60, r: 40, t: 60, b: 60 }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
      <div className="graphs-container">
        <MenuButton />
        <h1>Performance Graphs</h1>
        <div className="box">
          <div className="graph">
            <Plot
              className="graph2"
              data={[{
                type: 'scatter',
                y: scores.scoresReaction,
                name: 'Reaction Time',
                mode: 'lines+markers',
                line: { color: '#4a75f5' },
                marker: { color: '#4a75f5' }
              }]}
              layout={{
                ...commonLayout,
                title: {
                  text: 'Reaction Time History',
                  font: { color: '#fff', size: 24 }
                },
                yaxis: { ...commonLayout.yaxis, title: 'Time (ms)' },
                xaxis: { ...commonLayout.xaxis, title: 'Attempt' }
              }}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="graph">
            <Plot
              className="graph2"
              data={[{
                type: 'scatter',
                y: scores.scoresClicker,
                name: 'Click Speed',
                mode: 'lines+markers',
                line: { color: '#f54a4a' },
                marker: { color: '#f54a4a' }
              }]}
              layout={{
                ...commonLayout,
                title: {
                  text: 'Click Speed History',
                  font: { color: '#fff', size: 24 }
                },
                yaxis: { ...commonLayout.yaxis, title: 'Clicks per Second' },
                xaxis: { ...commonLayout.xaxis, title: 'Attempt' }
              }}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="graph">
            <Plot
              className="graph2"
              data={[{
                type: 'scatter',
                y: scores.scoresAim,
                name: 'Aim Score',
                mode: 'lines+markers',
                line: { color: '#4af58c' },
                marker: { color: '#4af58c' }
              }]}
              layout={{
                ...commonLayout,
                title: {
                  text: 'Aim Score History',
                  font: { color: '#fff', size: 24 }
                },
                yaxis: { ...commonLayout.yaxis, title: 'Score' },
                xaxis: { ...commonLayout.xaxis, title: 'Attempt' }
              }}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
  );
};

export default Graph;