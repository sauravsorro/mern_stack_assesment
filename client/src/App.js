// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameScreen from "./pages/GameScreen";
import Leaderboard from "./pages/Leaderboard";
import { ROUTES } from "./constants";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.default} element={<Home />} />
        <Route path={ROUTES.gameScreen} element={<GameScreen />} />
        <Route path={ROUTES.leaderboard} element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
