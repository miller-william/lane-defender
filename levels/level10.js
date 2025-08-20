export default {
    name: "Alternating Onslaught",
    background: "#3e5c59",
    backgroundImage: "assets/river-vertical.png",
    bulletColor: "#ff0000",
  
    spawnEvents: [
      // Wave 1: Poop swarm (low dmg, high volume)
      {
        time: 4000,
        enemyType: "jack",
        count: 60,
        interval: 80,
        modifiers: { health: 4, damage: 0.5, speed: 0.08, bonus: null, glowColour: null }
      },
  
      // Wave 2: Zombies (high dmg, low volume)
      {
        time: 8000,
        enemyType: "zombie",
        count: 6,
        interval: 900,
        modifiers: { health: 3, damage: 2, speed: 0.15, movement: 'zigzag', bonus: null, glowColour: null }
      },
  
      // Wave 3: will wave
      {
        time: 20000,
        enemyType: "will",
        count: 60,
        interval: 60,
        modifiers: { health: 3, damage: 0.5, speed: 0.09, movement: "zigzag", bonus: null, glowColour: null }
      },
  
      // Wave 4: zombies
      {
        time: 28000,
        enemyType: "zombie",
        count: 2,
        interval: 800,
        modifiers: { health: 10, damage: 2, speed: 0.25, movement: 'zigzag', bonus: null, glowColour: null }
      },
  
      // Wave 5: Jack wave
      {
        time: 36000,
        enemyType: "jack",
        count: 90,
        interval: 40,
        modifiers: { health: 7, damage: 0.5, speed: 0.1, movement: "zigzag", bonus: null, glowColour: null }
      },
  
      // Wave 6: Tanky Jacks
      {
        time: 43000,
        enemyType: "jack",
        count: 6,
        interval: 1000,
        modifiers: { health: 80, damage: 18, speed: 0.07, bonus: null, glowColour: null, radius: 100 }
      },
  
      // Finale: Mixed pressure — a small poop screen + a couple zombies
      {
        time: 55000,
        enemyType: "roll",
        count: 35,
        interval: 50,
        modifiers: { health: 15, damage: 0.5, speed: 0.1, movement: "zigzag", bonus: null, glowColour: null }
      },
      {
        time: 53500,
        enemyType: "barrels",
        count: 4,
        interval: 900,
        modifiers: { health: 80, damage: 40, speed: 0.08, bonus: null, glowColour: null }
      },
      {
        time: 65500,
        enemyType: "barrels",
        count: 4,
        interval: 900,
        modifiers: { health: 140, damage: 60, speed: 0.1, bonus: null, glowColour: null }
      }
    ],
  
    upgradeEvents: [
      {
        time: 0,
        type: "upgradeChoice",
        bannerSpeed: 0.25,
        leftBonus: [            // crowd control for poop swarms
          { type: "spread", value: 3 },
          { type: "fireRate", value: -450 }
        ],
        rightBonus: [           // single-target for zombies
          { type: "damage", value: 4 },
          { type: "fireRate", value: -350 }
          //{ type: "pierce", value: 1 }
        ]
      },
      {
        time: 30000,
        type: "upgradeChoice",
        bannerSpeed: 0.25,
        leftBonus: [
          //{ type: "moveSpeed", value: 0.1 },     // mobility to dodge zombies
          { type: "fireRate", value: -200 }
        ],
        rightBonus: [
          { type: "spread", value: 2 },
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
          { type: "spread", value: 2 },
          //{ type: "critChance", value: 0.1 }
        ]
      }
    ]
  };