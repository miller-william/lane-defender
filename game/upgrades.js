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

// Function to draw pixel art wooden boxes
function drawPixelArtWoodenBox(ctx, x, y, width, height, side) {
    // Save context
    ctx.save();
    
    // Wooden gradient background
    const woodGradient = ctx.createLinearGradient(x, y, x, y + height);
    woodGradient.addColorStop(0, '#8B4513');    // Dark brown
    woodGradient.addColorStop(0.3, '#A0522D');  // Medium brown
    woodGradient.addColorStop(0.7, '#CD853F');  // Light brown
    woodGradient.addColorStop(1, '#DEB887');    // Very light brown
    
    // Draw main box
    ctx.fillStyle = woodGradient;
    ctx.fillRect(x, y, width, height);
    
    // Draw pixel art border (darker wood)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
    
    // Draw inner pixel art border (lighter wood)
    ctx.strokeStyle = '#DEB887';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 6, y + 6, width - 12, height - 12);
    
    // Draw pixel art wood grain lines
    ctx.strokeStyle = '#A0522D';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const lineY = y + 15 + (i * 20);
        ctx.beginPath();
        ctx.moveTo(x + 10, lineY);
        ctx.lineTo(x + width - 10, lineY);
        ctx.stroke();
    }
    
    // Removed side labels for cleaner look
    
    // Restore context
    ctx.restore();
}

// Load banner images
let frogBannerImage = null;
let scientistBannerImage = null;

const frogBannerImg = new Image();
frogBannerImg.onload = function() {
    frogBannerImage = this;
    console.log('Frog banner image loaded successfully');
};
frogBannerImg.onerror = function() {
    console.error('Failed to load frog banner image');
};
frogBannerImg.src = 'assets/images/frog_banner.png';

const scientistBannerImg = new Image();
scientistBannerImg.onload = function() {
    scientistBannerImage = this;
    console.log('Scientist banner image loaded successfully');
};
scientistBannerImg.onerror = function() {
    console.error('Failed to load scientist banner image');
};
scientistBannerImg.src = 'assets/images/scientist_banner.png';

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
    
    // Draw left side (wooden pixel art box)
    const leftBoxX = 0;
    const leftBoxY = upgradeBannerY;
    const leftBoxWidth = CANVAS_WIDTH / 2;
    const leftBoxHeight = 120;
    
    // Only draw if any part of the box is visible
    if (leftBoxY < CANVAS_HEIGHT && leftBoxY + leftBoxHeight > 0) {
        drawPixelArtWoodenBox(ctx, leftBoxX, leftBoxY, leftBoxWidth, leftBoxHeight, 'left');
    }
    
    // Draw right side (wooden pixel art box)
    const rightBoxX = CANVAS_WIDTH / 2;
    const rightBoxY = upgradeBannerY;
    const rightBoxWidth = CANVAS_WIDTH / 2;
    const rightBoxHeight = 120;
    
    // Only draw if any part of the box is visible
    if (rightBoxY < CANVAS_HEIGHT && rightBoxY + rightBoxHeight > 0) {
        drawPixelArtWoodenBox(ctx, rightBoxX, rightBoxY, rightBoxWidth, rightBoxHeight, 'right');
    }
    
    // Draw center line on the wooden boxes
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
    
    // Draw upgrade text inside the wooden boxes
    const textStartY = upgradeBannerY + 40; // Position text in the middle of the box
    
    // Only draw text if it's visible
    if (textStartY < CANVAS_HEIGHT) {
        // Set up text styling for wooden boxes - bigger and more visible
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw left upgrades
        const leftStartY = textStartY + 15;
        leftUpgrades.forEach((upgrade, index) => {
            const y = leftStartY + (index * 25); // Increased line spacing for bigger text
            if (y >= 0 && y <= CANVAS_HEIGHT) {
                // Draw text with better contrast against wooden background
                ctx.fillStyle = '#ffffff'; // White text for maximum contrast
                ctx.shadowColor = '#000000'; // Black shadow for readability
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(upgrade, CANVAS_WIDTH / 4, y);
            }
        });
        
        // Draw right upgrades
        const rightStartY = textStartY + 15;
        rightUpgrades.forEach((upgrade, index) => {
            const y = rightStartY + (index * 25); // Increased line spacing for bigger text
            if (y >= 0 && y <= CANVAS_HEIGHT) {
                // Draw text with better contrast against wooden background
                ctx.fillStyle = '#ffffff'; // White text for maximum contrast
                ctx.shadowColor = '#000000'; // Black shadow for readability
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(upgrade, (CANVAS_WIDTH / 4) * 3, y);
            }
        });
    }
    
    // Draw decision indicator or confirmation
    if (upgradeBannerY >= DECISION_Y_THRESHOLD - 50 && !upgradeDecisionMade) {
        // Show "CHOOSE NOW!" with better styling
        const time = performance.now() * 0.001;
        const pulseIntensity = 0.8 + 0.2 * Math.sin(time * 5);
        const text = '⚡ CHOOSE NOW! ⚡';
        
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text for background
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 30;
        const textX = CANVAS_WIDTH / 2 - textWidth / 2;
        const textY = upgradeBannerY + bannerImageHeight / 2;
        
        // Only draw if visible
        if (textY >= 0 && textY <= CANVAS_HEIGHT) {
            // Draw solid background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
            
            // Draw border
            ctx.strokeStyle = `rgba(255, 255, 0, ${pulseIntensity})`;
            ctx.lineWidth = 3;
            ctx.strokeRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
            
            // Draw text with better visibility
            ctx.fillStyle = `rgba(255, 255, 0, ${pulseIntensity})`;
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(text, CANVAS_WIDTH / 2, textY);
        }
    } else if (upgradeDecisionMade) {
        // Show confirmation with better styling
        const text = '✅ UPGRADE APPLIED! ✅';
        
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text for background
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 30;
        const textX = CANVAS_WIDTH / 2 - textWidth / 2;
        const textY = upgradeBannerY + bannerImageHeight / 2;
        
        // Only draw if visible
        if (textY >= 0 && textY <= CANVAS_HEIGHT) {
            // Draw solid background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
            
            // Draw border
            ctx.strokeStyle = 'rgba(0, 255, 100, 0.9)';
            ctx.lineWidth = 3;
            ctx.strokeRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
            
            // Draw text with better visibility
            ctx.fillStyle = 'rgba(0, 255, 100, 0.9)';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
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
                return `🌪️ Fire Rate -${Math.abs(bonus.value)}ms (Faster)`;
            } else if (bonus.value > 0) {
                return `🌪️ Fire Rate +${bonus.value}ms (Slower)`;
            } else {
                return `🌪️ Fire Rate +0ms`;
            }
        case 'damage':
            if (bonus.value > 0) {
                return `🌊 Damage +${bonus.value} (Better)`;
            } else if (bonus.value < 0) {
                return `🌊 Damage ${bonus.value} (Worse)`;
            } else {
                return `🌊 Damage +0`;
            }
        case 'spread':
            if (bonus.value > 0) {
                return `💦 Spread +${bonus.value} (More Bullets)`;
            } else if (bonus.value < 0) {
                return `💦 Spread ${bonus.value} (Fewer Bullets)`;
            } else {
                return `💦 Spread +0`;
            }
        default:
            if (bonus.value > 0) {
                return `${bonus.type} +${bonus.value}`;
            } else if (bonus.value < 0) {
                return `${bonus.type} ${bonus.value}`;
            } else {
                return `${bonus.type} +0`;
            }
    }
}

// Check if upgrade event is active
export function isUpgradeEventActive() {
    return activeUpgradeEvent !== null && !upgradeDecisionMade;
} 