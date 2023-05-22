import { GameObjects, Scene } from "phaser";
import { renderSkillNameText, renderText } from "../utils/text-renderer";

class SkillDetails extends GameObjects.Container {
    private contentContainer: GameObjects.Rectangle;
    private skillDesc: GameObjects.Text;
    private skillName: GameObjects.Text;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.contentContainer = new GameObjects.Rectangle(scene, 0, 0, 400, 400, 0x13353F).setOrigin(1, 0).setAlpha(0.9).setStrokeStyle(2, 0x7FD2E0);
        this.add(this.contentContainer);
    }

    setSkillDescription(name: string, desc: string) {
        if (this.skillDesc) {
            this.remove(this.skillDesc);
        }
        if (this.skillName) {
            this.remove(this.skillName);
        }
        this.skillName = renderSkillNameText({
            scene: this.scene,
            x: this.contentContainer.getLeftCenter().x + 10,
            y: this.contentContainer.getTopCenter().y + 10,
            content: name
        });
        this.add(this.skillName);
        this.skillDesc = renderText(this.scene, this.contentContainer.getLeftCenter().x + 10, this.skillName.getBottomCenter().y + 10, desc);
        this.add(this.skillDesc);
        this.skillDesc.setWordWrapWidth(390);
        this.contentContainer.setDisplaySize(this.contentContainer.displayWidth, this.skillDesc.getBottomCenter().y + 10);
    }
};

export default SkillDetails;
