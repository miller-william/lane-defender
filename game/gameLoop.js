import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { gameOver, levelComplete, isLevelComplete } from './state.js';
import { updatePlayer } from './player.js';
import { createBullet, updateBullets, drawBullets } from './bullets.js';
import { updateEnemies, drawEnemies } from './enemies.js';
import { handleCollisions } from './collisions.js';
import { drawPlayer } from './player.js';
import { drawPlayerHealth, drawGameOver, drawWinScreen, drawBackground, drawActiveBonuses, drawDamageFlash } from './ui.js';
import { updateLevel, getCurrentLevelNumber } from './levels.js';
import { updateParticles, drawParticles } from './particles.js';
import { updateUpgradeBanner, drawUpgradeBanner } from './upgrades.js';
import { showGameOver } from './menu.js';

let ctx = null;
let lastTime = 0;
let gameLoopActive = false;

export function initializeGameLoop(canvas) {
    ctx = canvas.getContext('2d');
    
    // Mobile performance optimization - reduce image smoothing for better performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = 'low';
    }
    
    lastTime = performance.now();
}

// Main game loop
export function gameLoop(currentTime = performance.now()) {
    if (!gameLoopActive) return;
    
    // Calculate real delta time in seconds, capped to prevent spikes
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05);
    lastTime = currentTime;
    
    // Draw background first
    drawBackground(ctx);
    
    if (gameOver) {
        // Player lost - stop game loop and show game over screen
        console.log('Game over triggered - player lost');
        gameLoopActive = false;
        const currentLevel = getCurrentLevelNumber();
        setTimeout(() => showGameOver('lose', currentLevel), 100);
        return; // stop loop
    }
    
    if (isLevelComplete()) {
        // Player won - stop game loop (win screen handled by handleLevelCompletion)
        console.log('Level complete triggered - player won');
        gameLoopActive = false;
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
    
    // Draw damage flash effect on top of everything
    drawDamageFlash(ctx);
    
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