// Renders the packet figures to PNG at twice their display size (240 px wide on the page).
//   node scripts/showcase/castle-rock-packet/render.cjs <output-img-dir>
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const out = process.argv[2];
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const name of fs.readdirSync(__dirname).filter((f) => f.endsWith(".svg"))) {
    await page.setContent(`<body style="margin:0">${fs.readFileSync(path.join(__dirname, name), "utf8")}</body>`);
    await (await page.$("svg")).screenshot({ path: path.join(out, name.replace(".svg", ".png")) });
  }
  await browser.close();
})();
