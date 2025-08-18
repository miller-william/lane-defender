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
                health: 4,
                defaultSpeed: 0.15
            }
        },
        {
            time: 10000,
            enemyType: 'crisps',
            count: 2,
            interval: 300,
            modifiers: {
                health: 4,
                defaultSpeed: 0.15
            }
        },
        {
            time: 12000,
            enemyType: 'roll',
            count: 2,
            interval: 300,
            modifiers: {
                health: 4,
                defaultSpeed: 0.15
            }
        }
        
    ],
    upgradeEvents: [        
        // slow and powerful or fast and weak
        {
            time: 300,
            type: 'upgradeChoice',
            bannerSpeed: 0.15,
            leftBonus: [
                { type: 'damage', value: 1 }
            ],
            rightBonus: [
                { type: 'fireRate', value: -400 },
            ]
        }
    ]
}; 