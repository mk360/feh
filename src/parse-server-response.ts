import effectTriggerAnimation from "./scripts/animations/effect-trigger";
import mapBuffAnimation from "./scripts/animations/map-buff";
import mapDebuffAnimation from "./scripts/animations/map-debuff";
import Hero from "./scripts/objects/hero";
import MainScene from "./scripts/scenes/mainScene";
import { Time } from "phaser";

const animationKeys = {
    "trigger": effectTriggerAnimation,
    "Penalty": mapDebuffAnimation,
    "Bonus": mapBuffAnimation
}

function parseServerResponse(scene: MainScene, lines: string[]) {

    const animations: Time.Timeline[][] = [];
    for (let line of lines) {
        const effects = line.split(",");
        const timelineArray: Time.Timeline[] = [];
        for (let effect of effects) {
            const [animation, target] = effect.split(" ");
            if (animation in animationKeys) {
                const hero = scene.heroesLayer.getByName(target) as Hero;
                const animData = animationKeys[animation as keyof typeof animationKeys](scene, hero);
                const timeline = new Time.Timeline(scene, animData);
                timelineArray.push(timeline);
            }
        }
        animations.push(timelineArray);
    }

    return animations;
};

export default parseServerResponse;
