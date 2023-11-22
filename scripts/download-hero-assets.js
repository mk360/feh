const Https = require("https");
const Fs = require("fs");
const Path = require("path");
const json = JSON.parse(Fs.readFileSync(Path.join(__dirname, "./first-100-characters.json"), "utf-8"));

async function downloadFile (url, targetFile) {  
  return await new Promise((resolve, reject) => {
    Https.get(url, response => {
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

      
      if (!Fs.existsSync(targetFile)) {
        const path = targetFile.split(Path.sep);
        path.pop();
        Fs.mkdirSync(path.join("/"), { recursive: true });
        // save the file to disk
        const fileWriter = Fs
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

(async function fct() {
    for (let { Name } of json) {
        const urlName = Name.replace(/[:'"]/g, "").replace(/ /g, "_");
        await downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_BtlFace_BU.webp`, Path.join(__dirname, "../temp", urlName + "/portrait.webp"));
        await downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_BtlFace_BU_D.webp`, Path.join(__dirname, "../temp", urlName + "/portrait-damage.webp"));
        await downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_Mini_Unit_Idle.png`, Path.join(__dirname, "../temp", urlName + "/map.png"));

        for (let i = 1; i <= 3; i++) {
          await downloadFile(`https://feheroes.fandom.com/Special:Filepath/VOICE_${urlName}_MAP_${i}.wav`, Path.join(__dirname, "../temp", urlName + "/" + i + ".wav"));
        }

        console.log(Name);
    }
})();
