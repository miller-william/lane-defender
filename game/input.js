import { keys, gameOver, touchTargetX, isTouchActive, player } from './state.js';

// Coordinate translation for scaled canvas
export function getCanvasCoords(touchEvent, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const touch = touchEvent.touches[0];
    return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}

// Input handling
export function handleKeyDown(e) {
    if (gameOver) return;
    keys[e.code] = true;
}

export function handleKeyUp(e) {
    if (gameOver) return;
    keys[e.code] = false;
}

// Touch handling for canvas
export function handleTouch(e, canvas) {
    if (gameOver) return;
    e.preventDefault();

    const { x: touchX } = getCanvasCoords(e, canvas);
    
    // Move player towards touch position
    if (touchX < player.x) {
        keys.ArrowLeft = true;
        keys.ArrowRight = false;
    } else if (touchX > player.x + player.width) {
        keys.ArrowLeft = false;
        keys.ArrowRight = true;
    } else {
        keys.ArrowLeft = false;
        keys.ArrowRight = false;
    }
}

export function handleTouchEnd(e) {
    if (gameOver) return;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
}

// Touch control area handling
export function handleTouchMove(e, canvas) {
    if (gameOver) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touch = e.touches[0];
    touchTargetX = (touch.clientX - rect.left) * scaleX;
}

export function handleTouchStart(e, canvas) {
    isTouchActive = true;
    handleTouchMove(e, canvas);
}

export function handleTouchAreaEnd() {
    isTouchActive = false;
    touchTargetX = null;
}

// Next level button click handler
function handleNextLevelClick(e, canvas) {
    if (!window.nextLevelButton) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clickX, clickY;
    
    if (e.type === 'click') {
        clickX = (e.clientX - rect.left) * scaleX;
        clickY = (e.clientY - rect.top) * scaleY;
    } else if (e.type === 'touchend') {
        clickX = (e.changedTouches[0].clientX - rect.left) * scaleX;
        clickY = (e.changedTouches[0].clientY - rect.top) * scaleY;
    }
    
    const button = window.nextLevelButton;
    if (clickX >= button.x && clickX <= button.x + button.width &&
        clickY >= button.y && clickY <= button.y + button.height) {
        console.log('Loading next level...');
        location.reload(); // For now, just reload the game
    }
}

// Initialize input handlers
export function initializeInput(canvas) {
    const touchArea = document.getElementById('touchControlArea');

    // Touch control area setup
    touchArea.addEventListener('touchstart', e => handleTouchStart(e, canvas));
    touchArea.addEventListener('touchmove', e => handleTouchMove(e, canvas));
    touchArea.addEventListener('touchend', handleTouchAreaEnd);

    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', e => handleTouch(e, canvas), { passive: false });
    canvas.addEventListener('touchmove', e => handleTouch(e, canvas), { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Next level button click handling
    canvas.addEventListener('click', e => handleNextLevelClick(e, canvas));
    canvas.addEventListener('touchend', e => handleNextLevelClick(e, canvas));
} 