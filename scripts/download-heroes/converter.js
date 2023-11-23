const webp_converter = require("webp-converter");
webp_converter.grant_permission();

async function convertWebpFileToPNG(file) {
    return webp_converter.dwebp(file, file.replace(".webp", ".png"), "-o");
};

async function convertPNGFileToWebp(file) {
    return webp_converter.cwebp(file, file.replace(".png", ".webp"));
}

module.exports = {
    convertPNGFileToWebp,
    convertWebpFileToPNG
};
