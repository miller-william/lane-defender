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