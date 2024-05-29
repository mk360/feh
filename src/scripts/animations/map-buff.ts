import { GameObjects } from "phaser";
import MainScene from "../scenes/mainScene";
import Hero from "../objects/hero";

function createMapBuffAnimation(scene: MainScene, target: Hero) {
    const heroCoordinates = target.getAbsoluteCoordinates();
    const statChangeAura = new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y + 50, "stat-change-aura").setAlpha(0.7).setOrigin(0.5, 1);
    const statChangeParticles = Array.from<GameObjects.Image>({ length: 4 }).fill(new GameObjects.Image(scene, heroCoordinates.x - 10, heroCoordinates.y - 10, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2));
    statChangeAura.setTint(0xFEF4B3, 0xFEF4B3, 0xFFD717, 0xFFD717);
    const animation = scene.add.timeline([{
        from: 0,
        tween: {
            onStart: () => {
                scene.sound.play("bonus");
                scene.add.existing(statChangeParticles[0]);
                scene.add.existing(statChangeAura);
            },
            scaleY: 1.8,
            duration: 600,
            targets: [statChangeAura]
        },
    }, {
        from: 600,
        tween: {
            alpha: 0,
            duration: 500,
            targets: [statChangeAura]
        }
    }]);

    return animation
};

export default createMapBuffAnimation;
