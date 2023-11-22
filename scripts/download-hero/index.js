const cmd = require("command-line-args");
const downloadAssets = require("./download-assets");
const compileAudio = require("./compile-audio");

const options = [{
    name: "name", alias: "n"
}];

const { name } = cmd(options);

(async function runHeroPipeline() {
    await downloadAssets(name);
    await compileAudio(name);
})();
