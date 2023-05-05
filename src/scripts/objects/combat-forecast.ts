import { GameObjects, Tweens } from "phaser";
import Hero from "./hero";
import HeroNameplate from "./hero-nameplate";
import { renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
import TextColors from "../utils/text-colors";
import HeroPortrait from "./hero-portrait";

interface ForecastData {
    attacker: Hero;
    defender: Hero;
    attackerDamage: number;
    defenderDamage: number;
    attackerEndHP: number;
    defenderEndHP: number;
}

class CombatForecast extends Phaser.GameObjects.Container {
    private firstSideBg: GameObjects.Rectangle;
    private secondSideBg: GameObjects.Rectangle;
    private portraitDisplayTween: Tweens.Tween;
    private firstPortrait: GameObjects.Image;
    private firstNameplate: HeroNameplate;
    private secondPortrait: GameObjects.Image;
    private secondNameplate: HeroNameplate;
    private koTween: Tweens.Tween;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.firstSideBg = new GameObjects.Rectangle(scene, 0, 0, 750, 400, 0xFEDCBA).setOrigin(0);
        this.firstSideBg.setAlpha(0);
        this.add(this.firstSideBg);
        this.firstPortrait = new HeroPortrait(scene, "Byleth");
        this.add(this.firstPortrait);
        this.add(new GameObjects.Rectangle(scene, 750, 0, 750, 400, 0x9A2D18).setVisible(true));
        this.secondPortrait = new HeroPortrait(scene, "Chrom").setFlipX(true).setX(1100).setOrigin(1, 0)
        this.add(this.secondPortrait);
        this.portraitDisplayTween = scene.tweens.create({
            duration: 300,
            x: 800,
            targets: [this.secondPortrait]
        }).play();
        this.firstNameplate = new HeroNameplate(scene, 100, 30, { name: "Byleth", weaponType: "sword" });
        this.add(this.firstNameplate);
        const hpLineHeight = 85;
        const hpTextHeight = 60;

        this.secondNameplate = new HeroNameplate(scene, 377, 30, {
            name: "Chrom", weaponType: "sword"
        });
        const unitBg = new GameObjects.Image(scene, 250, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        const unitBg2 = new GameObjects.Image(scene, 510, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        
        this.add(this.secondNameplate);
        this.add([unitBg, unitBg2]);
        this.add(renderText(scene, this.firstSideBg.getCenter().x, hpLineHeight, "HP", {
            fontSize: "22px",
        }).setOrigin(0.5));
        const firstSideHP = renderRegularHPText({
            scene,
            x: 160,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: "47 → 47"
        });
        const secondSideHP1 = renderRegularHPText({
            scene,
            content: 49,
            style: {
                fontSize: "36px",
            },
            x: 480,
            y: hpTextHeight,
        }).setOrigin(1, 0);
        const arrow = renderRegularHPText({
            scene,
            x: 490,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "36px"
            }
        });
        const secondSideHP2 = renderCritHPText({
            scene,
            content: 0,
            x: 540,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            }
        });
        this.add(secondSideHP1);
        this.add(secondSideHP2);
        this.add(arrow);
        this.add(firstSideHP);
    }

    setForecastData(params: ForecastData) {
        
    }

    update() {
    }

    runKOTween(target: GameObjects.Image) {
        if (this.koTween) {
            this.koTween.destroy();
        }
        this.koTween = this.scene.tweens.create({
            duration: 500,
            loop: -1,
            targets: [target],
            yoyo: true,
            alpha: 0.6,
        });
    }
}

export default CombatForecast;