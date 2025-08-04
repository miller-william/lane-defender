// Enemy type definitions
export const ENEMY_TYPES = {
    basic: {
        radius: 20,
        defaultHealth: 3,
        defaultSpeed: 0.2, // 80% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1, // damage to player when reaching bottom
        color: '#ff0000', // red
        image: null, // placeholder for future sprite support
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    fast: {
        radius: 15,
        defaultHealth: 1,
        defaultSpeed: 0.4, // 120% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1, // fast but not more damaging
        color: '#ff6600', // orange
        image: null,
        behaviour: 'straight',
        bonus: {
            type: 'fireRate',
            value: -50 // reduce fire rate by 50ms
        },
        glowColour: '#00ffcc' // cyan glow for fire rate bonus
    },
    tank: {
        radius: 25,
        defaultHealth: 5,
        defaultSpeed: 0.01, // 40% of canvas height per second (adjusted for real delta time)
        defaultDamage: 2, // tank deals more damage
        color: '#800000', // dark red
        image: null,
        behaviour: 'straight',
        bonus: {
            type: 'damage',
            value: 1 // increase damage by 1
        },
        glowColour: '#ff00ff' // magenta glow for damage bonus
    },
    small: {
        radius: 12,
        defaultHealth: 1,
        defaultSpeed: 0.4, // 120% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1, // small but still dangerous
        color: '#ff4444', // light red
        image: null,
        behaviour: 'straight',
        bonus: {
            type: 'fireRate',
            value: -25 // reduce fire rate by 25ms
        },
        glowColour: '#00ffcc' // cyan glow for fire rate bonus
    },
    fireElemental: {
        radius: 30,
        defaultHealth: 1,
        defaultSpeed: 0.2, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1.5,
        color: '#ff4400', // fire orange fallback
        image: 'assets/images/fire.png', // placeholder image path
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    fireTankElemental: {
        radius: 50,
        defaultHealth: 10,
        defaultSpeed: 0.07, // 20% of canvas height per second (adjusted for real delta time)
        defaultDamage: 10,
        color: 'green', // fire orange fallback
        image: 'assets/images/green_fire.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    fireFastElemental: {
        radius: 30,
        defaultHealth: 1,
        defaultSpeed: 0.4, // 100% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1,
        color: 'blue', 
        image: 'assets/images/blue_fire.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    iceElemental: {
        radius: 18,
        defaultHealth: 2,
        defaultSpeed: 0.2, // 80% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1,
        color: '#00aaff', // ice blue
        image: 'assets/images/ice.png',
        behaviour: 'zigzag', // Changed to zigzag behavior
        bonus: null,
        glowColour: null
    },
    iceTankElemental: {
        radius: 60,
        defaultHealth: 25,
        defaultSpeed: 0.1, // 80% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1,
        color: '#00aaff', // ice blue
        image: 'assets/images/ice.png',
        behaviour: 'zigzag', // Changed to zigzag behavior
        bonus: null,
        glowColour: null
    },
    poisonElemental: {
        radius: 22,
        defaultHealth: 3,
        defaultSpeed: 0.2, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 2,
        color: '#00ff00', // poison green
        image: null,
        behaviour: 'zigzag', // Changed to zigzag for variety
        bonus: {
            type: 'damage',
            value: 2
        },
        glowColour: '#ff00ff' // magenta glow for damage bonus
    }
}; 