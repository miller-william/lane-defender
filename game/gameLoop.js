import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { gameOver, levelComplete, isLevelComplete } from './state.js';
import { updatePlayer } from './player.js';
import { createBullet, updateBullets, drawBullets } from './bullets.js';
import { updateEnemies, drawEnemies } from './enemies.js';
import { handleCollisions } from './collisions.js';
import { drawPlayer } from './player.js';
import { drawPlayerHealth, drawGameOver, drawWinScreen, drawBackground, drawActiveBonuses } from './ui.js';
import { updateLevel } from './levels.js';
import { updateParticles, drawParticles } from './particles.js';
import { updateUpgradeBanner, drawUpgradeBanner } from './upgrades.js';
import { showGameOver } from './menu.js';

let ctx = null;
let lastTime = 0;
let gameLoopActive = false;

export function initializeGameLoop(canvas) {
    ctx = canvas.getContext('2d');
    lastTime = performance.now();
}

// Main game loop
export function gameLoop(currentTime = performance.now()) {
    if (!gameLoopActive) return;
    
    // Calculate real delta time in seconds, capped to prevent spikes
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05);
    lastTime = currentTime;
    
    // Debug delta time occasionally
    if (Math.random() < 0.01) { // Log 1% of the time
        console.log(`Delta time: ${deltaTime.toFixed(4)}s`);
    }
    
    // Draw background first
    drawBackground(ctx);
    
    // Debug game state occasionally
    if (Math.random() < 0.01) { // Log 1% of the time
        console.log(`Game state: gameOver=${gameOver}, isLevelComplete=${isLevelComplete()}`);
    }
    
    if (gameOver) {
        // Player lost - stop game loop and show game over screen
        console.log('Game over triggered - player lost');
        gameLoopActive = false;
        setTimeout(() => showGameOver('lose'), 100);
        return; // stop loop
    }
    
    if (isLevelComplete()) {
        // Player won - stop game loop and show win screen
        console.log('Level complete triggered - player won');
        gameLoopActive = false;
        setTimeout(() => showGameOver('win'), 100);
        return;
    }
    
    // Update game state using real delta time
    updatePlayer();
    createBullet();
    updateBullets(deltaTime);
    updateLevel(); // Update level spawning
    updateEnemies(deltaTime);
    updateUpgradeBanner(deltaTime); // Update upgrade banner
    handleCollisions();
    updateParticles(deltaTime); // Pass delta time in seconds
    
    // Draw everything
    drawParticles(ctx); // Draw particles first after background
    drawPlayer(ctx);
    drawBullets(ctx);
    drawEnemies(ctx);
    drawUpgradeBanner(ctx); // Draw upgrade banner on top
    drawPlayerHealth(ctx);
    drawActiveBonuses(ctx); // Draw active bonuses
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start the game loop
export function startGameLoop() {
    gameLoopActive = true;
    lastTime = performance.now();
    gameLoop();
}

// Stop the game loop
export function stopGameLoop() {
    gameLoopActive = false;
} 