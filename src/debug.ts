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
        Name: [{ value: "Roy: Brave Lion" }],
        Side: [{ value: "team1" }],
        Weapon: [{ weaponType: "sword", color: "red" }],
        Position: [{ x: 3, y: 7 }],
        Stats: [{ maxHP: 42, hp: 5, atk: 10, spd: 8, def: 1, res: 7 }],
        Skill: [{ name: "Blazing Durandal", slot: "weapon" }, { name: "Armored Blow 1", slot: "A" }, { name: "Atk Smoke 3", slot: "C" }, { slot: "special", name: "Astra" }, { slot: "assist", name: "Shove" }]
    }
}

export default DEBUG_ENTITIES;
