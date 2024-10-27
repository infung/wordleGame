
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const gameRoutes = require('./routes/game');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/api', gameRoutes);
setupWebSocket(server); // Initialize WebSocket

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
