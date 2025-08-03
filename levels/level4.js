export default {
    name: "Swarm Attack",
    background: "#1a472a", // Dark green background
    spawnEvents: [
        // Massive swarm of small enemies
        {
            time: 0,
            enemyType: 'small',
            count: 15,
            interval: 100,
            modifiers: { damage: 1, color: '#00ff00' }
        },
        
        // Fast enemies mixed in
        {
            time: 2000,
            enemyType: 'fast',
            count: 8,
            interval: 150,
            modifiers: { damage: 2, color: '#ff8800' }
        },
        
        // Tank enemies for challenge
        {
            time: 4000,
            enemyType: 'tank',
            count: 3,
            interval: 800,
            modifiers: { health: 8, damage: 3 }
        }
    ]
}; 