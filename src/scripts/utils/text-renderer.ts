import { GameObjects, Scene } from "phaser";
import TextColors from "./text-colors";

interface TextRenderingConfig {
    scene: Scene;
    x: number;
    y: number;
    content: string | number;
    style?: Partial<GameObjects.TextStyle>;
}

export function renderText(config: TextRenderingConfig) {
    const { content, scene, x, y, style } = config;

    return new Phaser.GameObjects.Text(scene, x, y, content.toString(), {
        fontFamily: "FEH",
        stroke: "black",
        strokeThickness: 2,
        ...style,
    });
};

export function getHealthyHPGradient(text: GameObjects.Text) {
    const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, TextColors.healthyHP);
    return gradient;
}

export function getLowHPGradient(text: GameObjects.Text) {
    const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, TextColors.criticalHP);
    return gradient;
}

export function renderDamageText(config: TextRenderingConfig) {
    const { text } = renderTextWith2DContext(config);
    text.style.stroke = "white";
    text.style.strokeThickness = 5;
    text.setColor("red");
    return text;
}

export function renderNumberText(config: TextRenderingConfig) {
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

export function renderBaneText(config: TextRenderingConfig) {
    const { text } = renderTextWith2DContext(config);
    text.setColor(TextColors.bane);
    return text;
}

export function renderLabelText(config: TextRenderingConfig) {
    const { text } = renderTextWith2DContext(config);
    text.setColor(TextColors.label);
    text.setFontSize(18);
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

export function renderSpecialText(config: TextRenderingConfig) {
    const { text, gradient } = renderTextWith2DContext(config);
    gradient.addColorStop(0, TextColors.specialPink);
    gradient.addColorStop(0.6, TextColors.specialPink);
    gradient.addColorStop(0.8, "white");
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
    const text = renderText(config);
    const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
    return {
        text,
        gradient
    };
}
