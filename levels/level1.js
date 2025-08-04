export default {
    name: "First Level",
    background: "assets/images/fire_bg.png",
    bulletColor: "#00ff00", // Green bullets for level 1
    spawnEvents: [
        // Single spawn events
        { time: 0, enemyType: 'fireElemental', health: 1},
        
        // Bulk spawn: 5 basic enemies every 250ms starting at 1000ms
        {
            time: 1000,
            enemyType: 'fireElemental',
            count: 3,
            interval: 250
        },
        
        // Bulk spawn: 3 fast enemies every 500ms starting at 2500ms
        {
            time: 2500,
            enemyType: 'fireFastElemental',
            count: 2,
            interval: 250
        },
        
        // Single tank enemy
        { 
            time: 2000, 
            enemyType: 'fireTankElemental'
        },
        
        // Bulk spawn: 4 small enemies every 200ms starting at 5000ms
        {
            time: 5000,
            enemyType: 'fireFastElemental',
            count: 1,
            interval: 200
        }
    ]
}; 