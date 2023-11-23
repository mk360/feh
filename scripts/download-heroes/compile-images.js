const path = require("path");
const spritePacker = require("@sjchang/sprite-packer");
const fs = require("fs");

async function compileImages(name) {
    const urlName = name.replace(/[:'"]/g, "").replace(/ /g, "_");
    const tempDir = path.join(__dirname, "../../temp", urlName);
    const assetsDir = path.join(__dirname, "../../src/assets/battle");
    const result = await spritePacker.default({
        format: "JsonArray",
        file: path.join(tempDir, "*.png"),
        name: urlName,
        sep: path.sep
    });

    const outputObj = {
        frames: {}
    };

    for (let frame of result.data.frames) {
        const { filename } = frame;
        delete frame.filename;
        let correctedFilename = filename.replace(".png", "");
        outputObj.frames[correctedFilename] = frame;
    }

    const compiledPNGFilepath = path.join(tempDir, urlName + ".png");

    for (let file of fs.readdirSync(tempDir)) {
        fs.unlinkSync(path.join(tempDir, file));
    }

    fs.writeFileSync(compiledPNGFilepath, result.image);
    fs.writeFileSync(path.join(assetsDir, urlName + ".json"), JSON.stringify(outputObj));

    return compiledPNGFilepath;
};

module.exports = compileImages;

