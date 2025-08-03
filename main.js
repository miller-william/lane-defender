import { initializeInput } from './game/input.js';
import { initializeGameLoop, startGameLoop } from './game/gameLoop.js';
import { startLevel } from './game/levels.js';
import { initializeMenu, setGameFunctions, showGameOver } from './game/menu.js';
import { 
    setBullets, setEnemies, setPlayerHealth, setGameOver, 
    setLevelComplete, setBulletDamage, setBulletFireRate 
} from './game/state.js';

// Game state reset function
function resetGameState() {
    // Reset arrays
    setBullets([]);
    setEnemies([]);
    
    // Reset player
    setPlayerHealth(5);
    
    // Reset game state
    setGameOver(false);
    setLevelComplete(false);
    
    // Reset game variables
    setBulletDamage(1);
    setBulletFireRate(500);
    
    console.log('Game state reset complete');
}

// Initialize game systems
function initializeGameSystems(canvas) {
    initializeInput(canvas);
    initializeGameLoop(canvas);
}

// Start a specific level
function startLevelGame(levelNumber) {
    startLevel(levelNumber);
    startGameLoop();
}

// Initialize the game
function initializeGame() {
    // Initialize menu system
    initializeMenu();
    
    // Set up game functions for menu system
    setGameFunctions(initializeGameSystems, startLevelGame, resetGameState);
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame); 