import React, { useState } from "react";
import Game from "./components/Game";
import InstructionsModal from "./components/InstructionsModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "./App.css";

const App = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  const openInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Wordle Game</h1>
        <div className="help-section" onClick={openInstructions}>
          <span className="help-text">How to Play</span>
          <HelpOutlineIcon className="help-icon" />
        </div>
      </div>
      <Game />
      <InstructionsModal show={showInstructions} onClose={closeInstructions} />
    </div>
  );
};

export default App;
