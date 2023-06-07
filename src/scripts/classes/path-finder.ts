import { MovementType, StatusBuff, StatusDebuff } from "feh-battles/dec/types";
import TileType from "../../types/tiles";
import Coords from "../../interfaces/coords";

class Pathfinder {
    private tiles: string[] = [];
    private lastCrossedTile = "";

    getDistance(tile1: string, tile2: string): number;
    getDistance(tile1: Coords, tile2: Coords): number;
    getDistance(tile1: string | Coords, tile2: string | Coords) {
        let tile1Coords: Coords = typeof tile1 === "object" ? tile1 : {
            x: +tile1[0],
            y: +tile1[2]
        };

        let tile2Coords: Coords = typeof tile2 === "object" ? tile2 : {
            x: +tile2[0],
            y: +tile2[2]
        };

        return Math.abs(tile1Coords.x - tile2Coords.x) + Math.abs(tile1Coords.y - tile2Coords.y);
    }

    reset() {
        this.tiles = [];
        this.lastCrossedTile = "";
    }
    
    crossTile(tile: string, range: number, {
        statuses,
        movementType
    }: { statuses: (StatusBuff | StatusDebuff)[], movementType: MovementType }) {
        if (this.tiles.includes(tile)) {
            this.tiles.splice(this.tiles.indexOf(this.lastCrossedTile), 1);
        } else {
            const partialPath = this.salvageExistingPath(this.tiles, tile);
            return this.autocompletePath(partialPath, range, tile, { statuses, movementType });
        }

        if (this.tiles.length < range + 1 && !this.tiles.includes(tile)) {
            this.tiles.push(tile);
        }

        return this.tiles;
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

    autocompletePath(existingPath: string[], remainingRange: number, targetTile: string, {
        statuses,
        movementType
    }: { statuses: (StatusBuff | StatusDebuff)[], movementType: MovementType }) {
        let pathCopy: string[] = [];
        pathCopy = pathCopy.concat(existingPath);

    }

    leaveTile(tile: string) {
        this.lastCrossedTile = tile;
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
