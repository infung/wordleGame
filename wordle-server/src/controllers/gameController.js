const { maxRounds, wordList } = require("../config/config");
const Game = require("../models/gameModel");
const { getClients } = require("../webSocketManager");

let games = {}; // Store all active games

// Start a new game and return game and player IDs
const startGame = (req, res) => {
  const answer = wordList[Math.floor(Math.random() * wordList.length)];
  const gameId = Math.random().toString(36).substring(7);
  const playerId = Math.random().toString(36).substring(7);

  const game = new Game(answer.toLowerCase(), playerId, maxRounds);
  game.addPlayer(playerId);

  if (req.body.word) {
    game.updateAnswer(req.body.word);
  }

  games[gameId] = game;

  res.json({ gameId, playerId, maxRounds });
};

// Allow a player to join an existing game
const joinGame = (req, res) => {
  const { gameId, word } = req.body;
  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  const playerId = Math.random().toString(36).substring(7);
  game.addPlayer(playerId);

  const clients = getClients();
  if (clients[gameId]) {
    Object.values(clients[gameId]).forEach((client) => {
      client.send(
        JSON.stringify({
          type: "playerJoined",
          playerId,
          creator: game.creator,
        })
      );
    });
  }

  res.json({ playerId, maxRounds });
};

// Handle a player's guess submission
const submitGuess = (req, res) => {
  const { gameId, playerId, guess } = req.body;
  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  const result = game.makeGuess(playerId, guess);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  // Broadcast the result to all players in the game
  const clients = getClients();
  if (clients[gameId]) {
    Object.values(clients[gameId]).forEach((client) => {
      client.send(
        JSON.stringify({
          type: "guessResult",
          playerId,
          guess,
          ...result,
        })
      );
    });
  }

  // Send an acknowledgment to the requester
  res.status(200).json({ message: "Guess processed and broadcasted" });
};

// Restart an existing game with a new answer
const restartGame = (req, res) => {
  const { gameId, playerId, newAnswer } = req.body;
  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  game.restartGame(playerId, newAnswer.toLowerCase());

  // Notify all players that the game has been restarted
  const clients = getClients();
  if (clients[gameId]) {
    Object.values(clients[gameId]).forEach((client) => {
      client.send(
        JSON.stringify({
          type: "gameRestarted",
          creator: playerId,
          playerId: game.creator,
          maxRounds: game.maxRounds,
        })
      );
    });
  }

  res.status(200).json({ message: "Game restarted" });
};

// Handle a player quitting the game
const quitGame = (req, res) => {
  const { gameId, playerId } = req.body;
  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  // Notify other players that a player has quit
  const clients = getClients();
  if (clients[gameId]) {
    Object.values(clients[gameId]).forEach((client) => {
      client.send(
        JSON.stringify({
          type: "playerQuit",
          playerId,
          creator: game.creator,
        })
      );
    });
  }

  delete games[gameId];

  res.status(200).json({ message: "Game quited" });
};

module.exports = { startGame, joinGame, submitGuess, quitGame, restartGame };
