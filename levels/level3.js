export default {
    name: "Intro to enemy bonuses",
    background: "#3e5c59",
    bulletColor: "#4a90e2", // Blue water bullets
    spawnEvents: [
        // Initial wave
        {
            time: 0,
            enemyType: 'fishFast',
            count: 1,
            interval: 1000,
            modifiers: {
                bonus: {
                    type: 'spread',
                    value: 1
                },
                glowColour: '#00ffcc'
            }
        },
        
        // Basic wave
        {
            time: 2000,
            enemyType: 'poop',
            count: 3,
            interval: 800
        },
        {
            time: 2400,
            enemyType: 'crisps',
            count: 3,
            interval: 800
        },
        
        // Fast wave
        {
            time: 3000,
            enemyType: 'cup',
            count: 2        },
        
        // Final swarm
        {
            time: 5000,
            enemyType: 'poop',
            count: 4,
            interval: 400
        },
        {
            time: 7000,
            enemyType: 'cup',
            count: 2        },
        
        // Final swarm
        {
            time: 8000,
            enemyType: 'poop',
            count: 4,
            interval: 400
        }
    ]
}; 