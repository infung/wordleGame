import React from 'react';
import './InstructionsModal.css';

// Modal component for displaying game instructions
const InstructionsModal = ({ show, onClose }) => {
    if (!show) return null; // Do not render if modal is not shown

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>How To Play</h2>
          <p>Guess the Wordle in 6 tries.</p>
          <ul>
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was to the word.</li>
          </ul>
          <h3>Solo Play</h3>
          <ul>
            <li>You have a fixed number of rounds to guess the word.</li>
            <li>Use the clues provided to make educated guesses.</li>
          </ul>
          <h3>Multiplayers Play</h3>
          <ul>
            <li>Player A sets a word for Player B to guess.</li>
            <li>Player B attempts to guess the word within the allowed rounds.</li>
            <li>Roles switch after each round, allowing Player B to set a new word if the previous round concludes.</li>
          </ul>
          <h3>Examples</h3>
          <div className="example">
            <div className="example-row">
              <span className="tile green">W</span>
              <span className="tile">O</span>
              <span className="tile">R</span>
              <span className="tile">D</span>
              <span className="tile">Y</span>
              <p><strong>W</strong> is in the word and in the correct spot.</p>
            </div>
            <div className="example-row">
              <span className="tile">L</span>
              <span className="tile yellow">I</span>
              <span className="tile">G</span>
              <span className="tile">H</span>
              <span className="tile">T</span>
              <p><strong>I</strong> is in the word but in the wrong spot.</p>
            </div>
            <div className="example-row">
              <span className="tile">R</span>
              <span className="tile">O</span>
              <span className="tile">G</span>
              <span className="tile grey">U</span>
              <span className="tile">E</span>
              <p><strong>U</strong> is not in the word in any spot.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default InstructionsModal;