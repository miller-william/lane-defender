import { initializeInput } from './game/input.js';
import { initializeGameLoop, startGameLoop } from './game/gameLoop.js';
import { startLevel } from './game/levels.js';
import { initializeMenu, setGameFunctions, showGameOver, resetUnlockedLevel, unlockLevel, testPersistentStorage, setLastPlayedLevel } from './game/menu.js';
import { 
    setBullets, setEnemies, setPlayerHealth, setGameOver, 
    setLevelComplete, setBulletDamage, setBulletFireRate, 
    setLevelPerfect, setPerfectCompletion, isLevelPerfect, setBulletColor, resetUpgradeSystem, setBulletSpread,
    setTotalEnemiesSpawned, setStartingHealth
} from './game/state.js';
import { getCurrentLevelNumber } from './game/levels.js';

// Game state reset function
function resetGameState() {
    // Reset arrays
    setBullets([]);
    setEnemies([]);
    
    // Reset player
    setPlayerHealth(5);
    setStartingHealth(5);
    
    // Reset game state
    setGameOver(false);
    setLevelComplete(false);
    setLevelPerfect(true); // Start with perfect score potential
    
    // Reset game variables
    setBulletDamage(1);
    setBulletFireRate(500);
    setBulletColor('#ff0000'); // Reset to default laser red
    setBulletSpread(0); // Reset spread to 0
    
    // Reset stats
    setTotalEnemiesSpawned(0);
    
    // Reset upgrade system
    resetUpgradeSystem();
    
    console.log('Game state reset complete');
}

// Initialize game systems
function initializeGameSystems(canvas) {
    initializeInput(canvas);
    initializeGameLoop(canvas);
}

// Start a specific level
function startLevelGame(levelNumber) {
    startLevel(levelNumber);
    startGameLoop();
}

// Handle level completion with perfect score tracking
function handleLevelCompletion(levelNumber) {
    const wasPerfect = isLevelPerfect();
    
    if (wasPerfect) {
        setPerfectCompletion(levelNumber, true);
        console.log(`🎉 Level ${levelNumber} completed perfectly!`);
    }
    
    // Update the last played level to the completed level
    // This ensures "Play Next Level" works correctly
    if (window.setLastPlayedLevel) {
        window.setLastPlayedLevel(levelNumber);
        console.log(`📝 Last played level updated to ${levelNumber}`);
    }
    
    // Unlock the next level immediately when level is completed
    // This ensures the level is unlocked regardless of whether the player
    // clicks "Play Next Level" or "Main Menu"
    if (window.unlockLevel && levelNumber < 10) { // Assuming max 10 levels
        const nextLevel = levelNumber + 1;
        window.unlockLevel(nextLevel);
        console.log(`🔓 Level ${nextLevel} unlocked automatically!`);
    }
    
    showGameOver('win', levelNumber);
}

// Initialize the game
function initializeGame() {
    // Initialize menu system
    initializeMenu();
    
    // Set up game functions for menu system
    setGameFunctions(initializeGameSystems, startLevelGame, resetGameState);
    
    // Set up level completion handler
    window.handleLevelCompletion = handleLevelCompletion;
    
    // Expose test functions to global scope for debugging
    window.resetUnlockedLevel = resetUnlockedLevel;
    window.unlockLevel = unlockLevel;
    window.testPersistentStorage = testPersistentStorage;
    window.setLastPlayedLevel = setLastPlayedLevel;
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame); 