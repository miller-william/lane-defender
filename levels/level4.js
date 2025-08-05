export default {
    name: "Tank attack",
    background: "assets/images/fire_bg.png",
    spawnEvents: [
        // Tank
        {
            time: 0,
            enemyType: 'fireTankElemental',
            count: 1,
            interval: 100,
            modifiers: {
                health: 20
            }
        },
        {
            time: 20000,
            enemyType: 'fireTankElemental',
            count: 2,
            interval: 10,
            modifiers: {
                health: 20
            }
        },
        
    ],
    upgradeEvents: [
        {
            time: 9000,
            type: 'upgradeChoice',
            bannerSpeed: 0.1,
            leftBonus: [
                { type: 'fireRate', value: 200 },
                { type: 'damage', value: 2 }
            ],
            rightBonus: [
                { type: 'fireRate', value: -200 },
                { type: 'damage', value: -0.5 }
            ]
        }
    ]
}; 