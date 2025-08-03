import { initializeInput } from './game/input.js';
import { initializeGameLoop, gameLoop } from './game/gameLoop.js';
import { startLevel } from './game/levels.js';

// Game initialization
function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize all game systems
    initializeInput(canvas);
    initializeGameLoop(canvas);
    
    // Start level 1
    startLevel(1);
    
    // Start the game loop
    gameLoop();
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame); 