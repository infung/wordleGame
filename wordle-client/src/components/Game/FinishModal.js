import React, { useState, useRef } from "react";

const FinishModal = ({
  message,
  startNewGame,
  restartGame,
  quitGame,
  isCreator,
  isPlayerJoined,
}) => {
  const startGame = () => {
    if (isPlayerJoined !== "") {
      restartGame(wordRef.current.value.toLowerCase());
    } else {
      startNewGame();
    }
  };

  const wordRef = useRef(null);
  const [canStart, setCanStart] = useState(false);

  const handleWordChange = (e) => {
    setCanStart(e.target.value.length === 5);
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        {/* Display the feedback message */}
        <p className="feedback-message">{message}</p>{" "}
        {/* Single Player Mode*/}
        {!isCreator && isPlayerJoined === "" && (
          <button
            className="restart-button"
            onClick={startGame}
          >
            Start a New Game
          </button>
        )}
        {/* MultiPlayers Mode*/}
        {!isCreator && isPlayerJoined !== "" && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input
              type="text"
              ref={wordRef}
              style={{ marginTop: "20px" }}
              onChange={handleWordChange}
              placeholder="  Enter words"
              className="room-input"
            />
            <button
              className="restart-button"
              onClick={startGame}
              disabled={!canStart}
            >
              Restart
            </button>
          </div>
        )}
        {isCreator && isPlayerJoined !== "" && (
          <p>It will be your component's turn next, please wait</p>
        )}
        <button className="restart-button" onClick={quitGame}>
          Quit
        </button>
      </div>
    </div>
  );
};

export default FinishModal;
