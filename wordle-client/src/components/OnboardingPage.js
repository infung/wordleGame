import React, { useEffect, useState, useRef, Fragment } from "react";
import Snackbar from "./Snackbar";
import "./OnboardingPage.css";

// Component for the onboarding page
const OnboardingPage = ({ onStart, onJoin }) => {
  const roomRef = useRef(null);
  const wordRef = useRef(null);

  const [errorState, setErrorState] = useState({ show: false, message: "" });
  const [canJoin, setCanJoin] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [isMultiPlayer, setIsMultiPlayer] = useState(false);

  const dismissError = () => {
    setErrorState({ show: false, message: "" });
  };

  const handleWordChange = (e) => {
    setCanStart(e.target.value.length === 5);
  };

  const handleRoomChange = (e) => {
    setCanJoin(e.target.value.length > 0);
  };

  const goBack = () => {
    setIsMultiPlayer(false);
  };

  // toggle to multiplayer mode
  const onMultiPlayer = () => {
    setIsMultiPlayer(true);
  };

  const startMultiPlayerGame = async () => {
    try {
      onStart(wordRef.current.value.toLowerCase());
    } catch (error) {
      setErrorState({
        show: true,
        message: "Unknown error occurred, please try again later",
      });
    }
  };

  const startSoloGame = async () => {
    try {
      onStart("");
    } catch (error) {
      setErrorState({
        show: true,
        message: "Unknown error occurred, please try again later",
      });
    }
  };

  const joinGame = async () => {
    try {
      await onJoin(roomRef.current.value);
    } catch (error) {
      if (error.message.includes("404")) {
        setErrorState({ show: true, message: "Room not found" });
      } else {
        setErrorState({
          show: true,
          message: "Unknown error occurred, please try again later",
        });
      }
    }
  };

  useEffect(() => {
    if (errorState.show) {
      setTimeout(() => {
        dismissError();
      }, 3000);
    }
  }, [errorState.show]);

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
              onChange={handleRoomChange}
              placeholder="  Enter room code"
              className="room-input"
            />
            <button
              style={{ marginTop: "40px" }}
              className="join-button"
              disabled={!canJoin}
              onClick={joinGame}
            >
              Join Room
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              ref={wordRef}
              onChange={handleWordChange}
              placeholder="  Enter a valid 5-letter word"
              className="room-input"
            />
            <button
              className="play-button"
              style={{ marginTop: "40px" }}
              disabled={!canStart}
              onClick={startMultiPlayerGame}
            >
              Start New Game
            </button>
          </div>

          <button className="play-button" onClick={goBack}>
            Back
          </button>
        </Fragment>
      )}

      <Snackbar
        message={errorState.message}
        isOpen={errorState.show}
        onClose={dismissError}
      />
    </div>
  );
};

export default OnboardingPage;
