import { GameObjects, Tweens } from "phaser";
import Hero from "./hero";
import HeroNameplate from "./hero-nameplate";
import { renderCritHPText, renderRegularHPText, renderText } from "../utils/text-renderer";
import HeroPortrait from "./hero-portrait";
import Stats from "../../interfaces/stats";

interface ForecastHeroData {
    hero: Hero;
    statChanges: Partial<{
        [k in keyof Omit<Stats, "hp">]: number;
    }>;
    startHP: number;
    endHP: number;
    turns: number;
    damage: number;
}

interface ForecastData {
    attacker: ForecastHeroData;
    defender: ForecastHeroData;
}

interface RenderedHero {
    portrait: GameObjects.Image;
    nameplate: HeroNameplate;
    previousHP: GameObjects.Text;
    predictedHP: GameObjects.Text;
};

class CombatForecast extends Phaser.GameObjects.Container {
    private portraitDisplayTween: Tweens.Tween;
    private firstPortraitSwitchingTween: Tweens.Tween;
    private secondPortraitSwitchingTween: Tweens.Tween;

    private firstHero: RenderedHero = {
        previousHP: null,
        predictedHP: null,
        nameplate: null,
        portrait: null,
    };
    private secondHero: RenderedHero = {
        previousHP: null,
        predictedHP: null,
        nameplate: null,
        portrait: null,
    };
    private koTween: Tweens.Tween;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);

        const firstSideBg = new GameObjects.Rectangle(scene, 0, 0, 750, 400, 0xFEDCBA).setOrigin(0);
        firstSideBg.setAlpha(0);
        this.add(firstSideBg);
        this.firstHero.portrait = new HeroPortrait(scene, "");
        this.add(this.firstHero.portrait);
        this.add(new GameObjects.Rectangle(scene, 750, 0, 750, 400, 0x9A2D18).setVisible(true));
        this.secondHero.portrait = new HeroPortrait(scene, "").setFlipX(true).setX(1100).setOrigin(1, 0);
        this.add(this.secondHero.portrait);
        this.firstHero.nameplate = new HeroNameplate(scene, 100, 30, { name: "", weaponType: "" });
        this.add(this.firstHero.nameplate);
        const hpLineHeight = 85;
        const hpTextHeight = 60;

        this.secondHero.nameplate = new HeroNameplate(scene, 377, 30, {
            name: "", weaponType: ""
        });
        const hpBg = new GameObjects.Image(scene, 250, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        const hpBg2 = new GameObjects.Image(scene, 510, hpLineHeight, "unit-bg").setScale(0.50, 0.75);
        
        this.add(this.secondHero.nameplate);
        this.add([hpBg, hpBg2]);
        this.add(renderText(scene, firstSideBg.getCenter().x, hpLineHeight, "HP", {
            fontSize: "22px",
        }).setOrigin(0.5));
        this.firstHero.previousHP = renderRegularHPText({
            scene,
            x: 200,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        }).setOrigin(1, 0);
        this.firstHero.predictedHP = renderRegularHPText({
            scene,
            x: 320,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            },
            content: ""
        }).setOrigin(1, 0);
        this.secondHero.previousHP = renderRegularHPText({
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
        const otherArrow = renderRegularHPText({
            scene,
            x: 210,
            y: hpTextHeight,
            content: "→",
            style: {
                fontSize: "36px"
            }
        });
        this.secondHero.predictedHP = renderCritHPText({
            scene,
            content: 0,
            x: 540,
            y: hpTextHeight,
            style: {
                fontSize: "36px"
            }
        });
        this.add(this.secondHero.previousHP);
        this.add(this.secondHero.predictedHP);
        this.add(arrow);
        this.add(otherArrow);
        this.add(this.firstHero.previousHP);
        this.add(this.firstHero.predictedHP);

        this.firstPortraitSwitchingTween = scene.tweens.create({
            duration: 300,
            targets: [this.firstHero.portrait],
            yoyo: true,
            alpha: 0,
            onYoyo: () => {

            }
        });

        this.secondPortraitSwitchingTween = scene.tweens.create({
            duration: 300,
            targets: [this.secondHero.portrait],
            yoyo: true,
            alpha: 0,
            onYoyo: () => {

            }
        });

        this.portraitDisplayTween = scene.tweens.create({
            duration: 300,
            x: 800,
            targets: this.secondHero.portrait,
        });
    }

    setForecastData(params: ForecastData) {
        const { attacker, defender } = params;
        this.firstHero.nameplate.weaponIcon.setTexture(attacker.hero.unitData.weaponType);
        this.firstHero.nameplate.heroName.setText(attacker.hero.unitData.name);
        this.secondHero.nameplate.weaponIcon.setTexture(defender.hero.unitData.weaponType);
        this.secondHero.nameplate.heroName.setText(defender.hero.unitData.name);

        const firstDamaged = attacker.hero.HP / attacker.hero.maxHP < 0.5 ? " damaged" : "";
        const secondDamaged = defender.hero.HP / defender.hero.maxHP < 0.5 ? " damaged" : "";
        this.firstHero.portrait.setTexture(`${attacker.hero.name} battle` + firstDamaged);
        this.secondHero.portrait.setTexture(`${defender.hero.name} battle` + secondDamaged);
        this.secondHero.portrait.x = 1100;
        this.portraitDisplayTween.play();

        const firstHeroStartingHP = attacker.startHP < 10 ? renderCritHPText : renderRegularHPText;
        const firstHeroEndingHP = attacker.endHP < 10 ? renderCritHPText : renderRegularHPText;
        const secondHeroStartingHP = defender.startHP < 10 ? renderCritHPText : renderRegularHPText;
        const secondHeroEndingHP = defender.endHP < 10 ? renderCritHPText : renderRegularHPText;
        this.firstHero.previousHP.destroy();
        this.firstHero.predictedHP.destroy();
        this.firstHero.previousHP = firstHeroStartingHP({
            scene: this.scene,
            x: this.firstHero.previousHP.x,
            y: this.firstHero.previousHP.y,
            content: attacker.startHP,
            style: {
                fontSize: "36px"
            }
        }).setOrigin(1, 0);

        this.firstHero.predictedHP = firstHeroEndingHP({
            scene: this.scene,
            x: this.firstHero.predictedHP.x,
            y: this.firstHero.predictedHP.y,
            content: attacker.endHP,
            style: {
                fontSize: "36px"
            }
        }).setOrigin(1, 0);


        this.add(this.firstHero.predictedHP);
        this.add(this.firstHero.previousHP);

        this.secondHero.previousHP.destroy();
        this.secondHero.predictedHP.destroy();

        this.secondHero.previousHP = secondHeroStartingHP({
            scene: this.scene,
            x: this.secondHero.previousHP.x,
            y: this.secondHero.previousHP.y,
            content: defender.startHP,
            style: {
                fontSize: "36px"
            }
        }).setOrigin(1, 0);

        this.secondHero.predictedHP = secondHeroEndingHP({
            scene: this.scene,
            x: this.secondHero.predictedHP.x,
            y: this.secondHero.predictedHP.y,
            content: defender.endHP,
            style: {
                fontSize: "36px"
            }
        });

        this.add(this.secondHero.predictedHP);
        this.add(this.secondHero.previousHP);
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