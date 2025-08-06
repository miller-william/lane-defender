export default {
    name: "Upgrade choice",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        // Wave of slightly stronger basic enemies
        {
            time: 10000,
            enemyType: 'poop',
            count: 2,
            interval: 300,
            modifiers: {
                health: 2
            }
        },
        {
            time: 10000,
            enemyType: 'crisps',
            count: 2,
            interval: 300,
            modifiers: {
                health: 2
            }
        },
        {
            time: 10000,
            enemyType: 'roll',
            count: 2,
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