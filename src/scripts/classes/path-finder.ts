import Coords from "../../interfaces/coords";
import PF from "pathfinding";

const grid = new PF.Grid(7, 9); // expanded the grid by 1 because i'm too lazy to convert UI coordinates to pathfinder coordinates
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
        return finder.findPath(from.x, from.y, to.x, to.y, this.grid.clone()) as [number, number][];
    }
};

export default Pathfinder;
