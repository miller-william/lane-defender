export default {
    name: "Swarm Battle",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 8000,
            enemyType: 'poop',
            count: 28,
            interval: 10,
            modifiers: {
                health: 4,
                speed: 0.05,
                bonus: null,
                glowColour: null
            }
        },
        // Initial minions
        {
            time: 25000,
            enemyType: 'zombie',
            count: 8,
            interval: 1000,
            modifiers: {
                health: 3,
                damage: 10,
                bonus: null,
                glowColour: null,
            }
        },
        
        // Final boss
        {
            time: 35000,
            enemyType: 'trolley',
            count: 1,
            modifiers: {
                health: 30
            }
        },

        {
            time: 45000,
            enemyType: 'poop',
            count: 8,
            interval: 0,
            modifiers: {
                health: 3,
                movement: 'zigzag',
                bonus: null,
                glowColour: null
            }
        },
        // Initial minions
        {
            time: 50000,
            enemyType: 'zombie',
            count: 2,
            interval: 1000,
            modifiers: {
                health: 3,
                speed: 1,
                damage: 10,
                movement: 'zigzag',
                bonus: null,
                glowColour: null
            }
        },
    ],
    upgradeEvents: [
        // Test multiple upgrades vs nothing
        {
            time: 0,
            type: 'upgradeChoice',
            bannerSpeed: 0.2, // Slow banner for easy reading
            leftBonus: [ // faster 
                { type: 'damage', value: 4 },

            ],
            rightBonus: [ // more spread
                { type: 'fireRate', value: -200 },
                { type: 'spread', value: 1 }
            ]
        },
        

    ]
}; 