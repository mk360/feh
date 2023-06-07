import FEH from "feh-battles";
import Hero from "feh-battles/dec/hero";
import Coords from "../interfaces/coords";
import MapEffectRunner from "feh-battles/dec/map-effect";
import Team from "../types/team";
import MapData from "../maps/lava.json";
import { CombatOutcome } from "feh-battles/dec/combat";
import * as Heroes from "./data/heroes";
import stringifyTile from "./utils/stringify-tile";
import Pathfinder from "./classes/path-finder";
import TileType from "../types/tiles";
import toCoords from "./utils/to-coords";


class Battle {
    team1: {
        [heroId: string]: Hero;
    };
    team2: {
        [heroId: string]: Hero;
    };
    map: {
        [k: number]: (Hero | null)[];
    };

    private terrain = MapData.terrain as {
        [k: number]: { [k: number]: TileType }
    };

    private effectRunner: MapEffectRunner;
    private pathfinder = new Pathfinder();

    constructor() {
        this.team1 = {};
        this.team2 = {};
        this.map = {};
        for (let i = 1; i < 9; i++) {
            this.map[i] = Array.from<Hero>({ length: 6 }).fill(null);
        }
    }

    crossTile(hero: Hero, tile: string, walkTiles: string[]) {
        const movementRange = this.pathfinder.getMovementRange(hero);
        const { tiles, complete } = this.pathfinder.crossTile(tile, movementRange);
        console.log({ complete, tiles });
        if (complete) {
            return tiles;
        } else {
            const distances = this.buildArrowPath(tiles, walkTiles, movementRange - tiles.length + 1);
        }
    }

    buildArrowPath(existingTiles: string[], validTiles: string[], remainingRange: number) {
        let currentTile = existingTiles[existingTiles.length - 1];
        const path = new Set<string>(existingTiles);
        let maxDistance = remainingRange;
        while (maxDistance) {
            const nearby = getNearby(toCoords(currentTile)).filter((tile) => {
                const isNewTile = !path.has(tile.x + "-" + tile.y);
                const canBeCrossed = validTiles.includes(tile.x + "-" + tile.y);
                return isNewTile && canBeCrossed;
            });
            const closest = nearby.sort(this.getDistance.bind(this));
            currentTile = closest[0].x + "-" + closest[0].y;
            maxDistance--;
        }
        return [];
    }

    leaveTile(tile: string) {
        this.pathfinder.leaveTile(tile);
    }

    resetEffects(team: Team) {
        for (let heroId in this[team]) {
            const hero = this[team][heroId];
            hero.mapBoosts = {
                atk: 0,
                spd: 0,
                res: 0,
                def: 0,
            };
            hero.mapPenalties = {
                atk: 0,
                spd: 0,
                res: 0,
                def: 0,
            };
            hero.statuses = [];
        }
    }

    resetPathfinder() {
        this.pathfinder.reset();
    }

    private getMovementRange(hero: Hero) {
        return this.pathfinder.getMovementRange(hero);
    }

    private tileHasEnemy(hero: Hero, tile: Coords) {
        const tileData = this.map[tile.y][tile.x];
        if (!tileData) return false;
        return (tileData.id in this.team1 && hero.id in this.team2) || (tileData.id in this.team2 && hero.id in this.team1);
    };

    getMovementTiles(hero: Hero, range?: number, previousTiles?: Coords[]) {
        let existingRange = range ?? this.getMovementRange(hero) + 1;
        if (existingRange === 0) return [];
        let tiles = previousTiles || [hero.coordinates];
        let result: Coords[] = [];
        let validTiles = tiles.map((tile) => {
            return getNearby(tile).filter((filteredTile) => {
                const heroCanReachTile = !this.tileHasEnemy(hero, filteredTile) && this.heroCanUseTile(filteredTile, hero);
                const tileCanBeCrossed = existingRange - this.getTileCost(hero, filteredTile) > 0;
                return heroCanReachTile && tileCanBeCrossed;
            });
        }).flat();
        validTiles = validTiles.concat(this.getMovementTiles(hero, existingRange - 1, validTiles));
        result = result.concat(validTiles);
        return Array.from(new Set(result.map((t) => t.x + "-" + t.y))).map((t) => ({
            x: +t[0],
            y: +t[2]
        }));
    }

    getAttackTiles(hero: Hero, movementTiles: Coords[]) {
        let weaponRange = hero.getWeapon().range;
        const movementTileStrings = movementTiles.map(stringifyTile);
        let extraTiles: Coords[] = movementTiles;
        while (weaponRange) {
            extraTiles = extraTiles.map(getNearby).flat();
            weaponRange--;
        }

        return Array.from(new Set(extraTiles.map(stringifyTile).filter((t) => !movementTileStrings.includes(t))));
    }

    getDistance(tile1: string | Coords, tile2: string | Coords) {
        return this.pathfinder.getDistance(tile1, tile2);
    }

    private heroCanUseTile(tile: Coords, hero: Hero) {
        const tileType = this.terrain[tile.y][tile.x];
        return this.pathfinder.checkCrossability(tileType, hero.getMovementType());
    }

    moveHero(hero: Hero, destination: Coords) {
        const previousCoordinates = hero.coordinates;
        this.map[previousCoordinates.y][previousCoordinates.x] = null;
        hero.coordinates = destination;
        this.map[destination.y][destination.x] = hero;
    }

    killHero(hero: Hero, team: Team) {
        const { coordinates } = hero;
        for (let ally of hero.allies) {
            ally.allies = ally.allies.filter(({ id }) => id !== hero.id);
        }
        for (let enemy of hero.enemies) {
            enemy.enemies = enemy.enemies.filter(({ id }) => id !== hero.id);
        }
        this.map[coordinates.y][coordinates.x] = null;
        delete this[team][hero.id];
    }

    addHero(hero: Hero, team: Team, startingCoordinates: { x: number; y: number }) {
        hero.coordinates = startingCoordinates;

        this[team][hero.id] = hero;
        this.map[startingCoordinates.y][startingCoordinates.x] = hero;
    }

    startCombat(attacker: Hero, defender: Hero) {
        return new FEH.Combat({ attacker, defender }).createCombat();
    }

    getTileCost(hero: Hero, tile: Coords) {
        const tileType = this.terrain[tile.y][tile.x];
        return this.pathfinder.getTileCost(tileType, hero.getMovementType());
    }

    setAlliesAndEnemies() {
        for (let heroId1 in this.team1) {
            for (let heroId2 in this.team1) {
                if (heroId1 !== heroId2) {
                    this.team1[heroId1].setAlly(this.team1[heroId2]);
                    this.team1[heroId2].setAlly(this.team1[heroId1]);
                }
            }

            for (let enemy in this.team2) {
                this.team1[heroId1].setEnemy(this.team2[enemy]);
            }
        }

        for (let heroId1 in this.team2) {
            for (let heroId2 in this.team2) {
                if (heroId1 !== heroId2) {
                    this.team2[heroId1].setAlly(this.team2[heroId2]);
                    this.team2[heroId2].setAlly(this.team2[heroId1]);
                }
            }
        }

        this.effectRunner = new FEH.MapEffectRunner(this.team1, this.team2);
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

battle.addHero(Heroes.Ike, "team2", MapData.startingSlots.team2[3]);

battle.addHero(Heroes.Corrin, "team2", MapData.startingSlots.team2[1]);

battle.addHero(Heroes.Ephraim, "team2", MapData.startingSlots.team2[0]);

battle.addHero(Heroes.Lyn, "team2", MapData.startingSlots.team2[2]);

battle.setAlliesAndEnemies();

export default battle;
