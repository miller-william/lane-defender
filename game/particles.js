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
        this.lifetime = 0.8; // seconds
        this.maxLifetime = this.lifetime;
        
        // Size
        this.size = Math.random() * 4 + 2; // 2-6 pixels
    }
    
    update(deltaTime) {
        // Update position
        this.x += this.dx;
        this.y += this.dy;
        
        // Apply gravity
        this.dy += 0.1;
        
        // Update lifetime (deltaTime is in seconds)
        this.lifetime -= deltaTime;
        
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

// Text particle class for bonus messages
class TextParticle {
    constructor(x, y, text, color = '#00ffcc') {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        
        // Float upward (slower for better visibility)
        this.dy = -0.5;
        
        // Lifetime
        this.lifetime = 3.0; // seconds (longer for better visibility)
        this.maxLifetime = this.lifetime;
        
        // Font size
        this.fontSize = 20;
    }
    
    update(deltaTime) {
        // Update position (float upward)
        this.y += this.dy;
        
        // Update lifetime
        this.lifetime -= deltaTime;
        
        // Return true if particle should be removed
        return this.lifetime <= 0;
    }
    
    draw(ctx) {
        const alpha = Math.max(0.1, this.lifetime / this.maxLifetime); // Minimum 10% opacity
        ctx.globalAlpha = alpha;
        
        // Set font
        ctx.font = `bold ${this.fontSize}px Arial`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw text with shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(this.text, this.x, this.y);
        
        // Reset shadow and alpha
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = 1;
    }
}

// Particle system
let particles = [];
let textParticles = [];

export function spawnParticles(x, y, color = '#ff8800', count = 15) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

export function spawnTextParticle(x, y, text, color = '#00ffcc') {
    textParticles.push(new TextParticle(x, y, text, color));
}

export function updateParticles(deltaTime) {
    // Update all particles and remove dead ones
    particles = particles.filter(particle => !particle.update(deltaTime));
    textParticles = textParticles.filter(particle => !particle.update(deltaTime));
}

export function drawParticles(ctx) {
    particles.forEach(particle => particle.draw(ctx));
    textParticles.forEach(particle => particle.draw(ctx));
}

export function getParticleCount() {
    return particles.length + textParticles.length;
} 