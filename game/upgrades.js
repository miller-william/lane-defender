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
    const dynamicBannerHeight = Math.max(BANNER_HEIGHT, maxRows * 25 + 40);
    
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
    const dynamicBannerHeight = Math.max(BANNER_HEIGHT, maxRows * 30 + 60); // Increased spacing
    
    const bannerTop = Math.max(0, upgradeBannerY);
    const bannerBottom = Math.min(CANVAS_HEIGHT, upgradeBannerY + dynamicBannerHeight);
    const bannerHeight = bannerBottom - bannerTop;
    
    if (bannerHeight <= 0) return;
    
    // Save context
    ctx.save();
    
    // Create animated glow effect based on time
    const time = performance.now() * 0.001;
    const glowIntensity = 0.3 + 0.1 * Math.sin(time * 3);
    
    // Draw background blur/overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, bannerTop, CANVAS_WIDTH, bannerHeight);
    
    // Draw left half with modern gradient
    const leftGradient = ctx.createLinearGradient(0, bannerTop, CANVAS_WIDTH / 2, bannerBottom);
    leftGradient.addColorStop(0, `rgba(255, 50, 50, ${0.4 + glowIntensity * 0.2})`);
    leftGradient.addColorStop(0.5, `rgba(255, 100, 100, ${0.3 + glowIntensity * 0.1})`);
    leftGradient.addColorStop(1, `rgba(255, 150, 150, ${0.2 + glowIntensity * 0.1})`);
    ctx.fillStyle = leftGradient;
    ctx.fillRect(0, bannerTop, CANVAS_WIDTH / 2, bannerHeight);
    
    // Draw right half with modern gradient
    const rightGradient = ctx.createLinearGradient(CANVAS_WIDTH / 2, bannerTop, CANVAS_WIDTH, bannerBottom);
    rightGradient.addColorStop(0, `rgba(50, 150, 255, ${0.4 + glowIntensity * 0.2})`);
    rightGradient.addColorStop(0.5, `rgba(100, 180, 255, ${0.3 + glowIntensity * 0.1})`);
    rightGradient.addColorStop(1, `rgba(150, 200, 255, ${0.2 + glowIntensity * 0.1})`);
    ctx.fillStyle = rightGradient;
    ctx.fillRect(CANVAS_WIDTH / 2, bannerTop, CANVAS_WIDTH / 2, bannerHeight);
    
    // Draw modern center line with glow
    const centerLineGlow = ctx.createLinearGradient(CANVAS_WIDTH / 2 - 3, bannerTop, CANVAS_WIDTH / 2 + 3, bannerBottom);
    centerLineGlow.addColorStop(0, 'rgba(255, 255, 255, 0)');
    centerLineGlow.addColorStop(0.5, `rgba(255, 255, 255, ${0.8 + glowIntensity * 0.2})`);
    centerLineGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.strokeStyle = centerLineGlow;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, bannerTop);
    ctx.lineTo(CANVAS_WIDTH / 2, bannerBottom);
    ctx.stroke();
    
    // Draw solid center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, bannerTop);
    ctx.lineTo(CANVAS_WIDTH / 2, bannerBottom);
    ctx.stroke();
    
    // Draw upgrade labels with modern styling
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw left upgrades in rows with enhanced styling
    const leftStartY = bannerTop + 20;
    leftUpgrades.forEach((upgrade, index) => {
        const y = leftStartY + (index * 30);
        
        // Draw background highlight for each upgrade
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(CANVAS_WIDTH / 4 - 80, y - 10, 160, 25);
        
        // Draw upgrade text with glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowColor = 'rgba(255, 50, 50, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText(upgrade, CANVAS_WIDTH / 4, y);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    });
    
    // Draw right upgrades in rows with enhanced styling
    const rightStartY = bannerTop + 20;
    rightUpgrades.forEach((upgrade, index) => {
        const y = rightStartY + (index * 30);
        
        // Draw background highlight for each upgrade
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect((CANVAS_WIDTH / 4) * 3 - 80, y - 10, 160, 25);
        
        // Draw upgrade text with glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowColor = 'rgba(50, 150, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText(upgrade, (CANVAS_WIDTH / 4) * 3, y);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    });
    
    // Draw decision indicator or confirmation with modern styling
    if (upgradeBannerY >= DECISION_Y_THRESHOLD - 50 && !upgradeDecisionMade) {
        // Show "CHOOSE NOW!" with pulsing effect and solid background
        const pulseIntensity = 0.8 + 0.2 * Math.sin(time * 5);
        const text = '⚡ CHOOSE NOW! ⚡';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text for background
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 25;
        const textX = CANVAS_WIDTH / 2 - textWidth / 2;
        const textY = bannerTop + bannerHeight / 2;
        
        // Draw solid background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
        
        // Draw border
        ctx.strokeStyle = `rgba(255, 255, 0, ${pulseIntensity})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
        
        // Draw text with glow
        ctx.fillStyle = `rgba(255, 255, 0, ${pulseIntensity})`;
        ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.fillText(text, CANVAS_WIDTH / 2, textY);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    } else if (upgradeDecisionMade) {
        // Show confirmation with success styling and solid background
        const text = '✅ UPGRADE APPLIED! ✅';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text for background
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 25;
        const textX = CANVAS_WIDTH / 2 - textWidth / 2;
        const textY = bannerTop + bannerHeight / 2;
        
        // Draw solid background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
        
        // Draw border
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(textX - 20, textY - textHeight/2 - 5, textWidth + 40, textHeight + 10);
        
        // Draw text with glow
        ctx.fillStyle = 'rgba(0, 255, 100, 0.9)';
        ctx.shadowColor = 'rgba(0, 255, 100, 0.8)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.fillText(text, CANVAS_WIDTH / 2, textY);
        
        // Reset shadow
        ctx.shadowBlur = 0;
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
                return `🔥 Fire Rate -${Math.abs(bonus.value)}ms (Faster)`;
            } else if (bonus.value > 0) {
                return `🔥 Fire Rate +${bonus.value}ms (Slower)`;
            } else {
                return `🔥 Fire Rate +0ms`;
            }
        case 'damage':
            if (bonus.value > 0) {
                return `💥 Damage +${bonus.value} (Better)`;
            } else if (bonus.value < 0) {
                return `💥 Damage ${bonus.value} (Worse)`;
            } else {
                return `💥 Damage +0`;
            }
        case 'spread':
            if (bonus.value > 0) {
                return `🎯 Spread +${bonus.value} (More Bullets)`;
            } else if (bonus.value < 0) {
                return `🎯 Spread ${bonus.value} (Fewer Bullets)`;
            } else {
                return `🎯 Spread +0`;
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