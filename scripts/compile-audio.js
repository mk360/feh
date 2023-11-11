const audiosprite = require("audiosprite");
const fs = require("fs");

const files = ["ko.mp3", "hit.mp3", "effect-trigger.mp3"].map(i => `../src/assets/audio/${i}`);

const filename = "battle-sfx";

audiosprite(files, {
    output: "./" + filename,
    export: "ogg",
}, (err, obj) => {
    fs.writeFileSync(filename + ".json", JSON.stringify(obj));
});