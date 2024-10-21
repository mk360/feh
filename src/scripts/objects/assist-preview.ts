import { GameObjects } from "phaser";
import MainScene from "../scenes/mainScene";
import HeroPortrait from "./hero-portrait";
import { getHealthyHPGradient, getLowHPGradient, renderRegularHPText, renderText } from "../utils/text-renderer";
import Hero from "./hero";

interface AssistSide {
    portrait: HeroPortrait;
    startingHP: GameObjects.Text;
    endHP: GameObjects.Text;
}

interface UpdateArguments {
    assist: string;
    assister: UpdatedSide;
    assisted: UpdatedSide;
}

interface UpdatedSide {
    hero: Hero;
    startHP: number;
    endHP: number;
}

class AssistPreview extends GameObjects.Container {
    background: GameObjects.Image;
    assister: AssistSide;
    assisted: AssistSide;
    assistName: GameObjects.Text;

    constructor(scene: MainScene) {
        super(scene, 0, 0);
        this.background = new GameObjects.Image(scene, 0, 0, "top-banner", "assist-bg").setOrigin(0);
        this.assistName = renderText({
            scene: this.scene,
            x: this.background.getCenter().x,
            y: this.background.getBottomCenter().y - 20,
            content: ""
        });
        this.add(this.background);
        this.assister = {
            portrait: new HeroPortrait(scene, 0, "").setScale(0.6),
            startingHP: renderRegularHPText({
                scene,
                x: 20,
                y: 0,
                content: ""
            }),
            endHP: renderRegularHPText({
                scene,
                x: 20,
                y: 0,
                content: ""
            }),
        };

        this.assisted = {
            portrait: new HeroPortrait(scene, 900, "").setScale(0.6).setFlipX(true),
            startingHP: renderRegularHPText({
                scene,
                x: 20,
                y: 0,
                content: ""
            }),
            endHP: renderRegularHPText({
                scene,
                x: 20,
                y: 0,
                content: ""
            }),
        };

        for (let key in this.assister) {
            this.add(this.assister[key]);
        }

        for (let key in this.assisted) {
            this.add(this.assisted[key]);
        }
    }

    updateSides(args: UpdateArguments) {
        const { Name, Stats } = args.assister.hero.getInternalHero();
        const { Name: AssistedName, Stats: AssistedStats } = args.assister.hero.getInternalHero();
        this.assister.portrait.setPortrait(Name[0].value, Stats[0].hp, Stats[0].maxHP);
        this.assisted.portrait.setPortrait(AssistedName[0].value, AssistedStats[0].hp, AssistedStats[0].maxHP);

        const applyFutureHPGradient = args.assister.endHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const futureHPGradient = applyFutureHPGradient(this.assister.endHP);
        this.assister.endHP.setFill(futureHPGradient).setText(args.assister.endHP.toString());

        const applyCurrentHPGradient = args.assister.startHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const currentHPGradient = applyCurrentHPGradient(this.assister.startingHP);
        this.assister.startingHP.setFill(currentHPGradient).setText(args.assister.startHP.toString());

        const applyAssistedFutureHPGradient = args.assisted.endHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const assistedFutureHPGradient = applyAssistedFutureHPGradient(this.assisted.endHP);
        this.assisted.endHP.setFill(assistedFutureHPGradient).setText(args.assisted.endHP.toString());

        const applyAssistedCurrentHPGradient = args.assisted.startHP <= 10 ? getLowHPGradient : getHealthyHPGradient;
        const currentAssistedHPGradient = applyAssistedCurrentHPGradient(this.assisted.startingHP);
        this.assisted.startingHP.setFill(currentAssistedHPGradient).setText(args.assisted.startHP.toString());
    }
};

export default AssistPreview;
