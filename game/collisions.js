import { bullets, enemies, setBullets, setEnemies, setBulletDamage, setBulletFireRate, setBulletSpread, bulletDamage, bulletFireRate, bulletSpread, applyPlayerBonus } from './state.js';
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
    
    // Apply the bonus effect and add to active bonuses array
    applyPlayerBonus(bonus);
    
    // Set up text and color for particle effect
    let text = '';
    let color = '#00ffcc';
    
    switch (bonus.type) {
        case 'fireRate':
            if (bonus.value > 0) {
                text = 'Slower Fire Rate';
                color = '#ff6666'; // Red for slower
            } else {
                text = 'Faster Fire Rate';
                color = '#00ffcc'; // Cyan for faster
            }
            break;
            
        case 'damage':
            if (bonus.value > 0) {
                text = 'More Power!';
                color = '#ff00ff'; // Magenta for damage
            } else {
                text = 'Less Power!';
                color = '#ff6666'; // Red for weaker
            }
            break;
            
        case 'spread':
            if (bonus.value > 0) {
                text = 'More Bullets';
                color = '#00ffff'; // Cyan for spread
            } else {
                text = 'Fewer Bullets';
                color = '#ff6666'; // Red for less
            }
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
                    
                    // Check for text popup and spawn it if present
                    if (enemy.text_popup) {
                        console.log(`Spawning text popup: "${enemy.text_popup}" for ${enemy.type} enemy`);
                        spawnTextParticle(enemy.x, enemy.y - enemy.radius - 20, enemy.text_popup, '#ffff00');
                    }
                    
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