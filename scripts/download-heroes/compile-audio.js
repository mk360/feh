const audiosprite = require("audiosprite");
const path = require("path");
const fs = require("fs");

module.exports = function compileAudio(heroName) {
    const urlName = heroName.replace(/[:'"]/g, "").replace(/ /g, "_");
    return new Promise((res) => {
        const outputPath = path.join(__dirname, "../..", "src/assets/audio/quotes");
        const audioFiles = fs.readdirSync(path.join(__dirname, "../..", "temp", urlName)).filter(i => i.endsWith(".wav")).map(i => path.join(__dirname, "../../temp", urlName, i));

        audiosprite(audioFiles, {
            output: path.join(outputPath, urlName),
            export: "m4a",
            gap: 0.01
        }, (err, obj) => {
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(path.join(outputPath));
            }
            delete obj.resources;
            fs.writeFileSync(path.join(outputPath, urlName + ".json"), JSON.stringify(obj));
            for (let file of audioFiles) {
                fs.unlinkSync(file);
            }
            res();
        });
    });
};
