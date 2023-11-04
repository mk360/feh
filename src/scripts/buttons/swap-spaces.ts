import Button from "../objects/button";
import MainScene from "../scenes/mainScene";

function createSwapSpacesButton(scene: MainScene) {
    const button = new Button(scene, "Swap Spaces");
    button.on("pointerup", () => {

    });

    return button;
};

export default createSwapSpacesButton;
