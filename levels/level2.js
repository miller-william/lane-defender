export default {
    name: "Wave Defense",
    background: "assets/images/fire_bg.png",
    bulletColor: "#00ff00", // Green bullets for level 2
    spawnEvents: [
        // Initial wave of basic enemies
        {
            time: 0,
            enemyType: 'fireElemental',
            count: 8,
            interval: 300
        },
        
        // Fast enemy rush
        {
            time: 4000,
            enemyType: 'fireTankElemental',
            count: 2,
            interval: 150,

        },
        
        // Small enemy swarm
        {
            time: 7000,
            enemyType: 'fireFastElemental',
            count: 3,
            interval: 100,
            modifiers: {
                bonus: {
                    type: 'fireRate',
                    value: -75
                },
                glowColour: '#00ffcc'
            }
        }
    ]
}; 