import createEndTurnButton from "../scripts/buttons/end-turn";
import createSwapSpacesButton from "../scripts/buttons/swap-spaces";
import ActionsTray from "../scripts/objects/actions-tray";
import MainScene from "../scripts/scenes/mainScene";
import State from "./state";

class PreparationState implements State {
    scene: MainScene;

    constructor(scene: MainScene) {
        this.scene = scene;
    }

    changeActionsTray(actionsTray: ActionsTray) {
        actionsTray.clear(true);
        actionsTray.addAction(createEndTurnButton(this.scene));
        actionsTray.addAction(createSwapSpacesButton(this.scene));
    }
};

export default PreparationState;
