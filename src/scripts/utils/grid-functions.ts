export const squareSize = 90;
export const squaresOffset = 45;
export const fixedY = 205;

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

export function getTileCoordinates(tileName: string | number) {
    const x = Math.floor(+tileName / 10);
    const y = +tileName - x * 10;
    return { x, y };
}
