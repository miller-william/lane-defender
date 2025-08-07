export default {
    name: "Moving around",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 0,
            enemyType: 'roll',
            count: 4,
            interval: 2000,
            modifiers: {
                health: 2,
                bonus: {
                    type: 'fireRate',
                    value: -75
                },
                glowColour: '#00ffcc'
            }
        },
        {
            time: 1000,
            enemyType: 'roll',
            count: 2,
            interval: 0,
            modifiers: {
                health: 2,
                bonus: {
                    type: 'fireRate',
                    value: -75
                },
                glowColour: '#00ffcc'
            }
        },
        
        // Final boss
        {
            time: 2500,
            enemyType: 'trolley',
            count: 1,
            modifiers: {
                health: 30,
                radius: 100
            }
        }
    ]
}; 