import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { player, gameOver, levelComplete, levelPerfect, playerActiveBonuses } from './state.js';
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

// Draw active player bonuses
export function drawActiveBonuses(ctx) {
    // Early return if no bonuses to avoid unnecessary canvas operations
    if (!playerActiveBonuses || playerActiveBonuses.length === 0) return;
    
    // Group bonuses by type and sum their values
    const groupedBonuses = {};
    playerActiveBonuses.forEach(bonus => {
        if (!groupedBonuses[bonus.type]) {
            groupedBonuses[bonus.type] = 0;
        }
        groupedBonuses[bonus.type] += bonus.value;
    });
    
    // Convert to array of combined bonuses
    const combinedBonuses = Object.entries(groupedBonuses).map(([type, totalValue]) => ({
        type,
        value: totalValue
    }));
    
    const x = 20;
    const y = 50;
    const iconSize = 20;
    const spacing = 25;
    
    // Cache canvas operations
    const originalFillStyle = ctx.fillStyle;
    const originalFont = ctx.font;
    const originalTextAlign = ctx.textAlign;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - 5, y - 5, combinedBonuses.length * spacing + 10, iconSize + 10);
    
    combinedBonuses.forEach((bonus, index) => {
        const iconX = x + (index * spacing);
        
        // Draw bonus icon
        let icon, color;
        switch (bonus.type) {
            case 'fireRate':
                icon = '🔥';
                color = '#00ff00';
                break;
            case 'damage':
                icon = '💥';
                color = '#ff00ff';
                break;
            case 'spread':
                icon = '🎯';
                color = '#00ffff';
                break;
            default:
                icon = '⭐';
                color = '#ffff00';
        }
        
        ctx.fillStyle = color;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(icon, iconX + iconSize/2, y + iconSize/2 + 5);
        
        // Draw bonus value with background for better readability
        const valueText = bonus.value >= 0 ? `+${bonus.value}` : `${bonus.value}`;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // Measure text for background
        const textMetrics = ctx.measureText(valueText);
        const textWidth = textMetrics.width;
        const textHeight = 14;
        const textX = iconX + iconSize/2 - textWidth/2;
        const textY = y + iconSize + 15;
        
        // Draw background for value text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(textX - 4, textY - textHeight/2 - 2, textWidth + 8, textHeight + 4);
        
        // Draw border for value text
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(textX - 4, textY - textHeight/2 - 2, textWidth + 8, textHeight + 4);
        
        // Draw value text (centered vertically in the background)
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.fillText(valueText, iconX + iconSize/2, textY);
    });
    
    // Restore original canvas state
    ctx.fillStyle = originalFillStyle;
    ctx.font = originalFont;
    ctx.textAlign = originalTextAlign;
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
    ctx.fillText('Level Complete!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

    // Perfect Score message
    if (levelPerfect) {
        // Gold gradient effect for perfect score
        const gradient = ctx.createLinearGradient(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 - 20, CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2 + 20);
        gradient.addColorStop(0, '#FFD700'); // Gold
        gradient.addColorStop(0.5, '#FFA500'); // Orange
        gradient.addColorStop(1, '#FFD700'); // Gold
        
        ctx.fillStyle = gradient;
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        
        // Add shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText('🎉 Perfect Score!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

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