export default {
    name: "Swarm Battle",
    background: "assets/images/ice_bg.png",
    bulletColor: "#ff0000", // Red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 12000,
            enemyType: 'iceElemental',
            count: 8,
            interval: 0,
            modifiers: {
                bonus: null,
                glowColour: null
            }
        },
        // Initial minions
        {
            time: 25000,
            enemyType: 'iceElemental',
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
            enemyType: 'iceTankElemental',
            count: 1,
            modifiers: {
                health: 20
            }
        }
    ],
    upgradeEvents: [
        // Test multiple upgrades vs nothing
        {
            time: 1000,
            type: 'upgradeChoice',
            bannerSpeed: 0.1, // Slow banner for easy reading
            leftBonus: [ // faster 
                { type: 'damage', value: 1 },

            ],
            rightBonus: [ // more spread
                { type: 'fireRate', value: +100 },
                { type: 'spread', value: 2 }
            ]
        },
        

    ]
}; 