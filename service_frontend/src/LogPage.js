import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LogPage.css";
import SettingsIcon from "./settings.png";
import HomeIcon from "./home.png";
import Logo from "./logo.png";
import threatIcon from './threat.png'
import './LoginPage.css';


function LogPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [camRunning, setCamRunning] = useState(false)

  useEffect(() => {
    const fetchUserIdAndLogs = async () => {
      setIsLoading(true);
      setError("");

      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          throw new Error("User email not found.");
        }

        const userIdResponse = await axios.get(
          `http://localhost:3000/user/userIdFromEmail?email=${userEmail}`
        );

        if (userIdResponse.data && userIdResponse.data.id) {
          const userId = userIdResponse.data.id;

          const logsResponse = await axios.get("http://localhost:3000/log", {
            headers: { "user-id": userId },
          });
          const logsData = logsResponse.data;

          // Fetch threat levels for each log with animal ID
          const logsDataWithThreat = await Promise.all(logsData.map(async (log) => {
            const threatResponse = await axios.get("http://localhost:3000/animal/animalId", {
              params: { animalId: log.animalId },
            });
            log.threatLevel = threatResponse.data;
            return log;
          }));

          const logsWithAnimalNames = await Promise.all(logsData.map(async log => {
            const response = await axios.get(`http://localhost:3000/animal/${log.animalId}/name`);
            log.animalName = response.data.animalName; // Assuming animal name is returned correctly
            return log;
          }));

          setLogs(logsDataWithThreat);
          setLogs(logsWithAnimalNames);

        } else {
          throw new Error("User ID not found for the given email.");
        }
      } catch (error) {
        console.error("Error fetching user ID, logs or threat levels:", error);
        setError("Failed to fetch user ID, logs or threat levels.");
      }

      setIsLoading(false);
    };

    fetchUserIdAndLogs();
  }, []);

  const runCamera = async () => {
    try {
      await axios.post("http://localhost:3000/cam/run-camera");
      setCamRunning(!camRunning)
    } catch (error) {
      console.error("Error executing Python script:", error);
    }
  };

  const stopCamera = async () => {
    try {
      await axios.post("http://localhost:3000/cam/stop-camera");
      setCamRunning(!camRunning)
    } catch (error) {
      console.error("Error executing Python script:", error);
    }
  };

  const handleSettings = () => navigate("/settings");
  const handleLivestream = () => navigate("/livestream");

  return (
    <div className="header-container">
      <div className="title-settings">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="title-space"></div>
        <div className="title-container">
          <h2 className="log-title">NatureNet</h2>
        </div>
        <div className="icons-container">
          <img src={SettingsIcon} alt="Settings" className="nav-icon" onClick={handleSettings} />
          <img src={threatIcon} alt="Livestream" className="nav-icon" onClick={handleLivestream} />
          <img src={HomeIcon} alt="Home" className="nav-icon" />
          {!camRunning ? 
          <button onClick={runCamera} className="run-button">Run Camera</button>:
          <button onClick={stopCamera} className="run-button">Stop Camera</button>
        }
        </div>
      </div>

      {isLoading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : logs.length > 0 ? (
        <div className="logs-container">
          {logs.map((log) => {
            const timestamp = log.timestamp; // Example: "2024-04-18T17:05:16.185Z"
            const date = new Date(timestamp);

            const month = date.toLocaleString('default', { month: 'long' }); // Converts month number to month name
            const day = date.getDate();
            const year = date.getFullYear();
            // const time = timestamp.split('T')[1]; // Extracts time part after 'T'
            const time = new Date(timestamp).toLocaleTimeString();

            return (
              <div key={log.id} className={`log-item ${log.threatLevel.toLowerCase()}`}>
                <div className="log-info">
                  <div className="left-info">
                    <div><span style={{ fontWeight: 'bold' }}>Month:</span> {month}</div>
                    <div><span style={{ fontWeight: 'bold' }}>Day:</span> {day}</div>
                    <div><span style={{ fontWeight: 'bold' }}>Year:</span> {year}</div>
                    <div><span style={{ fontWeight: 'bold' }}>Time:</span> {time}</div>
                    <div><span style={{ fontWeight: 'bold' }}>Animal Name:</span> {log.animalName}</div>
                    <div><span style={{ fontWeight: 'bold' }}>Threat Level:</span> {log.threatLevel}</div>
                  </div>
                  <div className="right-info">
                    <img src={log.image} alt="Log" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No logs found.</p>
      )}
    </div>
  );
}

export default LogPage;