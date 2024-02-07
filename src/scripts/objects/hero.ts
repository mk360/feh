// import { GameObjects, Scene, Tweens } from "phaser";
import { renderText } from "../utils/text-renderer";
// import HeroData from "feh-battles/dec/hero";
// import Team from "../../types/team";
import IconsSwitcher from "./icons-switcher";

import { GameObjects, Scene, Tweens } from "phaser";

const hpBarWidth = 60;

class Hero extends GameObjects.Container {
    hpBar: GameObjects.Rectangle;
    hpBarBackground: GameObjects.Rectangle;
    weaponType: GameObjects.Image;
    sprite: GameObjects.Image;
    glowingSprite: GameObjects.Image;
    hpText: GameObjects.Text;
    statuses: string[];
    statusesImage: IconsSwitcher;
    effectivenessImage: IconsSwitcher;

    constructor(scene: Scene, x: number, y: number, data: any) {
        console.log({ data });
        const name = data.Name[0].value;
        const team = data.Side[0].value;
        const stats = data.Stats[0];
        const weapon = data.Weapon[0];
        super(scene, x, y);
        this.setData("hero", data);
        this.statuses = [];
        // this.special = the special icon or count
        this.setName(data.id);
        this.sprite = new GameObjects.Image(scene, 0, 0, name, "map").setScale(0.7).setDepth(1);
        this.glowingSprite = new GameObjects.Image(scene, 0, 0, name, "map").setScale(0.7).setDepth(2).setAlpha(0).setTintFill(0xFFFFFF);
        this.add(this.sprite);
        this.add(this.glowingSprite);
        this.statusesImage = new IconsSwitcher(scene, 45, 45, []);
        this.effectivenessImage = new IconsSwitcher(scene, 0, 0, []);
        const hpBarHeight = this.statusesImage.getCenter().y;
        this.hpText = renderText(scene, -15, hpBarHeight, stats.hp, {
            fontSize: "18px"
        }).setOrigin(1, 0.5);
        this.hpBar = new GameObjects.Rectangle(scene, this.hpText.getRightCenter().x, hpBarHeight, hpBarWidth, 5, team === "team1" ? 0x54DFF4 : 0xFA4D69).setOrigin(0, 0).setDepth(2);
        this.weaponType = new GameObjects.Image(scene, team === "team1" ? -30 : 30, -40, "weapons", `${weapon.color}-${weapon.weaponType}`).setScale(1.2);
        this.hpBarBackground = new GameObjects.Rectangle(scene, this.hpBar.getLeftCenter().x - 1, hpBarHeight - 1, hpBarWidth + 2, 7, 0x000000).setOrigin(0, 0);
        this.add(this.hpBarBackground);
        this.add(this.hpBar);
        this.add(this.weaponType);
        this.add(this.statusesImage);
        this.add(this.effectivenessImage);
        const gradient = this.hpText.context.createLinearGradient(0, 0, 0, this.hpText.height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.7, team === "team1" ? "#54DFF4" : "#FA4D69");
        this.sprite.setFlipX(team === "team2");
        this.glowingSprite.setFlipX(team === "team2");
        this.hpText.setFill(gradient);
        this.add(this.hpText);
        this.setSize(120, 120);
        this.updateHP(stats.hp);
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

    toggleStatuses() {
        this.statusesImage.setIcons(this.statuses).setVisible(!!this.statuses.length).toggleIcons();
    }
};

export default Hero;
