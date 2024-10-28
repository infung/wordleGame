# Wordle Game Setup and Instructions

## Prerequisites

Ensure you have the following installed:

- Node.js (v22.4.0 or above)
- npm (v10.8.1 or above)

## Cloning the Repository

To set up the project, first clone the repository:

```bash
git clone https://github.com/infung/wordleGame.git

cd wordleGame
```

## Backend Setup (Express.js)

1. **Navigate to the backend directory:**

   ```bash
   cd wordle-server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the server:**

   - Update the configuration in `src/config/config.js`:

     ```javascript
     module.exports = {
        maxRounds: 6, // Maximum number of rounds allowed
        wordList: ['apple', 'grape', 'peach', 'berry', 'melon'], // List of possible answers
     };
     ```

4. **Start the server:**

   ```bash
   node src/server.js
   ```

   The server will start on `http://localhost:3001`.


## Frontend Setup (React)

1. **Navigate to the frontend directory:**

   ```bash
   cd wordle-client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the client:**

   - Ensure the client is pointing to the correct server URL. Update the API endpoint in your React app if necessary in `src/api.js`

    ```javascript
     // Base URL for the API
    const API_URL = 'http://localhost:3001';
     ```

4. **Start the frontend:**

   ```bash
   npm start
   ```

   The app will open in the default web browser at `http://localhost:3000`.

## Testing the Game

### Single Player Mode:
1. **Start the React Client:**
   - Make sure you have start the React application.

2. **Enter Single Player Mode:**
   - Click the 'Solo Play' button to initiate Single Player Mode.

3. **View Instructions:**
   - Click the question icon at the tool bar to read the game instructions.

4. **Play the Game:**
   - Attempt to guess the word within the maximum number of rounds.

5. **Restart the Game:**
   - Restart the game after a win or loss and try again.

### Multiplayer Mode:

1. **Start Two React Clients:**
   - Run two instances of the React application (e.g., open two terminal tabs to run `npm start` on different port and using two browser tabs).

2. **Player A Setup:**
   - Player A clicks the 'Multiplayers Play' button to enter Multiplayer Mode.
   - Provide a 5-letter word in the second input box.
   - Click 'Start New Game' to enter the game room and receive a room ID.

3. **Share Room ID:**
   - Player A shares the room code with Player B.

4. **Player B Setup:**
   - Player B clicks the 'Multiplayers Play' button to enter Multiplayer Mode.
   - Enter the room code in the first input box.
   - Click 'Join Room' to enter the game room.

5. **Player B Gameplay:**
   - Attempt to guess the word within the maximum number of rounds.

6. **Start a New Game:**
   - If Player B loses or wins, provide a new 5-letter word in the popup window input box to start a new game for Player A to guess.


## Game Rules

1. **Objective:**
   - Guess the correct 5-letter word within a limited number of attempts.

2. **Gameplay:**
   - Enter a 5-letter word as your guess.
   - After each guess, receive feedback on each letter:
     - **Green:** Correct letter in the correct position.
     - **Yellow:** Correct letter in the wrong position.
     - **Gray:** Incorrect letter.

3. **Single Player Mode:**
   - You have a fixed number of rounds to guess the word.
   - Use the clues provided to make educated guesses.

4. **Multiplayer Mode:**
   - Player A sets a word for Player B to guess.
   - Player B attempts to guess the word within the allowed rounds.
   - Roles switch after each round, allowing Player B to set a new word if the previous round concludes.

5. **Winning and Losing:**
   - Win by guessing the word correctly within the allowed attempts.
   - Lose if you fail to guess the word within the given rounds.

6. **Hints and Tips:**
   - The virtual keyboard displays different colors based on the frequency of each key pressed.
   - Pay attention to feedback to refine your guesses.

7. **Restart:**
   - After a win or loss, start a new game to play again.


## Considerations

- **Trade-offs:**
  - **Real-time Updates:** Implementing real-time updates between players may require WebSockets. This enhances the user experience by providing instant feedback but increases complexity and maintenance due to additional server-client communication layers.
  - **Virtual Keyboard Display:** Using different colors on the virtual keyboard to indicate the frequency of each letter used helps players identify common letters. This improves user experience but adds complexity to UI logic. It was chosen over simpler interfaces to provide strategic insights to players.

- **Security:**
  - Ensure that the server-side logic does not expose the answer to the client until the game concludes. This prevents cheating and maintains game integrity.

## Future Enhancements

- Implement a leaderboard to track player performance.
- Enhance UI/UX for better player experience.

❤ Enjoy playing Wordle with your friends! 🤩🤩