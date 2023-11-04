import battle from "../classes/battle";
import Button from "../objects/button";
import MainScene from "../scenes/mainScene";

function createEndTurnButton(scene: MainScene) {
    const button = new Button(scene, "End Turn");
    button.on("pointerup", () => {
        const action = battle.endTurn();
        scene.processAction(action);
    });

    return button;
};

export default createEndTurnButton;
