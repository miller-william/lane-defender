import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

// Particle class for individual particles
class Particle {
    constructor(x, y, color = '#ff8800') {
        this.x = x;
        this.y = y;
        this.color = color;
        
        // Random velocity
        this.dx = (Math.random() - 0.5) * 4; // -2 to 2
        this.dy = (Math.random() - 0.5) * 4; // -2 to 2
        
        // Lifetime
        this.lifetime = 800; // ms - increased from 400ms
        this.maxLifetime = this.lifetime;
        
        // Size - make particles bigger for visibility
        this.size = Math.random() * 4 + 2; // 2-6 pixels
    }
    
    update(deltaTime) {
        // Update position
        this.x += this.dx;
        this.y += this.dy;
        
        // Apply gravity
        this.dy += 0.1;
        
        // Update lifetime - use a fixed time step to ensure consistent behavior
        this.lifetime -= 16; // Assume 60fps = ~16ms per frame
        
        // Return true if particle should be removed
        return this.lifetime <= 0;
    }
    
    draw(ctx) {
        const alpha = Math.max(0.3, this.lifetime / this.maxLifetime); // Minimum 30% opacity
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset alpha
        ctx.globalAlpha = 1;
    }
}

// Particle system
let particles = [];

export function spawnParticles(x, y, color = '#ff8800', count = 15) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

export function updateParticles(deltaTime) {
    // Update all particles and remove dead ones
    particles = particles.filter(particle => !particle.update(deltaTime));
}

export function drawParticles(ctx) {
    particles.forEach(particle => particle.draw(ctx));
}

export function getParticleCount() {
    return particles.length;
} 