/**
 * Visual smoke for the 2026-07-19 label-collision fixes: renders the exact
 * payloads from sessions 1784320013977 (FBD wall-push) and 1784182146307 /
 * 1784194326500 (number-line diameter) plus two stress cases to one PNG.
 *
 * Usage: npx tsx scripts/label-collision-smoke.ts <out.png>
 */
import * as fs from 'fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import FreeBodyDiagramRenderer from '../src/app/tutor/components/whiteboard/FreeBodyDiagramRenderer';
import { NumberLineRenderer } from '../src/app/tutor/components/whiteboard/NumberLineRenderer';

const OUT = process.argv[2] || '/tmp/label-collision-smoke.png';

const cards: { title: string; el: React.ReactElement }[] = [
  {
    title: 'session-1784320013977 — FBD, opposed horizontal forces on "You"',
    el: React.createElement(FreeBodyDiagramRenderer, {
      title: 'You push a wall... does it push back?',
      object: { label: 'You', shape: 'person' as const },
      surface: { type: 'none' as const },
      forces: [
        { name: 'Push on wall', magnitude: 'F', direction: 'right' as const },
        { name: 'Wall pushes back', magnitude: 'F', direction: 'left' as const },
      ],
    }),
  },
  {
    title: 'FBD stress — 4 forces, box on ground, wide caption',
    el: React.createElement(FreeBodyDiagramRenderer, {
      object: { shape: 'box' as const, mass: 'm = 5 kg' },
      surface: { type: 'horizontal' as const },
      forces: [
        { name: 'N', direction: 'up' as const },
        { name: 'W', magnitude: 'mg', direction: 'down' as const },
        { name: 'F_app', magnitude: '20 N', direction: 'right' as const },
        { name: 'f_k', magnitude: '8 N', direction: 'left' as const },
      ],
    }),
  },
  {
    title: 'session-1784182146307 — number line, segment vs point label',
    el: React.createElement(NumberLineRenderer, {
      min: 0, max: 4, step: 1,
      points: [{ value: 1, label: 'diameter piece', color: '#3b82f6' }],
      segments: [
        { from: 0, to: 1, label: 'diameter', color: '#2563eb' },
        { from: 1, to: 4, label: 'wrap ≈ 3.14 diameters', color: '#92400e' },
      ],
    }),
  },
  {
    title: 'number-line stress — interval + clustered points',
    el: React.createElement(NumberLineRenderer, {
      min: -2, max: 6, step: 1,
      intervals: [{ from: 0, to: 3, label: 'solution set', fromInclusive: true, toInclusive: false }],
      points: [
        { value: 0, label: 'start' },
        { value: 3, label: 'boundary', style: 'open' as const },
        { value: 1.5, label: 'midpoint' },
      ],
    }),
  },
];

async function main() {
  const html = `<!doctype html><html><body style="font-family:system-ui;background:#f8fafc;margin:0;padding:16px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:1100px">
      ${cards.map((c) => `
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:10px">
          <div style="font-size:12px;color:#475569;margin-bottom:6px">${c.title}</div>
          ${renderToStaticMarkup(c.el)}
        </div>`).join('')}
    </div></body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1160, height: 900 } });
  await page.setContent(html);
  await page.screenshot({ path: OUT, fullPage: true });
  await browser.close();
  console.log(`wrote ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
