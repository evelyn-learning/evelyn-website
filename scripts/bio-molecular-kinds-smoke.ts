/**
 * Visual smoke: render the 4 molecular / cell-biology catalog kinds
 * (protein_synthesis, enzyme_action, cell_cycle, gene_expression) through their
 * real solver + renderer to a single PNG so we can eyeball the SVG output.
 * Mirrors bio-kinds-smoke.ts but for the molecular-biology catalog renderers.
 *
 * Usage: npx tsx scripts/bio-molecular-kinds-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveProteinSynthesis,
  solveEnzymeAction,
  solveCellCycle,
  solveGeneExpression,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/molecular-biology';
import {
  CatalogProteinSynthesisRenderer,
  CatalogEnzymeActionRenderer,
  CatalogCellCycleRenderer,
  CatalogGeneExpressionRenderer,
} from '../apps/marketing/src/app/tutor/components/whiteboard/CatalogMolecularBiologyRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  protein_synthesis: solveProteinSynthesis,
  enzyme_action: solveEnzymeAction,
  cell_cycle: solveCellCycle,
  gene_expression: solveGeneExpression,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  protein_synthesis: CatalogProteinSynthesisRenderer,
  enzyme_action: CatalogEnzymeActionRenderer,
  cell_cycle: CatalogCellCycleRenderer,
  gene_expression: CatalogGeneExpressionRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'protein_synthesis (bare — both stages)', kind: 'protein_synthesis', params: {} },
  { title: 'protein_synthesis (stage = transcription)', kind: 'protein_synthesis', params: { stage: 'transcription' } },
  { title: 'protein_synthesis (stage = translation)', kind: 'protein_synthesis', params: { stage: 'translation' } },
  { title: 'enzyme_action (bare — lock and key)', kind: 'enzyme_action', params: {} },
  { title: 'enzyme_action (model = induced_fit)', kind: 'enzyme_action', params: { model: 'induced_fit' } },
  { title: 'cell_cycle (bare — full ring)', kind: 'cell_cycle', params: {} },
  { title: 'cell_cycle (highlight = S)', kind: 'cell_cycle', params: { highlight: 'S' } },
  { title: 'gene_expression (bare — OFF)', kind: 'gene_expression', params: {} },
  { title: 'gene_expression (state = on)', kind: 'gene_expression', params: { state: 'on' } },
];

const cards = fixtures.map((f) => {
  const figure = SOLVE[f.kind](f.params);
  const svg = renderToStaticMarkup(React.createElement(RENDER[f.kind], { figure }));
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
  const htmlPath = path.join(OUT_DIR, 'kinds-bio-molecular.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 840, height: 4200 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-bio-molecular.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
