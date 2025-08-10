export default {
    name: "Tank attack",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        // Opening wave – familiar enemies
        {
            time: 3000,
            enemyType: 'crisps',
            count: 4,
            interval: 600,
            modifiers: {
                behaviour: 'straight',
                health: 2
            }
        },

        // First fatberg introduction
        {
            time: 7000,
            enemyType: 'fatberg',
            count: 1,
            modifiers: {
                behaviour: 'straight',
                radius: 90,
                defaultHealth: 15,
                defaultSpeed: 0.05,
                defaultDamage: 2,
            }

         },

        // Mix wave
        {
            time: 11000,
            enemyType: 'cup',
            count: 3,
            interval: 500,
            modifiers: {
                behaviour: 'zigzag',
                health: 1,
                defaultSpeed: 0.12
            }
        },

        {
            time: 13000,
            enemyType: 'poop',
            count: 3,
            interval: 500,
            modifiers: {
                behaviour: 'zigzag',
                health: 2
            }
        },

        // Second fatberg with no bonus
        {
            time: 16000,
            enemyType: 'fatberg',
            count: 1,
            modifiers: {
                behaviour: 'straight',
                radius: 100,
                defaultHealth: 30,
                defaultSpeed: 0.045,
                defaultDamage: 2,
                glowColour: '#ddaa00'
            }
        },

        // Final cluttered swarm
        {
            time: 19000,
            enemyType: 'crisps',
            count: 3,
            interval: 400,
            modifiers: {
                behaviour: 'zigzag',
                health: 2
            }
        },
        {
            time: 20000,
            enemyType: 'cup',
            count: 1,
            interval: 500,
            modifiers: {
                behaviour: 'straight',
                defaultSpeed: 0.14
            }
        }
    ],

    upgradeEvents: [
        // Power trade-off choice: slower heavy damage vs fast firing
        {
            time: 0,
            type: 'upgradeChoice',
            bannerSpeed: 0.18,
            leftBonus: [
                { type: 'damage', value: 2 }
            ],
            rightBonus: [
                { type: 'fireRate', value: -50 } // faster fire rate
            ]
        }
    ]
};