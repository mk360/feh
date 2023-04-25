function renderText(scene: Phaser.Scene, x: number, y: number, content: string | number, style?: Partial<Phaser.GameObjects.TextStyle>) {
    return new Phaser.GameObjects.Text(scene, x, y, content.toString(), {
        fontFamily: "'FEH'",
        stroke: "black",
        strokeThickness: 2,
        ...style,
    });
};

export default renderText;
