import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { player, gameOver, levelComplete, levelPerfect, playerActiveBonuses } from './state.js';
import { getCurrentLevel } from './levels.js';

// Background image cache
const backgroundCache = {};
let backgroundOffset = 0;
const backgroundScrollSpeed = -0.5; // negative scroll speed

export function drawBackground(ctx) {
    const currentLevel = getCurrentLevel();
    console.log('Current level data:', currentLevel);
    
    if (!currentLevel || !currentLevel.background) {
        // Default background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        return;
    }

    // Draw base color first for depth
    const baseColor = currentLevel.background;
    if (baseColor && baseColor.startsWith('#')) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Check if level has a background image
    if (currentLevel.backgroundImage) {
        const imagePath = currentLevel.backgroundImage;
        console.log(`Loading background image: ${imagePath}`);
        
        // Load image if not cached
        if (!backgroundCache[imagePath]) {
            const img = new Image();
            img.src = imagePath;
            backgroundCache[imagePath] = img;
            console.log(`Caching new background image: ${imagePath}`);
        }

        const img = backgroundCache[imagePath];
        if (img.complete && img.naturalWidth > 0) {
            console.log(`Drawing background image: ${imagePath}, size: ${img.naturalWidth}x${img.naturalHeight}`);
            // Calculate image dimensions to fill canvas width
            const imageAspectRatio = img.naturalWidth / img.naturalHeight;
            const canvasAspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
            
            let drawWidth, drawHeight;
            if (imageAspectRatio > canvasAspectRatio) {
                // Image is wider - scale to fit canvas height
                drawHeight = CANVAS_HEIGHT;
                drawWidth = drawHeight * imageAspectRatio;
            } else {
                // Image is taller - scale to fit canvas width
                drawWidth = CANVAS_WIDTH;
                drawHeight = drawWidth / imageAspectRatio;
            }

            // Calculate how many tiles we need to cover the canvas
            const tilesNeeded = Math.ceil(CANVAS_HEIGHT / drawHeight) + 2;
            
            // Calculate the starting Y position (include tiles above visible area)
            const startY = -backgroundOffset - drawHeight;
            
            // Draw tiled background with scrolling - SEAMLESS DOWNWARD SCROLLING
            for (let i = 0; i < tilesNeeded; i++) {
                const y = startY + (i * drawHeight);
                ctx.drawImage(img, 0, y, drawWidth, drawHeight);
            }

            // Update scroll position with modulo to keep it safely within range
            backgroundOffset = (backgroundOffset + backgroundScrollSpeed) % drawHeight;
            
            // Debug: log the direction and offset
            console.log(`Background flowing DOWNWARD, offset: ${backgroundOffset.toFixed(2)}`);
        } else {
            // Fallback to base color while image loads
            if (baseColor && baseColor.startsWith('#')) {
                ctx.fillStyle = baseColor;
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        }
    } else {
        // No background image - just use base color
        if (baseColor && baseColor.startsWith('#')) {
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
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
    const iconSize = 24; // Increased icon size for better alignment
    const spacing = 35; // Increased spacing to accommodate larger numbers
    
    // Cache canvas operations
    const originalFillStyle = ctx.fillStyle;
    const originalFont = ctx.font;
    const originalTextAlign = ctx.textAlign;
    const originalTextBaseline = ctx.textBaseline;
    
    // Calculate total width needed for all bonuses
    const totalWidth = combinedBonuses.length * spacing;
    
    // Wood-colored background for bonus counter
    const woodGradient = ctx.createLinearGradient(x - 5, y - 5, x + totalWidth + 5, y + iconSize + 20);
    woodGradient.addColorStop(0, '#8B4513');
    woodGradient.addColorStop(0.5, '#A0522D');
    woodGradient.addColorStop(1, '#CD853F');
    ctx.fillStyle = woodGradient;
    ctx.fillRect(x - 5, y - 5, totalWidth + 10, iconSize + 25); // Increased height for text
    
    // Wood border
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 5, y - 5, totalWidth + 10, iconSize + 25);
    
    combinedBonuses.forEach((bonus, index) => {
        const iconX = x + (index * spacing);
        
        // Draw bonus icon
        let icon, color;
        switch (bonus.type) {
            case 'fireRate':
                icon = '🌪️';
                color = '#4a90e2';
                break;
            case 'damage':
                icon = '🌊';
                color = '#6ba3e8';
                break;
            case 'spread':
                icon = '💦';
                color = '#87ceeb';
                break;
            default:
                icon = '⭐';
                color = '#ffff00';
        }
        
        // Draw icon (properly centered)
        ctx.fillStyle = color;
        ctx.font = '20px Arial'; // Increased font size
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, iconX + spacing/2, y + iconSize/2);
        
        // Draw bonus value with background for better readability
        const valueText = bonus.value >= 0 ? `+${bonus.value}` : `${bonus.value}`;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text for background
        const textMetrics = ctx.measureText(valueText);
        const textWidth = textMetrics.width;
        const textHeight = 14;
        const textX = iconX + spacing/2 - textWidth/2;
        const textY = y + iconSize + 8; // Better vertical spacing
        
        // Draw background for value text (wood-themed)
        ctx.fillStyle = '#654321';
        ctx.fillRect(textX - 4, textY - textHeight/2 - 2, textWidth + 8, textHeight + 4);
        
        // Draw border for value text
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.strokeRect(textX - 4, textY - textHeight/2 - 2, textWidth + 8, textHeight + 4);
        
        // Draw value text
        ctx.fillStyle = '#F5DEB3';
        ctx.fillText(valueText, iconX + spacing/2, textY);
    });
    
    // Restore original canvas state
    ctx.fillStyle = originalFillStyle;
    ctx.font = originalFont;
    ctx.textAlign = originalTextAlign;
    ctx.textBaseline = originalTextBaseline;
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