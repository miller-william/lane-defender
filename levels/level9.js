export default {
    name: "Alternating Onslaught",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000",
  
    spawnEvents: [
      // Wave 1: Poop swarm (low dmg, high volume)
      {
        time: 4000,
        enemyType: "roll",
        count: 15,
        interval: 80,
        modifiers: { health: 2, damage: 0.5, speed: 0.08, bonus: null, glowColour: null }
      },
  
      // Wave 2: Zombies (high dmg, low volume)
      {
        time: 8000,
        enemyType: "zombie",
        count: 3,
        interval: 900,
        modifiers: { health: 3, damage: 2, speed: 0.15, movement: 'zigzag', bonus: null, glowColour: null }
      },
  
      // Wave 3: Poop swarm (denser, some zigzag)
      {
        time: 20000,
        enemyType: "roll",
        count: 15,
        interval: 60,
        modifiers: { health: 2, damage: 0.5, speed: 0.09, movement: "zigzag", bonus: null, glowColour: null }
      },
  
      // Wave 4: Zombies (faster)
      {
        time: 28000,
        enemyType: "zombie",
        count: 4,
        interval: 800,
        modifiers: { health: 3, damage: 2, speed: 0.25, movement: 'zigzag', bonus: null, glowColour: null }
      },
  
      // Wave 5: Poop surge (short bursts)
      {
        time: 36000,
        enemyType: "roll",
        count: 24,
        interval: 40,
        modifiers: { health: 2, damage: 0.5, speed: 0.1, movement: "zigzag", bonus: null, glowColour: null }
      },
  
      // Wave 6: Elite zombies (few but tanky)
      {
        time: 43000,
        enemyType: "barrels",
        count: 3,
        interval: 1000,
        modifiers: { health: 40, damage: 18, speed: 0.07, bonus: null, glowColour: null }
      },
  
      // Finale: Mixed pressure — a small poop screen + a couple zombies
      {
        time: 55000,
        enemyType: "roll",
        count: 15,
        interval: 50,
        modifiers: { health: 2, damage: 0.5, speed: 0.1, movement: "zigzag", bonus: null, glowColour: null }
      },
      {
        time: 53500,
        enemyType: "barrels",
        count: 2,
        interval: 900,
        modifiers: { health: 7, damage: 40, speed: 0.08, bonus: null, glowColour: null }
      },
      {
        time: 65500,
        enemyType: "barrels",
        count: 4,
        interval: 900,
        modifiers: { health: 20, damage: 60, speed: 0.1, bonus: null, glowColour: null }
      }
    ],
  
    upgradeEvents: [
      {
        time: 0,
        type: "upgradeChoice",
        bannerSpeed: 0.25,
        leftBonus: [            // crowd control for poop swarms
          { type: "spread", value: 1 },
          { type: "fireRate", value: -150 }
        ],
        rightBonus: [           // single-target for zombies
          { type: "damage", value: 4 },
          //{ type: "pierce", value: 1 }
        ]
      },
      {
        time: 30000,
        type: "upgradeChoice",
        bannerSpeed: 0.25,
        leftBonus: [
          //{ type: "moveSpeed", value: 0.1 },     // mobility to dodge zombies
          { type: "fireRate", value: -100 }
        ],
        rightBonus: [
          { type: "spread", value: 1 },
          //{ type: "critChance", value: 0.1 }
        ]
      },
      {
        time: 55000,
        type: "upgradeChoice",
        bannerSpeed: 0.25,
        leftBonus: [
          //{ type: "moveSpeed", value: 0.1 },     // mobility to dodge zombies
          { type: "damage", value: 3 }
        ],
        rightBonus: [
          { type: "spread", value: 1 },
          //{ type: "critChance", value: 0.1 }
        ]
      }
    ]
  };