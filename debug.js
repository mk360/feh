const fs = require("fs");

const dir = fs.readdirSync(".");

if (dir.includes("dist")) console.log("dist exists");
else console.log("dist doesn't exist");
