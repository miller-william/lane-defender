import { enemies, setEnemies, setLevelComplete, setBulletColor, setActiveUpgradeEvent, clearUpgradeEvent, setLevelCompletionDelayActive, getLevelCompletionDelay, isLevelCompletionDelayActive, setTotalEnemiesSpawned, setLevelPerfect } from './state.js';
import { createEnemyFromSpawnEvent } from './enemies.js';
import { LEVELS } from '../levels/index.js';

// Helper function to get bonus description
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

// Dev options - toggle these for testing
const DEV_MODE = {
    ALL_LEVELS_UNLOCKED: true, // Set to true to unlock all levels for testing
    INFINITE_HEALTH: false, // Set to true for infinite health
    INSTANT_WIN: false // Set to true to instantly complete levels
};

// Function to expand bulk spawn events into individual spawn events
function expandBulkSpawnEvents(spawnEvents) {
    const expandedEvents = [];
    
    for (const event of spawnEvents) {
        if (event.count && event.count > 1) {
            // This is a bulk spawn event - expand it
            const interval = event.interval || 500; // default 500ms interval
            const baseTime = event.time;
            
            for (let i = 0; i < event.count; i++) {
                const expandedEvent = {
                    time: baseTime + (i * interval),
                    enemyType: event.enemyType,
                    modifiers: event.modifiers ? { ...event.modifiers } : undefined
                };
                
                // Copy individual properties for backward compatibility
                if (event.health !== undefined) expandedEvent.health = event.health;
                if (event.speed !== undefined) expandedEvent.speed = event.speed;
                if (event.damage !== undefined) expandedEvent.damage = event.damage;
                
                expandedEvents.push(expandedEvent);
            }
            
            console.log(`Expanded bulk spawn: ${event.count} ${event.enemyType} enemies every ${interval}ms starting at ${baseTime}ms`);
        } else {
            // Single spawn event - add as is
            expandedEvents.push(event);
        }
    }
    
    return expandedEvents;
}

// Function to process all level events (spawn and upgrade)
function processLevelEvents(level) {
    const allEvents = [];
    
    // Add spawn events
    if (level.spawnEvents) {
        const expandedSpawnEvents = expandBulkSpawnEvents(level.spawnEvents);
        allEvents.push(...expandedSpawnEvents);
    }
    
    // Add upgrade events
    if (level.upgradeEvents) {
        allEvents.push(...level.upgradeEvents);
    }
    
    // Sort all events by time
    return allEvents.sort((a, b) => a.time - b.time);
}

// Level state
let currentLevel = null;
let levelStartTime = 0;
let eventIndex = 0;
let allLevelEvents = [];
let currentLevelNumber = 1;

// Level management functions
export function startLevel(levelNumber) {
    const level = LEVELS[levelNumber];
    if (!level) {
        console.error(`Level ${levelNumber} not found`);
        return;
    }
    
    // Process all level events (spawn and upgrade)
    allLevelEvents = processLevelEvents(level);
    
    currentLevel = level;
    currentLevelNumber = levelNumber;
    levelStartTime = Date.now();
    eventIndex = 0;
    setLevelComplete(false);
    setLevelCompletionDelayActive(false); // Reset completion delay state
    
    // Set bullet color from level configuration (default to yellow if not specified)
    const bulletColor = level.bulletColor || '#ffff00';
    setBulletColor(bulletColor);
    
    // Count total enemies that will be spawned
    const spawnEvents = allLevelEvents.filter(event => !event.type || event.type !== 'upgradeChoice');
    setTotalEnemiesSpawned(spawnEvents.length);
    
    console.log(`Starting Level ${levelNumber}: ${level.name}`);
    console.log(`Bullet color: ${bulletColor}`);
    console.log(`Total events: ${allLevelEvents.length} (spawn + upgrade)`);
    console.log(`Total enemies to spawn: ${spawnEvents.length}`);
    
    // Dev mode: instant win
    if (DEV_MODE.INSTANT_WIN) {
        console.log('DEV MODE: Instant win enabled');
        setTimeout(() => {
            setLevelComplete(true);
            console.log('DEV MODE: Level instantly completed');
        }, 1000); // Win after 1 second
    }
}

export function updateLevel() {
    if (!currentLevel) return;
    
    const currentTime = Date.now() - levelStartTime;
    
    // Check for events using all events
    while (eventIndex < allLevelEvents.length) {
        const event = allLevelEvents[eventIndex];
        
        if (currentTime >= event.time) {
            // Handle different event types
            if (event.type === 'upgradeChoice') {
                // Trigger upgrade event
                setActiveUpgradeEvent(event);
                const leftDesc = getBonusDescription(event.leftBonus);
                const rightDesc = getBonusDescription(event.rightBonus);
                console.log(`🎯 Upgrade choice triggered: ${leftDesc} vs ${rightDesc}`);
            } else {
                // Spawn enemy with custom properties
                createEnemyFromSpawnEvent(event);
            }
            eventIndex++;
        } else {
            break; // Wait for next event time
        }
    }
    
    // Check if level is complete (all events processed and enemies defeated)
    if (eventIndex >= allLevelEvents.length && enemies.length === 0 && !isLevelCompletionDelayActive()) {
        // Start completion delay to allow for final explosion
        setLevelCompletionDelayActive(true);
        console.log(`Level complete! Starting completion delay...`);
        
        // Wait for delay before showing win screen
        setTimeout(() => {
            setLevelComplete(true);
            setLevelCompletionDelayActive(false);
            console.log(`Level completion delay finished, showing win screen.`);
            
            // Call the level completion handler
            if (window.handleLevelCompletion) {
                window.handleLevelCompletion(currentLevelNumber);
            }
        }, 1000); // 1 second delay
    }
}

export function isLevelComplete() {
    return levelComplete;
}

export function getCurrentLevel() {
    return currentLevel;
}

export function getCurrentLevelNumber() {
    return currentLevelNumber;
} 