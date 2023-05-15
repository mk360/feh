import { GameObjects, Scene } from "phaser";
import TextColors from "./text-colors";

interface TextRenderingConfig {
    scene: Scene;
    x: number;
    y: number;
    content: string | number;
    style?: Partial<GameObjects.TextStyle>;
}

export function renderText(scene: Scene, x: number, y: number, content: string | number, style?: Partial<Phaser.GameObjects.TextStyle>) {
    return new Phaser.GameObjects.Text(scene, x, y, content.toString(), {
        fontFamily: "'FEH'",
        stroke: "black",
        strokeThickness: 2,
        ...style,
    });
};

export function renderStatText(config: TextRenderingConfig) {
    const { gradient, text } = renderTextWith2DContext(config);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, TextColors.numbers);
    text.setFill(gradient);
    return text;
}

export function renderBoonText(config: TextRenderingConfig) {
    const { text } = renderTextWith2DContext(config);
    text.setColor(TextColors.boon);
    return text;
}

export function renderCritHPText(config: TextRenderingConfig) {
    const { text, gradient } = renderTextWith2DContext(config);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.5, TextColors.criticalHP);
    gradient.addColorStop(1, "white");
    text.setFill(gradient);
    return text;
}

export function renderRegularHPText(config: TextRenderingConfig) {
    const { text, gradient } = renderTextWith2DContext(config);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, TextColors.healthyHP);
    text.setFill(gradient);
    return text;
}

function renderTextWith2DContext(config: TextRenderingConfig) {
    const text = renderText(config.scene, config.x, config.y, config.content, config.style);
    const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
    return {
        text,
        gradient
    };
}
