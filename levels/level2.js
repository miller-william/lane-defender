export default {
    name: "Upgrade choice",
    background: "assets/images/fire_bg.png",
    bulletColor: "#00ff00", 
    spawnEvents: [
        // Wave of slightly stronger basic enemies
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
            bannerSpeed: 0.15,
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