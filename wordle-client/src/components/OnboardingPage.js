import React from 'react';
import './OnboardingPage.css';

// Component for the onboarding page
const OnboardingPage = ({ onStart }) => {
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
      <button className="play-button" onClick={onStart}>Play</button> {/* Button to start game */}
    </div>
  );
};

export default OnboardingPage;