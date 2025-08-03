import { BULLET_WIDTH, BULLET_HEIGHT, BULLET_SPEED } from './constants.js';
import { bullets, lastBulletFiredAt, bulletDamage, bulletFireRate, player, setLastBulletFiredAt, setBullets } from './state.js';

// Bullet management
export function createBullet() {
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
        setLastBulletFiredAt(currentTime);
    }
}

export function updateBullets() {
    const filteredBullets = bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        return bullet.y + bullet.height > 0; // Remove bullets that go off screen
    });
    setBullets(filteredBullets);
}

export function drawBullets(ctx) {
    ctx.fillStyle = '#ffff00';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
} 