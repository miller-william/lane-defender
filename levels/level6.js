export default {
    name: "Boss Battle",
    background: "assets/images/ice_bg.png",
    bulletColor: "#ff0000", // Red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 12000,
            enemyType: 'iceElemental',
            count: 4,
            interval: 2000,
            modifiers: {
                bonus: null,
                glowColour: null
            }
        },
        
        // Final boss
        {
            time: 30000,
            enemyType: 'iceTankElemental',
            count: 1,
            modifiers: {
                health: 25
            }
        }
    ],
    upgradeEvents: [
        // Test multiple upgrades vs nothing
        {
            time: 3000,
            type: 'upgradeChoice',
            bannerSpeed: 0.1, // Slow banner for easy reading
            leftBonus: [
                { type: 'fireRate', value: -50 },
                { type: 'damage', value: 1 },
                { type: 'spread', value: 1 }
            ],
            rightBonus: 'nothing'
        },
        
        // Test heavy cannon vs multiple upgrades (fast banner)
        {
            time: 8000,
            type: 'upgradeChoice',
            bannerSpeed: 0.3, // Fast banner for urgency
            leftBonus: [
                { type: 'fireRate', value: 1000 },
                { type: 'damage', value: 8 }
            ],
            rightBonus: [
                { type: 'fireRate', value: -100 },
                { type: 'spread', value: 2 }
            ]
        }
    ]
}; 