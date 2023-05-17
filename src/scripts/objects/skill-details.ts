import { GameObjects, Scene } from "phaser";
import { renderSkillNameText, renderText } from "../utils/text-renderer";

class R extends GameObjects.Container {
    private contentContainer: GameObjects.Rectangle;
    private skillDesc: GameObjects.Text;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.contentContainer = new GameObjects.Rectangle(scene, 0, 0, 400, 400, 0x13353F).setOrigin(1, 0).setAlpha(0.7).setStrokeStyle(2, 0x7FD2E0);

        this.add(this.contentContainer);
    }

    setSkillDescription(desc: string) {
        if (this.skillDesc) {
            this.remove(this.skillDesc);
        }
        const skillName = renderSkillNameText({
            scene: this.scene,
            x: this.contentContainer.getLeftCenter().x + 10,
            y: this.contentContainer.getTopCenter().y + 10,
            content: "Distant Counter"
        });
        this.add(skillName);
        this.skillDesc = renderText(this.scene, this.contentContainer.getLeftCenter().x + 10, skillName.getBottomCenter().y + 10, desc, {
            wordWrapWidth: 450,
            wordWrapUseAdvanced: true,
        });
        this.add(this.skillDesc);
    }
};

export default R;
