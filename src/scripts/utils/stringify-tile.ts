import Coords from "../../interfaces/coords";

function stringifyTile(tile: Coords) {
    return tile.x + "-" + tile.y;
}

export default stringifyTile;
