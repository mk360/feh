const cmd = require("command-line-args");
const fs = require("fs");
const path = require("path");
const compileImages = require("./compile-images");
const downloadAssets = require("./download-assets");
const compileAudio = require("./compile-audio");
const finalizeCompiledFile = require("./finalize-compiled-file");

const options = [{
    name: "filename", alias: "f"
}];

const { filename } = cmd(options);
const fileContents = JSON.parse(fs.readFileSync(path.join(__dirname, filename), "utf-8"));

(async function runHeroPipeline() {
    for (let { Name: name } of fileContents) {
        await downloadAssets(name);
        await compileAudio(name);
        const compiledPath = await compileImages(name);
        await finalizeCompiledFile(name, compiledPath);
    }

    if (fs.existsSync(path.join(__dirname, "../../temp"))) {
        fs.rmSync(path.join(__dirname, "../../temp"), { force: true, recursive: true });
    }
})();
