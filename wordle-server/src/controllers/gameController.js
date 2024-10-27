const { wordList, maxRounds } = require('../config/config');

// In-memory storage for active games
let games = {};

// Start a new game and generate a random answer
const startGame = (req, res) => {
  const answer = wordList[Math.floor(Math.random() * wordList.length)]; // Randomly pick a word from predefined word list
  const gameId = Math.random().toString(36).substring(7); // Generate a unique game ID
  games[gameId] = { answer, attempts: 0 }; // Initialize game with answer and attempts
  res.json({ id: gameId, maxRounds: maxRounds }); // Respond with game ID
};

// Submit a guess and provide feedback
const submitGuess = (req, res) => {
  const { gameId, guess } = req.body;
  const game = games[gameId];

  // Check if game exists
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  // Check if max rounds reached
  if (game.attempts >= maxRounds) {
    return res.status(400).json({ error: 'Game over' });
  }

  game.attempts += 1; // Increment attempt count
  const feedback = getFeedback(game.answer, guess); // Get feedback for the guess

  // Check win condition
  if (guess.toLowerCase() === game.answer) {
    delete games[gameId]; // Remove game from active games
    return res.json({ feedback: ['You win!'], gameOver: true });
  }

  // Check game over condition
  if (game.attempts >= maxRounds) {
    delete games[gameId];
    return res.json({ feedback: [`You lose! The word was ${game.answer}!`], gameOver: true });
  }

  res.json({ feedback, gameOver: false }); // Respond with feedback
};

// Generate feedback for the guess
const getFeedback = (answer, guess) => {
  const feedback = [];
  const answerArray = answer.split('');
  const guessArray = guess.toLowerCase().split('');

  // Determine hits, presents, and misses
  guessArray.forEach((letter, index) => {
    if (letter === answerArray[index]) {
      feedback.push('Hit');
    } else if (answerArray.includes(letter)) {
      feedback.push('Present');
    } else {
      feedback.push('Miss');
    }
  });

  return feedback;
};

module.exports = { startGame, submitGuess };