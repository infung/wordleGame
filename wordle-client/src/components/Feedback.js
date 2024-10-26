import React from 'react';

const Feedback = ({ feedback }) => (
  <div>
    {feedback.map((item, index) => (
      <p key={index}>{item}</p> // Render feedback items
    ))}
  </div>
);

export default Feedback;