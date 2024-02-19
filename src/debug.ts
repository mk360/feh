// const DEBUG_ENTITIES: JSONEntity[] = [{
//     id: "test1",
//     tags: [],
//     components: [{ type: "Name", value: "Roy: Brave Lion" }, { type: "Position", x: 1, y: 1 }, { type: "Side", value: "team1" }, { type: "Weapon", weaponType: "sword", color: "red" }, { type: "Stats", maxHP: 50, hp: 50, atk: 49, spd: 49, def: 49, res: 49 }]
// }, {
//     id: "test3",
//     tags: [],
//     components: [{ type: "Name", value: "Ike: Brave Mercenary" }, { type: "Position", x: 5, y: 2 }, { type: "Side", value: "team2" }, { type: "Weapon", weaponType: "axe", color: "green" }, { type: "Stats", maxHP: 76, hp: 50, atk: 49, spd: 46, def: 49, res: 49 }]
// }, {
//     id: "test4",
//     tags: [],
//     components: [{ type: "Name", value: "Arvis: Emperor of Flame" }, { type: "Position", x: 5, y: 6 }, { type: "Side", value: "team1" }, { type: "Weapon", weaponType: "tome", color: "red" }, { type: "Stats", maxHP: 29, hp: 20, atk: 10, spd: 8, def: 1, res: 7 }]
// }, {
//     id: "test5",
//     tags: [],
//     components: [{ type: "Name", value: "Marth: Altean Prince" }, { type: "Position", x: 3, y: 7 }, { type: "Side", value: "team2" }, { type: "Weapon", weaponType: "sword", color: "red" }, { type: "Stats", maxHP: 42, hp: 20, atk: 10, spd: 8, def: 1, res: 7 }]
// }];

const DEBUG_ENTITIES = {
    "test1": {
        Name: [{ value: "Roy: Brave Lion", description: "The son of Eliwood, Marquess of Pherae. Has immense respect for his father and wields his weapon, Durandal. Appears in Fire Emblem: The Binding Blade." }],
        Side: [{ value: "team1" }],
        Weapon: [{ weaponType: "sword", color: "red", range: 1 }],
        Position: [{ x: 3, y: 7 }],
        Stats: [{ maxHP: 42, hp: 5, atk: 10, spd: 8, def: 1, res: 7 }],
        Skill: [{ name: "Blazing Durandal", slot: "weapon", might: 16, description: "Grants Atk+3. If unit's Atk > foe's Atk, grants Special cooldown charge +1 per unit's attack. (Only highest value applied. Does not stack.)" }, { name: "Armored Blow 1", slot: "A", description: "If unit initiates combat, grants Def+2 during combat." }, { name: "Atk Smoke 3", slot: "C", description: "Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat." }, { slot: "special", name: "Astra", baseCooldown: 5, currentCooldown: 5, cooldown: 4, description: "Boosts damage by 250%." }, { slot: "assist", name: "Shove", range: 1, description: "Pushes target ally 1 space away." }]
    },
    "test5": {
        Name: [{ value: "Lyn: Lady of the Plains", description: "The son of Eliwood, Marquess of Pherae. Has immense respect for his father and wields his weapon, Durandal. Appears in Fire Emblem: The Binding Blade." }],
        Side: [{ value: "team1" }],
        Weapon: [{ weaponType: "sword", color: "red", range: 1 }],
        Position: [{ x: 1, y: 7 }],
        Stats: [{ maxHP: 42, hp: 5, atk: 10, spd: 8, def: 1, res: 7 }],
        Skill: [{ name: "Blazing Durandal", slot: "weapon", might: 16, description: "Grants Atk+3. If unit's Atk > foe's Atk, grants Special cooldown charge +1 per unit's attack. (Only highest value applied. Does not stack.)" }, { name: "Armored Blow 1", slot: "A", description: "If unit initiates combat, grants Def+2 during combat." }, { name: "Atk Smoke 3", slot: "C", description: "Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat." }, { slot: "special", name: "Astra", baseCooldown: 5, currentCooldown: 5, cooldown: 0, description: "Boosts damage by 250%." }, { slot: "assist", name: "Shove", range: 1, description: "Pushes target ally 1 space away." }]
    },
    "test6": {
        Name: [{ value: "Berkut: Prideful Prince", description: "The son of Eliwood, Marquess of Pherae. Has immense respect for his father and wields his weapon, Durandal. Appears in Fire Emblem: The Binding Blade." }],
        Side: [{ value: "team1" }],
        Weapon: [{ weaponType: "lance", color: "blue", range: 1 }],
        Position: [{ x: 5, y: 1 }],
        Stats: [{ maxHP: 42, hp: 5, atk: 10, spd: 8, def: 1, res: 7 }],
        Skill: [{ name: "Blazing Durandal", slot: "weapon", might: 16, description: "Grants Atk+3. If unit's Atk > foe's Atk, grants Special cooldown charge +1 per unit's attack. (Only highest value applied. Does not stack.)" }, { name: "Armored Blow 1", slot: "A", description: "If unit initiates combat, grants Def+2 during combat." }, { name: "Atk Smoke 3", slot: "C", description: "Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat." }, { slot: "special", name: "Astra", baseCooldown: 5, currentCooldown: 5, cooldown: 4, description: "Boosts damage by 250%." }, { slot: "assist", name: "Shove", range: 1, description: "Pushes target ally 1 space away." }]
    },
    "test7": {
        Name: [{ value: "Hinoka: Warrior Princess", description: "The son of Eliwood, Marquess of Pherae. Has immense respect for his father and wields his weapon, Durandal. Appears in Fire Emblem: The Binding Blade." }],
        Side: [{ value: "team1" }],
        Weapon: [{ weaponType: "lance", color: "blue", range: 1 }],
        Position: [{ x: 3, y: 3 }],
        Stats: [{ maxHP: 42, hp: 35, atk: 10, spd: 8, def: 1, res: 7 }],
        Skill: [{ name: "Blazing Durandal", slot: "weapon", might: 16, description: "Grants Atk+3. If unit's Atk > foe's Atk, grants Special cooldown charge +1 per unit's attack. (Only highest value applied. Does not stack.)" }, { name: "Armored Blow 1", slot: "A", description: "If unit initiates combat, grants Def+2 during combat." }, { name: "Atk Smoke 3", slot: "C", description: "Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat." }, { slot: "special", name: "Astra", baseCooldown: 5, currentCooldown: 5, cooldown: 4, description: "Boosts damage by 250%." }, { slot: "assist", name: "Shove", range: 1, description: "Pushes target ally 1 space away." }]
    },
    "test8": {
        Name: [{ value: "Azura: Lady of Ballads", description: "The son of Eliwood, Marquess of Pherae. Has immense respect for his father and wields his weapon, Durandal. Appears in Fire Emblem: The Binding Blade." }],
        Side: [{ value: "team1" }],
        Weapon: [{ weaponType: "axe", color: "green", range: 1 }],
        Position: [{ x: 5, y: 6 }],
        Stats: [{ maxHP: 50, hp: 22, atk: 10, spd: 8, def: 1, res: 7 }],
        Skill: [{ name: "Blazing Durandal", slot: "weapon", might: 16, description: "Grants Atk+3. If unit's Atk > foe's Atk, grants Special cooldown charge +1 per unit's attack. (Only highest value applied. Does not stack.)" }, { name: "Armored Blow 1", slot: "A", description: "If unit initiates combat, grants Def+2 during combat." }, { name: "Atk Smoke 3", slot: "C", description: "Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat." }, { slot: "special", name: "Astra", baseCooldown: 5, currentCooldown: 5, cooldown: 4, description: "Boosts damage by 250%." }, { slot: "assist", name: "Shove", range: 1, description: "Pushes target ally 1 space away." }]
    },
    "test4": {
        Name: [{ value: "Hector: General of Ostia", description: "The son of Eliwood, Marquess of Pherae. Has immense respect for his father and wields his weapon, Durandal. Appears in Fire Emblem: The Binding Blade." }],
        Side: [{ value: "team2" }],
        Weapon: [{ weaponType: "axe", color: "green", range: 1 }],
        Position: [{ x: 3, y: 5 }],
        Stats: [{ maxHP: 42, hp: 5, atk: 10, spd: 8, def: 1, res: 7 }],
        Skill: [{ name: "Blazing Durandal", slot: "weapon", might: 16, description: "Grants Atk+3. If unit's Atk > foe's Atk, grants Special cooldown charge +1 per unit's attack. (Only highest value applied. Does not stack.)" }, { name: "Armored Blow 1", slot: "A", description: "If unit initiates combat, grants Def+2 during combat." }, { name: "Atk Smoke 3", slot: "C", description: "Inflicts Atk-7 on foes within 2 spaces of target through their next actions after combat." }, { slot: "special", name: "Astra", baseCooldown: 5, currentCooldown: 5, cooldown: 0, description: "Boosts damage by 250%." }, { slot: "assist", name: "Shove", range: 1, description: "Pushes target ally 1 space away." }]
    },
    "test2": {
        Name: [{ value: "Corrin: Fateful Prince", description: "King of the Holy Kingdom of Faerghus. Although he lost himself for a time, he now walks the path of a great ruler. Appears in Fire Emblem: Three Houses." }],
        Side: [{ value: "team2" }],
        Weapon: [{ weaponType: "sword", color: "red", range: 1 }],
        Position: [{ x: 2, y: 1 }],
        Stats: [{ maxHP: 45, hp: 29, atk: 46, spd: 38, def: 31, res: 21 }],
        Skill: [{ name: "Yato", slot: "weapon", might: 14, description: "If unit initiates combat, grants Spd+4 during combat." }, { name: "Atk/Res Bond 2", slot: "A", description: "If unit is adjacent to an ally, grants Atk/Res+4 during combat." },{ name: "Pass 3", slot: "B", description: "If unit's HP ≥ 25%, unit can move through foes' spaces. " }, { name: "Savage Blow 1", slot: "C", description: "If unit initiates combat, deals 3 damage to foes within 2 spaces of target after combat." }, { slot: "special", name: "Dragon Fang", description: "Boosts damage by 30% of unit's Atk.", baseCooldown: 3, currentCooldown: 5, cooldown: 3 }, { slot: "assist", name: "Rally Def", range: 1, description: "Grants Def+4 to target ally for 1 turn." }]
    },
    "test3": {
        Name: [{ value: "Corrin: Fateful Princess", description: "A Hoshidan prince raised in Nohr. Fights on his chosen path with the divine blade Yato. Appears in Fire Emblem Fates." }],
        Side: [{ value: "team2" }],
        Weapon: [{ weaponType: "sword", color: "red", range: 1 }],
        Position: [{ x: 2, y: 4 }],
        Stats: [{ maxHP: 45, hp: 29, atk: 46, spd: 38, def: 31, res: 21 }],
        Skill: [{ name: "Yato", slot: "weapon", might: 14, description: "If unit initiates combat, grants Spd+4 during combat." }, { name: "Atk/Res Bond 2", slot: "A", description: "If unit is adjacent to an ally, grants Atk/Res+4 during combat." },{ name: "Pass 3", slot: "B", description: "If unit's HP ≥ 25%, unit can move through foes' spaces. " }, { name: "Savage Blow 1", slot: "C", description: "If unit initiates combat, deals 3 damage to foes within 2 spaces of target after combat." }, { slot: "special", name: "Dragon Fang", description: "Boosts damage by 30% of unit's Atk.", baseCooldown: 3, currentCooldown: 5, cooldown: 3 }, { slot: "assist", name: "Rally Def", range: 1, description: "Grants Def+4 to target ally for 1 turn." }]
    }
}

export default DEBUG_ENTITIES;
