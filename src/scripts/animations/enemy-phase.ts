import { GameObjects, Time } from "phaser";
import MainScene from "../scenes/mainScene";
import { renderText } from "../utils/text-renderer";
import { squareSize } from "../utils/grid-functions";

function enemyPhase(scene: MainScene, turnCount: number) {
    const background = new GameObjects.Rectangle(scene, 0, 0, 6 * squareSize, scene.game.canvas.height, 0, 0.6).setOrigin(0);
    const phaseGleam = new GameObjects.Image(scene, scene.game.canvas.width, scene.game.canvas.height / 2, "enemy-phase", "gleam").setScale(1.4, 0.8);
    const enemyPhaseText = new GameObjects.Image(scene, scene.game.canvas.width, phaseGleam.y, "enemy-phase", "title").setScale(1, 0.4);
    const glowingEnemyPhaseText = new GameObjects.Image(scene, 20, phaseGleam.y, "enemy-phase", "glow-title").setScale(1, 0.4).setAlpha(0);
    const chains1 = new GameObjects.Image(scene, 400, enemyPhaseText.getCenter().y - 200, "enemy-phase", "chains").setAlpha(0.1, 1, 0.1, 1);
    const chains2 = new GameObjects.Image(scene, 400, enemyPhaseText.getCenter().y + 200, "enemy-phase", "chains").setAlpha(0.1, 1, 0.1, 1);
    const turnText = renderText(scene, enemyPhaseText.getCenter().x, enemyPhaseText.getCenter().y + 100, `Turn ${turnCount}`, {
        fontSize: 40
    }).setOrigin(0.5);

    return new Time.Timeline(scene, [{
        tween: {
            targets: [chains1, chains2],
            scaleY: 1,
            onStart: () => {
                scene.tweens.add({
                    targets: [scene.footer.enemyPhaseText],
                    alpha: 1,
                    duration: 500
                }).play();
                scene.footer.turnCount.setText(`Turn ${turnCount}`);
                scene.tweens.add({
                    targets: [scene.footer.playerPhaseText],
                    alpha: 0.5,
                    duration: 500
                }).play();
                scene.add.existing(background);
                scene.add.existing(phaseGleam);
                scene.add.existing(enemyPhaseText);
                scene.add.existing(glowingEnemyPhaseText);
                scene.add.existing(chains1);
                scene.add.existing(chains2);
                scene.add.existing(turnText);
                scene.game.input.enabled = false;
                scene.sound.play("enemy-phase");
            },
            x: background.getCenter().x - 100,
            duration: 250 // initial slide
        }
    }, {
        tween: {
            targets: [enemyPhaseText, glowingEnemyPhaseText, turnText],
            scaleY: 1,
            x: background.getCenter().x + 0,
            duration: 250 // initial slide
        }
    }, {
        from: 100,
        tween: {
            targets: [phaseGleam],
            x: "-=1100",
            duration: 2000
        }
    }, {
        from: 200,
        tween: {
            targets: [chains1, chains2],
            x: "-=150",
            duration: 1000 // slowdown
        },
    }, {
        from: 0,
        tween: {
            targets: [enemyPhaseText, glowingEnemyPhaseText, turnText],
            x: "-=150",
            duration: 1000 // slowdown
        },
    }, {
        from: 200,
        tween: {
            targets: [glowingEnemyPhaseText],
            alpha: 1,
            yoyo: true,
            duration: 200
        }
    }, {
        from: 700,
        tween: {
            targets: [chains1, chains2],
            x: "-=1000",
            scaleY: 0.4,
            duration: 300
        }
    }, {
        from: 0,
        tween: {
            targets: [enemyPhaseText, glowingEnemyPhaseText, turnText],
            x: "-=1000",
            scaleY: 0.4,
            duration: 300
        }
    }, {
        from: 500,
        tween: {
            targets: [glowingEnemyPhaseText],
            alpha: 0,
            duration: 500
        }
    }, {
        from: 100,
        tween: {
            targets: [enemyPhaseText],
            alpha: 1,
            duration: 400
        }
    }, {
        from: 0,
        tween: {
            targets: [enemyPhaseText, phaseGleam, chains1, chains2, background],
            alpha: 0,
            duration: 500,
            onComplete() {
                scene.game.input.enabled = true;
                scene.changeTurns();
            }
        }
    }]);
};

export default enemyPhase;
