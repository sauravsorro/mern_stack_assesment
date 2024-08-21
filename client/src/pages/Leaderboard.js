import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, API_URL, ROUTES } from "../constants";
import "./Leaderboard.css";
import { appToaster } from "../utils/function";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_URL}${API_ROUTES.leaderBoard}`);
        setPlayers(response.data.data);
      } catch (error) {
        appToaster(
          "error",
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    };
    fetchLeaderboard();
  }, []);

  function formatDateTimeInIST(isoString) {
    const date = new Date(isoString);

    // Convert UTC to IST by adding 5 hours and 30 minutes
    const offset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const istDate = new Date(date.getTime() + offset);

    // Format components
    const day = istDate.getUTCDate().toString().padStart(2, "0");
    const month = (istDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = istDate.getUTCFullYear();

    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Construct the final string
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }

  return (
    <div className="container">
      <button onClick={() => navigate(ROUTES.default)} className="start-button">
        Start the game
      </button>
      <h1 className="title">Leaderboard</h1>
      {players?.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Prize Money</th>
                <th>Status</th>
                <th>Start Time</th>
              </tr>
            </thead>
            <tbody>
              {players?.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                  <td>{player.prizeMoney}</td>
                  <td>{player.status}</td>
                  <td className="date">
                    {formatDateTimeInIST(player.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        "No Players Found"
      )}
    </div>
  );
};

export default Leaderboard;
