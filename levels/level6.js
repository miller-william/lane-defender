export default {
    name: "Boss Battle",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 15000,
            enemyType: 'roll',
            count: 4,
            interval: 2000,
            modifiers: {
                bonus: null,
                glowColour: null
            }
        },
        {
            time: 18000,
            enemyType: 'ducks',
            count: 1,
            modifiers: {
                health: 15,
                speed: 0.045,
            }
        },
        // Initial minions
        {
            time: 28000,
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
            time: 38000,
            enemyType: 'trolley',
            count: 1,
            modifiers: {
                health: 20
            }
        }
    ],
    upgradeEvents: [
        // Test multiple upgrades vs nothing
        {
            time: 3000,
            type: 'upgradeChoice',
            bannerSpeed: 0.1, // Slow banner for easy reading
            leftBonus: [ // faster 
                { type: 'fireRate', value: -200 },

            ],
            rightBonus: [ // more spread
                { type: 'fireRate', value: +100 },
                { type: 'spread', value: 1 }
            ]
        },
        

    ]
}; 