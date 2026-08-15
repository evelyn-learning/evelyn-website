/**
 * Visual smoke: render the 4 Phase-20 physics catalog kinds (nuclear_decay,
 * em_induction, magnetic_field_current, projectile_motion) through their real
 * solver + renderer to a single PNG so we can eyeball the SVG output. Mirrors
 * waves-smoke.ts but drives React SSR for the .tsx catalog renderers.
 *
 * Usage: npx tsx scripts/physics-kinds-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveNuclearDecay,
  solveEMInduction,
  solveMagneticFieldCurrent,
  solveProjectileMotion,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/em-nuclear-motion';
import {
  CatalogNuclearDecayRenderer,
  CatalogEMInductionRenderer,
  CatalogMagneticFieldRenderer,
  CatalogProjectileRenderer,
} from '../apps/marketing/src/app/tutor/components/whiteboard/CatalogEMNuclearMotionRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  nuclear_decay: solveNuclearDecay,
  em_induction: solveEMInduction,
  magnetic_field_current: solveMagneticFieldCurrent,
  projectile_motion: solveProjectileMotion,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  nuclear_decay: CatalogNuclearDecayRenderer,
  em_induction: CatalogEMInductionRenderer,
  magnetic_field_current: CatalogMagneticFieldRenderer,
  projectile_motion: CatalogProjectileRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'nuclear_decay (alpha, default)', kind: 'nuclear_decay', params: {} },
  { title: 'nuclear_decay (beta-minus)', kind: 'nuclear_decay', params: { mode: 'beta-minus' } },
  { title: 'nuclear_decay (beta-plus)', kind: 'nuclear_decay', params: { mode: 'beta-plus' } },
  { title: 'nuclear_decay (gamma)', kind: 'nuclear_decay', params: { mode: 'gamma' } },
  { title: 'em_induction (magnet moving in)', kind: 'em_induction', params: { motion: 'in' } },
  { title: 'em_induction (magnet moving out)', kind: 'em_induction', params: { motion: 'out' } },
  { title: 'magnetic_field_current (wire, default)', kind: 'magnetic_field_current', params: {} },
  { title: 'magnetic_field_current (solenoid)', kind: 'magnetic_field_current', params: { conductor: 'solenoid' } },
  { title: 'projectile_motion (45°, default)', kind: 'projectile_motion', params: {} },
  { title: 'projectile_motion (30°)', kind: 'projectile_motion', params: { angle: 30 } },
  { title: 'projectile_motion (60°, no components)', kind: 'projectile_motion', params: { angle: 60, showComponents: false } },
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
  const htmlPath = path.join(OUT_DIR, 'kinds-physics.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 3400 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-physics.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
