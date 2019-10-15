const { PNG } = require("pngjs");
const fs = require("fs");
const { spawnSync } = require("child_process");

function generateImage(name, maxOpacity) {
  const png = new PNG({
    width: 200,
    height: 200,
    colorType: 6
  });
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 84;
    png.data[i + 1] = 167;
    png.data[i + 2] = 255;
    png.data[i + 3] = (Math.random() * maxOpacity * 255) | 0;
  }
  fs.writeFileSync(name, PNG.sync.write(png))
  spawnSync("pngquant", ["--force", "--output", name, name], { "stdio": "inherit" })
  console.log("DONE")
}

generateImage('./assets/noise-20.png', 0.2)
generateImage('./assets/noise-10.png', 0.1)
generateImage('./assets/noise-05.png', 0.05)
