import TextColors from "../utils/text-colors";
import { renderSpecialText, renderText } from "../utils/text-renderer";
import IconsSwitcher from "./icons-switcher";

import { GameObjects, Math, Scene, Tweens } from "phaser";

const hpBarWidth = 50;

class Hero extends GameObjects.Container {
    hpBar: GameObjects.Rectangle;
    temporaryPosition = {
        x: 0,
        y: 0
    };
    hpBarBackground: GameObjects.Rectangle;
    weaponType: GameObjects.Image;
    sprite: GameObjects.Image;
    private special: GameObjects.Text | GameObjects.Image;
    glowingSprite: GameObjects.Image;
    hpText: GameObjects.Text;
    movementIndicator: GameObjects.Image;
    private movementIndicatorTween: Tweens.Tween;
    statusesImage: IconsSwitcher;
    effectivenessImage: IconsSwitcher;

    constructor(scene: Scene, x: number, y: number, data: any) {
        const name = data.Name[0].value;
        const team = data.Side[0].value;
        const stats = data.Stats[0];
        const weapon = data.Weapon[0];
        super(scene, x, y);
        this.temporaryPosition = data.Position[0];
        this.setData("hero", data);
        this.movementIndicator = new GameObjects.Image(scene, 0, 0, "movement-indicators", "movement-indicator").setDisplaySize(95, 95).setAlpha(0).setVisible(false);
        this.movementIndicatorTween = this.scene.add.tween({
            targets: [this.movementIndicator],
            duration: 1100,
            yoyo: true,
            loop: -1,
            loopDelay: 100,
            alpha: 1,
            paused: true,
        });
        this.add(this.movementIndicator);
        this.sprite = new GameObjects.Image(scene, 0, 0, name, "map").setScale(0.5);
        this.glowingSprite = new GameObjects.Image(scene, 0, 0, name, "map").setScale(0.5).setDepth(1).setAlpha(0).setTintFill(0xFFFFFF);
        this.add(this.sprite);
        this.add(this.glowingSprite);
        this.statusesImage = new IconsSwitcher(scene, 35, 35, data.tags.map((tag) => {
            return {
                frame: tag.toLowerCase(),
                texture: "statuses"
            }
        })).setScale(0.4);
        this.effectivenessImage = new IconsSwitcher(scene, 0, 0, []);
        const hpBarHeight = this.statusesImage.getCenter().y;
        this.hpText = renderText(scene, -25, hpBarHeight, stats.hp, {
            fontSize: "14px"
        }).setOrigin(1, 0.5);
        this.hpBar = new GameObjects.Rectangle(scene, this.hpText.getRightCenter().x, hpBarHeight, hpBarWidth, 5, team === "team1" ? parseInt(TextColors.player.replace("#", ""), 16) : parseInt(TextColors.enemy.replace("#", ""), 16)).setOrigin(0, 0).setDepth(2);
        this.weaponType = new GameObjects.Image(scene, team === "team1" ? -30 : 30, -30, "weapons", `${weapon.color}-${weapon.weaponType}`).setScale(1);
        this.hpBarBackground = new GameObjects.Rectangle(scene, this.hpBar.getLeftCenter().x - 1, hpBarHeight - 1, hpBarWidth + 2, 7, 0x000000).setOrigin(0, 0);
        this.add(this.hpBarBackground);
        this.add(this.hpBar);
        this.add(this.weaponType);
        this.add(this.statusesImage);
        this.add(this.effectivenessImage);
        const gradient = this.hpText.context.createLinearGradient(0, 0, 0, this.hpText.height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.7, team === "team1" ? TextColors.player : TextColors.enemy);
        this.sprite.setFlipX(team === "team2");
        this.glowingSprite.setFlipX(team === "team2");
        this.hpText.setFill(gradient);
        this.add(this.hpText);
        this.setSize(120, 120);
        this.updateHP(stats.hp);
        const existingSpecial = data.Special;
        this.enableMovementIndicator();
        if (existingSpecial) {
            if (existingSpecial[0].cooldown === 0) {
                this.special = new GameObjects.Image(this.scene, team === "team1" ? -30 : 30, -5, "skills-ui", "special-icon").setScale(0.35);
            } else {
                this.special = renderSpecialText({
                    scene: this.scene,
                    x: team === "team1" ? -40 : 20,
                    y: -20,
                    style: {
                        fontSize: 22,
                        shadowColor: "black",
                    },
                    content: existingSpecial[0].cooldown,
                });
            }
            this.add(this.special);
        }
    }

    createFlashTween() {
        this.glowingSprite.x = this.sprite.x;
        this.glowingSprite.y = this.sprite.y;
        const flashingTween = this.scene.tweens.create({
            targets: this.glowingSprite,
            alpha: 1,
            duration: 100,
            yoyo: true,
        });
        return flashingTween as Tweens.Tween;
    }

    getInternalHero() {
        return this.data.get("hero");
    }

    updateHP(newHP: number) {
        const stats = this.getInternalHero().Stats[0];
        const { maxHP } = stats;
        this.hpText.setText(newHP.toString());
        const hpRatio = newHP / maxHP;
        this.hpBar.displayWidth = hpBarWidth * hpRatio;
    }

    updateSpecial(newCooldown: number) {
        if (this.special) {
            const { value: team } = this.getInternalHero().Team[0];
            if (newCooldown === 0) {
                this.special = new GameObjects.Image(this.scene, team === "team1" ? -40 : 20, -25, "skills-ui", "special-icon");
            } else {
                this.special = renderSpecialText({
                    scene: this.scene,
                    x: team === "team1" ? -40 : 20,
                    y: -25,
                    style: {
                        fontSize: 26,
                        shadowColor: "black",
                    },
                    content: newCooldown,
                });
            }
        }
    }

    enableMovementIndicator() {
        this.movementIndicator.setVisible(true);
        const special = this.getInternalHero().Special?.[0];
        if (special && special.cooldown === 0) {
            this.movementIndicator.setFrame("special-indicator");
        } else {
            this.movementIndicator.setFrame("movement-indicator");
        }
        this.movementIndicatorTween.restart();
    }

    disableMovementIndicator() {
        this.movementIndicator.setVisible(false);
        this.movementIndicatorTween.pause();
    }

    toggleStatuses() {
        this.statusesImage.setVisible(!!this.statusesImage.iconsList.length).toggleIcons();
    }

    toggleEffectivenessImages() {
        this.effectivenessImage.setVisible(!!this.effectivenessImage.iconsList.length).toggleIcons();
    }

    getAbsoluteCoordinates() {
        const vec = new Math.Vector2();
        vec.add(this);
        vec.add(this.sprite);
        return vec;
    }
};

export default Hero;
