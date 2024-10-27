import React from "react";
import "./Snackbar.css"; // Importing CSS for styling

const Snackbar = ({ message, isOpen, onClose }) => {
  return (
    <div className={`snackbar ${isOpen ? "show" : ""}`}>
      {message}
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};export default Snackbar;
