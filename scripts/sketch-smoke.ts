/**
 * Phase-0 visual smoke: render the reference doodles (and any extra fixtures)
 * to a PNG so we can eyeball the rough.js output.
 *
 * Usage: TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *   --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/sketch-smoke.ts
 * Output: scratchpad/sketch-smoke.png
 */
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { sketchToSvgString } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-render-core';
import { BALL_ON_HILL, GLASS_SHATTER } from '../apps/marketing/src/lib/tutor/whiteboard/sketch-examples';

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/eef0f93c-2529-4cf5-a783-e7aa5c6bf075/scratchpad';

const cards: { title: string; svg: string }[] = [
  { title: 'ball on a hill', svg: sketchToSvgString(BALL_ON_HILL) },
  { title: 'glass shattering', svg: sketchToSvgString(GLASS_SHATTER) },
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font-family:sans-serif;display:flex;gap:24px;padding:24px}
  .card{width:360px}
  .card h3{margin:0 0 8px;font-size:14px;color:#374151}
  .frame{border:1px solid #e5e7eb;border-radius:8px;padding:12px}
  svg{width:100%;height:auto}
</style></head><body>
  ${cards.map((c) => `<div class="card"><h3>${c.title}</h3><div class="frame">${c.svg}</div></div>`).join('')}
</body></html>`;

(async () => {
  const htmlPath = path.join(OUT_DIR, 'sketch-smoke.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 820, height: 460 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(150);
  const pngPath = path.join(OUT_DIR, 'sketch-smoke.png');
  await page.screenshot({ path: pngPath });
  await browser.close();
  console.log('wrote', pngPath);
})();
