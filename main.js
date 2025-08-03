import { initializeInput } from './game/input.js';
import { initializeDevPanel } from './devpanel.js';
import { initializeGameLoop, gameLoop } from './game/gameLoop.js';
import { startLevel } from './game/levels.js';

// Game initialization
function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize all game systems
    initializeInput(canvas);
    initializeDevPanel();
    initializeGameLoop(canvas);
    
    // Start level 1
    startLevel(1);
    
    // Start the game loop
    gameLoop();
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame); 