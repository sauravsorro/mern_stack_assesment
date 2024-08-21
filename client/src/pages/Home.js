import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES, API_URL, ROUTES } from "../constants";
import { appToaster } from "../utils/function";
import "./Home.css";

const Home = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const startGame = async () => {
    if (name.trim() === "") {
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}${API_ROUTES.startGame}`, {
        name: name?.trim(),
      });
      localStorage.setItem("playerId", data.data._id);
      appToaster("success", data.message);
      navigate(ROUTES.gameScreen);
    } catch (error) {
      appToaster(
        "error",
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="container">
      <h1 className="title">Start a New Game</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="input"
      />
      <button onClick={startGame} className="button">
        Start Game
      </button>
      <button onClick={() => navigate(ROUTES.leaderboard)} className="button">
        Go to Leaderboard
      </button>
    </div>
  );
};

export default Home;
