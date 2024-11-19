import { GameObjects, Tweens } from "phaser";
import MainScene from "../scenes/mainScene";
import HeroPortrait from "./hero-portrait";
import { getHealthyHPGradient, getLowHPGradient, renderRegularHPText, renderText } from "../utils/text-renderer";
import Hero from "./hero";


interface AssistSide {
    portrait: HeroPortrait;
    startingHP: GameObjects.Text;
    endHP: GameObjects.Text;
    arrow: GameObjects.Text;
}

interface UpdateArguments {
    assist: string;
    assisting: UpdatedSide;
    assisted: UpdatedSide;
}

interface UpdatedSide {
    id: Hero;
    previousHP: number;
    expectedHP: number;
}

class AssistPreview extends GameObjects.Container {
    background: GameObjects.Image;
    assister: AssistSide;
    assisted: AssistSide;
    assistName: GameObjects.Text;
    private portraitDisplayTween: Tweens.Tween;

    constructor(scene: MainScene, y: number) {
        super(scene, 0, y);
        this.background = new GameObjects.Image(scene, 0, 0, "top-banner", "assist-bg").setOrigin(0);
        this.assistName = renderText({
            scene: this.scene,
            x: this.background.getCenter().x,
            y: this.background.getBottomCenter().y - 20,
            content: ""
        });
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
                x: 20,
                y: 60,
                content: "",
                style: {
                    fontSize: 26
                }
            }),
            arrow: renderRegularHPText({
                scene,
                x: 50,
                y: 60,
                content: "→",
                style: {
                    fontSize: 26
                }
            })
        };

        this.assisted = {
            portrait: new HeroPortrait(scene, 900, "").setScale(0.6).setFlipX(true),
            startingHP: renderRegularHPText({
                scene,
                x: 20,
                y: 0,
                content: "",
                style: {
                    fontSize: 26
                }
            }),
            endHP: renderRegularHPText({
                scene,
                x: 20,
                y: 0,
                content: "",
                style: {
                    fontSize: 26
                }
            }),
            arrow: renderRegularHPText({
                scene,
                x: 20,
                y: 60,
                content: "→",
                style: {
                    fontSize: 26
                }
            })
        };

        for (let key in this.assister) {
            this.add(this.assister[key]);
        }

        for (let key in this.assisted) {
            this.add(this.assisted[key]);
        }
    }

    updateSides(args: UpdateArguments) {
        this.assistName.setText(args.assist);
        const { Name, Stats } = args.assisting.id.getInternalHero();
        const { Name: AssistedName, Stats: AssistedStats } = args.assisted.id.getInternalHero();
        console.log(AssistedName, Name);
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
