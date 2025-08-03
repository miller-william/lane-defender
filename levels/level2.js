export default {
    name: "Wave Defense",
    background: "#1a1a2e", // Dark blue background
    spawnEvents: [
        // Initial wave of basic enemies
        {
            time: 0,
            enemyType: 'basic',
            count: 8,
            interval: 300,
            modifiers: { health: 2 }
        },
        
        // Fast enemy rush
        {
            time: 3000,
            enemyType: 'fast',
            count: 6,
            interval: 150,
            modifiers: { 
                damage: 2,
                color: '#ff8800' // bright orange
            }
        },
        
        // Tank boss
        {
            time: 5000,
            enemyType: 'tank',
            modifiers: {
                health: 15,
                damage: 4,
                color: '#800080', // purple
                radius: 30
            }
        },
        
        // Small enemy swarm
        {
            time: 7000,
            enemyType: 'small',
            count: 10,
            interval: 100,
            modifiers: {
                damage: 2,
                color: '#ff0080' // pink
            }
        }
    ]
}; 