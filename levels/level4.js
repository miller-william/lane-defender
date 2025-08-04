export default {
    name: "Swarm Attack",
    background: "assets/images/fire_bg.png",
    spawnEvents: [
        // Tank
        {
            time: 0,
            enemyType: 'fireTankElemental',
            count: 1,
            interval: 100,
            modifiers: {
                health: 12
            }
        },
        {
            time: 20000,
            enemyType: 'fireTankElemental',
            count: 2,
            interval: 10,
            modifiers: {
                health: 12
            }
        },
        
    ],
    upgradeEvents: [
        {
            time: 10000,
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