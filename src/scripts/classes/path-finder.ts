import Coords from "../../interfaces/coords";
import PF from "pathfinding";

const grid = new PF.Grid(7, 9); // expanded the grid by 1 because i'm too lazy to convert UI coordinates to pathfinder coordinates

for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 9; j++) {
        grid.setWalkableAt(i, j, false);
    }
}

const finder = new PF.DijkstraFinder({
    heuristic: PF.Heuristic.manhattan
});

class Pathfinder {
    private grid: PF.Grid;

    reset() {
        this.grid = grid.clone();
    }

    setWalkable(x: number, y: number) {
        this.grid.setWalkableAt(x, y, true);
    }

    findPath(from: Coords, to: Coords) {
        const path = finder.findPath(from.x, from.y, to.x, to.y, this.grid) as [number, number][];
        this.grid = this.grid.clone();
        return path;
    }
};

export default Pathfinder;
