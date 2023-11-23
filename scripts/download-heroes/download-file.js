const https = require("https");
const fs = require("fs");
const Path = require("path");

module.exports = async function downloadFile(url, targetFile) {
    return await new Promise((resolve, reject) => {
        https.get(url, response => {
            const code = response.statusCode ?? 0

            if (code >= 400) {
                return reject(new Error(response.statusMessage))
            }

            // handle redirects
            if (code > 300 && code < 400 && !!response.headers.location) {
                return resolve(
                    downloadFile(response.headers.location, targetFile)
                )
            }


            if (!fs.existsSync(targetFile)) {
                const path = targetFile.split(Path.sep);
                path.pop();
                fs.mkdirSync(path.join("/"), { recursive: true });
                // save the file to disk
                const fileWriter = fs
                    .createWriteStream(targetFile)
                    .on('finish', () => {
                        resolve({})
                    })

                response.pipe(fileWriter)
            } else {
                resolve({});
            }
        }).on('error', error => {
            reject(error)
        })
    })
}