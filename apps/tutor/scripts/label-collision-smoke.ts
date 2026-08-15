/**
 * Visual smoke for the label-collision battery: renders every fixture's real
 * component (the same LabelFixture[] the automated test asserts on) into one
 * PNG montage so a human can eyeball the de-overlap. Mafs-based fixtures
 * (diagram-renderer) need a browser to lay out, so they render fine here.
 *
 * Usage: npx tsx scripts/label-collision-smoke.ts <out.png>
 */
import * as fs from 'fs';
import * as path from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';
import type { LabelFixture } from './lib/label-collision-harness';

const OUT = process.argv[2] || '/tmp/label-collision-smoke.png';

async function main() {
  const dir = path.join(__dirname, 'label-collision-fixtures');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts')).sort();
  const cards: string[] = [];
  for (const file of files) {
    const mod = await import(path.join(dir, file));
    const fixtures: LabelFixture[] = mod.default;
    for (const f of fixtures) {
      let svg: string;
      try { svg = renderToStaticMarkup(f.element); }
      catch (e) { svg = `<div style="color:#b91c1c">render error: ${(e as Error).message}</div>`; }
      cards.push(`
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:10px;overflow:hidden">
          <div style="font-size:11px;color:#64748b;margin-bottom:6px;font-family:ui-monospace,monospace">${f.name}</div>
          <div style="max-width:100%;overflow:auto">${svg}</div>
        </div>`);
    }
  }
  const html = `<!doctype html><html><body style="font-family:system-ui;background:#f8fafc;margin:0;padding:16px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:1200px">${cards.join('')}</div>
  </body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1240, height: 1000 } });
  await page.setContent(html);
  await page.screenshot({ path: OUT, fullPage: true });
  await browser.close();
  console.log(`wrote ${OUT} (${cards.length} fixtures)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
