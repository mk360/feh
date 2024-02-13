import { GameObjects, Scene } from "phaser";
import TextboxContent from "../../types/textbox-content";
import { renderBaneText, renderBoonText, renderLabelText, renderText } from "../utils/text-renderer";
import TextColors from "../utils/text-colors";
import Stats from "../../interfaces/stats";

class Textbox extends GameObjects.Container {
    private contentContainer: GameObjects.Rectangle;
    private children: GameObjects.GameObject[] = [];

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.contentContainer = new GameObjects.Rectangle(scene, 0, 0, 450, 500, 0x13353F).setOrigin(1, 0).setAlpha(0.9).setStrokeStyle(2, 0x7FD2E0);
        this.add(this.contentContainer);
    }

    createPassiveTextbox({ name, description }: { name: string, description: string }) {
        const skillInfosLines: GameObjects.Text[][] = [];
        
        skillInfosLines.push([renderLabelText({
            scene: this.scene,
            x: 0,
            y: 0,
            content: name
        })]);

        skillInfosLines.push([renderText(this.scene, 0, 40, description).setWordWrapWidth(390)]);

        return skillInfosLines;
    }

    openingAnimation() {

    }

    setContent(contentLines: TextboxContent[][]) {
        this.clearContent();
        let padding = 10;
        let lowestHeight = 0;

        for (let line of contentLines) {
            for (let element of line) {
                this.add(element);
                this.children.push(element);
                element.y += padding + this.contentContainer.getTopCenter().y;
                element.x += padding + this.contentContainer.getLeftCenter().x;
                lowestHeight = Math.max(lowestHeight, element.getBottomCenter().y);
            }
        }

        this.contentContainer.setDisplaySize(this.contentContainer.displayWidth, lowestHeight + padding - this.contentContainer.getTopCenter().y);
        return this;
    };

    clearContent() {
        while (this.children.length) {
            this.remove(this.children.shift(), true);
        }
        return this;
    }

    assistTextbox({
        description,
        range,
    }: { description: string, range: number }) {
        const rangeLabel = renderLabelText({
            scene: this.scene,
            x: 0,
            y: 0,
            content: "Rng"
        });

        const rangeText = renderText(this.scene, rangeLabel.getRightCenter().x + 10, 0, range, {
            fontSize: "18px"
        });

        const descText = renderText(this.scene, 0, 30, description, {
            fontSize: "18px"
        });

        const lines: TextboxContent[][] = [[rangeLabel, rangeText], [descText]];

        return lines;
    }

    createStatTextbox({ stat, baseValue, penalty, buff, boon, bane, description }: { stat: keyof Stats, baseValue: number, penalty?: number, buff?: number, boon?: keyof Stats, bane?: keyof Stats, description: string }) {
            // const { description } = this.stats[stat];
            const lines: GameObjects.Text[][] = [];
            const valuesLines: GameObjects.Text[] = [];
            const baseValueLabel = renderLabelText({
                scene: this.scene,
                x: 0,
                y: 0,
                content: "Base Value"
            });
            const baseValueText = renderText(this.scene, baseValueLabel.getRightCenter().x + 10, 0, baseValue, { 
                fontSize: "18px"
            });
            valuesLines.push(baseValueLabel);
            valuesLines.push(baseValueText);
            if (buff > 0) {
                const buffLabel = renderLabelText({
                    scene: this.scene,
                    x: baseValueText.getRightCenter().x + 10,
                    y: 0,
                    content: "Buff"
                });
                const buffValue = renderBoonText({
                    scene: this.scene,
                    x: buffLabel.getRightCenter().x + 10,
                    y: 0,
                    content: "+" + buff,
                    style: { fontSize: "18px" }
                });
                valuesLines.push(buffLabel);
                valuesLines.push(buffValue);
            }

            if (penalty > 0) {
                const penaltyLabel = renderLabelText({
                    scene: this.scene,
                    x: valuesLines[valuesLines.length - 1].getRightCenter().x + 10,
                    y: 0,
                    content: "Penalty"
                });
                const penaltyValue = renderBaneText({
                    scene: this.scene,
                    x: penaltyLabel.getRightCenter().x + 10,
                    y: 0,
                    content: penalty,
                    style: { fontSize: "18px" }
                });
                valuesLines.push(penaltyLabel);
                valuesLines.push(penaltyValue);
            }

            lines.push(valuesLines);

            const modifiersLine: GameObjects.Text[] = [];
            if (bane === stat) {
                const flawText = renderBaneText({
                    scene: this.scene,
                    x: 0,
                    y: 30,
                    content: "Flaw",
                    style: {
                        fontSize: "18px"
                    }
                });
                modifiersLine.push(flawText);
            }
            if (boon === stat) {
                const assetText = renderBoonText({
                    scene: this.scene,
                    x: 0,
                    y: 30,
                    content: "Asset",
                    style: {
                        fontSize: "18px"
                    }
                });
                modifiersLine.push(assetText);
            }
            if (modifiersLine.length) lines.push(modifiersLine);

            const descLine: GameObjects.Text[] = [];
            const descriptionText = renderText(this.scene, 0, lines[lines.length - 1][0].y + 30, description, {
                fontSize: "18px",
            }).setWordWrapWidth(396);
            descLine.push(descriptionText);
            lines.push(descLine);

            return lines;
    }

    specialTextbox({ cooldown, baseCooldown, description }: { cooldown: number, baseCooldown: number, description: string }) {
        const textLines: TextboxContent[][] = [];
        const firstLine: TextboxContent[] = [];
        const secondLine: TextboxContent[] = [];
        const specialIcon = new GameObjects.Image(this.scene, 0, 0, "skills-ui", "special-icon").setOrigin(0).setScale(0.5);
        const cooldownText = renderText(this.scene, 30, 2, cooldown, {
            fontSize: "18px"
        });
        cooldownText.setColor(baseCooldown > cooldown ? TextColors.boon : baseCooldown < cooldown ? TextColors.bane : "white");
        cooldownText.setColor(cooldown < baseCooldown ? TextColors.boon : cooldown > baseCooldown ? TextColors.bane : "white");
        firstLine.push(specialIcon);
        firstLine.push(cooldownText);

        secondLine.push(renderText(this.scene, 0, 30, description, {
            fontSize: "18px"
        }));
        textLines.push(firstLine);
        textLines.push(secondLine);

        return textLines;
    }

    weaponTextbox({ might, range, description }: { might: number, range: number, description: string }) {
        const firstLine = [
            renderLabelText({
                scene: this.scene,
                content: "Mt",
                x: 0,
                y: 0
            }),
            renderText(this.scene, 30, 0, might).setFontSize(18),
            renderLabelText({
                scene: this.scene,
                content: "Rng",
                x: 70,
                y: 0
            }),
            renderText(this.scene, 110, 0, range).setFontSize(18)
        ];

        const secondLine = [renderText(this.scene, 0, 30, description).setWordWrapWidth(440).setFontSize(18)];

        return [firstLine, secondLine];
    }
}

export default Textbox;
