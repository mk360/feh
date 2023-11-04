import createEndTurnButton from "../scripts/buttons/end-turn";
import createEnemyRangeButton from "../scripts/buttons/enemy-range";
import ActionsTray from "../scripts/objects/actions-tray";
import MainScene from "../scripts/scenes/mainScene";
import State from "./state";

class FightingState implements State {
    scene: MainScene;
    constructor(scene: MainScene) {
        this.scene = scene;
    }

    changeActionsTray(actionsTray: ActionsTray): void {
        actionsTray.clear(true);
        actionsTray.addAction(createEndTurnButton(this.scene));
        actionsTray.addAction(createEnemyRangeButton(this.scene));
    }
};

export default FightingState;
