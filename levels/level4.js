export default {
    name: "Swarm Attack",
    background: "assets/images/fire_bg.png",
    spawnEvents: [
        // Massive swarm of small enemies
        {
            time: 0,
            enemyType: 'fireTankElemental',
            count: 2,
            interval: 100,
        },
        
        // Fast enemies mixed in
        {
            time: 2000,
            enemyType: 'fireFastElemental',
            count: 2,
            interval: 150,
        },

        {
            time: 2200,
            enemyType: 'fireFastElemental',
            count: 2,
            interval: 150,
        },

        {
            time: 2100,
            enemyType: 'fireFastElemental',
            count: 1,
            interval: 300,
            modifiers: {
                bonus: {
                    type: 'fireRate',
                    value: -300
                },
                glowColour: '#00ffcc'
            }
        },
        {
            time: 3000,
            enemyType: 'fireFastElemental',
            count: 2,
            interval: 150,
        },
        {
            time: 3500,
            enemyType: 'fireFastElemental',
            count: 2,
            interval: 150,
        },
        
        // Tank enemies for challenge
        {
            time: 4000,
            enemyType: 'fireTankElemental',
            count: 2,
            interval: 800,
        },
        {
            time: 6000,
            enemyType: 'fireTankElemental',
            count: 1,
            interval: 800,
        }
    ]
}; 