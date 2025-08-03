// Enemy type definitions
export const ENEMY_TYPES = {
    basic: {
        radius: 20,
        defaultHealth: 3,
        defaultSpeed: 2,
        defaultDamage: 1, // damage to player when reaching bottom
        color: '#ff0000', // red
        image: null, // placeholder for future sprite support
        behaviour: 'straight',
        bonus: null
    },
    fast: {
        radius: 15,
        defaultHealth: 2,
        defaultSpeed: 4,
        defaultDamage: 1, // fast but not more damaging
        color: '#ff6600', // orange
        image: null,
        behaviour: 'straight',
        bonus: {
            type: 'fireRate',
            value: -50 // reduce fire rate by 50ms
        }
    },
    tank: {
        radius: 25,
        defaultHealth: 5,
        defaultSpeed: 1,
        defaultDamage: 2, // tank deals more damage
        color: '#800000', // dark red
        image: null,
        behaviour: 'straight',
        bonus: {
            type: 'damage',
            value: 1 // increase damage by 1
        }
    },
    small: {
        radius: 12,
        defaultHealth: 1,
        defaultSpeed: 3,
        defaultDamage: 1, // small but still dangerous
        color: '#ff4444', // light red
        image: null,
        behaviour: 'straight',
        bonus: {
            type: 'fireRate',
            value: -25 // reduce fire rate by 25ms
        },
    },
    fireElemental: {
        radius: 30,
        defaultHealth: 1,
        defaultSpeed: 2.5,
        defaultDamage: 1.5,
        color: '#ff4400', // fire orange fallback
        image: 'assets/images/fire.png', // placeholder image path
        behaviour: 'straight',
        bonus: null
    }
}; 