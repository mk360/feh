const fs = require("fs");
const path = require("path");
const { convertPNGFileToWebp } = require("./converter");

async function finalizeCompiledFile(heroName, filepath) {
    const urlName = heroName.replace(/[:'"]/g, "").replace(/ /g, "_");
    await convertPNGFileToWebp(filepath);
    const webpFilepath = filepath.replace(".png", ".webp");
    fs.unlinkSync(filepath);
    fs.renameSync(webpFilepath, path.join(__dirname, "../../src/assets/battle", urlName + ".webp"));
};

module.exports = finalizeCompiledFile;
