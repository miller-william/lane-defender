export default {
    name: "Boss Battle",
    background: "assets/images/ice_bg.png",
    bulletColor: "#ff0000", // Red bullets
    spawnEvents: [
        // Initial minions
        {
            time: 0,
            enemyType: 'iceElemental',
            count: 4,
            interval: 2000,
        },
        {
            time: 1000,
            enemyType: 'iceElemental',
            count: 2,
            interval: 0,
        },
        
        // Final boss
        {
            time: 1400,
            enemyType: 'iceTankElemental',
            count: 1,
        }
    ]
}; 