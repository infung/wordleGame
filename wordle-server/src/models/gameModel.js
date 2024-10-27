// Game class to manage game state and logic
class Game {
    constructor(answer, maxRounds) {
      this.answer = answer; // The correct answer for the game
      this.players = {}; // Object to store players' data
      this.maxRounds = maxRounds; // Maximum attempts allowed
    }
  
    // Add a new player to the game
    addPlayer(playerId) {
      this.players[playerId] = { attempts: 0, guesses: [] };
    }
  
    // Process a player's guess and return feedback
    makeGuess(playerId, guess) {
      if (!this.players[playerId]) return { error: 'Player not found' };
  
      const player = this.players[playerId];
      if (player.attempts >= this.maxRounds) return { error: 'Game over' };
  
      player.attempts += 1;
      const feedback = this.getFeedback(guess);
  
      player.guesses.push({ guess, feedback });
  
      // Check if the guess is correct
      if (guess.toLowerCase() === this.answer) {
        return { feedback: ['You win!'], gameOver: true };
      }
  
      // Check if the player has used all attempts
      if (player.attempts >= this.maxRounds) {
        return { feedback: [`You lose! The word was ${this.answer}`], gameOver: true };
      }
  
      return { feedback, gameOver: false };
    }
  
    // Generate feedback for a guess
    getFeedback(guess) {
      const feedback = [];
      const answerArray = this.answer.split('');
      const guessArray = guess.toLowerCase().split('');
  
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
    }
  }
  
  module.exports = Game;