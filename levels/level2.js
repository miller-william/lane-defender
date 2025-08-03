export default {
    name: "Wave Defense",
    background: "#1a1a2e", // Dark blue background
    spawnEvents: [
        // Initial wave of basic enemies
        {
            time: 0,
            enemyType: 'fireElemental',
            count: 8,
            interval: 300,
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