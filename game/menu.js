import { setPerfectCompletion, isLevelPerfectlyCompleted, getEnemiesDefeated, getDamageTaken, getStartingHealth, playerActiveBonuses, isLevelPerfect } from './state.js';
import { DEV_MODE, GAME_CONFIG, STORAGE_KEYS } from './config.js';

// Menu system state
let unlockedLevel = 1;
let currentLevel = null;
let lastPlayedLevel = null; // Track the last level played
let gameResult = null; // 'win' or 'lose'

// Load unlocked level from localStorage
function loadUnlockedLevel() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL);
        if (saved) {
            unlockedLevel = parseInt(saved, 10);
            console.log(`Loaded unlocked level from storage: ${unlockedLevel}`);
        } else {
            console.log('No saved unlocked level found, starting at level 1');
        }
    } catch (error) {
        console.warn('Failed to load unlocked level:', error);
        unlockedLevel = 1;
    }
}

// Save unlocked level to localStorage
function saveUnlockedLevel() {
    try {
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, unlockedLevel.toString());
        console.log(`Saved unlocked level to storage: ${unlockedLevel}`);
    } catch (error) {
        console.warn('Failed to save unlocked level:', error);
    }
}

    // UI elements
    let menuScreen = null;
    let gameWrapper = null;
    let gameOverScreen = null;
    let levelButtons = null;
    let aboutButton = null;
    let instructionsButton = null;
    let returnToMenuButton = null;
    let retryLevelButton = null;
    let playAgainButton = null;
    let nextLevelButton = null;
    let touchControlArea = null;

// Initialize menu system
export function initializeMenu() {
    // Load unlocked level from persistent storage
    loadUnlockedLevel();
    
    menuScreen = document.getElementById('menuScreen');
    gameWrapper = document.getElementById('gameWrapper');
    gameOverScreen = document.getElementById('gameOverScreen');
    levelButtons = document.getElementById('levelButtons');
    aboutButton = document.getElementById('aboutButton');
    instructionsButton = document.getElementById('instructionsButton');
    returnToMenuButton = document.getElementById('returnToMenu');
    retryLevelButton = document.getElementById('retryLevel');
    playAgainButton = document.getElementById('playAgain');
    nextLevelButton = document.getElementById('nextLevel');
    touchControlArea = document.getElementById('touchControlArea');
    
    // Check if this is the first time and show how to play popup
    checkAndShowHowToPlay();
    
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
    
    if (instructionsButton) {
        instructionsButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleInstructionsClick();
        }, { passive: false });
        instructionsButton.addEventListener('click', handleInstructionsClick);
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
    
    // Add event listener for back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleBackClick();
        }, { passive: false });
        backButton.addEventListener('click', handleBackClick);
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
                startLevelInMenu(i);
            }, { passive: false });
            
            // Keep click for desktop
            button.addEventListener('click', (e) => {
                e.preventDefault();
                startLevelInMenu(i);
            });
        }
        
        levelButtons.appendChild(button);
    }
    
    // Add legend for perfect completion
    // addPerfectLegend();
    
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
function startLevelInMenu(levelNumber) {
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
    // Restore body scrolling
    document.body.style.overflow = '';
    
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
    // Restore body scrolling
    document.body.style.overflow = '';
    
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

// Check if this is the first time and show how to play popup
function checkAndShowHowToPlay() {
    const hasSeenTips = localStorage.getItem('firstSeenGameTips');
    
    if (!hasSeenTips) {
        const popup = document.getElementById('howToPlayPopup');
        const gotItButton = document.getElementById('gotItButton');
        
        if (popup && gotItButton) {
            // Show the popup
            popup.style.display = 'flex';
            
            // Add event listener to the "Got it!" button
            gotItButton.addEventListener('click', () => {
                // Set the flag in localStorage
                localStorage.setItem('firstSeenGameTips', 'true');
                
                // Hide the popup
                popup.style.display = 'none';
            });
            
            // Also allow clicking outside the popup to dismiss it
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    localStorage.setItem('firstSeenGameTips', 'true');
                    popup.style.display = 'none';
                }
            });
        }
    }
}

// Show game over screen with appropriate message
export function showGameOver(result = 'lose', levelNumber = null) {
    gameResult = result;
    
    // Prevent body scrolling when game over screen is shown
    document.body.style.overflow = 'hidden';
    
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
    
    // Update mission debrief
    updateMissionDebrief(result, levelNumber);
    
    // Handle stats box visibility
    const statsElement = document.getElementById('levelStats');
    if (statsElement) {
        if (result === 'win') {
            // Show and populate stats for win screen
            statsElement.style.display = 'block';
            populateLevelStats(levelNumber);
        } else {
            // Hide stats box for lose screen
            statsElement.style.display = 'none';
        }
    }
    
    console.log(`Game over screen shown with result: ${result}${levelNumber ? ` for level ${levelNumber}` : ''}`);
}

// Debrief messages for each level
const debriefMessages = {
    1: {
        win: "Welcome to the river, young defender! You've successfully completed your first mission. The small stream is now safe from basic pollutants. Your journey as a river guardian begins!",
        lose: "Don't worry, rookie fish! Level 1 is just the beginning. Even the most experienced defenders started with simple streams. Try again and show the river your determination!"
    },
    2: {
        win: "Outstanding! You've cleaned up the sewage! Did you know? Sewage pollution lowers oxygen in rivers, which can suffocate fish and other wildlife.",
        lose: "The poop got you."
    },
    3: {
        win: "Impressive work! You've cleared the fast food containers! Did you know? Single-use packaging is one of the most common forms of river litter.",
        lose: "The moderate currents of level 3 can be tricky. Remember, even the strongest rivers started as small streams. Keep flowing forward!"
    },
    4: {
        win: "Outstanding! You've cleaned up the chemical waste barrels! Chemicals dumped in rivers can devastate ecosystems.",
        lose: "Level 4's stronger currents tested your limits. But remember, the river doesn't flow in straight lines. Adapt and overcome!"
    },
    5: {
        win: "Magnificent! Level 5's challenging waters are now pristine. Did you keep the ducks alive? Ducks are a symbol of the river's health.",
        lose: "Level 5's deep waters are challenging indeed. But every great river defender faced deep currents. Your determination will carry you through!"
    },
    6: {
        win: "Extraordinary! That was a tricky one. The ecosystem thanks you!",
        lose: "Level 6's complex patterns are difficult to master. But complexity is just many simple patterns combined. Break it down and try again!"
    },
    7: {
        win: "Legendary performance! Level 7's treacherous waters are now pure. You're among the elite river defenders. The river's heart beats strong!",
        lose: "Level 7's treacherous waters are not for the faint-hearted. But legends are made by those who face the greatest challenges. Rise to the occasion!"
    },
    8: {
        win: "Masterful! You've conquered the wall of poop! Your river defense skills are now legendary. The entire watershed is in awe!",
        lose: "Those zombie fish are deadly - don't let them get to you!"
    },
    9: {
        win: "Incredible! Level 9's ultimate challenge has been overcome. You're now a river defense virtuoso. The entire aquatic world celebrates your victory!",
        lose: "Level 9's ultimate challenge is not easily conquered. But virtuosos are made through persistence. Your potential is limitless!"
    },
    10: {
        win: "PERFECT! You've achieved the impossible - level 10 is pure! You are now the ultimate river defender, a true guardian of the waters. The entire river system bows to your mastery!",
        lose: "Level 10 is the ultimate test of river defense. Even the greatest defenders face setbacks here. But legends are forged in the fires of challenge. You have what it takes!"
    },
    default: {
        win: "Excellent work, fish warrior! You've successfully defended the river from invaders. The aquatic ecosystem thanks you!",
        lose: "Mission failed, brave fish. The river needs you to try again. Don't give up!"
    }
};

// Update mission debrief based on result
function updateMissionDebrief(result, levelNumber) {
    const debriefElement = document.getElementById('missionDebrief');
    if (!debriefElement) return;
    
    const messages = debriefMessages[levelNumber] || debriefMessages.default;
    debriefElement.textContent = result === 'win' ? messages.win : messages.lose;
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
                    case 'fireRate': return `🌪️ Fire Rate ${valueText}`;
                    case 'damage': return `🌊 Damage ${valueText}`;
                    case 'spread': return `💦 Spread ${valueText}`;
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
    
    // Animate stats one by one
    animateStats();
}

// Animate stats with staggered timing
function animateStats() {
    const statElements = [
        document.getElementById('enemiesDefeated'),
        document.getElementById('damageTaken'),
        document.getElementById('bonusesUsed')
    ].filter(el => el); // Remove any null elements
    
    // Add perfect badge to animation if it exists and is visible
    const perfectBadge = document.getElementById('perfectBadge');
    if (perfectBadge && perfectBadge.style.display !== 'none') {
        statElements.push(perfectBadge);
    }
    
    // Reset all elements to initial state first
    statElements.forEach(element => {
        element.classList.remove('animate-in');
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
    });
    
    // Animate each element with staggered timing
    statElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
            console.log(`Animating stat element ${index + 1}: ${element.textContent}`);
            
            // Fallback: if CSS animation doesn't work, use JavaScript animation
            setTimeout(() => {
                if (element.style.opacity !== '1') {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }
            }, 100);
        }, 1200 + (index * 300)); // Start after debrief animation, stagger by 300ms
    });
    
    console.log(`Starting stats animation for ${statElements.length} elements`);
}

// Handle about button click
function handleAboutClick() {
    alert('About River Revival\n\nA pixel art tower defense game where you defend against waves of enemies!\n\n⭐ Perfect Score: Complete a level without taking any damage!');
}

// Handle instructions button click
function handleInstructionsClick() {
    const menuScreen = document.getElementById('menuScreen');
    const instructionsScreen = document.getElementById('instructionsScreen');
    
    if (menuScreen && instructionsScreen) {
        menuScreen.style.display = 'none';
        instructionsScreen.style.display = 'flex';
    }
}

// Handle back button click
function handleBackClick() {
    const menuScreen = document.getElementById('menuScreen');
    const instructionsScreen = document.getElementById('instructionsScreen');
    
    if (menuScreen && instructionsScreen) {
        instructionsScreen.style.display = 'none';
        menuScreen.style.display = 'flex';
    }
}

// Handle return to menu button click
function handleReturnToMenu() {
    // Update progress if level was completed
    if (gameResult === 'win' && currentLevel && currentLevel === unlockedLevel) {
        unlockedLevel = Math.min(unlockedLevel + 1, 10);
        saveUnlockedLevel(); // Save the updated unlocked level
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
        startLevelInMenu(lastPlayedLevel);
    } else {
        // Fallback to current level or level 1
        const levelToStart = currentLevel || 1;
        console.log(`No last played level, starting level ${levelToStart}`);
        startLevelInMenu(levelToStart);
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
            
            // Update unlocked level to the next level since player completed the previous level
            if (nextLevel > unlockedLevel) {
                unlockedLevel = nextLevel;
                saveUnlockedLevel(); // Save the updated unlocked level
                console.log(`Unlocked level updated to ${unlockedLevel}`);
            }
            
            resetGameState();
            startLevelInMenu(nextLevel);
        } else {
            console.log('No more levels available');
            showMenu();
            resetGame();
        }
    } else {
        // Fallback to level 2 if no last played level
        console.log('No last played level, starting level 2');
        
        // Update unlocked level to level 2 since player is progressing
        if (2 > unlockedLevel) {
            unlockedLevel = 2;
            saveUnlockedLevel(); // Save the updated unlocked level
            console.log(`Unlocked level updated to ${unlockedLevel}`);
        }
        
        resetGameState();
        startLevelInMenu(2);
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

// Set last played level (for updating when level is completed)
export function setLastPlayedLevel(levelNumber) {
    lastPlayedLevel = levelNumber;
    console.log(`Last played level set to ${levelNumber}`);
}

// Get game result
export function getGameResult() {
    return gameResult;
}

// Reset unlocked level (for testing purposes)
export function resetUnlockedLevel() {
    unlockedLevel = 1;
    saveUnlockedLevel();
    renderLevelButtons(); // Re-render to reflect the change
}

// Unlock a specific level (for testing purposes)
export function unlockLevel(levelNumber) {
    if (levelNumber > unlockedLevel) {
        unlockedLevel = levelNumber;
        saveUnlockedLevel();
        renderLevelButtons(); // Re-render to reflect the change
        console.log(`Level ${levelNumber} unlocked`);
    }
}

// Test function to verify persistent storage (can be called from browser console)
export function testPersistentStorage() {
    console.log('=== Testing Persistent Storage ===');
    console.log(`Current unlocked level: ${unlockedLevel}`);
    console.log(`Storage key: ${STORAGE_KEYS.UNLOCKED_LEVEL}`);
    console.log(`Storage value: ${localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL)}`);
    console.log('=== End Test ===');
} 