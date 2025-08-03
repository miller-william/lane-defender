import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { player, gameOver, levelComplete } from './state.js';
import { getCurrentLevel } from './levels.js';

// Background image cache
const backgroundCache = {};

export function drawBackground(ctx) {
    const currentLevel = getCurrentLevel();
    if (!currentLevel || !currentLevel.background) {
        // Default background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        return;
    }

    const background = currentLevel.background;

    // Check if it's a color (starts with #)
    if (background.startsWith('#')) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        return;
    }

    // It's an image path
    if (!backgroundCache[background]) {
        const img = new Image();
        img.src = background;
        backgroundCache[background] = img;
    }

    const img = backgroundCache[background];
    if (img.complete) {
        // Draw the image to fill the canvas
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        // Fallback to black while image loads
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

export function drawPlayerHealth(ctx) {
    const barWidth = 200;
    const barHeight = 20;
    const x = 20;
    const y = 20;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health
    const healthRatio = player.health / player.maxHealth;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(x, y, barWidth, barHeight);
}

// Game over screen
export function drawGameOver(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

// Win screen
export function drawWinScreen(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Level Complete text
    ctx.fillStyle = '#00ff00';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Level Complete!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

    // Next Level button
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = CANVAS_WIDTH / 2 - buttonWidth / 2;
    const buttonY = CANVAS_HEIGHT / 2 + 20;

    // Button background
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Button text
    ctx.fillStyle = '#000000';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Next Level', CANVAS_WIDTH / 2, buttonY + 35);

    // Store button coordinates for click detection
    window.nextLevelButton = {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
    };
} 