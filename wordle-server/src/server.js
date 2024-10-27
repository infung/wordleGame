
const express = require('express');
const http = require('http');
const cors = require('cors');

const gameRoutes = require('./routes/game');

const { setupWebSocket } = require('./webSocketManager');

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/api', gameRoutes);
setupWebSocket(server); // Initialize WebSocket

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
