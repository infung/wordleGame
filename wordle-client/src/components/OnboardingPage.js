import React, { useState, useRef, Fragment } from "react";
import "./OnboardingPage.css";

// Component for the onboarding page
const OnboardingPage = ({ onStart, onJoin }) => {
  const roomRef = useRef(null);
  const wordRef = useRef(null);

  const [isMultiPlayer, setIsMultiPlayer] = useState(false);

  const goBack = () => {
    setIsMultiPlayer(false);
  };

  // toggle to multiplayer mode
  const onMultiPlayer = () => {
    setIsMultiPlayer(true);
  };

  const startMultiPlayerGame = () => {
    onStart(wordRef.current.value);
  };

  const startSoloGame = () => {
    onStart("");
  };

  const joinGame = () => {
    onJoin(roomRef.current.value);
  };

  return (
    <div className="onboarding">
      <div className="icon-row">
        <span className="icon-tile">W</span>
        <span className="icon-tile">O</span>
        <span className="icon-tile">R</span>
        <span className="icon-tile">D</span>
        <span className="icon-tile">L</span>
        <span className="icon-tile">E</span>
      </div>
      <h1>Welcome to Wordle Game</h1>
      <p>Guess the word in as few tries as possible!</p>

      {!isMultiPlayer ? (
        <Fragment>
          {/* Button to start solo game */}
          <button className="play-button" onClick={startSoloGame}>
            Solo Play
          </button>

          {/* Button to start multiplayer game */}
          <button className="play-button" onClick={onMultiPlayer}>
            Multiplayer Play
          </button>
        </Fragment>
      ) : (
        <Fragment>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              ref={roomRef}
              placeholder="Enter room code"
              className="room-input"
            />
            <button
              style={{ marginTop: "40px" }}
              className="join-button"
              onClick={joinGame}
            >
              Join Room
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              ref={wordRef}
              placeholder="Enter words"
              className="room-input"
            />
            <button
              className="play-button"
              style={{ marginTop: "40px" }}
              onClick={startMultiPlayerGame}
            >
              Start New Room
            </button>
          </div>

          <button className="play-button" onClick={goBack}>
            Back
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default OnboardingPage;
