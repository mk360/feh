import { Time } from "phaser";
import MainScene from "../scenes/mainScene";
import { renderText } from "../utils/text-renderer";

const squareSize = 90;

function playerPhase(scene: MainScene, turnCount: number) {
    const background = scene.add.rectangle(0, 0, 6 * squareSize, scene.game.canvas.height, 0, 0.6).setOrigin(0);
    const phaseGleam = scene.add.image(0, scene.game.canvas.height / 2, "player-phase-gleam").setScale(1.4, 0.8);
    const playerPhaseText = scene.add.image(-360, phaseGleam.y, "player-phase-base").setScale(1, 0.4);
    const glowingPlayerPhaseText = scene.add.image(20, phaseGleam.y, "player-phase-glow").setScale(1, 0.4).setAlpha(0);
    const chains1 = scene.add.image(-400, playerPhaseText.getCenter().y - 200, "chains").setAlpha(0.1, 1, 0.1, 1);
    const chains2 = scene.add.image(-400, playerPhaseText.getCenter().y + 200, "chains").setAlpha(0.1, 1, 0.1, 1);
    const turnText = renderText(scene, playerPhaseText.getCenter().x, playerPhaseText.getCenter().y + 100, `Turn ${turnCount}`, {
        fontSize: 40
    }).setOrigin(0.5);

    return new Time.Timeline(scene, [{
        tween: {
            targets: [chains1, chains2],
            scaleY: 1,
            onStart: () => {
                scene.game.input.enabled = false;
                scene.add.existing(turnText);
                scene.sound.play("player-phase");
            },
            x: background.getCenter().x - 100,
            duration: 250 // initial slide
        }
    }, {
        tween: {
            targets: [playerPhaseText, glowingPlayerPhaseText, turnText],
            scaleY: 1,
            x: background.getCenter().x - 100,
            duration: 250 // initial slide
        }
    }, {
        from: 100,
        tween: {
            targets: [phaseGleam],
            x: "+=1100",
            duration: 2000
        }
    }, {
        from: 200,
        tween: {
            targets: [chains1, chains2],
            x: "+=200",
            duration: 1000 // slowdown
        },
    }, {
        from: 0,
        tween: {
            targets: [playerPhaseText, glowingPlayerPhaseText, turnText],
            x: "+=200",
            duration: 1000 // slowdown
        },
    }, {
        from: 200,
        tween: {
            targets: [glowingPlayerPhaseText],
            alpha: 1,
            yoyo: true,
            duration: 200
        }
    }, {
        from: 700,
        tween: {
            targets: [chains1, chains2],
            x: "+=1000",
            scaleY: 0.4,
            duration: 300
        }
    }, {
        from: 0,
        tween: {
            targets: [playerPhaseText, glowingPlayerPhaseText, turnText],
            x: "+=1000",
            scaleY: 0.4,
            duration: 300
        }
    }, {
        from: 500,
        tween: {
            targets: [glowingPlayerPhaseText],
            alpha: 0,
            duration: 500
        }
    }, {
        from: 100,
        tween: {
            targets: [playerPhaseText],
            alpha: 1,
            duration: 400
        }
    }, {
        from: 0,
        tween: {
            targets: [playerPhaseText, phaseGleam, chains1, chains2, background],
            alpha: 0,
            duration: 500,
            onComplete() {
                scene.game.input.enabled = true;
            }
        }
    }]);
};

export default playerPhase;
