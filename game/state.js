import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, DEFAULT_BULLET_DAMAGE, DEFAULT_BULLET_FIRE_RATE, DEFAULT_ENEMY_HEALTH } from './constants.js';

// Game state
export let player = {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: PLAYER_SPEED,
    health: 5,
    maxHealth: 5
};

export let bullets = [];
export let enemies = [];
export let lastBulletFiredAt = 0;
export let keys = {};
export let gameOver = false;
export let levelComplete = false;
export let levelPerfect = true; // Track if level was completed without taking damage
export let touchTargetX = null;
export let isTouchActive = false;

// Perfect completion tracking
export let perfectCompletedLevels = {};

// Load perfect completion data from localStorage
function loadPerfectCompletionData() {
    try {
        const saved = localStorage.getItem('laneDefenderPerfectLevels');
        if (saved) {
            perfectCompletedLevels = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Failed to load perfect completion data:', error);
        perfectCompletedLevels = {};
    }
}

// Save perfect completion data to localStorage
function savePerfectCompletionData() {
    try {
        localStorage.setItem('laneDefenderPerfectLevels', JSON.stringify(perfectCompletedLevels));
    } catch (error) {
        console.warn('Failed to save perfect completion data:', error);
    }
}

// Initialize perfect completion data
loadPerfectCompletionData();

// Dynamic game variables (can be changed via dev panel)
export let bulletDamage = DEFAULT_BULLET_DAMAGE;
export let bulletFireRate = DEFAULT_BULLET_FIRE_RATE;
export let bulletColor = '#ffff00'; // Default yellow bullet color
export let enemyHealth = DEFAULT_ENEMY_HEALTH;
export let bulletSpread = 0; // Number of additional bullets (0 = single bullet)

// Upgrade system state
export let activeUpgradeEvent = null;
export let upgradeBannerY = -100; // Start off-screen
export let upgradeDecisionMade = false;
export let playerActiveBonuses = []; // Store active bonuses for stacking
export let upgradeEventQueue = []; // Queue for pending upgrade events

// Level completion delay state
export let levelCompletionDelay = 0; // Time to wait before showing win screen
export let levelCompletionDelayActive = false; // Whether delay is currently active

// Level stats tracking
export let totalEnemiesSpawned = 0;
export let startingHealth = 5;

// Setter functions for mutable state
export function setLastBulletFiredAt(time) {
    lastBulletFiredAt = time;
}

export function setBullets(newBullets) {
    bullets.length = 0;
    bullets.push(...newBullets);
}

export function setEnemies(newEnemies) {
    enemies.length = 0;
    enemies.push(...newEnemies);
}

export function setLevelComplete(complete) {
    levelComplete = complete;
}

export function isLevelComplete() {
    return levelComplete;
}

export function setLevelPerfect(perfect) {
    levelPerfect = perfect;
}

export function isLevelPerfect() {
    return levelPerfect;
}

export function setPerfectCompletion(levelNumber, perfect) {
    perfectCompletedLevels[levelNumber] = perfect;
    savePerfectCompletionData();
}

export function isLevelPerfectlyCompleted(levelNumber) {
    return perfectCompletedLevels[levelNumber] === true;
}

export function setBulletDamage(newDamage) {
    bulletDamage = Math.max(1, newDamage); // Ensure minimum damage of 1
}

export function setBulletFireRate(newFireRate) {
    bulletFireRate = Math.max(100, newFireRate); // Ensure minimum fire rate of 100ms
}

export function setBulletColor(newColor) {
    bulletColor = newColor;
}

export function setBulletSpread(newSpread) {
    bulletSpread = Math.max(0, newSpread); // Ensure minimum spread of 0
}

export function setPlayerHealth(newHealth) {
    const oldHealth = player.health;
    player.health = Math.max(0, newHealth); // Ensure health doesn't go below 0
    
    // If player took damage, set levelPerfect to false
    if (newHealth < oldHealth) {
        setLevelPerfect(false);
    }
}

export function setGameOver(newGameOver) {
    gameOver = newGameOver;
}

// Upgrade system functions
export function setActiveUpgradeEvent(event) {
    // If there's already an active event, queue this one
    if (activeUpgradeEvent) {
        upgradeEventQueue.push(event);
        console.log(`📋 Upgrade event queued (${upgradeEventQueue.length} pending)`);
        return;
    }
    
    // Start the new event
    activeUpgradeEvent = event;
    upgradeBannerY = -100; // Reset banner position
    upgradeDecisionMade = false;
    const bannerSpeed = event.bannerSpeed || 0.1;
    console.log(`🎯 Starting upgrade event: ${getBonusDescription(event.leftBonus)} vs ${getBonusDescription(event.rightBonus)} (banner speed: ${bannerSpeed})`);
}

export function clearUpgradeEvent() {
    // Clear cached data
    if (activeUpgradeEvent) {
        delete activeUpgradeEvent._cachedLeftUpgrades;
        delete activeUpgradeEvent._cachedRightUpgrades;
    }
    
    activeUpgradeEvent = null;
    upgradeBannerY = -100;
    upgradeDecisionMade = false;
    
    // Check if there are queued events
    if (upgradeEventQueue.length > 0) {
        const nextEvent = upgradeEventQueue.shift();
        console.log(`📋 Processing next upgrade event from queue (${upgradeEventQueue.length} remaining)`);
        setActiveUpgradeEvent(nextEvent);
    }
}

// Helper function for bonus description
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

export function setUpgradeBannerY(y) {
    upgradeBannerY = y;
}

export function setUpgradeDecisionMade(decision) {
    upgradeDecisionMade = decision;
}

export function applyPlayerBonus(bonus) {
    // Handle array of bonuses
    if (Array.isArray(bonus)) {
        bonus.forEach(singleBonus => {
            applySingleBonus(singleBonus);
        });
        return;
    }
    
    // Handle single bonus (backward compatibility)
    applySingleBonus(bonus);
}

function applySingleBonus(bonus) {
    switch (bonus.type) {
        case 'fireRate':
            const newFireRate = bulletFireRate + bonus.value;
            setBulletFireRate(newFireRate);
            if (bonus.value < 0) {
                console.log(`🔥 Fire Rate upgrade: -${Math.abs(bonus.value)}ms (faster, new rate: ${newFireRate}ms)`);
            } else if (bonus.value > 0) {
                console.log(`🔥 Fire Rate upgrade: +${bonus.value}ms (slower, new rate: ${newFireRate}ms)`);
            } else {
                console.log(`🔥 Fire Rate upgrade: +0ms (no change, rate: ${newFireRate}ms)`);
            }
            break;
            
        case 'damage':
            const newDamage = bulletDamage + bonus.value;
            setBulletDamage(newDamage);
            if (bonus.value > 0) {
                console.log(`💥 Damage upgrade: +${bonus.value} (better, new damage: ${newDamage})`);
            } else if (bonus.value < 0) {
                console.log(`💥 Damage upgrade: ${bonus.value} (worse, new damage: ${newDamage})`);
            } else {
                console.log(`💥 Damage upgrade: +0 (no change, damage: ${newDamage})`);
            }
            break;
            
        case 'spread':
            const newSpread = bulletSpread + bonus.value;
            setBulletSpread(newSpread);
            if (bonus.value > 0) {
                console.log(`🎯 Spread upgrade: +${bonus.value} bullets (more bullets, new spread: ${newSpread})`);
            } else if (bonus.value < 0) {
                console.log(`🎯 Spread upgrade: ${bonus.value} bullets (fewer bullets, new spread: ${newSpread})`);
            } else {
                console.log(`🎯 Spread upgrade: +0 bullets (no change, spread: ${newSpread})`);
            }
            break;
            
        default:
            console.warn(`Unknown upgrade type: ${bonus.type}`);
            return;
    }
    
    // Store the bonus for future reference
    playerActiveBonuses.push(bonus);
}

export function resetUpgradeSystem() {
    activeUpgradeEvent = null;
    upgradeBannerY = -100;
    upgradeDecisionMade = false;
    playerActiveBonuses = [];
    upgradeEventQueue = []; // Clear the queue
    bulletSpread = 0; // Reset spread to 0
} 

// Level completion delay functions
export function setLevelCompletionDelay(delay) {
    levelCompletionDelay = delay;
}

export function setLevelCompletionDelayActive(active) {
    levelCompletionDelayActive = active;
}

export function getLevelCompletionDelay() {
    return levelCompletionDelay;
}

export function isLevelCompletionDelayActive() {
    return levelCompletionDelayActive;
}

// Level stats functions
export function setTotalEnemiesSpawned(count) {
    totalEnemiesSpawned = count;
}

export function setStartingHealth(health) {
    startingHealth = health;
}

export function getEnemiesDefeated() {
    // Calculate enemies defeated on-demand: total spawned - current enemies
    // Cache enemies.length to avoid repeated property access
    const currentEnemies = enemies ? enemies.length : 0;
    return totalEnemiesSpawned - currentEnemies;
}

export function getDamageTaken() {
    // Calculate damage taken on-demand instead of tracking incrementally
    return startingHealth - player.health;
}

export function getStartingHealth() {
    return startingHealth;
} 