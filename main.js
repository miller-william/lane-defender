// Game canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

// Player properties
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 7;

// Bullet properties
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const BULLET_SPEED = 6;

// Enemy properties
const ENEMY_RADIUS = 20;
const ENEMY_SPEED = 2;
const ENEMY_SPAWN_INTERVAL_MS = 1000; // milliseconds

// Dynamic game variables (can be changed via dev panel)
let bulletDamage = 1;
let bulletFireRate = 500; // milliseconds
let enemyHealth = 1;

// Game state
let player = {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: PLAYER_SPEED,
    health: 5,
    maxHealth: 5
};

let bullets = [];
let enemies = [];
let lastBulletFiredAt = 0;
let keys = {};
let gameOver = false;
let touchTargetX = null;
let isTouchActive = false;

// Input handling
function handleKeyDown(e) {
    if (gameOver) return;
    keys[e.code] = true;
}

function handleKeyUp(e) {
    if (gameOver) return;
    keys[e.code] = false;
}

// Coordinate translation for scaled canvas
function getCanvasCoords(touchEvent) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const touch = touchEvent.touches[0];
    return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}

// Touch handling
function handleTouch(e) {
    if (gameOver) return;
    e.preventDefault();

    const { x: touchX } = getCanvasCoords(e);
    
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

function handleTouchEnd(e) {
    if (gameOver) return;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
}

// Touch control area setup
const touchArea = document.getElementById('touchControlArea');

touchArea.addEventListener('touchstart', e => {
    isTouchActive = true;
    handleTouchMove(e);
});

touchArea.addEventListener('touchmove', handleTouchMove, { passive: false });
touchArea.addEventListener('touchend', () => {
    isTouchActive = false;
    touchTargetX = null;
});

function handleTouchMove(e) {
    if (gameOver) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touch = e.touches[0];
    touchTargetX = (touch.clientX - rect.left) * scaleX;
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd);

// Player movement
function updatePlayer() {
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

// Bullet management
function createBullet() {
    const currentTime = Date.now();
    if (currentTime - lastBulletFiredAt >= bulletFireRate) {
        bullets.push({
            x: player.x + player.width / 2 - BULLET_WIDTH / 2,
            y: player.y,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            speed: BULLET_SPEED,
            damage: bulletDamage
        });
        lastBulletFiredAt = currentTime;
    }
}

function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        return bullet.y + bullet.height > 0; // Remove bullets that go off screen
    });
}

// Enemy management
function createEnemy() {
    const x = Math.random() * (CANVAS_WIDTH - ENEMY_RADIUS * 2) + ENEMY_RADIUS;
    enemies.push({
        x: x,
        y: -ENEMY_RADIUS,
        radius: ENEMY_RADIUS,
        speed: ENEMY_SPEED,
        health: enemyHealth,
        maxHealth: enemyHealth
    });
}

function updateEnemies() {
    enemies = enemies.filter(enemy => {
        enemy.y += enemy.speed;
        if (enemy.y - enemy.radius >= CANVAS_HEIGHT) {
            player.health -= 1;
            if (player.health <= 0) {
                gameOver = true;
            }
            return false; // remove this enemy
        }
        return true;
    });
}

// Collision detection
function checkCollision(bullet, enemy) {
    const bulletCenterX = bullet.x + bullet.width / 2;
    const bulletCenterY = bullet.y + bullet.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(bulletCenterX - enemy.x, 2) + 
        Math.pow(bulletCenterY - enemy.y, 2)
    );
    
    return distance < enemy.radius + Math.max(bullet.width, bullet.height) / 2;
}

function handleCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], enemies[j])) {
                // Capture bullet reference before removing it
                const bullet = bullets[i];
                
                // Remove bullet
                bullets.splice(i, 1);
                
                // Reduce enemy health using captured bullet damage
                enemies[j].health -= bullet.damage;
                
                // Remove enemy if health is 0 or below
                if (enemies[j].health <= 0) {
                    enemies.splice(j, 1);
                }
                
                break; // Bullet can only hit one enemy
            }
        }
    }
}

// Drawing functions
function drawPlayer() {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlayerHealth() {
    const barWidth = 200;
    const barHeight = 20;
    const x = 20;
    const y = 20;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health
    const healthRatio = player.health / player.maxHealth;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawBullets() {
    ctx.fillStyle = '#ffff00';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Draw enemy circle
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar
        const healthBarWidth = enemy.radius * 2;
        const healthBarHeight = 4;
        const healthBarX = enemy.x - healthBarWidth / 2;
        const healthBarY = enemy.y - enemy.radius - 10;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // Health
        const healthRatio = enemy.health / enemy.maxHealth;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthRatio, healthBarHeight);
    });
}

// Game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (gameOver) {
        drawGameOver();
        return; // stop loop
    }
    
    // Update game state
    updatePlayer();
    createBullet();
    updateBullets();
    updateEnemies();
    handleCollisions();
    
    // Draw everything
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawPlayerHealth();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Dev panel event listeners
function initializeDevPanel() {
    const bulletDamageInput = document.getElementById('bulletDamage');
    const bulletFireRateInput = document.getElementById('bulletFireRate');
    const enemyHealthInput = document.getElementById('enemyHealth');
    const spawnEnemyButton = document.getElementById('spawnEnemy');

    // Update bullet damage
    bulletDamageInput.addEventListener('input', function() {
        bulletDamage = Math.max(1, parseInt(this.value) || 1);
    });

    // Update bullet fire rate
    bulletFireRateInput.addEventListener('input', function() {
        bulletFireRate = Math.max(50, parseInt(this.value) || 500);
    });

    // Update enemy health
    enemyHealthInput.addEventListener('input', function() {
        enemyHealth = Math.max(1, parseInt(this.value) || 3);
    });

    // Manual enemy spawn
    spawnEnemyButton.addEventListener('click', function() {
        createEnemy();
    });
}

// Initialize dev panel
initializeDevPanel();

// Start enemy spawning
setInterval(createEnemy, ENEMY_SPAWN_INTERVAL_MS);

// Start the game
gameLoop(); 