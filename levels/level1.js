export default {
    name: "Test Level",
    spawnEvents: [
        // Single spawn events
        { time: 0, enemyType: 'basic', health: 1, speed: 2 },
        
        // Bulk spawn: 5 basic enemies every 250ms starting at 1000ms
        {
            time: 1000,
            enemyType: 'fireElemental',
            count: 3,
            interval: 250,
            modifiers: { speed: 1 }
        },
        
        // Bulk spawn: 3 fast enemies every 500ms starting at 2500ms
        {
            time: 2500,
            enemyType: 'fast',
            count: 2,
            modifiers: { damage: 0.5 }
        },
        
        // Single tank enemy
        { 
            time: 4000, 
            enemyType: 'tank',
            modifiers: {
                health: 8,
                damage: 3,
                color: '#ff00ff'
            }
        },
        
        // Bulk spawn: 4 small enemies every 200ms starting at 5000ms
        {
            time: 5000,
            enemyType: 'small',
            count: 1,
            interval: 200,
            modifiers: {
                damage: 0.5,
                color: '#00ff00' // green small enemies
            }
        }
    ]
}; 