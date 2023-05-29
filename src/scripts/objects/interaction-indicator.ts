import { GameObjects, Scene } from "phaser";

class InteractionIndicator extends GameObjects.Container {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        const bubble = new GameObjects.Image(scene, 0, 0, "interactions", "bubble");
        const center = bubble.getCenter();
    
        const crossedSwords = new GameObjects.Image(scene, center.x, center.y - 5, "interactions", "attack");
        this.add([bubble, crossedSwords]);
    }
};

export default InteractionIndicator;
