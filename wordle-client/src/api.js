import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:3001';

// Function to start a new game
export const startGame = async () => {
  const response = await axios.post(`${API_URL}/api/start`);
  return response.data; // Return game ID
};

// Function to submit a guess
export const submitGuess = async (gameId, playerId, guess) => {
  const response = await axios.post(`${API_URL}/api/guess`, { gameId, playerId, guess });
  return response.data; // Return feedback
};