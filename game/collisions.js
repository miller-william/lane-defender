import { bullets, enemies, setBullets, setEnemies, setBulletDamage, setBulletFireRate, bulletDamage, bulletFireRate } from './state.js';
import { ENEMY_TYPES } from './enemyTypes.js';
import { spawnParticles, spawnTextParticle } from './particles.js';

// Bonus application function
function applyEnemyBonus(enemy) {
    let bonus = null;
    
    // Check for bonus on the enemy instance first (from modifiers)
    if (enemy.bonus) {
        bonus = enemy.bonus;
    }
    // Fallback to enemy type bonus if no instance bonus
    else if (enemy.type) {
        const enemyType = ENEMY_TYPES[enemy.type];
        if (enemyType && enemyType.bonus) {
            bonus = enemyType.bonus;
        }
    }
    
    if (!bonus) return;
    
    // Spawn text particle based on bonus type
    let text = '';
    let color = '#00ffcc';
    
    switch (bonus.type) {
        case 'fireRate':
            const newFireRate = bulletFireRate + bonus.value;
            setBulletFireRate(newFireRate);
            text = `Fire Rate +${Math.abs(bonus.value)}ms`;
            color = '#00ffcc'; // Cyan for fire rate
            console.log(`Fire rate bonus: ${bonus.value}ms (new rate: ${newFireRate}ms)`);
            break;
            
        case 'damage':
            const newDamage = bulletDamage + bonus.value;
            setBulletDamage(newDamage);
            text = `Damage +${bonus.value}`;
            color = '#ff00ff'; // Magenta for damage
            console.log(`Damage bonus: +${bonus.value} (new damage: ${newDamage})`);
            break;
            
        default:
            console.warn(`Unknown bonus type: ${bonus.type}`);
            return;
    }
    
    // Spawn text particle at enemy position
    spawnTextParticle(enemy.x, enemy.y - enemy.radius, text, color);
}

// Collision detection
export function checkCollision(bullet, enemy) {
    const bulletCenterX = bullet.x + bullet.width / 2;
    const bulletCenterY = bullet.y + bullet.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(bulletCenterX - enemy.x, 2) + 
        Math.pow(bulletCenterY - enemy.y, 2)
    );
    
    return distance < enemy.radius + Math.max(bullet.width, bullet.height) / 2;
}

export function handleCollisions() {
    let bulletsModified = false;
    let enemiesModified = false;
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], enemies[j])) {
                // Capture bullet reference before removing it
                const bullet = bullets[i];
                
                // Remove bullet
                bullets.splice(i, 1);
                bulletsModified = true;
                
                // Reduce enemy health using captured bullet damage
                enemies[j].health -= bullet.damage;
                
                // Remove enemy if health is 0 or below
                if (enemies[j].health <= 0) {
                    // Spawn particles at enemy position
                    const enemy = enemies[j];
                    spawnParticles(enemy.x, enemy.y, enemy.color || '#ff8800', 15);
                    
                    // Apply bonus before removing enemy
                    applyEnemyBonus(enemies[j]);
                    enemies.splice(j, 1);
                    enemiesModified = true;
                }
                
                break; // Bullet can only hit one enemy
            }
        }
    }
    
    // Update arrays if modified
    if (bulletsModified) {
        setBullets([...bullets]);
    }
    if (enemiesModified) {
        setEnemies([...enemies]);
    }
} 