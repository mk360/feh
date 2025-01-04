// const commandLineArgs = require("command-line-args");
// const audiosprite = require("audiosprite");
// const fs = require("fs");
import commandLineArgs from "command-line-args";
import audiosprite from "audiosprite";
import * as fs from "fs"

const parsed = commandLineArgs([
    { name: "files", alias: "f", multiple: true },
    { name: "output", alias: "o" }
], {
    caseInsensitive: true,
    camelCase: true,
});

if (!parsed.output) {
    console.error("Output filename not specified");
    process.exit(1);
}

await new Promise((res, rej) => {
    audiosprite(parsed.files, {
    output: "compile-audio/temp/" + parsed.output,
    export: "ogg",
    gap: 0.01
}, (err, obj) => {
    delete obj.resources;
    fs.writeFileSync(`compile-audio/temp/${parsed.output}.json`, JSON.stringify(obj));
    res();
});
});

console.log(`\nGenerated file: ${parsed.output}.ogg`);
