// Menu system state
let unlockedLevel = 1;
let currentLevel = null;

// UI elements
let menuScreen = null;
let gameWrapper = null;
let gameOverScreen = null;
let levelButtons = null;
let aboutButton = null;
let returnToMenuButton = null;

// Initialize menu system
export function initializeMenu() {
    menuScreen = document.getElementById('menuScreen');
    gameWrapper = document.getElementById('gameWrapper');
    gameOverScreen = document.getElementById('gameOverScreen');
    levelButtons = document.getElementById('levelButtons');
    aboutButton = document.getElementById('aboutButton');
    returnToMenuButton = document.getElementById('returnToMenu');
    
    // Set up event listeners
    aboutButton.addEventListener('click', handleAboutClick);
    returnToMenuButton.addEventListener('click', handleReturnToMenu);
    
    // Render initial level buttons
    renderLevelButtons();
}

// Render level buttons based on unlocked levels
function renderLevelButtons() {
    levelButtons.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.className = 'levelButton';
        button.textContent = `Level ${i}`;
        button.disabled = i > unlockedLevel;
        
        if (i <= unlockedLevel) {
            button.addEventListener('click', () => startLevel(i));
        }
        
        levelButtons.appendChild(button);
    }
}

// Start a specific level
function startLevel(levelNumber) {
    currentLevel = levelNumber;
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
}

// Show menu screen
function showMenu() {
    menuScreen.style.display = 'flex';
    gameWrapper.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    // Re-render level buttons to show any new unlocks
    renderLevelButtons();
}

// Show game over screen
export function showGameOver() {
    gameOverScreen.style.display = 'flex';
}

// Handle about button click
function handleAboutClick() {
    alert('About Lane Defender\n\nA tower defense game where you defend against waves of enemies!');
}

// Handle return to menu button click
function handleReturnToMenu() {
    // Update progress if level was completed
    if (currentLevel && currentLevel === unlockedLevel) {
        unlockedLevel = Math.min(unlockedLevel + 1, 10);
    }
    
    showMenu();
    resetGame();
}

// Reset game state
function resetGame() {
    // Reset all game state
    resetGameState();
    currentLevel = null;
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