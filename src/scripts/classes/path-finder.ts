import { MovementType, StatusBuff, StatusDebuff } from "feh-battles/dec/types";
import TileType from "../../types/tiles";
import Coords from "../../interfaces/coords";
import toCoords from "../utils/to-coords";
import getNearby from "../utils/get-nearby";

class Pathfinder {
    tiles: string[] = [];
    private lastCrossedTile = "";

    getDistance(tile1: string | Coords, tile2: string | Coords) {
        let tile1Coords: Coords = typeof tile1 === "object" ? tile1 : toCoords(tile1);

        let tile2Coords: Coords = typeof tile2 === "object" ? tile2 : toCoords(tile2);

        return Math.abs(tile1Coords.x - tile2Coords.x) + Math.abs(tile1Coords.y - tile2Coords.y);
    }

    reset(startingPoint: Coords) {
        this.tiles = [startingPoint.x + "-" + startingPoint.y];
        this.lastCrossedTile = "";
    }

    setTiles(tiles: string[]) {
        this.tiles = tiles;
    }
    
    crossTile(tile: string, range: number, startingCoordinates: Coords) {
        if (!this.tiles.includes(tile) && this.tiles.length < range + 1) {
            if (this.getDistance(this.tiles[this.tiles.length 
            - 1], tile) === 1) {
                this.tiles.push(tile);
            } else {
            }
        }

        return {
            tiles: this.tiles,
            complete: true,
        };
    }
    
    private salvageExistingPath(path: string[], newTile: string) {
        const mostValidPath: string[] = [];
        let baseDistance = Infinity;
        for (let oldTile of path) {
            const distance = this.getDistance(newTile, oldTile);
            if (distance < baseDistance) {
                baseDistance = distance;
                mostValidPath.push(oldTile);
            } else return mostValidPath;
        }
        return mostValidPath;
    }

    leaveTile(tile: string) {
        this.lastCrossedTile = tile;
    }

    buildAutomaticPath(existingTiles: string[], validTiles: string[], remainingRange: number, target: string) {
        let currentTile = existingTiles[existingTiles.length - 1];
        const path = new Set(existingTiles);
        let maxDistance = remainingRange;
        while (maxDistance) {
            const nearby = getNearby(toCoords(currentTile)).filter((tile) => {
                const isNewTile = !path.has(tile.x + "-" + tile.y);
                const canBeCrossed = validTiles.includes(tile.x + "-" + tile.y);
                return isNewTile && canBeCrossed;
            });
            const closest = nearby.sort((tile1, tile2) => {
                return this.getDistance(tile1, target) - this.getDistance(tile2, target);
            });
            currentTile = closest[0].x + "-" + closest[0].y;
            path.add(currentTile);
            maxDistance--;
        }

        return Array.from(path);
    }

    getMovementRange({
        statuses,
        movementType
    }: { statuses: (StatusBuff | StatusDebuff)[], movementType: MovementType }) {
        if (statuses.includes("limitedMovement")) return 1;
        let movementRange = 2;
        if (movementType === "cavalry") movementRange = 3;
        if (movementType === "armored") movementRange = 1;
        if (statuses.includes("enhancedMovement")) movementRange++;
        return movementRange;
    }

    // find a better name
    checkCrossability(tileType: TileType, movementType: MovementType) {
        switch (tileType) {
            case "void": return movementType === "flier";
            case "wall": return false;
            case "tree": return movementType !== "cavalry";
            default: return true;
        }
    }

    getTileCost(tileType: TileType, movementType: MovementType) {
        switch (tileType) {
            case "tree": return movementType === "infantry" ? 2 : 1;
            case "trench": return movementType === "cavalry" ? 3 : 1;
            default: return 1;
        }
    }
};

export default Pathfinder;
