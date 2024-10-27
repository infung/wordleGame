const express = require('express');
const { startGame, submitGuess } = require('../controllers/gameController');
const { validateGuess } = require('../middleware/validate');
const router = express.Router();

// Define routes for game actions
router.post('/start', startGame); // Start a new game
router.post('/join', joinGame); // Join an existing game
router.post('/guess', validateGuess, submitGuess); // Submit a guess

module.exports = router;