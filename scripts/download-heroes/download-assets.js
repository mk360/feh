const path = require("path");
const downloadFile = require("./download-file");

module.exports = async function downloadHeroAssets(heroName) {
  const urlName = heroName.replace(/[:'"]/g, "").replace(/ /g, "_");
  const targetDir = path.join(__dirname, "../../temp", urlName);
  await Promise.allSettled([
    downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_BtlFace_BU.webp`, path.join(targetDir, "/portrait.png")),
    downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_BtlFace_BU_D.webp`, path.join(targetDir, "/portrait-damage.png")),
    downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_Mini_Unit_Idle.png`, path.join(targetDir, "/map.png")),
    downloadFile(`https://feheroes.fandom.com/Special:Filepath/VOICE_${urlName}_MAP_1.wav`, path.join(targetDir, 1 + ".wav")),
    downloadFile(`https://feheroes.fandom.com/Special:Filepath/VOICE_${urlName}_MAP_2.wav`, path.join(targetDir, 2 + ".wav")),
    downloadFile(`https://feheroes.fandom.com/Special:Filepath/VOICE_${urlName}_MAP_3.wav`, path.join(targetDir, 3 + ".wav")),
    downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_Face_FC.webp`, path.join(targetDir, "face.png"))
  ]);
};
