import { GameObjects, Scene } from "phaser";
import { renderText } from "../utils/text-renderer";
import HeroData from "feh-battles/dec/hero";

const fullWidth = 60;

class Hero extends GameObjects.Container {
    hpBar: GameObjects.Rectangle;
    hpBarBackground: GameObjects.Rectangle;
    weaponType: GameObjects.Image;
    image: GameObjects.Image;
    hpText: GameObjects.Text;
    team: "team1" | "team2";
    statuses: string[];
    statusesImage: GameObjects.Image;
    statusIndex = 0;

    // todo: simplify constructor
    constructor(scene: Scene, x: number, y: number, data: HeroData, team: "team1" | "team2") {
        super(scene, x, y);
        this.setData("hero", data);
        this.statuses = [];
        this.setName(data.id);
        this.image = new GameObjects.Image(scene, 0, 0, data.name, "map").setScale(0.7).setDepth(1);
        this.add(this.image);
        this.team = team;
        this.statusesImage = new GameObjects.Image(scene, 45, 45, "").setVisible(false);
        const hpBarHeight = this.statusesImage.getCenter().y;        
        this.hpText = renderText(scene, -15, hpBarHeight, data.maxHP, {
            fontSize: "18px"
        }).setOrigin(1, 0.5);
        this.hpBar = new GameObjects.Rectangle(scene, this.hpText.getRightCenter().x, hpBarHeight, fullWidth, 5, team === "team1" ? 0x54DFF4 : 0xFA4D69).setOrigin(0, 0).setDepth(2);
        this.weaponType = new GameObjects.Image(scene, -30, -40, "weapons", `${data.getWeapon().color}-${data.getWeapon().type}`);
        this.hpBarBackground = new GameObjects.Rectangle(scene, this.hpBar.getLeftCenter().x - 1, hpBarHeight - 1, fullWidth + 2, 7, 0x000000).setOrigin(0, 0);
        this.add(this.hpBarBackground);
        this.add(this.hpBar);
        this.add(this.weaponType);
        this.add(this.statusesImage);
        const gradient = this.hpText.context.createLinearGradient(0, 0, 0, this.hpText.height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.7, this.team === "team1" ? "#54DFF4" : "#FA4D69");
        this.hpText.setFill(gradient);
        this.add(this.hpText);
        this.setSize(120, 120);
    }

    getInternalHero() {
        return this.data.get("hero") as HeroData;
    }

    update() {
        const { maxHP, stats: { hp } } = this.getInternalHero();
        this.hpText.setText(hp.toString());
        const hpRatio = hp / maxHP;
        this.hpBar.displayWidth = fullWidth * hpRatio;
    }

    toggleStatuses() {
        this.statusesImage.setVisible(!!this.statuses.length);
        if (this.statuses.length) {
            if (this.statusIndex + 1 === this.statuses.length) {
                this.statusIndex = 0;
            } else {
                this.statusIndex++;
            }

            this.statusesImage.setTexture(this.statuses[this.statusIndex]);
        }
    }

    getMovementRange() {
        const { movementType } = this.getInternalHero();
        if (movementType === "cavalry") return 3;
        if (movementType === "armored") return 1;
        return 2;
    }

    getNextIndex(array: any[], curIndex: number) {
        if (curIndex === array.length - 1) return 0;
        return curIndex + 1;
    }

    getWeaponRange() {
        if (["sword", "lance", "axe", "dragonstone"].includes(this.getInternalHero().getWeapon().type)) {
            return 1;
        }

        return 2;
    }
};

export default Hero;
