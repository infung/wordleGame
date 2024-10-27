import React, { useState, useEffect, useRef } from "react";
import OnboardingPage from "../OnboardingPage";
import {
  startGame,
  submitGuess,
  joinGame,
  quitGame,
  restartGame,
} from "../../api";
import FinishModal from "./FinishModal";
import "./style.css";

const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

const Game = () => {
  // State variables
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
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
  const [keyFrequency, setKeyFrequency] = useState(
    keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

  // to workaround bounded scope in ws
  const gridRef = useRef(gridState);
  const guessRef = useRef(currentGuess);
  const playerRef = useRef(playerId);

  const ws = useRef(null);

  const handlePhysicalKeyPress = (event) => {
    handleKeyPress(event.key);
  };

  // Effect to handle physical keyboard input
  useEffect(() => {
    if (!showOnboarding) {
      window.addEventListener("keydown", handlePhysicalKeyPress);
    } else {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [showOnboarding, isPlayerJoined]);

  useEffect(() => {
    if (isCreator) {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    }
    console.log("isCreator", isCreator);
  }, [isCreator]);

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

  useEffect(() => {
    playerRef.current = playerId;
  }, [playerId]);
  useEffect(() => {
    gridRef.current = gridState;
  }, [gridState]);
  useEffect(() => {
    guessRef.current = currentGuess;
  }, [currentGuess]);

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
    setGridState(updatedGridState);

    if (gameOver) {
      setGameOver(true); // End game if over
    } else {
      setCurrentGuess("");
    }
  };

  const onPlayerJoined = (data) => {
    setIsPlayerJoined(data.playerId);
  };

  const onPlayerQuit = (data) => {
    setShowOnboarding(true);
  };

  const onGameRestarted = (data) => {
    const { creator, maxRounds, playerId } = data;
    setIsCreator(playerRef.current === creator);
    setGameOver(false);
    setCurrentGuess("");
    setIsPlayerJoined(playerId);
    setGridState({
      grid: Array(maxRounds)
        .fill("")
        .map(() => Array(5).fill("")),
      feedback: Array(maxRounds).fill([]),
      currentRow: 0,
    });
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
          case "playerQuit":
            onPlayerQuit(data);
            break;
          case "gameRestarted":
            onGameRestarted(data);
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

  const handlRestart = async (newAnswer) => {
    console.log("restart game", newAnswer);
    await restartGame(gameId, playerId, newAnswer);
  };

  // Quit the current game
  const handleQuit = async () => {
    await quitGame(gameId, playerId);
  };

  // Start a new game
  const handleStart = async (guessWord) => {
    const { gameId, playerId, maxRounds } = await startGame({
      word: guessWord,
    });

    // multiplayer
    if (guessWord) {
      setIsCreator(true);
    }

    initializeGame(gameId, playerId, maxRounds);
    setIsPlayerJoined("");

    initializeWs(gameId, playerId);
  };

  const handleJoin = async (gameId) => {
    const { playerId, maxRounds } = await joinGame(gameId);

    initializeGame(gameId, playerId, maxRounds);
    setIsPlayerJoined(playerId);

    initializeWs(gameId, playerId);
  };

  const initializeGame = (gameId, playerId, maxRounds) => {
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
  };

  // Handle virtual and physical key presses
  const handleKeyPress = (key) => {
    if (gameOver || showOnboarding) return;

    const currentGuess = guessRef.current;

    if (key === "Enter" && currentGuess.length === 5) {
      handleSubmit(currentGuess); // Submit guess
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

  // Submit the current guess to the server
  const handleSubmit = async (currentGuess) => {
    try {
      await submitGuess(gameId, playerId, currentGuess);
    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  const handleSubmitFromUi = () => {
    handleSubmit(currentGuess);
  };

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
          <button className="submit-button" onClick={handleSubmitFromUi}>
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
          disabled={isCreator}
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
        disabled={currentGuess.length < 5 || isCreator}
      >
        ENTER
      </button>
      <button
        className="key special"
        onClick={() => handleKeyPress("Backspace")}
        disabled={currentGuess.length === 0 || isCreator}
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
        {isCreator && isPlayerJoined && `Player [${isPlayerJoined}] joined`}
        {isCreator && !isPlayerJoined && `Waiting for other player to join`}
      </h3>

      <div className="game-board">
        {renderGrid()}
        {gameOver && (
          <FinishModal
            message={gridState.feedback[gridState.currentRow][0]}
            startNewGame={startSoloGame}
            restartGame={handlRestart}
            quitGame={handleQuit}
            isCreator={isCreator}
            isPlayerJoined={isPlayerJoined}
          />
        )}
      </div>
      {renderKeyboard()}
    </div>
  );
};

export default Game;
