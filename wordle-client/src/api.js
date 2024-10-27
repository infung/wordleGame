import axios from "axios";

// Base URL for the API
const API_URL = "http://localhost:3001";

// Function to start a new game
export const startGame = async (payload) => {
  const response = await axios.post(`${API_URL}/api/start`, payload);
  return response.data; // Return game ID
};

// Function to submit a guess
export const submitGuess = async (gameId, playerId, guess) => {
  const response = await axios.post(`${API_URL}/api/guess`, {
    gameId,
    playerId,
    guess,
  });
  return response.data; // Return feedback
};

// Function to join an existing game
export const joinGame = async (gameId) => {
  const response = await axios.post(`${API_URL}/api/join`, { gameId });
  return response.data; // Return player ID
};

export const quitGame = async (gameId, playerId) => {
  const response = await axios.post(`${API_URL}/api/quit`, {
    gameId,
    playerId,
  });
  return response.data; // Return msg;
};

export const restartGame = async (gameId, playerId, newAnswer) => {
  const response = await axios.post(`${API_URL}/api/restart`, {
    gameId,
    playerId,
    newAnswer,
  });
  return response.data; // Return msg;
};
