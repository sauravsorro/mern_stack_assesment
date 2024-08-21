// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameScreen from "./pages/GameScreen";
import Leaderboard from "./pages/Leaderboard";
import { ROUTES } from "./constants";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "#000000",
            color: "#fff",
          },
        }}
      />
      <Router>
        <Routes>
          <Route path={ROUTES.default} element={<Home />} />
          <Route path={ROUTES.gameScreen} element={<GameScreen />} />
          <Route path={ROUTES.leaderboard} element={<Leaderboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
