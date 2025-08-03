import { CANVAS_WIDTH, CANVAS_HEIGHT, ENEMY_RADIUS, ENEMY_SPEED } from './constants.js';
import { enemies, enemyHealth, player, gameOver, setEnemies, setPlayerHealth, setGameOver } from './state.js';
import { ENEMY_TYPES } from './enemyTypes.js';

// Enemy management
export function createEnemy() {
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

export function createEnemyFromSpawnEvent(event) {
    const enemyType = ENEMY_TYPES[event.enemyType];
    
    if (!enemyType) {
        console.warn(`Unknown enemy type: ${event.enemyType}. Using basic enemy.`);
        return createEnemy(); // Fallback to basic enemy
    }
    
    // Create base enemy config from type template
    const baseConfig = {
        radius: enemyType.radius,
        speed: enemyType.defaultSpeed,
        health: enemyType.defaultHealth,
        damage: enemyType.defaultDamage,
        color: enemyType.color,
        imageSrc: enemyType.image,
        bonus: enemyType.bonus,
        behaviour: enemyType.behaviour
    };
    
    // Apply modifiers if they exist (shallow merge)
    const finalConfig = event.modifiers 
        ? { ...baseConfig, ...event.modifiers }
        : baseConfig;
    
    // Handle individual property overrides from event (for backward compatibility)
    if (event.health !== undefined) finalConfig.health = event.health;
    if (event.speed !== undefined) finalConfig.speed = event.speed;
    if (event.damage !== undefined) finalConfig.damage = event.damage;
    
    const x = Math.random() * (CANVAS_WIDTH - finalConfig.radius * 2) + finalConfig.radius;
    
    const enemy = {
        x: x,
        y: -finalConfig.radius,
        radius: finalConfig.radius,
        speed: finalConfig.speed,
        health: finalConfig.health,
        maxHealth: finalConfig.health,
        damage: finalConfig.damage,
        color: finalConfig.color,
        imageSrc: finalConfig.imageSrc,
        type: event.enemyType,
        behaviour: finalConfig.behaviour,
        bonus: finalConfig.bonus
    };
    
    const newEnemies = [...enemies, enemy];
    setEnemies(newEnemies);
    
    console.log(`Spawned ${event.enemyType} enemy: health=${finalConfig.health}, speed=${finalConfig.speed}, radius=${finalConfig.radius}, damage=${finalConfig.damage}, color=${finalConfig.color}`);
}

export function updateEnemies() {
    const updatedEnemies = enemies.map(enemy => {
        // Create a new enemy object with updated position
        const updatedEnemy = {
            ...enemy,
            y: enemy.y + enemy.speed
        };
        
        // Check if enemy reached bottom
        if (updatedEnemy.y - updatedEnemy.radius >= CANVAS_HEIGHT) {
            // Use enemy's damage value instead of fixed 1
            const damage = enemy.damage || 1; // fallback to 1 if damage is undefined
            const newHealth = player.health - damage;
            setPlayerHealth(newHealth);
            console.log(`Enemy reached bottom! Player took ${damage} damage. Health: ${newHealth}`);
            if (newHealth <= 0) {
                setGameOver(true);
            }
            return null; // mark for removal
        }
        return updatedEnemy; // return updated enemy
    });
    
    // Filter out null entries (enemies that reached bottom)
    const filteredEnemies = updatedEnemies.filter(enemy => enemy !== null);
    setEnemies(filteredEnemies);
}

// Image cache for enemy sprites
const imageCache = {};

export function drawEnemies(ctx) {
    enemies.forEach(enemy => {
        const { x, y, radius, imageSrc, color } = enemy;

        if (imageSrc) {
            // Draw enemy image if available
            if (!imageCache[imageSrc]) {
                const img = new Image();
                img.src = imageSrc;
                imageCache[imageSrc] = img;
            }
            const img = imageCache[imageSrc];
            ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
        } else {
            // Draw enemy circle as fallback
            ctx.fillStyle = color || '#ff0000';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
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