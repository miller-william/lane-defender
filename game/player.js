import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { player, keys, touchTargetX, isTouchActive, gameOver } from './state.js';

// Player image cache
let playerImage = null;

// Load player image
function loadPlayerImage() {
    if (!playerImage) {
        playerImage = new Image();
        playerImage.src = 'assets/images/wizard.png';
    }
    return playerImage;
}

// Player movement
export function updatePlayer() {
    if (gameOver) return;
    
    // Smooth touch movement
    if (touchTargetX !== null) {
        const playerCenter = player.x + player.width / 2;
        const dx = touchTargetX - playerCenter;
        player.x += dx * 0.2; // smoothing factor
    } else if (!isTouchActive) {
        // Arrow key movement only when touch is not active
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < CANVAS_WIDTH - player.width) {
            player.x += player.speed;
        }
    }
    
    // Clamp player position
    player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x));
}

// Drawing functions
export function drawPlayer(ctx) {
    const img = loadPlayerImage();
    
    if (img.complete) {
        // Draw the wizard image
        ctx.drawImage(img, player.x, player.y, player.width, player.height);
    } else {
        // Fallback to green rectangle while image loads
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
} 