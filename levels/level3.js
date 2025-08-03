export default {
    name: "Fire Storm",
    background: "assets/images/fire_bg.png",
    bulletColor: "#00ff00", // Green bullets for level 2
    spawnEvents: [
        // Initial wave
        {
            time: 0,
            enemyType: 'fireElemental',
            count: 5,
            interval: 200
        },
        
        // Fast wave
        {
            time: 2000,
            enemyType: 'fireFastElemental',
            count: 3,
            interval: 400
        },
        
        // Tank wave
        {
            time: 4000,
            enemyType: 'fireTankElemental',
            count: 2,
            interval: 4000
        },
        
        // Final swarm
        {
            time: 6000,
            enemyType: 'fireElemental',
            count: 4,
            interval: 400
        }
    ]
}; 