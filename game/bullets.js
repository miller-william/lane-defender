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
    bullets.forEach(bullet => {
        ctx.save();
        
        // Set up water droplet colors
        const waterColors = {
            '#ffff00': ['#4a90e2', '#6ba3e8', '#87ceeb'], // Blue water droplets for default
            '#00ff00': ['#4a90e2', '#6ba3e8', '#87ceeb'], // Blue water droplets for green
            '#ff0000': ['#ff6b6b', '#ff8e8e', '#ffb3b3'], // Red water droplets
            '#0000ff': ['#4a90e2', '#6ba3e8', '#87ceeb'], // Blue water droplets
            '#ff00ff': ['#e6a3e6', '#f0b3f0', '#f8c3f8'], // Purple water droplets
        };
        
        // Get water colors based on bullet color, default to blue
        const colors = waterColors[bulletColor] || waterColors['#ffff00'];
        
        // Rotate bullet based on its angle
        if (bullet.angle) {
            ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
            ctx.rotate(bullet.angle);
            drawWaterDroplet(ctx, -bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height, colors);
        } else {
            drawWaterDroplet(ctx, bullet.x, bullet.y, bullet.width, bullet.height, colors);
        }
        
        ctx.restore();
    });
}

function drawWaterDroplet(ctx, x, y, width, height, colors) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2;
    
    // Create teardrop shape
    ctx.beginPath();
    
    // Top curve (wider part)
    ctx.arc(centerX, centerY - radius * 0.3, radius * 0.8, 0, Math.PI * 2);
    
    // Bottom point
    ctx.moveTo(centerX - radius * 0.3, centerY + radius * 0.2);
    ctx.quadraticCurveTo(centerX, centerY + radius * 1.2, centerX + radius * 0.3, centerY + radius * 0.2);
    
    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY - radius * 0.5, 0, centerX, centerY, radius * 1.5);
    gradient.addColorStop(0, colors[0]);   // Darker center
    gradient.addColorStop(0.6, colors[1]); // Medium
    gradient.addColorStop(1, colors[2]);   // Lighter edge
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add highlight
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.2, centerY - radius * 0.4, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
    
    // Add outline
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1;
    ctx.stroke();
} 