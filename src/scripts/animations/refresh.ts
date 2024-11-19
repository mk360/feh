import { GameObjects, Time, Types } from "phaser";
import Hero from "../objects/hero";
import MainScene from "../scenes/mainScene";

function refreshAnimation(scene: MainScene, target: Hero) {
    const heroCoordinates = target.getAbsoluteCoordinates();
    const refreshAura = new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y + 50, "stat-change-aura").setAlpha(0.9).setOrigin(0.5, 1);
    const note1 = new GameObjects.Image(scene, heroCoordinates.x - 10, heroCoordinates.y, "note");
    const note2 = new GameObjects.Image(scene, heroCoordinates.x - 7, heroCoordinates.y - 6, "note");
    const note3 = new GameObjects.Image(scene, heroCoordinates.x + 5, heroCoordinates.y - 2, "note");
    const note4 = new GameObjects.Image(scene, heroCoordinates.x + 10, heroCoordinates.y, "note");
    const note5 = new GameObjects.Image(scene, heroCoordinates.x, heroCoordinates.y + 10, "note");

    const timelineData: Types.Time.TimelineEventConfig[] = [{
        from: 0,
        tween: {
            targets: [refreshAura],
            scaleY: 1.8,
            duration: 600,
            onStart: () => {
                scene.add.existing(refreshAura);
            },
        }
    }, {
        from: 200,
        tween: {
            targets: [note1, note2, note3, note4, note5],
            y: "-=50",
            duration: 1200,
            onStart: () => {
                scene.add.existing(note1);
                scene.add.existing(note2);
                scene.add.existing(note3);
                scene.add.existing(note4);
                scene.add.existing(note5);
            }
        }
    }, {
        from: 0,
        tween: {
            targets: [note1, note2, note3, note4, note5, refreshAura],
            duration: 200,
            alpha: 0,
            onComplete: () => {
                [note1, note2, note3, note4, note5].forEach((note) => {
                    note.destroy();
                });
            }
        }
    }];

    return timelineData;
};

export default refreshAnimation;
