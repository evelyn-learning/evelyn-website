/**
 * Visual smoke: render the 4 cell-biology catalog kinds (mitosis, meiosis,
 * dna_replication, cell_membrane) through their real solver + renderer, to a
 * single PNG so we can eyeball the SVG output. Mirrors waves-smoke.ts but for
 * the .tsx cell-biology catalog renderers.
 *
 * Usage: npx tsx scripts/bio-kinds-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveMitosis,
  solveMeiosis,
  solveDnaReplication,
  solveCellMembrane,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/cell-biology';
import {
  CatalogMitosisRenderer,
  CatalogMeiosisRenderer,
  CatalogDnaReplicationRenderer,
  CatalogCellMembraneRenderer,
} from '../apps/marketing/src/app/tutor/components/whiteboard/CatalogCellBiologyRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  mitosis: solveMitosis,
  meiosis: solveMeiosis,
  dna_replication: solveDnaReplication,
  cell_membrane: solveCellMembrane,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  mitosis: CatalogMitosisRenderer,
  meiosis: CatalogMeiosisRenderer,
  dna_replication: CatalogDnaReplicationRenderer,
  cell_membrane: CatalogCellMembraneRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'mitosis (bare — all six phases)', kind: 'mitosis', params: {} },
  { title: 'mitosis (phase = anaphase highlighted)', kind: 'mitosis', params: { phase: 'anaphase' } },
  { title: 'meiosis (bare — full flow)', kind: 'meiosis', params: {} },
  { title: 'meiosis (stage = crossing_over)', kind: 'meiosis', params: { stage: 'crossing over' } },
  { title: 'dna_replication (bare — enzymes labeled)', kind: 'dna_replication', params: {} },
  { title: 'cell_membrane (bare — fluid mosaic)', kind: 'cell_membrane', params: {} },
  { title: 'cell_membrane (mode = facilitated)', kind: 'cell_membrane', params: { mode: 'facilitated' } },
  { title: 'cell_membrane (mode = active)', kind: 'cell_membrane', params: { mode: 'active' } },
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
  const htmlPath = path.join(OUT_DIR, 'kinds-bio.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 840, height: 3400 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-bio.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
