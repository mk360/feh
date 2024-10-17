import { GameObjects, Scene } from "phaser";
import { renderBaneText, renderBoonText, renderText } from "../utils/text-renderer";

const padding = 20;

class Footer extends GameObjects.Container {
    playerPhaseText: GameObjects.Text;
    enemyPhaseText: GameObjects.Text;
    turnCount: GameObjects.Text;

    constructor(scene: Scene, x: number, y: number, turnCount: number) {
        super(scene, x, y);
        const footer = new GameObjects.Image(this.scene, 0, 0, "marginals", "footer").setOrigin(0);
        const background = new GameObjects.Graphics(this.scene);
        background.fillStyle(0, 0.5);
        background.fillRoundedRect(padding, 10, footer.width - padding * 2, 30, 8);
        this.playerPhaseText = renderBoonText({
            scene: this.scene,
            x: background.x + 30,
            y: background.y + 16,
            content: "PLAYER PHASE",
            style: {
                fontSize: 12
            }
        });

        this.enemyPhaseText = renderBaneText({
            scene: this.scene,
            x: background.x + 410,
            y: background.y + 16,
            content: "ENEMY PHASE",
            style: {
                fontSize: 12
            }
        });

        const center = (this.enemyPhaseText.getRightCenter().x + this.playerPhaseText.getLeftCenter().x) / 2;

        this.turnCount = renderText({
            scene: this.scene,
            x: center,
            y: background.y + 16,
            content: `Turn ${turnCount}`,
            style: {
                fontSize: 12
            }
        }).setOrigin(0.5, 0);
        this.add(footer);
        this.add(background);
        this.add(this.playerPhaseText);
        this.add(this.enemyPhaseText);
        this.add(this.turnCount);
    }

    setSide(newSide: "player" | "enemy") {
        this[`${newSide}PhaseText`].setAlpha(1);
        const otherSide = newSide === "player" ? "enemy" : "player";
        this[`${otherSide}PhaseText`].setAlpha(0.5);
    }
};

export default Footer;
