import { GameObjects, Tweens } from "phaser";
import MainScene from "../scenes/mainScene";
import HeroPortrait from "./hero-portrait";
import { getHealthyHPGradient, getLowHPGradient, renderRegularHPText, renderText } from "../utils/text-renderer";
import Hero from "./hero";
import HeroNameplate from "./hero-nameplate";


interface AssistSide {
    portrait: HeroPortrait;
    startingHP: GameObjects.Text;
    endHP: GameObjects.Text;
    nameplate: HeroNameplate;
}

interface UpdateArguments {
    assist: string;
    assisting: UpdatedSide;
    assisted: UpdatedSide;
}

interface UpdatedSide {
    object: Hero;
    previousHP: number;
    expectedHP: number;
}

const hpTextHeight = 60;

class AssistPreview extends GameObjects.Container {
    background: GameObjects.Image;
    assister: AssistSide;
    assisted: AssistSide;
    assistName: GameObjects.Text;
    private portraitDisplayTween: Tweens.Tween;

    constructor(scene: MainScene, y: number) {
        super(scene, 0, y);
        this.background = new GameObjects.Image(scene, 0, 0, "banners", "assist").setOrigin(0);
        this.assistName = renderText({
            scene: this.scene,
            x: this.background.getCenter().x - 100,
            y: this.background.getCenter().y + 25,
            content: ""
        }).setOrigin(0.5);
        this.add(this.background);
        this.assister = {
            portrait: new HeroPortrait(scene, -100, "").setScale(0.6).setOrigin(0),
            startingHP: renderRegularHPText({
                scene,
                x: 130,
                y: 60,
                content: "",
                style: {
                    fontSize: 26
                }
            }),
            endHP: renderRegularHPText({
                scene,
                x: 200,
                y: hpTextHeight,
                content: "",
                style: {
                    fontSize: 26
                }
            }),
            nameplate: new HeroNameplate(this.scene, 60, 20, {
                name: "",
                weaponColor: "",
                weaponType: "",
                ally: true,
                tapCallbacks: {
                    weaponType: null,
                    name: null,
                },
                rarity: 5,
            })
        };

        this.assisted = {
            portrait: new HeroPortrait(scene, 900, "").setScale(0.6).setFlipX(true),
            startingHP: renderRegularHPText({
                scene,
                x: 300,
                y: hpTextHeight,
                content: "",
                style: {
                    fontSize: 26
                }
            }),
            endHP: renderRegularHPText({
                scene,
                x: 370,
                y: hpTextHeight,
                content: "",
                style: {
                    fontSize: 26
                }
            }),
            nameplate: new HeroNameplate(this.scene, 270, 20, {
                name: "",
                weaponColor: "",
                weaponType: "",
                ally: true,
                tapCallbacks: {
                    weaponType: null,
                    name: null,
                },
                rarity: 5,
            })
        };

        this.add(this.assister.portrait);
        this.add(this.assister.nameplate);

        this.add(this.assisted.portrait);
        this.add(this.assisted.nameplate);

        this.add(new GameObjects.Image(this.scene, this.scene.game.canvas.width / 2, hpTextHeight + 30, "assist-forecast"));

        this.add(this.assister.startingHP);
        this.add(this.assister.endHP);

        this.add(this.assisted.startingHP);
        this.add(this.assisted.endHP);


        this.add(this.assister.startingHP);
        this.add(this.assistName);
    }

    updateSides(args: UpdateArguments) {
        this.assistName.setText(args.assist);
        const { Name, Stats, Weapon } = args.assisting.object.getInternalHero();
        const { Name: AssistedName, Stats: AssistedStats, Weapon: assistedWeapon } = args.assisted.object.getInternalHero();
        this.assister.portrait.setPortrait(Name[0].value, Stats[0].hp, Stats[0].maxHP);
        this.assisted.portrait.setPortrait(AssistedName[0].value, AssistedStats[0].hp, AssistedStats[0].maxHP);

        const applyFutureHPGradient = args.assisting.expectedHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const futureHPGradient = applyFutureHPGradient(this.assister.endHP);
        this.assister.endHP.setFill(futureHPGradient).setText(args.assisting.expectedHP.toString());

        const applyCurrentHPGradient = args.assisting.previousHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const currentHPGradient = applyCurrentHPGradient(this.assister.startingHP);
        this.assister.startingHP.setFill(currentHPGradient).setText(args.assisting.previousHP.toString());

        const applyAssistedFutureHPGradient = args.assisted.expectedHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const assistedFutureHPGradient = applyAssistedFutureHPGradient(this.assisted.endHP);
        this.assisted.endHP.setFill(assistedFutureHPGradient).setText(args.assisted.expectedHP.toString());

        const applyAssistedCurrentHPGradient = args.assisted.previousHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const currentAssistedHPGradient = applyAssistedCurrentHPGradient(this.assisted.startingHP);
        this.assisted.startingHP.setFill(currentAssistedHPGradient).setText(args.assisted.previousHP.toString());
        this.assister.nameplate.updateNameplate({
            name: Name[0].value.split(":")[0],
            weaponColor: Weapon[0].color,
            weaponType: Weapon[0].weaponType,
            ally: true,
            rarity: 5,
        });

        this.assisted.nameplate.updateNameplate({
            name: AssistedName[0].value.split(":")[0],
            weaponColor: assistedWeapon[0].color,
            weaponType: assistedWeapon[0].weaponType,
            ally: true,
            rarity: 5,
        });

        if (this.portraitDisplayTween) this.portraitDisplayTween.stop();
        this.portraitDisplayTween = this.scene.tweens.add({
            duration: 300,
            x: 350,
            onStart: () => {
                this.assisted.portrait.x = 900;
            },
            targets: this.assisted.portrait,
        }).play();

        return this;
    }
};

export default AssistPreview;
