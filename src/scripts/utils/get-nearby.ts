import Coords from "../../interfaces/coords";

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

export default getNearby;
