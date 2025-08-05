export default {
    name: "Tank attack",
    background: "#3e5c59",
    bulletColor: "#4a90e2", // Blue water bullets
    spawnEvents: [
        // Tank
        {
            time: 0,
            enemyType: 'trolley',
            count: 1,
            interval: 100,
            modifiers: {
                health: 20
            }
        },
        {
            time: 20000,
            enemyType: 'trolley',
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