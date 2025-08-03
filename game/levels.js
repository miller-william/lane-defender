import { enemies, setEnemies, setLevelComplete } from './state.js';
import { createEnemyFromSpawnEvent } from './enemies.js';
import { LEVELS } from '../levels/index.js';

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



// Level state
let currentLevel = null;
let levelStartTime = 0;
let spawnEventIndex = 0;
let expandedSpawnEvents = [];

// Level management functions
export function startLevel(levelNumber) {
    const level = LEVELS[levelNumber];
    if (!level) {
        console.error(`Level ${levelNumber} not found`);
        return;
    }
    
    // Expand bulk spawn events into individual spawn events
    expandedSpawnEvents = expandBulkSpawnEvents(level.spawnEvents);
    
    currentLevel = level;
    levelStartTime = Date.now();
    spawnEventIndex = 0;
    setLevelComplete(false);
    
    console.log(`Starting Level ${levelNumber}: ${level.name}`);
    console.log(`Expanded ${level.spawnEvents.length} spawn events into ${expandedSpawnEvents.length} individual events`);
    
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
    
    // Check for spawn events using expanded events
    while (spawnEventIndex < expandedSpawnEvents.length) {
        const event = expandedSpawnEvents[spawnEventIndex];
        
        if (currentTime >= event.time) {
            // Spawn enemy with custom properties
            createEnemyFromSpawnEvent(event);
            spawnEventIndex++;
        } else {
            break; // Wait for next spawn time
        }
    }
    
    // Check if level is complete (all enemies spawned and defeated)
    if (spawnEventIndex >= expandedSpawnEvents.length && enemies.length === 0) {
        setLevelComplete(true);
        console.log(`Level complete! All enemies defeated.`);
    }
}



export function isLevelComplete() {
    return levelComplete;
}

export function getCurrentLevel() {
    return currentLevel;
} 