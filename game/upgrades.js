import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { 
    activeUpgradeEvent, 
    upgradeBannerY, 
    upgradeDecisionMade, 
    player, 
    applyPlayerBonus, 
    clearUpgradeEvent,
    setUpgradeBannerY,
    setUpgradeDecisionMade
} from './state.js';

// Function to draw board image
function drawBoard(ctx, x, y, width, height) {
    if (!boardImage) {
        return;
    }
    
    // Save context
    ctx.save();
    
    // Draw the board image, filling the full width while maintaining aspect ratio
    const aspectRatio = boardImage.width / boardImage.height;
    
    // Focus on width - make board fill the full allocated width and extend slightly beyond
    let drawWidth = width * 1.2; // 20% wider than allocated space
    let drawHeight = drawWidth / aspectRatio;
    
    // No height restriction - let the board scale naturally
    // Center the board horizontally in the allocated space
    const offsetX = x + (width - drawWidth) / 2; // Center horizontally
    const offsetY = y + (height - drawHeight) / 2; // Center vertically
    
    ctx.drawImage(boardImage, offsetX, offsetY, drawWidth, drawHeight);
    
    // Restore context
    ctx.restore();
}

// Load banner images
let frogBannerImage = null;
let scientistBannerImage = null;
let boardImage = null;

const frogBannerImg = new Image();
frogBannerImg.onload = function() {
    frogBannerImage = this;
    console.log('Frog banner image loaded successfully');
};
frogBannerImg.onerror = function() {
    console.log('Frog banner image not found - using fallback');
};
frogBannerImg.src = 'assets/images/frog_banner.png';

const scientistBannerImg = new Image();
scientistBannerImg.onload = function() {
    scientistBannerImage = this;
    console.log('Scientist banner image loaded successfully');
};
scientistBannerImg.onerror = function() {
    console.log('Scientist banner image not found - using fallback');
};
scientistBannerImg.src = 'assets/images/scientist_banner.png';

const boardImg = new Image();
boardImg.onload = function() {
    boardImage = this;
    console.log('Board image loaded successfully');
};
boardImg.onerror = function() {
    console.error('Failed to load board image');
};
boardImg.src = 'assets/images/board.png';

// Banner animation constants
const BANNER_HEIGHT = 80;
const DEFAULT_BANNER_SPEED = 0.1; // Default speed if not specified in level
const DECISION_Y_THRESHOLD = CANVAS_HEIGHT * 0.7; // Decision point at 70% of screen height

// Update upgrade banner position
export function updateUpgradeBanner(deltaTime) {
    if (!activeUpgradeEvent) return;
    
    // Get banner speed from level config or use default
    const bannerSpeed = activeUpgradeEvent.bannerSpeed || DEFAULT_BANNER_SPEED;
    
    // Cache upgrade lists to avoid recalculating every frame
    if (!activeUpgradeEvent._cachedLeftUpgrades) {
        activeUpgradeEvent._cachedLeftUpgrades = getUpgradeList(activeUpgradeEvent.leftBonus);
    }
    if (!activeUpgradeEvent._cachedRightUpgrades) {
        activeUpgradeEvent._cachedRightUpgrades = getUpgradeList(activeUpgradeEvent.rightBonus);
    }
    
    const leftUpgrades = activeUpgradeEvent._cachedLeftUpgrades;
    const rightUpgrades = activeUpgradeEvent._cachedRightUpgrades;
    const maxRows = Math.max(leftUpgrades.length, rightUpgrades.length);
    
    // Calculate heights to maintain aspect ratios
    const leftImageWidth = CANVAS_WIDTH / 2;
    const rightImageWidth = CANVAS_WIDTH / 2;
    const leftImageHeight = frogBannerImage ? (leftImageWidth / (frogBannerImage.width / frogBannerImage.height)) : 120;
    const rightImageHeight = scientistBannerImage ? (rightImageWidth / (scientistBannerImage.width / scientistBannerImage.height)) : 120;
    const bannerImageHeight = Math.max(leftImageHeight, rightImageHeight);
    const dynamicBannerHeight = bannerImageHeight; // No separate text area needed
    
    // Move banner down
    const newBannerY = upgradeBannerY + bannerSpeed * CANVAS_HEIGHT * deltaTime;
    setUpgradeBannerY(newBannerY);
    
    // Banner position updated
    
    // Check if banner has reached decision point (only once)
    if (newBannerY >= DECISION_Y_THRESHOLD && !upgradeDecisionMade) {
        makeUpgradeDecision();
    }
    
    // Remove banner if it goes completely off screen (using dynamic height)
    if (newBannerY > CANVAS_HEIGHT + dynamicBannerHeight) {
        console.log('Banner off screen, clearing upgrade event');
        clearUpgradeEvent();
    }
    
    // Fallback: remove banner if it gets stuck for too long
    if (newBannerY > CANVAS_HEIGHT + 200) {
        console.log('Banner stuck, forcing cleanup');
        clearUpgradeEvent();
    }
}

// Make upgrade decision based on player position
function makeUpgradeDecision() {
    if (upgradeDecisionMade) return;
    
    const playerCenterX = player.x + player.width / 2;
    const screenCenterX = CANVAS_WIDTH / 2;
    
    let chosenBonus = null;
    
    if (playerCenterX < screenCenterX) {
        // Player is on the left side
        chosenBonus = activeUpgradeEvent.leftBonus;
        console.log(`🎯 Player chose LEFT: ${getBonusDescription(chosenBonus)}`);
    } else if (playerCenterX > screenCenterX) {
        // Player is on the right side
        chosenBonus = activeUpgradeEvent.rightBonus;
        console.log(`🎯 Player chose RIGHT: ${getBonusDescription(chosenBonus)}`);
    } else {
        // Player is exactly on center line - randomly choose
        const randomChoice = Math.random() < 0.5 ? 'left' : 'right';
        chosenBonus = randomChoice === 'left' ? activeUpgradeEvent.leftBonus : activeUpgradeEvent.rightBonus;
        console.log(`🎯 Player on center line - randomly chose ${randomChoice.toUpperCase()}: ${getBonusDescription(chosenBonus)}`);
    }
    
    // Apply the chosen bonus (or nothing)
    if (chosenBonus && chosenBonus !== 'nothing') {
        applyPlayerBonus(chosenBonus);
    } else {
        console.log(`🎯 Player chose nothing - no upgrade applied`);
    }
    
    setUpgradeDecisionMade(true);
    
    // Don't remove banner immediately - let it continue scrolling off screen
}

// Get description for bonus (single, array, or nothing)
function getBonusDescription(bonus) {
    if (bonus === 'nothing' || bonus === null) {
        return 'nothing';
    }
    
    if (Array.isArray(bonus)) {
        return bonus.map(b => `${b.type}+${b.value}`).join(', ');
    }
    
    if (bonus && bonus.type && bonus.value !== undefined) {
        return `${bonus.type}+${bonus.value}`;
    }
    
    return 'unknown';
}

// Draw upgrade banner
export function drawUpgradeBanner(ctx) {
    if (!activeUpgradeEvent || upgradeBannerY > CANVAS_HEIGHT) return;
    
    // Use cached upgrade lists to avoid recalculating
    const leftUpgrades = activeUpgradeEvent._cachedLeftUpgrades || getUpgradeList(activeUpgradeEvent.leftBonus);
    const rightUpgrades = activeUpgradeEvent._cachedRightUpgrades || getUpgradeList(activeUpgradeEvent.rightBonus);
    const maxRows = Math.max(leftUpgrades.length, rightUpgrades.length);
    
    // Calculate banner dimensions
    const leftImageWidth = CANVAS_WIDTH / 2;
    const rightImageWidth = CANVAS_WIDTH / 2;
    
    // Calculate heights to maintain aspect ratios
    const leftImageHeight = frogBannerImage ? (leftImageWidth / (frogBannerImage.width / frogBannerImage.height)) : 120;
    const rightImageHeight = scientistBannerImage ? (rightImageWidth / (scientistBannerImage.width / scientistBannerImage.height)) : 120;
    
    // Use the taller of the two images for banner height
    const bannerImageHeight = Math.max(leftImageHeight, rightImageHeight);
    const totalBannerHeight = bannerImageHeight; // No separate text area needed
    
    const bannerTop = Math.max(0, upgradeBannerY);
    const bannerBottom = Math.min(CANVAS_HEIGHT, upgradeBannerY + totalBannerHeight);
    const bannerHeight = bannerBottom - bannerTop;
    
    if (bannerHeight <= 0) return;
    
    // Save context
    ctx.save();
    
    // Draw left side (board image)
    const leftBoxX = 0;
    const leftBoxY = upgradeBannerY;
    const leftBoxWidth = CANVAS_WIDTH / 2;
    const leftBoxHeight = 120;
    
    // Only draw if any part of the box is visible
    if (leftBoxY < CANVAS_HEIGHT && leftBoxY + leftBoxHeight > 0) {
        drawBoard(ctx, leftBoxX, leftBoxY, leftBoxWidth, leftBoxHeight);
    }
    
    // Draw right side (board image)
    const rightBoxX = CANVAS_WIDTH / 2;
    const rightBoxY = upgradeBannerY;
    const rightBoxWidth = CANVAS_WIDTH / 2;
    const rightBoxHeight = 120;
    
    // Only draw if any part of the box is visible
    if (rightBoxY < CANVAS_HEIGHT && rightBoxY + rightBoxHeight > 0) {
        drawBoard(ctx, rightBoxX, rightBoxY, rightBoxWidth, rightBoxHeight);
    }
    
    // Draw center line on the boards
    const boxHeight = 120;
    const centerLineY = upgradeBannerY + boxHeight / 2;
    if (centerLineY >= 0 && centerLineY <= CANVAS_HEIGHT) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, Math.max(0, upgradeBannerY));
        ctx.lineTo(CANVAS_WIDTH / 2, Math.min(CANVAS_HEIGHT, upgradeBannerY + boxHeight));
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw upgrade text inside the boards
    const textStartY = upgradeBannerY + (boxHeight / 2); // Center text vertically in the board
    
    // Only draw text if it's visible
    if (textStartY < CANVAS_HEIGHT) {
        // Set up text styling for boards - slightly smaller for better fit
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Calculate vertical spacing for multiple lines
        const totalLines = Math.max(leftUpgrades.length, rightUpgrades.length);
        const totalHeight = (totalLines - 1) * 30; // Height of all lines
        const startOffset = -totalHeight / 2; // Center the entire text block
        
                    // Draw left upgrades
            leftUpgrades.forEach((upgrade, index) => {
                const y = textStartY + startOffset + (index * 30); // Center the text block
                if (y >= 0 && y <= CANVAS_HEIGHT) {
                    // Draw text with better contrast against board background
                    ctx.fillStyle = '#ffffff'; // White text for maximum contrast
                    ctx.shadowColor = '#000000'; // Black shadow for readability
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    ctx.fillText(upgrade, CANVAS_WIDTH / 4, y);
                }
            });
        
                    // Draw right upgrades
            rightUpgrades.forEach((upgrade, index) => {
                const y = textStartY + startOffset + (index * 30); // Center the text block
                if (y >= 0 && y <= CANVAS_HEIGHT) {
                    // Draw text with better contrast against board background
                    ctx.fillStyle = '#ffffff'; // White text for maximum contrast
                    ctx.shadowColor = '#000000'; // Black shadow for readability
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    ctx.fillText(upgrade, (CANVAS_WIDTH / 4) * 3, y);
                }
            });
    }
    
    // Draw decision indicator or confirmation
    if (upgradeBannerY >= DECISION_Y_THRESHOLD - 50 && !upgradeDecisionMade) {
        // Show "CHOOSE NOW!" with modern styling
        const time = performance.now() * 0.001;
        const pulseIntensity = 0.7 + 0.3 * Math.sin(time * 4);
        const text = ' CHOOSE NOW! ';
        
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text for background
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 36;
        const textX = CANVAS_WIDTH / 2 - textWidth / 2;
        const textY = upgradeBannerY + bannerImageHeight / 2;
        
        // Only draw if visible
        if (textY >= 0 && textY <= CANVAS_HEIGHT) {
            // Create modern gradient background
            const gradient = ctx.createLinearGradient(textX - 25, textY - textHeight/2 - 8, textX + textWidth + 25, textY + textHeight/2 + 8);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.95)'); // Gold
            gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.95)'); // Orange
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0.95)'); // Gold
            
            // Draw rounded background with gradient
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(textX - 25, textY - textHeight/2 - 8, textWidth + 50, textHeight + 16, 12);
            ctx.fill();
            
            // Draw modern border with glow effect
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * pulseIntensity})`;
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
            ctx.shadowBlur = 8 * pulseIntensity;
            ctx.stroke();
            
            // Draw text with modern styling
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillText(text, CANVAS_WIDTH / 2, textY);
        }
    } else if (upgradeDecisionMade) {
        // Show confirmation with modern styling
        const text = 'UPGRADE APPLIED!';
        
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text for background
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 36;
        const textX = CANVAS_WIDTH / 2 - textWidth / 2;
        const textY = upgradeBannerY + bannerImageHeight / 2;
        
        // Only draw if visible
        if (textY >= 0 && textY <= CANVAS_HEIGHT) {
            // Create modern gradient background
            const gradient = ctx.createLinearGradient(textX - 25, textY - textHeight/2 - 8, textX + textWidth + 25, textY + textHeight/2 + 8);
            gradient.addColorStop(0, 'rgba(0, 255, 100, 0.95)'); // Green
            gradient.addColorStop(0.5, 'rgba(0, 200, 80, 0.95)'); // Darker green
            gradient.addColorStop(1, 'rgba(0, 255, 100, 0.95)'); // Green
            
            // Draw rounded background with gradient
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(textX - 25, textY - textHeight/2 - 8, textWidth + 50, textHeight + 16, 12);
            ctx.fill();
            
            // Draw modern border with glow effect
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(0, 255, 100, 0.8)';
            ctx.shadowBlur = 8;
            ctx.stroke();
            
            // Draw text with modern styling
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillText(text, CANVAS_WIDTH / 2, textY);
        }
    }
    
    // Restore context
    ctx.restore();
}

// Get list of upgrade strings for display
function getUpgradeList(bonus) {
    if (bonus === 'nothing' || bonus === null) {
        return ['❌ Nothing'];
    }
    
    if (Array.isArray(bonus)) {
        return bonus.map(singleBonus => getSingleUpgradeLabel(singleBonus));
    }
    
    return [getSingleUpgradeLabel(bonus)];
}



function getSingleUpgradeLabel(bonus) {
    switch (bonus.type) {
        case 'fireRate':
            if (bonus.value < 0) {
                return `Faster Shooting (${bonus.value}ms) 🌪️`;
            } else if (bonus.value > 0) {
                return `Slower Shooting (+${bonus.value}ms) 🌪️`;
            } else {
                return `No Change (0ms) 🌪️`;
            }
        case 'damage':
            if (bonus.value > 0) {
                return `Higher Damage (+${bonus.value}) 🌊`;
            } else if (bonus.value < 0) {
                return `Lower Damage (${bonus.value}) 🌊`;
            } else {
                return `No Change (0) 🌊`;
            }
        case 'spread':
            if (bonus.value > 0) {
                return `More Projectiles (+${bonus.value}) 💦`;
            } else if (bonus.value < 0) {
                return `Fewer Projectiles (${bonus.value}) 💦`;
            } else {
                return `No Change (0) 💦`;
            }
        default:
            if (bonus.value > 0) {
                return `Increased ${bonus.type} (+${bonus.value})`;
            } else if (bonus.value < 0) {
                return `Decreased ${bonus.type} (${bonus.value})`;
            } else {
                return `No Change (0)`;
            }
    }
}

// Check if upgrade event is active
export function isUpgradeEventActive() {
    return activeUpgradeEvent !== null && !upgradeDecisionMade;
} 