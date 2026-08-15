/**
 * Smoke test for the browser-independent parts of whiteboard-capture.ts.
 *
 * Usage: npx tsx scripts/test-whiteboard-capture.ts
 *
 * The DOM-dependent capture (captureCommandSvg, captureCommandRaster,
 * drawCapturedSvg) can only run in a browser — verify those in an actual
 * tutor session by clicking "Export PDF" and inspecting the output.
 */

// Node environment doesn't ship DOMParser; pull in happy-dom just for this
// script so parseSvgDimensions has something to work with.
import { Window } from 'happy-dom';
const win = new Window();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).DOMParser = win.DOMParser;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).window = win;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).document = win.document;

import { parseSvgDimensions } from '../apps/marketing/src/lib/utils/export/whiteboard-capture';

type TC = { name: string; svg: string; expected: { width: number; height: number } };
const cases: TC[] = [
  {
    name: 'viewBox present — standard DIAGRAM_VIEWBOX',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 360"><rect/></svg>',
    expected: { width: 520, height: 360 },
  },
  {
    name: 'viewBox comma-separated',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,800,400"><rect/></svg>',
    expected: { width: 800, height: 400 },
  },
  {
    name: 'width/height only, no viewBox',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300"><rect/></svg>',
    expected: { width: 600, height: 300 },
  },
  {
    name: 'width/height with px suffix',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="600px" height="300px"><rect/></svg>',
    expected: { width: 600, height: 300 },
  },
  {
    name: 'neither viewBox nor width/height → default 520×360',
    svg: '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>',
    expected: { width: 520, height: 360 },
  },
  {
    name: 'malformed SVG → default',
    svg: '<not-svg>nope</not-svg>',
    expected: { width: 520, height: 360 },
  },
];

let passed = 0;
let failed = 0;
for (const tc of cases) {
  const actual = parseSvgDimensions(tc.svg);
  const ok = actual.width === tc.expected.width && actual.height === tc.expected.height;
  if (ok) passed++;
  else failed++;
  const marker = ok ? '✓' : '✗';
  const got = ok ? '' : `  (got ${actual.width}×${actual.height}, expected ${tc.expected.width}×${tc.expected.height})`;
  console.log(`${marker} ${tc.name}${got}`);
}

console.log(`\n${passed}/${cases.length} parseSvgDimensions cases passed` + (failed > 0 ? `  (${failed} failed)` : ''));

// Sanity: the real Tier-1 renderers use viewBox 520×360 from DIAGRAM_VIEWBOX,
// and the PDF exporter reserves 125mm for their fallback path. The aspect
// ratio check below catches regressions in DIAGRAM_VIEWBOX that would make
// the 125mm reservation inadequate.
import { DIAGRAM_VIEWBOX } from '../apps/marketing/src/lib/tutor/diagrams/layout';
const aspectRatio = DIAGRAM_VIEWBOX.height / DIAGRAM_VIEWBOX.width;
const contentWidthMm = 170; // typical A4 portrait content width after margins
const impliedHeightMm = aspectRatio * contentWidthMm;
const reservationMm = 125;
const withinBudget = impliedHeightMm <= reservationMm;
console.log(`\n${withinBudget ? '✓' : '✗'} DIAGRAM_VIEWBOX (${DIAGRAM_VIEWBOX.width}×${DIAGRAM_VIEWBOX.height}) implied PDF height ${impliedHeightMm.toFixed(1)}mm fits within ${reservationMm}mm reservation`);
if (!withinBudget) {
  console.error('  → pdf-tutor-session.ts "captured-SVG fallback reservation" (125mm) needs to be increased.');
  process.exit(1);
}

if (failed > 0) process.exit(1);
