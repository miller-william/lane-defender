import { CANVAS_WIDTH, CANVAS_HEIGHT, BULLET_WIDTH, BULLET_HEIGHT, BULLET_SPEED } from './constants.js';
import { bullets, lastBulletFiredAt, bulletDamage, bulletFireRate, bulletColor, bulletSpread, player, setBullets, setLastBulletFiredAt } from './state.js';

export function createBullet() {
    const currentTime = Date.now();
    
    // Check if enough time has passed since last bullet
    if (currentTime - lastBulletFiredAt >= bulletFireRate) {
        const bulletsToCreate = [];
        
        if (bulletSpread === 0) {
            // Single bullet (center)
            bulletsToCreate.push({
                x: player.x + player.width / 2 - BULLET_WIDTH / 2,
                y: player.y,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                speed: BULLET_SPEED,
                damage: bulletDamage,
                angle: 0 // Straight up
            });
        } else {
            // Multiple bullets with spread
            const totalBullets = bulletSpread + 1; // +1 for center bullet
            const spreadAngle = 15; // Degrees between bullets
            
            for (let i = 0; i < totalBullets; i++) {
                const angleOffset = (i - (totalBullets - 1) / 2) * spreadAngle;
                const angleRadians = (angleOffset * Math.PI) / 180;
                
                bulletsToCreate.push({
                    x: player.x + player.width / 2 - BULLET_WIDTH / 2,
                    y: player.y,
                    width: BULLET_WIDTH,
                    height: BULLET_HEIGHT,
                    speed: BULLET_SPEED,
                    damage: bulletDamage,
                    angle: angleRadians // Angle in radians
                });
            }
        }
        
        setBullets([...bullets, ...bulletsToCreate]);
        setLastBulletFiredAt(currentTime);
    }
}

export function updateBullets(deltaTime) {
    const updatedBullets = bullets.map(bullet => {
        // Calculate movement based on angle
        const speedX = Math.sin(bullet.angle || 0) * bullet.speed * CANVAS_HEIGHT * deltaTime;
        const speedY = -Math.cos(bullet.angle || 0) * bullet.speed * CANVAS_HEIGHT * deltaTime;
        
        return {
            ...bullet,
            x: bullet.x + speedX,
            y: bullet.y + speedY
        };
    });
    
    // Filter out bullets that have moved off the screen
    const filteredBullets = updatedBullets.filter(bullet => {
        return bullet.y + bullet.height > 0 && 
               bullet.x + bullet.width > 0 && 
               bullet.x < CANVAS_WIDTH;
    });
    
    setBullets(filteredBullets);
}

export function drawBullets(ctx) {
    ctx.fillStyle = bulletColor; // Use the bullet color from state
    bullets.forEach(bullet => {
        ctx.save();
        
        // Rotate bullet based on its angle
        if (bullet.angle) {
            ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
            ctx.rotate(bullet.angle);
            ctx.fillRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
        } else {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
        
        ctx.restore();
    });
} 