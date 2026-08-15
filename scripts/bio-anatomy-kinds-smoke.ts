/**
 * Visual smoke: render the 4 bio-anatomy catalog kinds (leaf_cross_section,
 * nephron, digestive_system, circulatory_system) through their real solver +
 * renderer, to a single PNG so we can eyeball the SVG output. Mirrors
 * bio-kinds-smoke.ts but for the .tsx bio-anatomy catalog renderers.
 *
 * Usage: npx tsx scripts/bio-anatomy-kinds-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveLeafCrossSection,
  solveNephron,
  solveDigestiveSystem,
  solveCirculatorySystem,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/bio-anatomy';
import {
  CatalogLeafCrossSectionRenderer,
  CatalogNephronRenderer,
  CatalogDigestiveSystemRenderer,
  CatalogCirculatorySystemRenderer,
} from '../apps/marketing/src/app/tutor/components/whiteboard/CatalogBioAnatomyRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  leaf_cross_section: solveLeafCrossSection,
  nephron: solveNephron,
  digestive_system: solveDigestiveSystem,
  circulatory_system: solveCirculatorySystem,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  leaf_cross_section: CatalogLeafCrossSectionRenderer,
  nephron: CatalogNephronRenderer,
  digestive_system: CatalogDigestiveSystemRenderer,
  circulatory_system: CatalogCirculatorySystemRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'leaf_cross_section (bare — gas exchange on)', kind: 'leaf_cross_section', params: {} },
  { title: 'leaf_cross_section (highlight = palisade + stoma)', kind: 'leaf_cross_section', params: { highlight: ['palisade', 'stoma'] } },
  { title: 'nephron (bare — filtration/reabsorption)', kind: 'nephron', params: {} },
  { title: 'nephron (highlight = loop_of_henle, no flow)', kind: 'nephron', params: { highlight: 'loop of henle', showFlow: false } },
  { title: 'digestive_system (bare — labeled in order)', kind: 'digestive_system', params: {} },
  { title: 'digestive_system (highlight = stomach + liver)', kind: 'digestive_system', params: { highlight: ['stomach', 'liver'] } },
  { title: 'circulatory_system (bare — double circulation)', kind: 'circulatory_system', params: {} },
  { title: 'circulatory_system (highlight = left_ventricle + aorta)', kind: 'circulatory_system', params: { highlight: ['left_ventricle', 'aorta'] } },
];

const cards = fixtures.map((f) => {
  const figure = SOLVE[f.kind](f.params);
  const svg = renderToStaticMarkup(
    React.createElement(RENDER[f.kind], { figure }),
  );
  return { title: f.title, svg };
});

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#f8fafc;font-family:sans-serif;padding:20px}
  .grid{display:flex;flex-direction:column;gap:20px;max-width:800px;margin:0 auto}
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px}
  .card h3{margin:0 0 8px;font-size:13px;color:#475569;font-family:monospace}
  svg{width:100%;height:auto}
</style></head><body>
  <div class="grid">
  ${cards.map((c) => `<div class="card"><h3>${c.title}</h3>${c.svg}</div>`).join('')}
  </div>
</body></html>`;

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const htmlPath = path.join(OUT_DIR, 'kinds-bio-anatomy.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 840, height: 4200 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-bio-anatomy.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
