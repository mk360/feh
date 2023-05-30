import FEH from "feh-battles";
import Hero from "feh-battles/dec/hero";
import Coords from "../interfaces/coords";
import MapEffectRunner from "feh-battles/dec/map-effect";
import Team from "../types/team";
import MapData from "../maps/lava.json";
import { CombatOutcome } from "feh-battles/dec/combat";
import * as Heroes from "./data/heroes";


class Battle {
    team1: ({ hero: Hero } & Coords)[];
    team2: ({ hero: Hero } & Coords)[];
    // todo: refactor into a key-value pair?
    map: {
        [k: number]: (Hero | null)[];
    };

    terrain = MapData.terrain;

    private effectRunner: MapEffectRunner;

    constructor() {
        this.team1 = [];
        this.team2 = [];
        this.map = {};
        for (let i = 1; i < 9; i++) {
            this.map[i] = Array.from<Hero>({ length: 6 }).fill(null);
        }
    }

    resetEffects(team: Team) {
        for (let { hero } of this[team]) {
            hero.mapMods = {
                atk: 0,
                spd: 0,
                res: 0,
                def: 0,
            };
            hero.statuses = [];
        }
    }

    getMovementRange(hero: Hero) {
        if (hero.statuses.includes("limitedMovement")) return 1;
        const { movementType } = hero;
        let movementRange = 2;
        if (movementType === "cavalry") movementRange = 3;
        if (movementType === "armored") movementRange = 1;
        if (hero.statuses.includes("enhancedMovement")) movementRange++;
        return movementRange;
    }

    getMovementTiles(hero: Hero, range?: number, previousTiles?: Coords[]) {
        if (range === 0) return [];
        let tiles = previousTiles || [hero.coordinates];
        let result: Coords[] = [];
        let validTiles = tiles.map((tile) => {
            return getNearby(tile).filter((filteredTile) => {
                const heroCanReachTile = !this.map[filteredTile.y][filteredTile.x] && this.heroCanUseTile(filteredTile, hero);
                const tileCanBeCrossed = range - this.getTileCost(hero, tile) >= 0;
                return heroCanReachTile && tileCanBeCrossed;
            });
        }).flat();
        validTiles = validTiles.concat(this.getMovementTiles(hero, range - 1, validTiles));
        result = result.concat(validTiles);
        return Array.from(new Set(result.map((t) => t.x + "-" + t.y))).map((t) => ({
            x: +t[0],
            y: +t[2]
        }));
    }

    getAttackTiles(hero: Hero, movementTiles: Coords[]) {

    }

    getTileCost(hero: Hero, tile: Coords) {
        const tileType = this.terrain[tile.y][tile.x];
        switch (tileType) {
            case "tree": return hero.getMovementType() === "infantry" ? 2 : 1;
            case "trench": return hero.getMovementType() === "cavalry" ? 3 : 1;
            default: return 1;
        }
    }

    getTilesInShallowRange(movementTiles: Coords[]) {
        
    }

    getDistance(tile1: Coords, tile2: Coords) {
        return Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y);
    }

    heroCanUseTile(tile: Coords, hero: Hero) {
        const tileType = this.terrain[tile.y][tile.x];
        switch (tileType) {
            case "void": return hero.getMovementType() === "flier";
            case "wall": return false;
            case "tree": return hero.getMovementType() !== "cavalry";
            default: return true;
        }
    }

    moveHero(hero: Hero, destination: Coords) {
        const previousCoordinates = hero.coordinates;
        this.map[previousCoordinates.y][previousCoordinates.x] = null;
        hero.coordinates = destination;
        this.map[destination.y][destination.x] = hero;
    }

    killHero(hero: Hero, coordinates: Coords, team: Team) {
        for (let ally of hero.allies) {
            ally.allies = ally.allies.filter(({ id }) => id !== hero.id);
        }
        for (let enemy of hero.enemies) {
            enemy.enemies = enemy.enemies.filter(({ id }) => id !== hero.id);
        }
        this.map[coordinates.y][coordinates.x] = null;
        this[team] = this[team].filter(({ hero: teamMember }) => teamMember.id !== hero.id);
    }

    addHero(hero: Hero, team: Team, startingCoordinates: { x: number; y: number }) {
        hero.coordinates = startingCoordinates;

        this[team].push({
            hero,
            ...startingCoordinates,
        });
        this.map[startingCoordinates.y][startingCoordinates.x] = hero;
    }

    startCombat(attacker: Hero, defender: Hero) {
        return new FEH.Combat({ attacker, defender }).createCombat();
    }

    setAlliesAndEnemies() {
        for (let i = 0; i < this.team1.length; i++) {
            for (let j = i + 1; j < this.team1.length; j++) {
                this.team1[i].hero.setAlly(this.team1[j].hero);
                this.team1[j].hero.setAlly(this.team1[i].hero);
            }

            for (let j = 0; j < this.team2.length; j++) {
                this.team1[i].hero.setEnemy(this.team2[j].hero);
            }
        }

        for (let i = 0; i < this.team2.length; i++) {
            for (let j = i + 1; j < this.team2.length; j++) {
                this.team2[i].hero.setAlly(this.team2[j].hero);
                this.team2[j].hero.setAlly(this.team2[i].hero);
            }

            for (let j = 0; j < this.team2.length; j++) {
                this.team2[i].hero.setEnemy(this.team1[j].hero);
            }
        }

        this.effectRunner = new FEH.MapEffectRunner(this.team1.map(({ hero }) => hero), this.team2.map(({ hero }) => hero));
    }

    getTurnStartEffects(team: Team) {
        return this.effectRunner.runTurnStartEffects(team);
    }

    getPostCombatEffects(hero: Hero, enemy: Hero, combatOutcome: CombatOutcome) {
        return this.effectRunner.runAfterCombatEffects({
            hero,
            enemy,
            combatOutcome
        });
    }
};

function isValid(tile: Coords) {
    return tile.x >= 1 && tile.x <= 6 && tile.y >= 1 && tile.y <= 8;
}
  
function getNearby(coords: Coords) {
    const { x, y } = coords;
    const nearbyTiles = [coords];

    nearbyTiles.push({
        x: x + 1,
        y
    });

    nearbyTiles.push({
        x: x-1,
        y
    });

    nearbyTiles.push({
        x,
        y: y + 1
    });

    nearbyTiles.push({
        x,
        y: y-1
    });

    return nearbyTiles.filter(isValid);
};

const battle = new Battle();


battle.addHero(Heroes.Lucina, "team1", MapData.startingSlots.team1[0]);
battle.addHero(Heroes.Ryoma, "team1", MapData.startingSlots.team1[1]);
battle.addHero(Heroes.Hector, "team1", MapData.startingSlots.team1[2]);
battle.addHero(Heroes.Robin, "team1", MapData.startingSlots.team1[3]);

console.log(battle.getMovementTiles(Heroes.Lucina, 2));

battle.addHero(Heroes.Ike, "team2", {
    y: 7,
    x: 6
});

battle.addHero(Heroes.Corrin, "team2", {
    y: 7,
    x: 4,
});

battle.addHero(Heroes.Ephraim, "team2", {
    x: 3,
    y: 7
});

battle.addHero(Heroes.Lyn, "team2", {
    y: 7,
    x: 5
});

battle.setAlliesAndEnemies();

export default battle;
