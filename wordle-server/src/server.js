const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/game');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api', gameRoutes); // Use game routes under /api path

const PORT = process.env.PORT || 3001; // Define server port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start server