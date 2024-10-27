import React, { useState, useEffect, useRef } from "react";
import OnboardingPage from "./OnboardingPage";
import { startGame, submitGuess, joinGame } from "../api";
import "./Game.css";

const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

const Game = () => {
  // State variables
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isMultiPlayer, setIsMultiPlayer] = useState(false);
  const [isPlayerJoined, setIsPlayerJoined] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gridState, setGridState] = useState({
    currentRow: 0,
    feedback: Array(6).fill([]),
    grid: Array(6)
      .fill("")
      .map(() => Array(5).fill("")),
  });
  const gridRef = useRef(gridState);
  const guessRef = useRef(currentGuess);
  const playerRef = useRef(playerId);
  const joinedRef = useRef(isPlayerJoined);

  const [keyFrequency, setKeyFrequency] = useState(
    keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );
  const ws = useRef(null);

  const handlePhysicalKeyPress = (event) => {
    handleKeyPress(event.key);
  };

  // Effect to handle physical keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handlePhysicalKeyPress);

    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [currentGuess, gameOver, showOnboarding]);

  useEffect(() => {
    if (isMultiPlayer) {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    }
  }, [isMultiPlayer]);

  const onGuessReceived = (data) => {
    const { playerId, feedback, gameOver, guess, creatorFeedback, creator } =
      data;
    const { currentRow, grid } = gridRef.current;

    // to sync the guess with other player
    if (playerId !== playerRef.current) {
      guessRef.current = guess;
    }
    const currentGuess = guessRef.current;

    // Update grid
    const newGrid = [...grid];
    newGrid[currentRow] = currentGuess.split("");

    // Merge feedback
    const updatedFeedback = [...gridRef.current.feedback];
    updatedFeedback[currentRow] =
      creator === playerRef.current && creatorFeedback
        ? creatorFeedback
        : feedback;

    const updatedGridState = {
      grid: newGrid,
      feedback: updatedFeedback,
      currentRow: gameOver ? currentRow : currentRow + 1,
    };
    gridRef.current = updatedGridState;
    setGridState(updatedGridState);

    if (gameOver) {
      setGameOver(true); // End game if over
    } else {
      guessRef.current = "";
      setCurrentGuess("");
    }
  };

  const onPlayerJoined = (data) => {
    joinedRef.current = data.playerId;
    setIsPlayerJoined(data.playerId);
  };

  const initializeWs = (gameId, playerId) => {
    if (gameId && playerId) {
      ws.current = new WebSocket("ws://localhost:3001");

      ws.current.onopen = () => {
        console.log(`WebSocket connected - ${gameId}`);

        ws.current.send(JSON.stringify({ type: "join", gameId, playerId }));
      };

      ws.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "guessResult":
            onGuessReceived(data);
            break;
          case "playerJoined":
            onPlayerJoined(data);
            break;
          default:
            break;
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
    }
  };

  const startSoloGame = () => {
    handleStart("");
  };

  // Start a new game
  const handleStart = async (guessWord) => {
    try {
      const { gameId, maxRounds, playerId } = await startGame({
        word: guessWord,
      });

      // multiplayer
      if (guessWord) {
        setIsMultiPlayer(true);
      }

      // Initialize game state
      setGameId(gameId);
      setPlayerId(playerId);
      setGridState({
        grid: Array(maxRounds)
          .fill("")
          .map(() => Array(5).fill("")),
        feedback: Array(maxRounds).fill([]),
        currentRow: 0,
      });
      setShowOnboarding(false);
      setGameOver(false);
      setCurrentGuess("");
      setKeyFrequency(keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));

      initializeWs(gameId, playerId);
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  const handleJoin = async (gameId) => {
    const { playerId, maxRounds } = await joinGame(gameId);
    setGameId(gameId);
    setPlayerId(playerId);
    setGridState({
      grid: Array(maxRounds)
        .fill("")
        .map(() => Array(5).fill("")),
      feedback: Array(maxRounds).fill([]),
      currentRow: 0,
    });
    setShowOnboarding(false);
    setGameOver(false);
    setCurrentGuess("");
    setKeyFrequency(keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));

    initializeWs(gameId, playerId);
  };

  // Handle virtual and physical key presses
  const handleKeyPress = (key) => {
    if (gameOver || showOnboarding) return;

    if (key === "Enter" && currentGuess.length === 5) {
      handleSubmit(); // Submit guess
    } else if (key === "Backspace") {
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
    const darkGray = 40; // Darker gray
    const grayValue = Math.floor(
      lightGray - intensity * (lightGray - darkGray)
    );
    return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
  };

  // Update grid with the current guess
  useEffect(() => {
    const { currentRow, grid } = gridState;

    const newGrid = [...grid];
    // Clear the current row first
    newGrid[currentRow] = Array(5).fill("");
    // Fill with current guess
    currentGuess.split("").forEach((letter, index) => {
      newGrid[currentRow][index] = letter;
    });
    setGridState({
      ...gridState,
      grid: newGrid,
    });
  }, [currentGuess, gridState.currentRow]);

  // Submit the current guess to the server
  const handleSubmit = async () => {
    try {
      await submitGuess(gameId, playerId, currentGuess);
    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  useEffect(() => {
    joinedRef.current = isPlayerJoined;
  }, [isPlayerJoined]);
  useEffect(() => {
    playerRef.current = playerId;
  }, [playerId]);
  useEffect(() => {
    gridRef.current = gridState;
  }, [gridState]);
  useEffect(() => {
    guessRef.current = currentGuess;
  }, [currentGuess]);

  // Render the game grid
  const renderGrid = () => {
    const { currentRow, feedback, grid } = gridState;
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="grid-row">
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className={`grid-cell ${
              feedback[rowIndex] && feedback[rowIndex][cellIndex]
                ? feedback[rowIndex][cellIndex].toLowerCase()
                : ""
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
          disabled={isMultiPlayer}
          onClick={() => handleKeyPress(key)}
          className="key"
          style={{ backgroundColor: getKeyColor(keyFrequency[key]) }}
        >
          {key}
        </button>
      ))}
      <button
        className="key special"
        onClick={() => handleKeyPress("Enter")}
        disabled={currentGuess.length < 5 || isMultiPlayer}
      >
        ENTER
      </button>
      <button
        className="key special"
        onClick={() => handleKeyPress("Backspace")}
        disabled={currentGuess.length === 0 || isMultiPlayer}
      >
        ⌫
      </button>
    </div>
  );

  return showOnboarding ? (
    <OnboardingPage onStart={handleStart} onJoin={handleJoin} />
  ) : (
    <div className="game">
      <h3>{gameId && `Room Id: ${gameId}`}</h3>

      <h3>
        {isMultiPlayer && isPlayerJoined && `Player [${isPlayerJoined}] joined`}
        {isMultiPlayer && !isPlayerJoined && `Waiting for other player to join`}
      </h3>

      <div className="game-board">
        {renderGrid()}
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <p className="feedback-message">
                {gridState.feedback[gridState.currentRow][0]}
              </p>{" "}
              {/* Display the feedback message */}
              <button className="restart-button" onClick={startSoloGame}>
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
