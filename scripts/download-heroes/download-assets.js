const path = require("path");
// const json = JSON.parse(Fs.readFileSync(path.join(__dirname, "./first-100-characters.json"), "utf-8"));
const downloadFile = require("./download-file");

module.exports = async function downloadHeroAssets(heroName) {
  const urlName = heroName.replace(/[:'"]/g, "").replace(/ /g, "_");
  const targetDir = path.join(__dirname, "../../temp", urlName);
  await downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_BtlFace_BU.webp`, path.join(targetDir, "/portrait.png"));
  await downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_BtlFace_BU_D.webp`, path.join(targetDir, "/portrait-damage.png"));
  await downloadFile(`https://feheroes.fandom.com/Special:Filepath/${urlName}_Mini_Unit_Idle.png`, path.join(targetDir, "/map.png"));

  for (let i = 1; i <= 3; i++) {
    await downloadFile(`https://feheroes.fandom.com/Special:Filepath/VOICE_${urlName}_MAP_${i}.wav`, path.join(targetDir, i + ".wav"));
  }
};
