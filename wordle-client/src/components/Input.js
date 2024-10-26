import React, { useState } from 'react';

const Input = ({ onSubmit }) => {
  const [guess, setGuess] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent bubbling
    if (guess.length === 5) {
      onSubmit(guess); // Call onSubmit with current guess
      setGuess(''); // Clear input
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value.toUpperCase())} // Convert input to uppercase
        maxLength={5}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Input;