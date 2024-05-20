import { GameObjects, Scene, Tweens } from "phaser";
import Hero from "./hero";

class InteractionIndicator extends GameObjects.Container {
    private bubbleContent: GameObjects.Image;
    private currentTween: Tweens.Tween;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        const bubble = new GameObjects.Image(scene, 0, 0, "interactions", "bubble");
        const center = bubble.getCenter();
        this.setScale(0.7)

        this.bubbleContent = new GameObjects.Image(scene, center.x, center.y - 5, "interactions", "attack");
        this.add([bubble, this.bubbleContent]);
    }

    setContent(frame: "attack" | "assist" | "switch") {
        this.bubbleContent.setFrame(frame);
        return this;
    }

    hover(target: Hero) {
        const { x, y } = target.getAbsoluteCoordinates();
        this.x = x;
        this.y = y - 70;

        return this;
    }

    disable() {
        this.setVisible(false);
        this.currentTween?.stop();
    }

    tween() {
        if (this.currentTween) this.currentTween.stop();
        const baseY = this.y;
        this.currentTween = this.scene.tweens.add({
            targets: [this],
            y: baseY - 10,
            yoyo: true,
            loop: -1,
            duration: 450,
            paused: true,
        }) as Tweens.Tween;

        return this.currentTween;
    }
};

export default InteractionIndicator;
