function toCoords(num: string | number) {
    const castNumber = Number(num);
    const x = Math.floor(castNumber / 10);
    const y = castNumber - x * 10;

    return {
        x,
        y
    }
};

export default toCoords;
