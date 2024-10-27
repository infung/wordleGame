import React, { useState, useEffect } from 'react';
import OnboardingPage from './OnboardingPage';
import { startGame, submitGuess } from '../api';
import './Game.css';

const Game = () => {
  // State variables
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [grid, setGrid] = useState(Array(6).fill('').map(() => Array(5).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState(Array(6).fill([]));
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(null);
  const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
  const [keyFrequency, setKeyFrequency] = useState(
    keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

  // Effect to handle physical keyboard input
  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);

    return () => {
      window.removeEventListener('keydown', handlePhysicalKeyPress);
    };
  }, [currentGuess, gameOver, showOnboarding]);

  // Start a new game
  const handleStart = async () => {
    try {
      const { id, maxRounds } = await startGame();
      // Initialize game state
      setGameId(id);
      setGrid(Array(maxRounds).fill('').map(() => Array(5).fill('')));
      setShowOnboarding(false);
      setGameOver(false);
      setCurrentRow(0);
      setCurrentGuess('');
      setFeedback(Array(maxRounds).fill([]));
      setKeyFrequency(keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  // Handle virtual and physical key presses
  const handleKeyPress = (key) => {
    if (gameOver || showOnboarding) return;

    if (key === 'Enter' && currentGuess.length === 5) {
      handleSubmit(); // Submit guess
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1)); // Remove last character
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key.toUpperCase()); // Add character to guess
      const upperKey = key.toUpperCase();
      if (keys.includes(upperKey)) {
        setKeyFrequency((prev) => ({
          ...prev,
          [upperKey]: prev[upperKey] + 1,
        }));
      }
    }
  };

  // Computes the color based on frequency
  const getKeyColor = (frequency) => {
    const maxFrequency = Math.max(...Object.values(keyFrequency));
    const intensity = frequency / (maxFrequency || 1);
    const lightGray = 160; // Lighter gray
    const darkGray = 40;   // Darker gray
    const grayValue = Math.floor(lightGray - intensity * (lightGray - darkGray));
    return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
  };

// Update grid with the current guess
  useEffect(() => {
    const newGrid = [...grid];
    // Clear the current row first
    newGrid[currentRow] = Array(5).fill('');
    // Fill with current guess
    currentGuess.split('').forEach((letter, index) => {
      newGrid[currentRow][index] = letter;
    });
    setGrid(newGrid);
  }, [currentGuess, currentRow]);

  // Submit the current guess to the server
  const handleSubmit = async () => {
    try {
      const result = await submitGuess(gameId, currentGuess);
      console.log(result)
      // Update grid
      const newGrid = [...grid];
      newGrid[currentRow] = currentGuess.split('');
      setGrid(newGrid);
      // Merge feedback
      const updatedFeedback = [...feedback];
      updatedFeedback[currentRow] = result.feedback;
      setFeedback(updatedFeedback);

      if (result.gameOver) {
        setGameOver(true); // End game if over
      } else {
        setCurrentRow(currentRow + 1); // Move to next row
        setCurrentGuess(''); // Reset current guess
      }
    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  // Render the game grid
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="grid-row">
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className={`grid-cell ${
              feedback[rowIndex] && feedback[rowIndex][cellIndex]
                ? feedback[rowIndex][cellIndex].toLowerCase()
                : ''
            }`}
          >
            {cell}
          </div>
        ))}
        {rowIndex === currentRow && currentGuess.length === 5 && (
          <button className="submit-button" onClick={handleSubmit}>
            ENTER
          </button>
        )}
      </div>
    ));
  };

  // Render the virtual keyboard
  const renderKeyboard = () => (
    <div className="keyboard">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          className="key"
          style={{ backgroundColor: getKeyColor(keyFrequency[key]) }}
        >
          {key}
        </button>
      ))}
      <button
        className="key special"
        onClick={() => handleKeyPress('Enter')}
        disabled={currentGuess.length < 5}
      >
        ENTER
      </button>
      <button
        className="key special"
        onClick={() => handleKeyPress('Backspace')}
      >
        ⌫
      </button>
    </div>
  );


  return showOnboarding ? (
    <OnboardingPage onStart={handleStart} />
  ) : (
    <div className="game">
      <div className="game-board">
        {renderGrid()}
        {gameOver && (
        <div className="game-over-overlay">
            <div className="game-over-content">
            <p className="feedback-message">{feedback[currentRow][0]}</p> {/* Display the feedback message */}
            <button className="restart-button" onClick={handleStart}>
                Start a New Game
            </button>
            </div>
        </div>
        )}
      </div>
      {renderKeyboard()}
    </div>
  );
};

export default Game;