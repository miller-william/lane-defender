export default {
    name: "Boss Battle",
    background: "#8b0000", // Dark red background
    spawnEvents: [
        // Initial minions
        {
            time: 0,
            enemyType: 'basic',
            count: 5,
            interval: 400,
            modifiers: { health: 3, damage: 2 }
        },
        
        // Elite enemies
        {
            time: 3000,
            enemyType: 'fireElemental',
            count: 3,
            interval: 600,
            modifiers: { health: 5, damage: 3 }
        },
        
        // Final boss
        {
            time: 6000,
            enemyType: 'fireTankElemental',
            modifiers: {
                health: 20,
                damage: 5,
                color: '#ff0000',
                radius: 50
            }
        }
    ]
}; 