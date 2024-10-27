import React from "react";

const FinishModal = ({ message, startNewGame, quitGame }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <p className="feedback-message">{message}</p>{" "}
        {/* Display the feedback message */}
        <button className="restart-button" onClick={startNewGame}>
          Start a New Game
        </button>
        <button className="restart-button" onClick={quitGame}>
          Quit
        </button>
      </div>
    </div>
  );
};

export default FinishModal;
