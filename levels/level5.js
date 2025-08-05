export default {
    name: "Ice swarm",
    background: "assets/images/ice_bg.png",
    bulletColor: "#ff0000", // Red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 0,
            enemyType: 'iceElemental',
            count: 4,
            interval: 2000,
            modifiers: {
                bonus: {
                    type: 'fireRate',
                    value: -75
                },
                glowColour: '#00ffcc'
            }
        },
        {
            time: 1000,
            enemyType: 'iceElemental',
            count: 2,
            interval: 0,
            modifiers: {
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
            enemyType: 'iceTankElemental',
            count: 1,
        }
    ]
}; 