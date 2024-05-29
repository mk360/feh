import { GameObjects } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function createMapDebuffAnimation(scene: MainScene, target: Hero) {
    const heroCoordinates = target.getAbsoluteCoordinates();
    const rand = Math.random() < 0.5;
    const statChangeImage = new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y, "stat-change-aura").setAlpha(0.7);
    const statChangeParticles = Array.from<GameObjects.Image>({ length: 4 }).fill(new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2));
    statChangeImage.setTint(0x00D4F0, 0x00D4F0, 0x0549B7, 0x0549B7);
    const animation = scene.add.timeline([{
        from: 0,
        tween: {
            onStart: () => {
                scene.add.existing(statChangeParticles[0])
                scene.add.existing(statChangeImage);
            },
            scaleY: 1.4,
            duration: 200,
            targets: [statChangeImage]
        },
    }]);

    return animation
};

export default createMapDebuffAnimation;
