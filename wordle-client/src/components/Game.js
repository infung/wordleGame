import React, { useState } from 'react';
import Input from './Input';
import Feedback from './Feedback';
import { startGame, submitGuess } from '../api';

const Game = () => {
  // State to hold feedback and game ID
  const [feedback, setFeedback] = useState([]);
  const [gameId, setGameId] = useState(null);

  // Handle starting a new game
  const handleStart = async () => {
    const { id } = await startGame(); // Call API to start game
    setGameId(id); // Set the game ID
    setFeedback([]); // Reset feedback
  };

  // Handle submitting a guess
  const handleGuess = async (guess) => {
    if (!gameId) return; // Ensure a game is started
    const result = await submitGuess(gameId, guess); // Call API to submit guess
    setFeedback(result.feedback); // Update feedback from server response
  };

  return (
    <div>
      <button onClick={handleStart}>Start Game</button>
      <Input onSubmit={handleGuess} />
      <Feedback feedback={feedback} />
    </div>
  );
};

export default Game;