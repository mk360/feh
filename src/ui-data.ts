export const WEAPON_TYPES = {
    "lance": "Lance. Physical weapon. Range: 1. Damage reduced by target's Def.",
    "sword": "Sword. Physical weapon. Range: 1. Damage reduced by target's Def.",
    "axe": "Axe. Physical weapon. Range: 1. Damage reduced by target's Def.",
    "beast": "%c Beast. Physical weapon. Range: 1. Damage reduced by target's Def.",
    "bow": "%c Bow. Physical weapon. Range: 2. Damage reduced by target's Def.",
    "dagger": "%c Dagger. Physical weapon. Range: 2. Damage reduced by target's Def. Can temporarily reduce target's stats.",
    "breath": "%c Breath. Magical weapon. Range: 1. Damage reduced by target's Res.",
    "tome": "%c Tome. Magical weapon. Range: 2. Damage reduced by target's Res.",
    "staff": "Staff. Magical weapon. Range: 2 (attack only). Damage reduced by target's Res."
} as const;

export const STATS = {
    hp: "A unit is defeated if its Hit Points reach 0.",
    def: "The higher a unit's Defense is, the less damage it takes from physical attacks (swords, axes, lances, etc.).",
    res: "The higher a unit's Resistance is, the less damage it takes from magical attacks (spells, staves, breath effects, etc.).",
    spd: "A unit will attack twice if its Spd is at least 5 more than its foe.",
    atk: "The higher a unit's Atk, the more damage it will inflict on foes.",
} as const;
