export default {
    name: "Moving around",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        // Opening zigzag wave
        {
            time: 2000,
            enemyType: 'cup',
            count: 4,
            interval: 600,
            modifiers: {
                behaviour: 'zigzag',
                health: 1,
                defaultSpeed: 0.12,
                defaultDamage: 0.3
            }
        },

        // Trap upgrade fatberg
        {
            time: 6000,
            enemyType: 'fatberg',
            count: 1,
            modifiers: {
                behaviour: 'straight',
                radius: 100,
                defaultHealth: 20,
                defaultSpeed: 0.045,
                defaultDamage: 0,
                glowColour: '#ff4444',
                bonus: [
                    { type: 'fireRate', value: 50 } // slower shooting (bad)
                ]
            }
        },

        // Mixed mid-pressure wave
        {
            time: 10000,
            enemyType: 'poop',
            count: 3,
            interval: 500,
            modifiers: {
                behaviour: 'zigzag',
                health: 2
            }
        },
        {
            time: 11500,
            enemyType: 'crisps',
            count: 3,
            interval: 400,
            modifiers: {
                behaviour: 'straight',
                health: 2
            }
        },

        // High-speed closing swarm
        {
            time: 14000,
            enemyType: 'cup',
            count: 4,
            interval: 350,
            modifiers: {
                behaviour: 'zigzag',
                defaultSpeed: 0.16,
                health: 1,
                defaultDamage: 0.3
            }
        },
        {
            time: 15000,
            enemyType: 'poop',
            count: 2,
            interval: 500,
            modifiers: {
                behaviour: 'zigzag',
                defaultSpeed: 0.14,
                health: 2
            }
        }
    ],

    upgradeEvents: [
        {
            time: 0,
            type: 'upgradeChoice',
            bannerSpeed: 0.2,
            leftBonus: [
                { type: 'damage', value: 1 }
            ],
            rightBonus: [
                { type: 'fireRate', value: +200 } // downgrade!
            ]
        }
    ]
};