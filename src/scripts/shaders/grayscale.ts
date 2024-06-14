import { Renderer } from "phaser";
import MainScene from "../scenes/mainScene";

const frag = `
#define SHADER_NAME GRAYSCALE

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;

void main() {
    gl_FragColor = texture2D(uMainSampler, outTexCoord);

}
`;

class Test extends Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(scene: MainScene) {
        super({
            game: scene.game,
            fragShader: frag
        })
    }
}