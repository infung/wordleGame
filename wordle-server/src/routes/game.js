const express = require('express');
const { startGame, submitGuess } = require('../controllers/gameController');
const { validateGuess } = require('../middleware/validate');
const router = express.Router();

// Route to start a new game
router.post('/start', startGame);

// Route to submit a guess with validation
router.post('/guess', validateGuess, submitGuess);

module.exports = router;