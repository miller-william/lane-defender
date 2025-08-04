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
    
    // Calculate dynamic banner height for removal logic
    const leftUpgrades = getUpgradeList(activeUpgradeEvent.leftBonus);
    const rightUpgrades = getUpgradeList(activeUpgradeEvent.rightBonus);
    const maxRows = Math.max(leftUpgrades.length, rightUpgrades.length);
    const dynamicBannerHeight = Math.max(BANNER_HEIGHT, maxRows * 25 + 40);
    
    // Move banner down
    const newBannerY = upgradeBannerY + bannerSpeed * CANVAS_HEIGHT * deltaTime;
    setUpgradeBannerY(newBannerY);
    
    // Debug banner position occasionally
    if (Math.random() < 0.1) { // Log 10% of the time
        console.log(`Banner Y: ${newBannerY.toFixed(1)}, Speed: ${bannerSpeed}, Canvas Height: ${CANVAS_HEIGHT}, Dynamic Height: ${dynamicBannerHeight}, Threshold: ${CANVAS_HEIGHT + dynamicBannerHeight}`);
    }
    
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
    
    // Calculate dynamic banner height based on content
    const leftUpgrades = getUpgradeList(activeUpgradeEvent.leftBonus);
    const rightUpgrades = getUpgradeList(activeUpgradeEvent.rightBonus);
    const maxRows = Math.max(leftUpgrades.length, rightUpgrades.length);
    const dynamicBannerHeight = Math.max(BANNER_HEIGHT, maxRows * 25 + 40); // 25px per row + padding
    
    const bannerTop = Math.max(0, upgradeBannerY);
    const bannerBottom = Math.min(CANVAS_HEIGHT, upgradeBannerY + dynamicBannerHeight);
    const bannerHeight = bannerBottom - bannerTop;
    
    if (bannerHeight <= 0) return;
    
    // Save context
    ctx.save();
    
    // Draw left half (translucent)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, bannerTop, CANVAS_WIDTH / 2, bannerHeight);
    
    // Draw right half (translucent)
    ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.fillRect(CANVAS_WIDTH / 2, bannerTop, CANVAS_WIDTH / 2, bannerHeight);
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, bannerTop);
    ctx.lineTo(CANVAS_WIDTH / 2, bannerBottom);
    ctx.stroke();
    
    // Draw upgrade labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw left upgrades in rows
    const leftStartY = bannerTop + 20;
    leftUpgrades.forEach((upgrade, index) => {
        const y = leftStartY + (index * 25);
        ctx.fillText(upgrade, CANVAS_WIDTH / 4, y);
    });
    
    // Draw right upgrades in rows
    const rightStartY = bannerTop + 20;
    rightUpgrades.forEach((upgrade, index) => {
        const y = rightStartY + (index * 25);
        ctx.fillText(upgrade, (CANVAS_WIDTH / 4) * 3, y);
    });
    
    // Draw decision indicator or confirmation
    if (upgradeBannerY >= DECISION_Y_THRESHOLD - 50 && !upgradeDecisionMade) {
        // Show "CHOOSE NOW!" before decision
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('CHOOSE NOW!', CANVAS_WIDTH / 2, bannerTop + bannerHeight / 2);
    } else if (upgradeDecisionMade) {
        // Show confirmation after decision
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('UPGRADE APPLIED!', CANVAS_WIDTH / 2, bannerTop + bannerHeight / 2);
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