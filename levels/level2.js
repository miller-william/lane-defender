export default {
    name: "Wave Defense",
    background: "assets/images/fire_bg.png",
    bulletColor: "#00ff00", // Green bullets for level 2
    spawnEvents: [
        // Initial wave of basic enemies
        {
            time: 10000,
            enemyType: 'fireElemental',
            count: 6,
            interval: 300,
            modifiers: {
                health: 2
            }
        }
        
    ],
    upgradeEvents: [        
        // slow and powerful or fast and weak
        {
            time: 500,
            type: 'upgradeChoice',
            bannerSpeed: 0.15, // Fast banner for urgency
            leftBonus: [
                { type: 'fireRate', value: 200 },
                { type: 'damage', value: 1 }
            ],
            rightBonus: [
                { type: 'fireRate', value: -200 },
                { type: 'damage', value: -0.5 }
            ]
        }
    ]
}; 