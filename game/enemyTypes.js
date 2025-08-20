// Enemy type definitions
export const ENEMY_TYPES = {
    poop: {
        radius: 30,
        defaultHealth: 1,
        defaultSpeed: 0.2, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1.5,
        color: '#bd672a', // fire orange fallback
        image: 'assets/images/poop.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    crisps: {
        radius: 20,
        defaultHealth: 1,
        defaultSpeed: 0.2, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1.5,
        color: '#800000', 
        image: 'assets/images/crisps.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    roll: {
        radius: 20,
        defaultHealth: 1,
        defaultSpeed: 0.2, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1.5,
        color: 'white', 
        image: 'assets/images/roll.png', 
        behaviour: 'zigzag',
        bonus: null,
        glowColour: null
    },
    zombie: {
        radius: 20,
        defaultHealth: 1,
        defaultSpeed: 0.2, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1.5,
        color: 'white', 
        image: 'assets/images/zombie.png', 
        behaviour: 'zigzag',
        bonus: null,
        glowColour: null
    },
    cup: {
        radius: 20,
        defaultHealth: 1,
        defaultSpeed: 0.4, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1.5,
        color: 'yellow', 
        image: 'assets/images/cup.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    fishFast: {
        radius: 40,
        defaultHealth: 1,
        defaultSpeed: 0.4, // 100% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1,
        color: 'brown', 
        image: 'assets/images/zombie.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    trolley: {
        radius: 90,
        defaultHealth: 10,
        defaultSpeed: 0.07, // 20% of canvas height per second (adjusted for real delta time)
        defaultDamage: 10,
        color: 'silver', // fire orange fallback
        image: 'assets/images/trolley.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    barrels: {
        radius: 90,
        defaultHealth: 10,
        defaultSpeed: 0.07, // 20% of canvas height per second (adjusted for real delta time)
        defaultDamage: 10,
        color: 'silver', // fire orange fallback
        image: 'assets/images/barrels.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: '#00ffcc', // cyan glow for fire rate bonus
        text_popup: "Chemical waste cleaned up!"

    },
    ducks: {
        radius: 90,
        defaultHealth: 10,
        defaultSpeed: 0.07, // 20% of canvas height per second (adjusted for real delta time)
        defaultDamage: 0,
        color: '#ffaa00', // Orange color for ducks
        image: 'assets/images/ducks.png', 
        behaviour: 'zigzag',
        bonus: {
            type: 'fireRate',
            value: +100 // increase fire rate by 50ms
        },
        glowColour: '#00ffcc', // cyan glow for fire rate bonus
        text_popup: "Oh no! That was a duck family 🦆💔"
    },
    will: {
        radius: 30,
        defaultHealth: 1,
        defaultSpeed: 0.2, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 1.5,
        color: '#bd672a', // fire orange fallback
        image: 'assets/images/will.png', 
        behaviour: 'straight',
        bonus: null,
        glowColour: null
    },
    jack: {
        radius: 30,
        defaultHealth: 1,
        defaultSpeed: 0.4, // 60% of canvas height per second (adjusted for real delta time)
        defaultDamage: 0.5,
        color: '#bd672a', // fire orange fallback
        image: 'assets/images/jack.png', 
        behaviour: 'zigzag',
        bonus: null,
        glowColour: null
    }
}; 