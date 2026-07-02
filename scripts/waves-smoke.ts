/**
 * Visual smoke: render the 3 wavefront catalog kinds (doppler_effect,
 * standing_wave, interference_pattern) through their real solver + renderer,
 * to a single PNG so we can eyeball the SVG output. Mirrors sketch-smoke.ts
 * but drives React SSR for the .tsx catalog renderers.
 *
 * Usage: npx tsx scripts/waves-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveDopplerEffect,
  solveStandingWave,
  solveInterferencePattern,
} from '../src/lib/tutor/diagrams/catalog/kinds/waves';
import {
  CatalogDopplerRenderer,
  CatalogStandingWaveRenderer,
  CatalogInterferenceRenderer,
} from '../src/app/tutor/components/whiteboard/CatalogWavesRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  doppler_effect: solveDopplerEffect,
  standing_wave: solveStandingWave,
  interference_pattern: solveInterferencePattern,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  doppler_effect: CatalogDopplerRenderer,
  standing_wave: CatalogStandingWaveRenderer,
  interference_pattern: CatalogInterferenceRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'doppler_effect (source → right, v=0.5c)', kind: 'doppler_effect', params: {} },
  { title: 'doppler_effect (source ← left, v=0.7c)', kind: 'doppler_effect', params: { movingRight: false, sourceSpeedFrac: 0.7 } },
  { title: 'standing_wave (n = 1)', kind: 'standing_wave', params: { harmonic: 1 } },
  { title: 'standing_wave (n = 3)', kind: 'standing_wave', params: { harmonic: 3 } },
  { title: 'standing_wave (n = 4)', kind: 'standing_wave', params: { harmonic: 4 } },
  { title: 'interference_pattern (default d = 3λ)', kind: 'interference_pattern', params: {} },
  { title: 'interference_pattern (d = 4λ, λ = 40)', kind: 'interference_pattern', params: { sourceSep: 160, wavelength: 40 } },
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
  const htmlPath = path.join(OUT_DIR, 'kinds-waves.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 2600 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-waves.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
