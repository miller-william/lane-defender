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
    
    // Draw left side (frog banner) if loaded
    if (frogBannerImage) {
        const imageY = upgradeBannerY;
        const leftImageWidth = CANVAS_WIDTH / 2;
        
        // Calculate height to maintain aspect ratio
        const aspectRatio = frogBannerImage.width / frogBannerImage.height;
        const leftImageHeight = leftImageWidth / aspectRatio;
        
        // Only draw if any part of the image is visible
        if (imageY < CANVAS_HEIGHT && imageY + leftImageHeight > 0) {
            // Draw the frog banner on the left half with proper aspect ratio
            ctx.drawImage(
                frogBannerImage,
                0, imageY, // Destination x, y
                leftImageWidth, leftImageHeight // Destination width, height
            );
        }
    }
    
    // Draw right side (scientist banner) if loaded
    if (scientistBannerImage) {
        const imageY = upgradeBannerY;
        const rightImageWidth = CANVAS_WIDTH / 2;
        
        // Calculate height to maintain aspect ratio
        const aspectRatio = scientistBannerImage.width / scientistBannerImage.height;
        const rightImageHeight = rightImageWidth / aspectRatio;
        
        // Only draw if any part of the image is visible
        if (imageY < CANVAS_HEIGHT && imageY + rightImageHeight > 0) {
            // Draw the scientist banner on the right half with proper aspect ratio
            ctx.drawImage(
                scientistBannerImage,
                CANVAS_WIDTH / 2, imageY, // Destination x, y (right half)
                rightImageWidth, rightImageHeight // Destination width, height
            );
        }
    }
    
    // Fallback: draw a simple banner background if images not loaded
    if (!frogBannerImage && !scientistBannerImage) {
        const gradient = ctx.createLinearGradient(0, bannerTop, 0, bannerTop + bannerImageHeight);
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(1, '#6ba3e8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, bannerTop, CANVAS_WIDTH, Math.min(bannerImageHeight, bannerHeight));
    }
    
    // Draw center line on the banner image
    const centerLineY = upgradeBannerY + bannerImageHeight / 2;
    if (centerLineY >= 0 && centerLineY <= CANVAS_HEIGHT) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, Math.max(0, upgradeBannerY));
        ctx.lineTo(CANVAS_WIDTH / 2, Math.min(CANVAS_HEIGHT, upgradeBannerY + bannerImageHeight));
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw upgrade text inside the banner image (moved up one line)
    const textStartY = upgradeBannerY + (bannerImageHeight * 0.67) - 10; // Moved up one line
    
    // Only draw text if it's visible
    if (textStartY < CANVAS_HEIGHT) {
        // Set up text styling - smaller font size
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw left upgrades
        const leftStartY = textStartY + 10;
        leftUpgrades.forEach((upgrade, index) => {
            const y = leftStartY + (index * 18); // Reduced line spacing
            if (y >= 0 && y <= CANVAS_HEIGHT) {
                // Draw text with better contrast and no background
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#000000';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(upgrade, CANVAS_WIDTH / 4, y);
            }
        });
        
        // Draw right upgrades
        const rightStartY = textStartY + 10;
        rightUpgrades.forEach((upgrade, index) => {
            const y = rightStartY + (index * 18); // Reduced line spacing
            if (y >= 0 && y <= CANVAS_HEIGHT) {
                // Draw text with better contrast and no background
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#000000';
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