import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LogPage.css";
import SettingsIcon from "./settings.png";
import HomeIcon from "./home.png";
import Logo from "./logo.png";
import threatIcon from './threat.png'

function LogPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

          setLogs(logsDataWithThreat);
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
        </div>
      </div>

      {isLoading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : logs.length > 0 ? (
        <div className="logs-container">
          {logs.map((log) => (
            <div key={log.id} className={`log-item ${log.threatLevel.toLowerCase()}`}> {/* Dynamic class assignment */}
              <div className="log-info">
                <div className="left-info">
                  <div>ID: {log.id}</div>
                  <div>Timestamp: {log.timestamp}</div>
                  <div>User ID: {log.userId}</div>
                  <div>Animal ID: {log.animalId}</div>
                  <div>Threat Level: {log.threatLevel}</div>
                </div>
                <div className="right-info">
                  <img src={log.image} alt="Log" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No logs found.</p>
      )}
    </div>
  );
}

export default LogPage;
