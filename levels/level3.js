export default {
    name: "Fire Storm",
    background: "assets/images/fire_bg.png",
    bulletColor: "#00ff00", // Green bullets for level 2
    spawnEvents: [
        // Initial wave
        {
            time: 0,
            enemyType: 'fireFastElemental',
            count: 1,
            interval: 1000,
            modifiers: {
                bonus: {
                    type: 'spread',
                    value: 1
                },
                glowColour: '#00ffcc'
            }
        },
        
        // Fast wave
        {
            time: 2000,
            enemyType: 'fireElemental',
            count: 4,
            interval: 400
        },
        
        // Tank wave
        {
            time: 3000,
            enemyType: 'fireFastElemental',
            count: 1        },
        
        // Final swarm
        {
            time: 5000,
            enemyType: 'fireElemental',
            count: 4,
            interval: 400
        }
    ]
}; 