function toCoords(stringCoordinate: string) {
    return {
        x: +stringCoordinate[0],
        y: +stringCoordinate[2]
    };
};

export default toCoords;
