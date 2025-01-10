import commandLineArgs from "command-line-args";
import audiosprite from "audiosprite";
import * as fs from "fs"

const parsed = commandLineArgs([
    { name: "files", alias: "f", multiple: true },
    { name: "output", alias: "o" },
    { name: "directory", alias: "d", defaultValue: "compile-audio/temp" }
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
    fs.writeFileSync(`${parsed.directory}/${parsed.output}.json`, JSON.stringify(obj));
    res();
});
});

console.log(`\nGenerated file: ${parsed.output}.ogg`);
