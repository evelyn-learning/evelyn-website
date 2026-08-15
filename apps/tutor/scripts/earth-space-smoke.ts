/**
 * Visual smoke: render the 4 Phase-23 earth & space catalog kinds
 * (geologic_cross_section, hr_diagram, volcano_cross_section,
 * atmosphere_layers) + variants through their real solver + renderer,
 * to a single PNG so we can eyeball the SVG output. Mirrors waves-smoke.ts.
 *
 * Usage: npx tsx scripts/earth-space-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveGeologicCrossSection,
  solveHRDiagram,
  solveVolcanoCrossSection,
  solveAtmosphereLayers,
} from '../src/lib/tutor/diagrams/catalog/kinds/earth-space';
import {
  CatalogGeologicCrossSectionRenderer,
  CatalogHRDiagramRenderer,
  CatalogVolcanoCrossSectionRenderer,
  CatalogAtmosphereLayersRenderer,
} from '../src/app/tutor/components/whiteboard/CatalogEarthSpaceRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  geologic_cross_section: solveGeologicCrossSection,
  hr_diagram: solveHRDiagram,
  volcano_cross_section: solveVolcanoCrossSection,
  atmosphere_layers: solveAtmosphereLayers,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  geologic_cross_section: CatalogGeologicCrossSectionRenderer,
  hr_diagram: CatalogHRDiagramRenderer,
  volcano_cross_section: CatalogVolcanoCrossSectionRenderer,
  atmosphere_layers: CatalogAtmosphereLayersRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'geologic_cross_section (bare — normal fault)', kind: 'geologic_cross_section', params: { title: 'Geologic cross-section' } },
  { title: 'geologic_cross_section (reverse fault, no unconformity)', kind: 'geologic_cross_section', params: { faultType: 'reverse', showUnconformity: false } },
  { title: 'hr_diagram (bare)', kind: 'hr_diagram', params: { title: 'Hertzsprung–Russell diagram' } },
  { title: 'hr_diagram (highlight: giants)', kind: 'hr_diagram', params: { highlight: 'giants' } },
  { title: 'volcano_cross_section (bare)', kind: 'volcano_cross_section', params: { title: 'Stratovolcano' } },
  { title: 'volcano_cross_section (no side vent)', kind: 'volcano_cross_section', params: { showSideVent: false } },
  { title: 'atmosphere_layers (bare)', kind: 'atmosphere_layers', params: { title: "Earth's atmosphere" } },
  { title: 'atmosphere_layers (highlight: stratosphere)', kind: 'atmosphere_layers', params: { highlight: 'stratosphere' } },
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
  const htmlPath = path.join(OUT_DIR, 'kinds-earth-space.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 3400 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-earth-space.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
