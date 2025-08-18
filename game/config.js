// Game configuration and development settings
export const DEV_MODE = {
    ALL_LEVELS_UNLOCKED: true, // Set to true to unlock all levels for testing
    INFINITE_HEALTH: false, // Set to true for infinite health
    INSTANT_WIN: false // Set to true to instantly complete levels
};

// Game settings
export const GAME_CONFIG = {
    // Level progression
    MAX_LEVELS: 10,
    
    // Player settings
    DEFAULT_PLAYER_HEALTH: 5,
    DEFAULT_PLAYER_SPEED: 5,
    
    // Bullet settings
    DEFAULT_BULLET_DAMAGE: 1,
    DEFAULT_BULLET_FIRE_RATE: 500, // milliseconds
    DEFAULT_BULLET_COLOR: '#ffff00', // yellow
    
    // Enemy settings
    DEFAULT_ENEMY_HEALTH: 3,
    
    // UI settings
    BONUS_INDICATOR_SPACING: 35,
    BONUS_INDICATOR_ICON_SIZE: 24
};

// Local storage keys
export const STORAGE_KEYS = {
    PERFECT_LEVELS: 'laneDefenderPerfectLevels',
    UNLOCKED_LEVEL: 'laneDefenderUnlockedLevel'
}; 