import { GameObjects, Types } from "phaser";
import MainScene from "../scenes/mainScene";
import Hero from "../objects/hero";

function mapBuffAnimation(scene: MainScene, target: Hero) {
    const heroCoordinates = target.getAbsoluteCoordinates();
    const statChangeAura = new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y + 50, "stat-change-aura").setAlpha(0.9).setOrigin(0.5, 1);
    const firstParticle = new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y + 10, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2).setOrigin(0.5, 0).setTint(0xFEDB2F);
    const rightParticle = new GameObjects.Image(scene, heroCoordinates.x + 30, heroCoordinates.y + 10, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2).setOrigin(0.5, 0).setTint(0xFEDB2F);
    const leftParticle = new GameObjects.Image(scene, heroCoordinates.x - 20, heroCoordinates.y + 20, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2).setOrigin(0.5, 0).setTint(0xFEDB2F);
    const fourthParticle = new GameObjects.Image(scene, heroCoordinates.x + 10, heroCoordinates.y + 30, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2).setOrigin(0.5, 0).setTint(0xFEDB2F);
    const fifthParticle = new GameObjects.Image(scene, heroCoordinates.x - 10, heroCoordinates.y + 30, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2).setOrigin(0.5, 0).setTint(0xFEDB2F);
    const statChangeParticles = Array.from<GameObjects.Image>({ length: 4 }).fill(new GameObjects.Image(scene, heroCoordinates.x - 10, heroCoordinates.y - 10, "stat-change-particle").setScale(0.1).setRotation(Math.PI / 2));
    statChangeAura.setTint(0xFFD717, 0xFFD717, 0xFEF4B3, 0xFEF4B3);
    const animation: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        tween: {
            onStart: () => {
                scene.sound.play("bonus");
                scene.add.existing(firstParticle);
                scene.add.existing(rightParticle);
                scene.add.existing(leftParticle);
                scene.add.existing(statChangeAura);
            },
            scaleY: 1.8,
            duration: 600,
            targets: [statChangeAura]
        },
    }, {
        from: 100,
        tween: {
            y: "-=50",
            scaleX: 0.9,
            duration: 1000,
            targets: [firstParticle]
        }
    },
    {
        from: 100,
        tween: {
            y: "-=50",
            scaleX: 0.9,
            duration: 1000,
            targets: [rightParticle]
        }
    }, {
        from: 100,
        tween: {
            y: "-=50",
            scaleX: 0.9,
            duration: 1000,
            targets: [leftParticle]
        }
    }, {
        from: 100,
        tween: {
            y: "-=50",
            duration: 1000,
            onStart: () => {
                scene.add.existing(fourthParticle);
            },
            targets: [fourthParticle]
        }
    }, {
        from: 50,
        tween: {
            scaleX: 0.9,
            duration: 1000,
            targets: [fourthParticle]
        }
    },
    {
        from: 50,
        tween: {
            y: "-=50",
            onStart: () => {
                scene.add.existing(fifthParticle);
            },
            duration: 1000,
            targets: [fifthParticle]
        }
    }, {
        from: 0,
        tween: {
            alpha: 0,
            duration: 500,
            targets: [statChangeAura, firstParticle, rightParticle, leftParticle, fourthParticle, fifthParticle]
        }
    }, {
        from: 1000,
        run: () => {
            statChangeAura.destroy();
            firstParticle.destroy();
            rightParticle.destroy();
            leftParticle.destroy();
            fifthParticle.destroy();
            statChangeParticles.forEach((p) => p.destroy())
        }
    }];

    return animation
};

export default mapBuffAnimation;
