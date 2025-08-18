import { CANVAS_WIDTH, CANVAS_HEIGHT, ENEMY_RADIUS, ENEMY_SPEED } from './constants.js';
import { enemies, enemyHealth, player, gameOver, setEnemies, setPlayerHealth, setGameOver } from './state.js';
import { triggerDamageFlash } from './ui.js';
import { ENEMY_TYPES } from './enemyTypes.js';

// Enemy management
export function createEnemy() {
    const x = Math.random() * (CANVAS_WIDTH - ENEMY_RADIUS * 2) + ENEMY_RADIUS;
    enemies.push({
        x: x,
        y: -ENEMY_RADIUS,
        radius: ENEMY_RADIUS,
        speed: ENEMY_SPEED, // This will now be canvas height per second
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
        speed: enemyType.defaultSpeed, // This will now be canvas height per second
        health: enemyType.defaultHealth,
        damage: enemyType.defaultDamage,
        color: enemyType.color,
        imageSrc: enemyType.image,
        bonus: enemyType.bonus,
        behaviour: enemyType.behaviour,
        glowColour: enemyType.glowColour,
        text_popup: enemyType.text_popup
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
        speed: finalConfig.speed, // Canvas height per second
        health: finalConfig.health,
        maxHealth: finalConfig.health,
        damage: finalConfig.damage,
        color: finalConfig.color,
        imageSrc: finalConfig.imageSrc,
        type: event.enemyType,
        behaviour: finalConfig.behaviour,
        bonus: finalConfig.bonus,
        glowColour: finalConfig.glowColour,
        text_popup: finalConfig.text_popup
    };
    
    // Add zigzag properties if behavior is zigzag
    if (enemy.behaviour === 'zigzag') {
        enemy.startX = enemy.x;
        enemy.zigzag = {
            amplitude: Math.min(50, (CANVAS_WIDTH - enemy.radius * 2) / 4), // Limit amplitude to prevent out of bounds
            frequency: 2,  // 2 cycles per second
            phase: Math.random() * Math.PI * 2 // Random starting phase
        };
        console.log(`Zigzag enemy created with amplitude: ${enemy.zigzag.amplitude}, frequency: ${enemy.zigzag.frequency}, phase: ${enemy.zigzag.phase.toFixed(2)}`);
    }
    
    const newEnemies = [...enemies, enemy];
    setEnemies(newEnemies);
    
    console.log(`Spawned ${event.enemyType} enemy: health=${finalConfig.health}, speed=${finalConfig.speed} (canvas height/sec), radius=${finalConfig.radius}, damage=${finalConfig.damage}, color=${finalConfig.color}, glow=${finalConfig.glowColour || 'none'}, behaviour=${finalConfig.behaviour}, text_popup=${finalConfig.text_popup || 'none'}`);
}

export function updateEnemies(deltaTime) {
    const updatedEnemies = enemies.map(enemy => {
        // Calculate new Y position (same for all enemies)
        const newY = enemy.y + (enemy.speed * CANVAS_HEIGHT * deltaTime);
        
        // Calculate new X position based on behavior
        let newX = enemy.x;
        
        if (enemy.behaviour === 'zigzag' && enemy.zigzag) {
            // Use performance.now() for smooth animation
            const t = performance.now() / 1000 + enemy.zigzag.phase;
            newX = enemy.startX + Math.sin(t * enemy.zigzag.frequency) * enemy.zigzag.amplitude;
            
            // Clamp X position to keep enemy within canvas bounds
            const minX = enemy.radius;
            const maxX = CANVAS_WIDTH - enemy.radius;
            newX = Math.max(minX, Math.min(maxX, newX));
            
            // Debug logging (uncomment to see zigzag movement)
            // console.log(`Zigzag enemy: t=${t.toFixed(2)}, sin=${Math.sin(t * enemy.zigzag.frequency).toFixed(2)}, x=${newX.toFixed(1)}`);
        }
        // For 'straight' behavior, X position remains unchanged
        
        // Create a new enemy object with updated position
        const updatedEnemy = {
            ...enemy,
            x: newX,
            y: newY
        };
        
        // Check if enemy reached bottom
        if (updatedEnemy.y - updatedEnemy.radius >= CANVAS_HEIGHT) {
            // Use enemy's damage value, fallback to 1 only if damage is null/undefined
            const damage = enemy.damage ?? 1; // fallback to 1 if damage is null/undefined (not 0)
            const newHealth = player.health - damage;
            setPlayerHealth(newHealth);
            
            // Only trigger damage flash if actual damage was dealt
            if (damage > 0) {
                triggerDamageFlash();
            }
            
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

// Animation state for pulsing glow
let glowAnimationTime = 0;

export function drawEnemies(ctx) {
    // Update animation time
    glowAnimationTime += 0.016; // Assuming 60fps, adjust if needed
    
    enemies.forEach(enemy => {
        const { x, y, radius, imageSrc, color, glowColour } = enemy;

        // Save context state
        ctx.save();
        
        // Draw glow effect if enemy has a bonus and glow color
        if (enemy.bonus && glowColour) {
            // Animated pulsing glow
            const pulseIntensity = 15 + Math.sin(glowAnimationTime * 3) * 10; // Pulse between 5-25 blur
            
            ctx.shadowColor = glowColour;
            ctx.shadowBlur = pulseIntensity;
            
            if (imageSrc) {
                // Draw sprite with glow
                if (!imageCache[imageSrc]) {
                    const img = new Image();
                    img.src = imageSrc;
                    imageCache[imageSrc] = img;
                }
                const img = imageCache[imageSrc];
                ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
            } else {
                // Draw circle with glow
                ctx.fillStyle = color || '#ff0000';
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Reset shadow for main sprite
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
        }
        
        // Draw main enemy sprite
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
        
        // Restore context state
        ctx.restore();
        
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