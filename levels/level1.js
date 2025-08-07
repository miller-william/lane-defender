export default {
    name: "Introductory Level",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000", // Laser red bullets for level 1
    spawnEvents: [
        // Single spawn events
        { time: 0, enemyType: 'poop', health: 1},
        
        // Bulk spawn: 5 basic enemies every 250ms starting at 1000ms
        {
            time: 1000,
            enemyType: 'poop',
            count: 3,
            interval: 250
        },
        
        // Bulk spawn: 3 fast enemies every 500ms starting at 2500ms
        {
            time: 4000,
            enemyType: 'cup',
            count: 1,
            interval: 250
        },
        
        // Bulk spawn: 4 small enemies every 200ms starting at 5000ms
        {
            time: 5000,
            enemyType: 'crisps',
            count: 2,
            interval: 200
        }
    ]
}; 