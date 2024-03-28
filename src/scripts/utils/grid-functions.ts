const squareSize = 125;
const squaresOffset = 63;
const fixedY = 120;

export function pixelsToGrid(x: number, y: number) {
    return {
        x: Math.round((squaresOffset + x) / squareSize),
        y: Math.round((y - fixedY) / squareSize)
    };
}

export function gridToPixels(x: number, y: number) {
    return {
        x: x * squareSize - squaresOffset,
        y: y * squareSize + fixedY,
    }
};
