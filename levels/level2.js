export default {
    name: "Wave Defense",
    background: "assets/images/fire_bg.png",
    spawnEvents: [
        // Initial wave of basic enemies
        {
            time: 0,
            enemyType: 'fireElemental',
            count: 8,
            interval: 300,
        },
        {
            time: 0,
            enemyType: 'fireElemental',
            count: 2,
            interval: 300,
            modifiers: {
                bonus: {
                    type: 'fireRate',
                    value: -150
                },
                glowColour: '#00ffcc'
            }
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
        }
    ]
}; 