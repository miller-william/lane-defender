export default {
    name: "Boss Battle",
    background: "#3e5c59",
    bulletColor: "#4a90e2", // Blue water bullets
    spawnEvents: [
        // Initial minions
        {
            time: 12000,
            enemyType: 'roll',
            count: 4,
            interval: 2000,
            modifiers: {
                bonus: null,
                glowColour: null
            }
        },
        // Initial minions
        {
            time: 25000,
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
            time: 35000,
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