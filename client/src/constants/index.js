export const API_URL = process.env.REACT_APP_API_BASE_URL;

export const ROUTES = {
  default: "/",
  gameScreen: "/game-screen",
  leaderboard: "/leaderboard",
};

export const API_ROUTES = {
  startGame: "/players/start",
  leaderBoard: "/players/leaderboard",
  questions: "/questions",
  players: "/players",
  useAskTheAi: "/players/use-ask-the-ai",
  useFifty: "/players/use-fifty-fifty",
  quitGame: "/players/quit",
};

export const STATUS = {
  Completed: "Completed",
  InProgress: "InProgress",
  Forfeited: "Forfeited",
};
