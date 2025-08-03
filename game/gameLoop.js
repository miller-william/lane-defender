import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { gameOver, levelComplete, isLevelComplete } from './state.js';
import { updatePlayer } from './player.js';
import { createBullet, updateBullets, drawBullets } from './bullets.js';
import { updateEnemies, drawEnemies } from './enemies.js';
import { handleCollisions } from './collisions.js';
import { drawPlayer } from './player.js';
import { drawPlayerHealth, drawGameOver, drawWinScreen, drawBackground } from './ui.js';
import { updateLevel } from './levels.js';
import { updateParticles, drawParticles } from './particles.js';

let ctx = null;
let lastTime = 0;

export function initializeGameLoop(canvas) {
    ctx = canvas.getContext('2d');
    lastTime = performance.now();
}

// Main game loop
export function gameLoop(currentTime = performance.now()) {
    // Calculate delta time in milliseconds
    const deltaTime = (currentTime - lastTime);
    lastTime = currentTime;
    
    // Draw background first
    drawBackground(ctx);
    
    if (gameOver) {
        drawGameOver(ctx);
        return; // stop loop
    }
    
    if (isLevelComplete()) {
        drawWinScreen(ctx);
        return; // stop loop
    }
    
    // Update game state
    updatePlayer();
    createBullet();
    updateBullets();
    updateLevel(); // Update level spawning
    updateEnemies();
    handleCollisions();
    updateParticles(deltaTime); // Update particles
    
    // Draw everything
    drawParticles(ctx); // Draw particles first after background
    drawPlayer(ctx);
    drawBullets(ctx);
    drawEnemies(ctx);
    drawPlayerHealth(ctx);
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
} 