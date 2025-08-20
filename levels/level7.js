export default {
    name: "Swarm Battle",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 10000,
            enemyType: 'roll',
            count: 8,
            interval: 0,
            modifiers: {
                bonus: null,
                glowColour: null
            }
        },
        // Initial minions
        {
            time: 20000,
            enemyType: 'roll',
            count: 8,
            interval: 1000,
            modifiers: {
                bonus: null,
                glowColour: null
            }
        },
        
        // Final boss
        {
            time: 30000,
            enemyType: 'trolley',
            count: 1,
            modifiers: {
                health: 30
            }
        },

        {
            time: 40000,
            enemyType: 'poop',
            count: 6,
            interval: 100,
            modifiers: {
                health: 3,
                movement: 'zigzag',
                bonus: null,
                glowColour: null
            }
        },
        // final minions
        {
            time: 50000,
            enemyType: 'crisps',
            count: 2,
            interval: 1000,
            modifiers: {
                health: 2,
                speed: 0.8,
                movement: 'zigzag',
                bonus: null,
                glowColour: null
            }
        },
    ],
    upgradeEvents: [
        // Test multiple upgrades vs nothing
        {
            time: 1000,
            type: 'upgradeChoice',
            bannerSpeed: 0.2, // Slow banner for easy reading
            leftBonus: [ // faster 
                { type: 'damage', value: 2 },

            ],
            rightBonus: [ // more spread
                { type: 'fireRate', value: +100 },
                { type: 'spread', value: 2 }
            ]
        },
        

    ]
}; 