import React, { useState, useEffect } from "react";
import axios from "axios";
import { appToaster } from "../utils/function";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, API_URL, ROUTES, STATUS } from "../constants";
import "./GameScreen.css";

const optionLabels = ["A", "B", "C", "D"];
const prizes = [
  1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000,
];

const GameScreen = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    playerData: null,
    currentQuestion: null,
    currentOptions: [],
    correctAnswer: null,
    questionId: null,
    selectedOption: null,
    isAnswerLocked: false,
  });

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) {
      navigate(ROUTES.default);
    } else {
      fetchGameData(playerId);
    }
  }, []);

  const fetchGameData = async (playerId) => {
    try {
      const playerResponse = await axios.get(
        `${API_URL}${API_ROUTES.players}/${playerId}`
      );
      const playerData = playerResponse?.data?.data;

      if (playerData.status === STATUS.Forfeited) {
        localStorage.removeItem("playerId");
        appToaster("error", "Timeout for your session");
        navigate(ROUTES.leaderboard);
        return;
      }

      const questionResponse = await axios.get(
        `${API_URL}${API_ROUTES.questions}`,
        {
          params: { page: playerData?.currentLevel + 1 },
        }
      );

      const questionData = questionResponse?.data?.data;
      setGameState({
        playerData,
        currentQuestion: questionData?.question,
        currentOptions: questionData?.options,
        correctAnswer: questionData?.correctAnswer,
        questionId: questionData?._id,
        selectedOption: null,
        isAnswerLocked: false,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleAnswerSelection = (option) => {
    if (!gameState?.isAnswerLocked) {
      setGameState((prevState) => ({ ...prevState, selectedOption: option }));
    }
  };

  const lockAnswer = async () => {
    setGameState((prevState) => ({ ...prevState, isAnswerLocked: true }));
    const isCorrect = gameState?.correctAnswer === gameState?.selectedOption;

    if (!isCorrect) {
      const prizeMoney =
        gameState?.playerData?.currentLevel >= 7
          ? 1000000
          : gameState?.playerData?.currentLevel >= 4
          ? 1000
          : 0;
      await updatePlayerStatus(
        prizeMoney,
        STATUS.Completed,
        "Your answer is wrong... Better luck next time"
      );
    } else {
      await updatePlayerStatus(
        calculatePrize(gameState?.playerData?.currentLevel + 1),
        STATUS.InProgress,
        "Proceeding to the next question..."
      );
    }
  };

  const updatePlayerStatus = async (prizeMoney, status, message) => {
    try {
      const playerId = localStorage.getItem("playerId");
      await axios.patch(`${API_URL}${API_ROUTES.players}/${playerId}`, {
        currentLevel: gameState?.playerData?.currentLevel + 1,
        prizeMoney,
        status,
      });

      if (status === STATUS.Completed) {
        localStorage.removeItem("playerId");
        setTimeout(() => navigate(ROUTES.leaderboard), 2000);
      }
      appToaster(status === STATUS.Completed ? "error" : "success", message);
    } catch (error) {
      handleError(error);
    }
  };

  const lifelineFunc = async (endpoint) => {
    try {
      const playerId = localStorage.getItem("playerId");
      const response = await axios.patch(
        `${API_URL}${endpoint}/${playerId}/${gameState.questionId}`
      );

      if (endpoint === API_ROUTES.useFifty) {
        setGameState((prevState) => ({
          ...prevState,
          currentOptions: response?.data?.data,
        }));
      } else {
        appToaster(
          "success",
          `Answer to this question is ${response.data.data}`
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  const proceedToNextQuestion = async () => {
    try {
      setGameState((prevState) => ({
        ...prevState,
        isAnswerLocked: false,
        selectedOption: null,
      }));
      const playerId = localStorage.getItem("playerId");
      fetchGameData(playerId);
    } catch (error) {
      handleError(error);
    }
  };

  const calculatePrize = (level) => prizes[level - 1];

  const quitGame = async () => {
    try {
      const playerId = localStorage.getItem("playerId");
      const response = await axios.patch(
        `${API_URL}${API_ROUTES.quitGame}/${playerId}`
      );
      appToaster("success", response.data.message);
      localStorage.removeItem("playerId");
      navigate(ROUTES.leaderboard);
    } catch (error) {
      handleError(error);
    }
  };

  const completeGame = async () => {
    try {
      const playerId = localStorage.getItem("playerId");
      await axios.patch(`${API_URL}${API_ROUTES.players}/${playerId}`, {
        currentLevel: gameState?.playerData?.currentLevel + 1,
        prizeMoney: calculatePrize(gameState?.playerData?.currentLevel + 1),
        status: STATUS.Completed,
      });
      appToaster("success", "Congratulations! You've completed the game.");
      localStorage.removeItem("playerId");
      navigate(ROUTES.leaderboard);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    appToaster(
      "error",
      error?.response?.data?.message || "An error occurred. Please try again."
    );
  };

  const getOptionClassName = (option) => {
    if (gameState.isAnswerLocked) {
      if (option === gameState.correctAnswer) return "correct";
      if (option === gameState.selectedOption) return "incorrect";
    } else if (option === gameState.selectedOption) {
      return "selected";
    }
    return "";
  };

  return (
    <div className="container">
      <h1>
        Prize - {calculatePrize(gameState?.playerData?.currentLevel + 1)} Rs
      </h1>
      <h2>Level: {gameState?.playerData?.currentLevel + 1}</h2>
      <div className="buttons-container">
        <button
          disabled={
            gameState?.playerData?.usedFiftyFifty || gameState?.isAnswerLocked
          }
          onClick={() => lifelineFunc(API_ROUTES.useFifty)}
          className="button"
        >
          Use 50-50
        </button>
        <button
          disabled={
            gameState?.playerData?.usedAskTheAI || gameState?.isAnswerLocked
          }
          onClick={() => lifelineFunc(API_ROUTES.useAskTheAi)}
          className="button"
        >
          Use Ask the AI
        </button>
        <button
          disabled={!gameState?.selectedOption || gameState?.isAnswerLocked}
          onClick={lockAnswer}
          className="button"
        >
          Lock the Answer
        </button>
        {gameState?.playerData?.currentLevel + 1 === 10 ? (
          <button
            disabled={!gameState?.isAnswerLocked}
            onClick={completeGame}
            className="button"
          >
            Complete Game
          </button>
        ) : (
          <button
            disabled={!gameState?.isAnswerLocked}
            onClick={proceedToNextQuestion}
            className="button"
          >
            Go to Next Question
          </button>
        )}
        <button onClick={quitGame} className="button">
          Quit Game
        </button>
      </div>

      <h1 className="question">
        Question {gameState?.playerData?.currentLevel + 1}:{" "}
        {gameState?.currentQuestion}
      </h1>
      <ul className="option-list">
        {gameState?.currentOptions?.map((option, index) => (
          <li
            key={index}
            className={`option-item ${getOptionClassName(option)}`}
            onClick={() => handleAnswerSelection(option)}
          >
            <span className="option-label">{optionLabels[index]}:</span>{" "}
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameScreen;
