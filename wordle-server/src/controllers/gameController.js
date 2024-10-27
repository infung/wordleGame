const { maxRounds, wordList } = require('../config/config');
const Game = require('../models/gameModel');
const { getClients } = require('../webSocketManager');

let games = {}; // Store all active games

// Start a new game and return game and player IDs
const startGame = (req, res) => {
  const answer = wordList[Math.floor(Math.random() * wordList.length)];
  const gameId = Math.random().toString(36).substring(7);
  const playerId = Math.random().toString(36).substring(7);

  const game = new Game(answer, maxRounds);
  game.addPlayer(playerId);

  games[gameId] = game;

  res.json({ gameId, playerId });
};

// Allow a player to join an existing game
const joinGame = (req, res) => {
  const { gameId } = req.body;
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const playerId = Math.random().toString(36).substring(7);
  const game = games[gameId];
  game.addPlayer(playerId);
  res.json({ playerId });
};

// Handle a player's guess submission
const submitGuess = (req, res) => {
  const { gameId, playerId, guess } = req.body;
  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const result = game.makeGuess(playerId, guess);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  // Broadcast the result to all players in the game
  const clients = getClients();
  if (clients[gameId]) {
    Object.values(clients[gameId]).forEach(client => {
      client.send(JSON.stringify({ playerId, guess, feedback: result.feedback, gameOver: result.gameOver }));
    });
  }

    // Send an acknowledgment to the requester
    res.status(200).json({ message: 'Guess processed and broadcasted' });
};

module.exports = { startGame, joinGame, submitGuess };