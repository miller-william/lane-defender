export default {
    name: "Elemental Chaos",
    background: "#2d1b69", // Purple background
    spawnEvents: [
        // Initial wave of mixed enemies
        {
            time: 0,
            enemyType: 'fireElemental',
            count: 3,
            interval: 300,
            modifiers: { health: 2 }
        },
        
        // Ice elemental wave
        {
            time: 2000,
            enemyType: 'iceElemental',
            count: 4,
            interval: 200,
            modifiers: { damage: 1.5 }
        },
        
        // Poison wave
        {
            time: 4000,
            enemyType: 'poisonElemental',
            count: 2,
            interval: 500,
            modifiers: { health: 4 }
        },
        
        // Final boss wave
        {
            time: 6000,
            enemyType: 'fireTankElemental',
            modifiers: {
                health: 12,
                damage: 4,
                color: '#ff4400'
            }
        }
    ]
}; 