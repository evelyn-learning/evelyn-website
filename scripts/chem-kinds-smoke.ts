/**
 * Visual smoke: render the 4 chemistry catalog kinds (bohr_model,
 * galvanic_cell, titration_curve, crystal_lattice) through their real solver +
 * renderer, to a single PNG so we can eyeball the SVG output. Mirrors
 * waves-smoke.ts / bio-kinds-smoke.ts.
 *
 * Usage: npx tsx scripts/chem-kinds-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveBohrModel,
  solveGalvanicCell,
  solveTitrationCurve,
  solveCrystalLattice,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/chemistry';
import {
  CatalogBohrRenderer,
  CatalogGalvanicRenderer,
  CatalogTitrationRenderer,
  CatalogLatticeRenderer,
} from '../apps/marketing/src/app/tutor/components/whiteboard/CatalogChemistryRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  bohr_model: solveBohrModel,
  galvanic_cell: solveGalvanicCell,
  titration_curve: solveTitrationCurve,
  crystal_lattice: solveCrystalLattice,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  bohr_model: CatalogBohrRenderer,
  galvanic_cell: CatalogGalvanicRenderer,
  titration_curve: CatalogTitrationRenderer,
  crystal_lattice: CatalogLatticeRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'bohr_model (bare → carbon)', kind: 'bohr_model', params: {} },
  { title: 'bohr_model element=Na', kind: 'bohr_model', params: { element: 'Na' } },
  { title: 'bohr_model element=Cl', kind: 'bohr_model', params: { element: 'Cl' } },
  { title: 'galvanic_cell (bare → Zn ‖ Cu Daniell)', kind: 'galvanic_cell', params: {} },
  { title: 'galvanic_cell Mg ‖ Ag', kind: 'galvanic_cell', params: { anodeMetal: 'Mg', cathodeMetal: 'Ag' } },
  { title: 'titration_curve (bare → strong-strong)', kind: 'titration_curve', params: {} },
  { title: 'titration_curve type=weak-strong', kind: 'titration_curve', params: { type: 'weak-strong' } },
  { title: 'crystal_lattice (bare → sc)', kind: 'crystal_lattice', params: {} },
  { title: 'crystal_lattice type=bcc', kind: 'crystal_lattice', params: { type: 'bcc' } },
  { title: 'crystal_lattice type=fcc', kind: 'crystal_lattice', params: { type: 'fcc' } },
];

const cards = fixtures.map((f) => {
  const figure = SOLVE[f.kind](f.params);
  const svg = renderToStaticMarkup(React.createElement(RENDER[f.kind], { figure }));
  return { title: f.title, svg };
});

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#f8fafc;font-family:sans-serif;padding:20px}
  .grid{display:flex;flex-direction:column;gap:20px;max-width:760px;margin:0 auto}
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
  const htmlPath = path.join(OUT_DIR, 'kinds-chem.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 3400 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-chem.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
