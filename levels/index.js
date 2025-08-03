import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';
import level4 from './level4.js';
import level5 from './level5.js';

// Placeholder levels for 6-10
const placeholderLevel = {
    name: "Coming Soon",
    background: "#333333",
    spawnEvents: [
        { time: 0, enemyType: 'basic', health: 1, speed: 1 }
    ]
};

export const LEVELS = {
    1: level1,
    2: level2,
    3: level3,
    4: level4,
    5: level5,
    6: placeholderLevel,
    7: placeholderLevel,
    8: placeholderLevel,
    9: placeholderLevel,
    10: placeholderLevel
}; 