export default {
    name: "level 3",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        
        // Basic wave
        {
            time: 8000,
            enemyType: 'poop',
            count: 3,
            interval: 800,
            modifiers: {
                behaviour: 'zigzag',
                health: 2
            }
        },
        {
            time: 8400,
            enemyType: 'crisps',
            count: 3,
            interval: 800,
            modifiers: {
                behaviour: 'zigzag',
                health: 2
            }
        },
        
        // Fast wave
        {
            time: 9000,
            enemyType: 'cup',
            count: 2,
            modifiers: {
                movement: 'zigzag',
                health: 1,
                defaultSpeed: 0.15
            }        },
        
        // Final swarm
        {
            time: 11000,
            enemyType: 'poop',
            count: 3,
            modifiers: {
                behaviour: 'zigzag',
                health: 2,
                defaultSpeed: 0.15
            },
            interval: 400
        },
        {
            time: 13000,
            enemyType: 'cup',
            count: 2,
            modifiers: {
                behaviour: 'zigzag',
                health: 1,
                defaultSpeed: 0.15
            }        },
        
        // Final swarm
        {
            time: 14000,
            enemyType: 'poop',
            count: 4,
            interval: 400,
            modifiers: {
                defaultSpeed: 0.15
            }
        }
    ],
    upgradeEvents: [        
        // slow and powerful or fast and weak
        {
            time: 0,
            type: 'upgradeChoice',
            bannerSpeed: 0.15,
            leftBonus: [
                { type: 'spread', value: 1 }
            ],
            rightBonus: [
                { type: 'damage', value: 1 },
            ]
        }
    ]
}; 