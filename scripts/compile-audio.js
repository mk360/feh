const cmd = require("command-line-args");
const audiosprite = require("audiosprite");
const fs = require("fs");
const path = require("path");

const options = [
    {
        name: "directory", alias: "f"
    }
];

const commandOptions = cmd(options);

const heroFolder = path.join(__dirname, "../temp", commandOptions.directory);

const audioFiles = fs.readdirSync(heroFolder).filter(i => i.endsWith(".wav")).map((i) => {
    return heroFolder + path.sep + i;
});

const filename = heroFolder;

(async function fct() { 
    await generateSprite();
})();

function generateSprite() {
    return new Promise((res) => {
        audiosprite(audioFiles, {
            output: filename + path.sep + commandOptions.directory,
            export: "m4a",
        }, (err, obj) => {
            fs.writeFileSync(filename + path.sep + commandOptions.directory + ".json", JSON.stringify(obj));
            console.log(filename);
            res();
            process.exit(1);
        });
    });
};