interface Edge {
    coordinate: number;
    sides: [boolean, boolean, boolean, boolean] // up, down, left, right
}

function getEdges(coordinates: number[]) {
    const edges: Edge[] = [];

    for (let coordinate of coordinates) {
        const isTopEdge = !coordinates.includes(coordinate - 1);
        const isBottomEdge = !coordinates.includes(coordinate + 1);
        const isLeftEdge = !coordinates.includes(coordinate - 10);
        const isRightEdge = !coordinates.includes(coordinate + 10);

        edges.push({
            coordinate,
            sides: [isTopEdge, isBottomEdge, isLeftEdge, isRightEdge]
        });
    }

    return edges;
};

export default getEdges;
