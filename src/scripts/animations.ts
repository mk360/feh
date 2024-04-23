import { GameObjects, Scene } from "phaser";

class Animator {
    constructor(private scene: Scene) { }

    tileMarkerGlow(tileMarker: GameObjects.Image) {
        return this.scene.tweens.create({
            targets: [tileMarker],
            loop: true,
            duration: 100,

        });
    }
}