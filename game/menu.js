import { setPerfectCompletion, isLevelPerfectlyCompleted, getEnemiesDefeated, getDamageTaken, getStartingHealth, playerActiveBonuses, isLevelPerfect } from './state.js';

// Menu system state
let unlockedLevel = 1;
let currentLevel = null;
let lastPlayedLevel = null; // Track the last level played
let gameResult = null; // 'win' or 'lose'

// Dev options - toggle these for testing
const DEV_MODE = {
    ALL_LEVELS_UNLOCKED: true, // Set to true to unlock all levels for testing
    INFINITE_HEALTH: false, // Set to true for infinite health
    INSTANT_WIN: false // Set to true to instantly complete levels
};

    // UI elements
    let menuScreen = null;
    let gameWrapper = null;
    let gameOverScreen = null;
    let levelButtons = null;
    let aboutButton = null;
    let returnToMenuButton = null;
    let retryLevelButton = null;
    let playAgainButton = null;
    let nextLevelButton = null;
    let touchControlArea = null;

// Initialize menu system
export function initializeMenu() {
    menuScreen = document.getElementById('menuScreen');
    gameWrapper = document.getElementById('gameWrapper');
    gameOverScreen = document.getElementById('gameOverScreen');
    levelButtons = document.getElementById('levelButtons');
    aboutButton = document.getElementById('aboutButton');
    returnToMenuButton = document.getElementById('returnToMenu');
    retryLevelButton = document.getElementById('retryLevel');
    playAgainButton = document.getElementById('playAgain');
    nextLevelButton = document.getElementById('nextLevel');
    touchControlArea = document.getElementById('touchControlArea');
    
    // Note: Some buttons may not exist initially (they're in gameOverScreen which is hidden)
    // Event listeners are added with null checks below
    
    // Set up event listeners with mobile compatibility
    if (aboutButton) {
        aboutButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleAboutClick();
        }, { passive: false });
        aboutButton.addEventListener('click', handleAboutClick);
    }
    
    if (returnToMenuButton) {
        returnToMenuButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleReturnToMenu();
        }, { passive: false });
        returnToMenuButton.addEventListener('click', handleReturnToMenu);
    }
    
    if (retryLevelButton) {
        retryLevelButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleRetryLevel();
        }, { passive: false });
        retryLevelButton.addEventListener('click', handleRetryLevel);
    }
    
    // Set up event listeners for new buttons
    if (playAgainButton) {
        playAgainButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handlePlayAgain();
        }, { passive: false });
        playAgainButton.addEventListener('click', handlePlayAgain);
    }
    
    if (nextLevelButton) {
        nextLevelButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleNextLevel();
        }, { passive: false });
        nextLevelButton.addEventListener('click', handleNextLevel);
    }
    
    // Render initial level buttons
    renderLevelButtons();
    
    // Show dev mode indicator if any dev options are enabled
    if (DEV_MODE.ALL_LEVELS_UNLOCKED || DEV_MODE.INFINITE_HEALTH || DEV_MODE.INSTANT_WIN) {
        showDevModeIndicator();
    }
}

// Show dev mode indicator
function showDevModeIndicator() {
    const devIndicator = document.createElement('div');
    devIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ff0000;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        z-index: 1000;
    `;
    devIndicator.textContent = 'DEV MODE';
    document.body.appendChild(devIndicator);
    
    console.log('DEV MODE ACTIVE - Options enabled:');
    console.log('- ALL_LEVELS_UNLOCKED:', DEV_MODE.ALL_LEVELS_UNLOCKED);
    console.log('- INFINITE_HEALTH:', DEV_MODE.INFINITE_HEALTH);
    console.log('- INSTANT_WIN:', DEV_MODE.INSTANT_WIN);
}

// Render level buttons based on unlocked levels
function renderLevelButtons() {
    if (!levelButtons) {
        console.error('levelButtons element not found!');
        return;
    }
    
    levelButtons.innerHTML = '';
    
    // Use dev mode to determine which levels are unlocked
    const effectiveUnlockedLevel = DEV_MODE.ALL_LEVELS_UNLOCKED ? 10 : unlockedLevel;
    
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.className = 'levelButton';
        button.textContent = `Level ${i}`;
        button.disabled = i > effectiveUnlockedLevel;
        
        // Add perfect completion indicator
        if (isLevelPerfectlyCompleted(i)) {
            button.classList.add('perfect-completed');
            // Add star icon
            const star = document.createElement('span');
            star.textContent = ' ⭐';
            star.style.color = '#FFD700';
            star.style.fontSize = '14px';
            button.appendChild(star);
        }
        
        if (i <= effectiveUnlockedLevel) {
            // Use touchstart for mobile compatibility
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                startLevel(i);
            }, { passive: false });
            
            // Keep click for desktop
            button.addEventListener('click', (e) => {
                e.preventDefault();
                startLevel(i);
            });
        }
        
        levelButtons.appendChild(button);
    }
    
    // Add legend for perfect completion
    addPerfectLegend();
    
    if (DEV_MODE.ALL_LEVELS_UNLOCKED) {
        console.log('DEV MODE: All levels unlocked for testing');
    }
}

// Add legend for perfect completion
function addPerfectLegend() {
    // Remove existing legend if any
    const existingLegend = document.getElementById('perfectLegend');
    if (existingLegend) {
        existingLegend.remove();
    }
    
    const legend = document.createElement('div');
    legend.id = 'perfectLegend';
    legend.style.cssText = `
        text-align: center;
        margin-top: 10px;
        font-size: 12px;
        color: #FFD700;
        font-weight: bold;
    `;
    legend.textContent = '⭐ = Perfect Score';
    
    levelButtons.appendChild(legend);
}

// Start a specific level
function startLevel(levelNumber) {
    currentLevel = levelNumber;
    lastPlayedLevel = levelNumber; // Track this as the last played level
    gameResult = null; // Reset game result
    showGame();
    
    // Initialize game systems
    const canvas = document.getElementById('gameCanvas');
    initializeGameSystems(canvas);
    
    // Start the level
    startLevelGame(levelNumber);
}

// Show game screen
function showGame() {
    menuScreen.style.display = 'none';
    gameWrapper.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    touchControlArea.style.display = 'block';
    
    // Remove any existing transition classes
    gameOverScreen.classList.remove('show');
    
    // Trigger smooth transition animation for game wrapper
    setTimeout(() => {
        gameWrapper.classList.add('show');
    }, 50); // Small delay to ensure display is set
}

// Show menu screen
function showMenu() {
    menuScreen.style.display = 'flex';
    gameWrapper.style.display = 'none';
    gameOverScreen.style.display = 'none';
    touchControlArea.style.display = 'none';
    
    // Remove transition classes
    gameWrapper.classList.remove('show');
    gameOverScreen.classList.remove('show');
    
    // Re-render level buttons to show any new unlocks
    renderLevelButtons();
}

// Show game over screen with appropriate message
export function showGameOver(result = 'lose', levelNumber = null) {
    gameResult = result;
    
    // Hide game wrapper and show game over screen
    gameWrapper.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    touchControlArea.style.display = 'none';
    
    // Trigger smooth transition animation
    setTimeout(() => {
        gameOverScreen.classList.add('show');
    }, 50); // Small delay to ensure display is set
    
    // Update the screen title based on result
    const titleElement = gameOverScreen.querySelector('h2');
    if (titleElement) {
        if (result === 'win') {
            titleElement.textContent = levelNumber ? `Level ${levelNumber} Complete!` : 'Level Complete!';
            titleElement.style.color = '#00ff00';
        } else {
            titleElement.textContent = 'Game Over';
            titleElement.style.color = '#ff0000';
        }
    }
    
    // Populate stats for win screen
    if (result === 'win') {
        populateLevelStats(levelNumber);
    }
    
    console.log(`Game over screen shown with result: ${result}${levelNumber ? ` for level ${levelNumber}` : ''}`);
}

// Populate level statistics
function populateLevelStats(levelNumber) {
    const enemiesDefeatedElement = document.getElementById('enemiesDefeated');
    const damageTakenElement = document.getElementById('damageTaken');
    const bonusesUsedElement = document.getElementById('bonusesUsed');
    const perfectBadgeElement = document.getElementById('perfectBadge');
    const statsContainer = document.getElementById('levelStats');
    const nextLevelButton = document.getElementById('nextLevel');
    
    // Update stats
    if (enemiesDefeatedElement) {
        enemiesDefeatedElement.textContent = `Enemies Defeated: ${getEnemiesDefeated()}`;
    }
    
    if (damageTakenElement) {
        damageTakenElement.textContent = `Damage Taken: ${getDamageTaken()}`;
    }
    
    // Format bonuses used (combine same types)
    if (bonusesUsedElement) {
        const bonuses = playerActiveBonuses;
        if (bonuses.length > 0) {
            // Group bonuses by type and sum their values
            const groupedBonuses = {};
            bonuses.forEach(bonus => {
                if (!groupedBonuses[bonus.type]) {
                    groupedBonuses[bonus.type] = 0;
                }
                groupedBonuses[bonus.type] += bonus.value;
            });
            
            // Convert to readable text
            const bonusText = Object.entries(groupedBonuses).map(([type, totalValue]) => {
                const valueText = totalValue >= 0 ? `+${totalValue}` : `${totalValue}`;
                switch (type) {
                    case 'fireRate': return `🔥 Fire Rate ${valueText}`;
                    case 'damage': return `💥 Damage ${valueText}`;
                    case 'spread': return `🎯 Spread ${valueText}`;
                    default: return `${type} ${valueText}`;
                }
            }).join(', ');
            bonusesUsedElement.textContent = `Bonuses Used: ${bonusText}`;
        } else {
            bonusesUsedElement.textContent = 'Bonuses Used: None';
        }
    }
    
    // Show/hide perfect badge
    if (perfectBadgeElement && statsContainer) {
        if (isLevelPerfectlyCompleted(levelNumber)) {
            perfectBadgeElement.style.display = 'block';
            statsContainer.classList.add('perfect');
        } else {
            perfectBadgeElement.style.display = 'none';
            statsContainer.classList.remove('perfect');
        }
    }
    
    // Show/hide next level button
    if (nextLevelButton && levelNumber) {
        const nextLevel = levelNumber + 1;
        if (nextLevel <= 10) { // Assuming max 10 levels
            nextLevelButton.style.display = 'block';
            nextLevelButton.textContent = `Next Level (${nextLevel})`;
        } else {
            nextLevelButton.style.display = 'none';
        }
    }
}

// Handle about button click
function handleAboutClick() {
    alert('About Defend the Rift\n\nA tower defense game where you defend against waves of enemies!\n\n⭐ Perfect Score: Complete a level without taking any damage!');
}

// Handle return to menu button click
function handleReturnToMenu() {
    // Update progress if level was completed
    if (gameResult === 'win' && currentLevel && currentLevel === unlockedLevel) {
        unlockedLevel = Math.min(unlockedLevel + 1, 10);
    }
    
    showMenu();
    resetGame();
}

// Handle retry level button click
function handleRetryLevel() {
    console.log(`Retry level clicked. lastPlayedLevel=${lastPlayedLevel}, currentLevel=${currentLevel}`);
    
    if (lastPlayedLevel) {
        // Reset game state first
        console.log(`Resetting game state and restarting level ${lastPlayedLevel}`);
        resetGameState();
        
        // Restart the same level
        startLevel(lastPlayedLevel);
    } else {
        // Fallback to current level or level 1
        const levelToStart = currentLevel || 1;
        console.log(`No last played level, starting level ${levelToStart}`);
        startLevel(levelToStart);
    }
}

// Handle play again button click (same as retry)
function handlePlayAgain() {
    handleRetryLevel();
}

// Handle next level button click
function handleNextLevel() {
    console.log(`Next level clicked. lastPlayedLevel=${lastPlayedLevel}, currentLevel=${currentLevel}`);
    
    if (lastPlayedLevel) {
        const nextLevel = lastPlayedLevel + 1;
        if (nextLevel <= 10) { // Assuming max 10 levels
            console.log(`Starting next level ${nextLevel}`);
            resetGameState();
            startLevel(nextLevel);
        } else {
            console.log('No more levels available');
            showMenu();
            resetGame();
        }
    } else {
        // Fallback to level 2 if no last played level
        console.log('No last played level, starting level 2');
        resetGameState();
        startLevel(2);
    }
}

// Reset game state
function resetGame() {
    // Reset all game state
    resetGameState();
    currentLevel = null;
    gameResult = null;
    // Don't reset lastPlayedLevel - preserve it for retry functionality
}

// Import functions from other modules (these will be implemented)
let initializeGameSystems = null;
let startLevelGame = null;
let resetGameState = null;

// Set the imported functions
export function setGameFunctions(initGame, startLevel, reset) {
    initializeGameSystems = initGame;
    startLevelGame = startLevel;
    resetGameState = reset;
}

// Get current unlocked level
export function getUnlockedLevel() {
    return unlockedLevel;
}

// Get current level
export function getCurrentLevel() {
    return currentLevel;
}

// Get last played level
export function getLastPlayedLevel() {
    return lastPlayedLevel;
}

// Get game result
export function getGameResult() {
    return gameResult;
} 