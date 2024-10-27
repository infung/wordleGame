const WebSocket = require('ws');

let clients = {};

// Initialize WebSocket server
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const { type, gameId, playerId } = JSON.parse(message);
      if (type === 'join') {
        if (!clients[gameId]) clients[gameId] = {};
        clients[gameId][playerId] = ws;
      }
    });

    ws.on('close', () => {
      // Handle client disconnection
      Object.keys(clients).forEach(gameId => {
        Object.keys(clients[gameId]).forEach(playerId => {
          if (clients[gameId][playerId] === ws) {
            delete clients[gameId][playerId];
          }
        });
      });
    });
  });
}

// Get connected clients
function getClients() {
  return clients;
}

module.exports = { setupWebSocket, getClients };