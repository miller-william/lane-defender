import { CANVAS_WIDTH, CANVAS_HEIGHT, BULLET_WIDTH, BULLET_HEIGHT, BULLET_SPEED } from './constants.js';
import { bullets, lastBulletFiredAt, bulletDamage, bulletFireRate, player, setBullets, setLastBulletFiredAt } from './state.js';

export function createBullet() {
    const currentTime = Date.now();
    
    // Check if enough time has passed since last bullet
    if (currentTime - lastBulletFiredAt >= bulletFireRate) {
        const bullet = {
            x: player.x + player.width / 2 - BULLET_WIDTH / 2,
            y: player.y,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            speed: BULLET_SPEED, // This will now be canvas height per second
            damage: bulletDamage
        };
        
        setBullets([...bullets, bullet]);
        setLastBulletFiredAt(currentTime);
    }
}

export function updateBullets(deltaTime) {
    const updatedBullets = bullets.map(bullet => ({
        ...bullet,
        y: bullet.y - (bullet.speed * CANVAS_HEIGHT * deltaTime) // Move upward
    }));
    
    // Filter out bullets that have moved off the top of the screen
    const filteredBullets = updatedBullets.filter(bullet => bullet.y + bullet.height > 0);
    setBullets(filteredBullets);
}

export function drawBullets(ctx) {
    ctx.fillStyle = '#ffff00';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
} 