// import FEH from "feh-battles";
// // import Hero from "feh-battles/dec/hero";
// import Coords from "../../interfaces/coords";
// // import MapEffectRunner from "feh-battles/dec/map-effect";
// import MapData from "../../maps/lava.json";
// // import { CombatOutcome } from "feh-battles/dec/combat";
// import Pathfinder from "./path-finder";
// import TileType from "../../types/tiles";
// import toCoords from "../utils/to-coords";
// import getNearby from "../utils/get-nearby";
// import UIAction from "../../interfaces/ui-action";
// import Team from "../../types/team";


// // class Battle {
// //     private map: {
// //         [k: number]: (Hero | null)[];
// //     };

// //     private terrain = MapData.terrain as {
// //         [k: number]: { [k: number]: TileType }
// //     };

// //     state = FEH.BattleState.createBlankState();

// //     private disabledCharacters: string[] = [];

// //     private effectRunner: MapEffectRunner;
// //     private pathfinder = new Pathfinder();

// //     constructor() {
// //         this.map = {};
// //         for (let i = 1; i < 9; i++) {
// //             this.map[i] = Array.from<Hero>({ length: 6 }).fill(null);
// //         }
// //     }

// //     initiateBattle(): UIAction {
// //         return {
// //             type: "start-turn",
// //             args: {
// //                 turn: "team1",
// //                 turnCount: 1
// //             }
// //         };
// //     }

// //     endTurn(): UIAction {
// //         this.state.endTurn();
// //         this.disabledCharacters = [];
// //         return {
// //             type: "start-turn",
// //             args: {
// //                 turn: this.state.currentTurn,
// //                 turnCount: this.state.turns[this.state.currentTurn]
// //             }
// //         }
// //     }

// //     decideDragAction(tile: string, hero: Hero, walkCoords: string[], attackCoords: string[]): UIAction[] {
// //         const coordinatedTile = toCoords(tile);
// //         const mapData = this.map[coordinatedTile.y]?.[coordinatedTile.x];
// //         if (mapData && this.areEnemies(hero, mapData) && attackCoords.includes(tile)) {
// //             const preview = this.startCombat(hero, mapData);
// //             return [{
// //                 type: "preview",
// //                 args: {
// //                     attacker: hero,
// //                     defender: mapData,
// //                     outcome: preview
// //                 }
// //             }];
// //         }
// //     }

// //     switchHeroes(hero1: Hero, hero2: Hero) {
// //         const { coordinates } = hero1;
// //         const { coordinates: secondCoordinates } = hero2;
// //         this.map[coordinates.y][coordinates.x] = hero2;
// //         this.map[secondCoordinates.y][secondCoordinates.x] = hero1;
// //         hero1.coordinates = { ...secondCoordinates };
// //         hero2.coordinates = { ...coordinates };
// //     }

// //     decideDragDropAction(tile: string, hero: Hero, walkCoords: string[], attackCoords: string[], isSwitchMode = false): UIAction[] {
// //         const coordinatedTile = toCoords(tile);
// //         const mapData = this.map[coordinatedTile.y]?.[coordinatedTile.x];
// //         if (walkCoords.includes(tile) && !mapData) {
// //             const heroMoved: UIAction[] = [{ type: "move", args: { ...coordinatedTile, hero } }, { type: "disable", args: hero }];
// //             this.disabledCharacters.push(hero.id);
// //             const hostTeam = hero.id in this.state.teams.team1.members ? this.state.teams.team1.members : this.state.teams.team2.members;
// //             if (this.disabledCharacters.length === Object.keys(hostTeam).length) {
// //                 const newTurn = this.endTurn();
// //                 heroMoved.push(newTurn);
// //             }

// //             return heroMoved;
// //         }

// //         if (attackCoords.includes(tile) && mapData && this.areEnemies(hero, mapData)) {
// //             const { range } = hero.getWeapon();
// //             const path = this.pathfinder.tiles;
// //             const finalTile = toCoords(path.find((t) => this.getDistance(t, coordinatedTile) === range));
// //             const outcome = this.startCombat(hero, mapData);
// //             return [{ type: "move", args: { ...finalTile, hero } }, {
// //                 type: "attack",
// //                 args: {
// //                     attacker: hero,
// //                     defender: mapData,
// //                     outcome
// //                 }
// //             }];
// //         }

// //         if (mapData && !this.areEnemies(hero, mapData) && isSwitchMode) {
// //             return [{
// //                 type: "switch",
// //                 args: {
// //                     firstHero: hero,
// //                     secondHero: mapData
// //                 }
// //             }];
// //         }

// //         return [{
// //             type: "cancel",
// //             args: {
// //                 hero,
// //                 ...hero.coordinates
// //             }
// //         }];
// //     }
// // };

// export default {};
