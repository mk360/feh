import { GameObjects, Scene } from "phaser";
import TextboxContent from "../../types/textbox-content";
import { renderBaneText, renderBoonText, renderLabelText, renderText } from "../utils/text-renderer";
import TextColors from "../utils/text-colors";
import Stats from "../../interfaces/stats";

function getEffectivenessIcons(effectiveness: string) {
    if (["cavalry", "flier", "infantry", "armored"].includes(effectiveness)) {
        return [{ sheet: "movement-types", icon: effectiveness }];
    } else {
        if (["bow", "breath", "tome", "breath"].includes(effectiveness)) {
            return ["red", "blue", "green", "colorless"].map((i) => ({
                sheet: "weapons",
                icon: `${i}-${effectiveness}`
            }));
        }
    }
};

const PADDING = 10;

class Textbox extends GameObjects.Container {
    private contentContainer: GameObjects.Rectangle;
    private children: GameObjects.GameObject[] = [];
    private playerSide = "";

    constructor(scene: Scene, x: number, y: number, side: string) {
        super(scene, x, y);
        this.playerSide = side;
        this.contentContainer = new GameObjects.Rectangle(scene, 0, 0, 450, 500, 0x32070C).setOrigin(1, 0).setAlpha(0.9);
        this.add(this.contentContainer);
    }

    display(side: string) {
        if (side === this.playerSide) {
            this.contentContainer.setFillStyle(0x13353F).setStrokeStyle(4, 0x7FD2E0);
        } else {
            this.contentContainer.setFillStyle(0x32070C).setStrokeStyle(4, 0xD7768D);
        }

        this.setVisible(true).setScale(0);
        this.scene.sound.playAudioSprite("sfx", "tap");
        this.scene.tweens.add({
            targets: [this],
            scale: 1,
            duration: 50,
        }).play();
    }

    close() {
        this.scene.tweens.add({
            targets: [this],
            scale: 0,
            duration: 50,
            onComplete: () => {
                this.clearContent().setVisible(false);
            }
        }).play();
    }

    createPassiveTextbox({ name, description }: { name: string, description: string }) {
        const skillInfosLines: GameObjects.Text[][] = [];

        skillInfosLines.push([renderLabelText({
            scene: this.scene,
            x: 0,
            y: 0,
            content: name
        })]);

        skillInfosLines.push([renderText({
            scene: this.scene,
            x: 0,
            y: 30,
            content: description
        }).setWordWrapWidth(430)]);

        return skillInfosLines;
    }

    createDescriptionTextbox(content: string) {
        const lines: GameObjects.Text[][] = [];
        const singleLine = [renderText({
            scene: this.scene,
            x: 0,
            y: 0, content
        }).setWordWrapWidth(430)];
        lines.push(singleLine);

        return lines;
    }

    setContent(contentLines: TextboxContent[][]) {
        this.clearContent();
        let lowestHeight = 0;

        for (let line of contentLines) {
            for (let element of line) {
                this.add(element);
                this.children.push(element);
                element.y += PADDING + this.contentContainer.getTopCenter().y;
                element.x += PADDING + this.contentContainer.getLeftCenter().x;
                lowestHeight = Math.max(lowestHeight, element.getBottomCenter().y);
            }
        }

        this.contentContainer.setDisplaySize(this.contentContainer.displayWidth, lowestHeight + PADDING);

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

        const rangeText = renderText({
            scene: this.scene,
            x: rangeLabel.getRightCenter().x + 10,
            y: 0,
            content: range,
            style: {
                fontSize: "18px"
            }
        });

        const descText = renderText({
            scene: this.scene,
            x: 0,
            y: 30,
            content: description,
            style: {
                fontSize: "18px"
            }
        });

        const lines: TextboxContent[][] = [[rangeLabel, rangeText], [descText]];

        return lines;
    }

    createStatTextbox({ stat, baseValue, penalty, buff, boon, bane, description }: { stat: keyof Stats, baseValue: number, penalty?: number, buff?: number, boon?: keyof Stats, bane?: keyof Stats, description: string }) {
        const lines: GameObjects.Text[][] = [];
        const valuesLines: GameObjects.Text[] = [];
        const baseValueLabel = renderLabelText({
            scene: this.scene,
            x: 0,
            y: 0,
            content: "Base Value"
        });
        const baseValueText = renderText({
            scene: this.scene,
            x: baseValueLabel.getRightCenter().x + 10,
            y: 0,
            content: baseValue,
            style: {
                fontSize: "18px"
            }
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

        if (penalty < 0) {
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
        const descriptionText = renderText({
            scene: this.scene,
            x: 0,
            y: lines[lines.length - 1][0].y + 30,
            content: description,
            style: {
                fontSize: "18px",
            }
        }).setWordWrapWidth(280);

        descLine.push(descriptionText);
        lines.push(descLine);

        return lines;
    }

    specialTextbox({ cooldown, baseCooldown, description }: { cooldown: number, baseCooldown: number, description: string }) {
        const textLines: TextboxContent[][] = [];
        const firstLine: TextboxContent[] = [];
        const secondLine: TextboxContent[] = [];
        const specialIcon = new GameObjects.Image(this.scene, 0, 0, "skills-ui", "special-icon").setOrigin(0).setScale(0.5);
        firstLine.push(specialIcon);
        if (cooldown) {
            const cooldownText = renderText({
                scene: this.scene,
                x: 30,
                y: 2,
                content: cooldown,
                style: {
                    fontSize: "18px"
                }
            });
            cooldownText.setColor(baseCooldown > cooldown ? TextColors.boon : baseCooldown < cooldown ? TextColors.bane : "white");
            firstLine.push(cooldownText);
        }

        secondLine.push(renderText({
            scene: this.scene,
            x: 0,
            y: 32,
            content: description,
            style: {
                fontSize: "18px"
            }
        }).setWordWrapWidth(this.contentContainer.displayWidth - 4));
        textLines.push(firstLine);
        textLines.push(secondLine);

        return textLines;
    }

    weaponTextbox({ might, range, description, effectiveness: effectivenessList }: { might: number, range: number, description: string, effectiveness: string[] }) {
        const mightLabel = renderLabelText({
            scene: this.scene,
            content: "Mt",
            x: 0,
            y: 0
        });

        const mightValue = renderText({
            scene: this.scene,
            x: mightLabel.getBottomRight().x + 4,
            y: 0,
            content: might
        }).setFontSize(18);

        const rangeLabel = renderLabelText({
            scene: this.scene,
            content: "Rng",
            x: mightValue.getBottomRight().x + 10,
            y: 0
        });

        const rangeValue = renderText({
            scene: this.scene,
            x: rangeLabel.getBottomRight().x + 4,
            y: 0,
            content: range
        }).setFontSize(18);

        const firstLine: TextboxContent[] = [
            mightLabel,
            mightValue,
            rangeLabel,
            rangeValue
        ];

        const linesArray = [firstLine];

        if (effectivenessList.length) {
            const effectivenessLabel = renderLabelText({
                scene: this.scene,
                content: "Eff",
                x: rangeValue.getBottomRight().x + 10,
                y: 0
            });

            firstLine.push(effectivenessLabel);

            const images = effectivenessList.map((effectiveness) => {
                const icons = getEffectivenessIcons(effectiveness);
                return icons.map((icon) => new GameObjects.Image(this.scene, 0, effectivenessLabel.getCenter().y, icon.sheet, icon.icon).setOrigin(0, 0.5));
            }).flat();

            let previousItem: TextboxContent = effectivenessLabel;

            for (let image of images) {
                image.x = previousItem.getRightCenter().x + 4;
                firstLine.push(image);
                previousItem = image;
            }
        }

        if (description) {
            const secondLine = [renderText({
                scene: this.scene,
                x: 0,
                y: 30,
                content: description
            }).setWordWrapWidth(440).setFontSize(18)];
            linesArray.push(secondLine);
        }

        return linesArray;
    }
}

export default Textbox;
