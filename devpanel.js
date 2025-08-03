import { bulletDamage, bulletFireRate, enemyHealth } from './game/state.js';
import { createEnemy } from './game/enemies.js';

// Dev panel event listeners
export function initializeDevPanel() {
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