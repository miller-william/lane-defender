import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { player, gameOver, levelComplete, levelPerfect, playerActiveBonuses } from './state.js';
import { getCurrentLevel } from './levels.js';

// Background image cache
const backgroundCache = {};
let backgroundOffset = 0;
const backgroundScrollSpeed = -0.5; // negative scroll speed

// Damage flash effect system
let damageFlashActive = false;
let damageFlashStartTime = 0;
const damageFlashDuration = 300; // milliseconds
const damageFlashColor = 'rgba(139, 69, 19, 0.4)'; // Semi-transparent brown (saddle brown)

export function drawBackground(ctx) {
    const currentLevel = getCurrentLevel();
    
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
        
        // Load image if not cached
        if (!backgroundCache[imagePath]) {
            const img = new Image();
            img.src = imagePath;
            backgroundCache[imagePath] = img;
        }

        const img = backgroundCache[imagePath];
        if (img.complete && img.naturalWidth > 0) {
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

// Trigger damage flash effect
export function triggerDamageFlash() {
    damageFlashActive = true;
    damageFlashStartTime = performance.now();
    console.log('Damage flash triggered');
}

// Draw damage flash effect if active
export function drawDamageFlash(ctx) {
    if (!damageFlashActive) return;
    
    const currentTime = performance.now();
    const elapsed = currentTime - damageFlashStartTime;
    
    if (elapsed >= damageFlashDuration) {
        // Flash duration expired, deactivate
        damageFlashActive = false;
        return;
    }
    
    // Calculate flash intensity (fade out over time)
    const remainingTime = damageFlashDuration - elapsed;
    const intensity = Math.min(1, remainingTime / damageFlashDuration);
    
    // Create semi-transparent brown pollution overlay
    ctx.fillStyle = `rgba(139, 69, 19, ${0.4 * intensity})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawPlayerHealth(ctx) {
    const barWidth = 200;
    const barHeight = 20;
    const x = 20;
    const y = 20;

    // Background (darker blue for river bed)
    ctx.fillStyle = '#1a4a6b';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health (river water - blue gradient or dark green when depleted)
    const healthRatio = player.health / player.maxHealth;
    if (healthRatio > 0) {
        // Create wavy river water effect
        ctx.beginPath();
        
        // Start at the left edge
        ctx.moveTo(x, y);
        
        // Create wavy top edge that follows the health ratio
        const waveAmplitude = 2; // Height of the waves
        const waveFrequency = 0.1; // How many waves
        const currentWidth = barWidth * healthRatio; // Width based on current health
        
        for (let i = 0; i <= currentWidth; i += 2) {
            const waveY = y + Math.sin(i * waveFrequency) * waveAmplitude;
            ctx.lineTo(x + i, waveY);
        }
        
        // Create wavy bottom edge that follows the health ratio
        for (let i = currentWidth; i >= 0; i -= 2) {
            const waveY = y + barHeight + Math.sin(i * waveFrequency) * waveAmplitude;
            ctx.lineTo(x + i, waveY);
        }
        
        // Close the path back to the start
        ctx.closePath();
        
        // Fill with water gradient
        const waterGradient = ctx.createLinearGradient(x, y, x + currentWidth, y);
        waterGradient.addColorStop(0, '#4a90e2');      // Light blue
        waterGradient.addColorStop(0.5, '#87ceeb');    // Sky blue
        waterGradient.addColorStop(1, '#b0e0e6');      // Powder blue
        ctx.fillStyle = waterGradient;
        ctx.fill();
    } else {
        // Dark green when health is completely depleted
        ctx.fillStyle = '#0d4d0d';
        ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Border (river bank - sandy brown) - also wavy
    ctx.strokeStyle = '#d2b48c';
    ctx.lineWidth = 2;
    
    // Draw wavy border
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Top edge waves
    const waveAmplitude = 2;
    const waveFrequency = 0.1;
    for (let i = 0; i <= barWidth; i += 2) {
        const waveY = y + Math.sin(i * waveFrequency) * waveAmplitude;
        ctx.lineTo(x + i, waveY);
    }
    
    // Right edge
    ctx.lineTo(x + barWidth, y + barHeight);
    
    // Bottom edge waves
    for (let i = barWidth; i >= 0; i -= 2) {
        const waveY = y + barHeight + Math.sin(i * waveFrequency) * waveAmplitude;
        ctx.lineTo(x + i, waveY);
    }
    
    // Left edge
    ctx.lineTo(x, y);
    ctx.stroke();

    // "River Health" text overlay with black outline for better visibility
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw black outline first
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText('River Health', x + barWidth / 2, y + barHeight / 2);
    
    // Draw white text on top
    ctx.fillStyle = '#ffffff';
    ctx.fillText('River Health', x + barWidth / 2, y + barHeight / 2);
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