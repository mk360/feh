import { GameObjects, Scene } from "phaser";

class InteractionIndicator extends GameObjects.Container {
    private bubbleContent: GameObjects.Image;
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        const bubble = new GameObjects.Image(scene, 0, 0, "interactions", "bubble");
        const center = bubble.getCenter();
    
        this.bubbleContent = new GameObjects.Image(scene, center.x, center.y - 5, "interactions", "attack");
        this.add([bubble, this.bubbleContent]);
    }

    setContent(frame: "attack" | "assist" | "switch") {
        this.bubbleContent.setFrame(frame);
        return this;
    }
};

export default InteractionIndicator;
