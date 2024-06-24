import effectTriggerAnimation from "./scripts/animations/effect-trigger";
import mapDebuffAnimation from "./scripts/animations/map-debuff";
import Hero from "./scripts/objects/hero";
import MainScene from "./scripts/scenes/mainScene";
import { Types } from "phaser";

const animationKeys = {
    "trigger": effectTriggerAnimation,
    "Penalty": mapDebuffAnimation
}

function parseServerResponse(scene: MainScene, lines: string[]) {
    const line = lines[0];
    const animations: Types.Time.TimelineEventConfig[][] = [];
    const effects = line.split(",");
    for (let effect of effects) {
        const [animation, target] = effect.split(" ");
        if (animation in animationKeys) {
            const hero = scene.heroesLayer.getByName(target) as Hero;
            console.log({ animation, target, hero: hero.getInternalHero() });
            const anim = animationKeys[animation as keyof typeof animationKeys](scene, hero);
            animations.push(anim);
        }
    }

    return animations;
};

export default parseServerResponse;
