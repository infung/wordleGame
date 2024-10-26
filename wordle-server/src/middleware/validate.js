// Middleware to validate the guess input
const validateGuess = (req, res, next) => {
  const { guess } = req.body;
  // Check if guess is a 5-letter word containing only alphabets
  if (!guess || guess.length !== 5 || !/^[a-zA-Z]+$/.test(guess)) {
    return res.status(400).json({ error: 'Invalid guess format' });
  }
  next(); // Proceed to next middleware or route handler
};

module.exports = { validateGuess };