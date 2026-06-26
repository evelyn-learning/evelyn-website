/// <reference types="node" />
/**
 * Whiteboard render-harness runner (Layer 1 — deterministic).
 *
 * Drives each tool-call fixture through /tutor/render-harness in headless
 * Chromium and captures a screenshot + the deterministic __renderResult.
 * No brain, no session — same input → same output every run.
 *
 *   npm run test:render-tools -- macro
 *   npm run test:render-tools -- macro --headed
 *
 * Requires the dev server on :3006 (npm run dev). Reads fixtures from
 * scripts/tutor-render-harness/fixtures/<course>/*.json — each file is a
 * single { tool, args, label? } or an array of them.
 *
 * Deterministic GATE: pass = not rejected AND no render error AND no page
 * error. (The "looks right" check is the separate vision-judge, judge.ts.)
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.TUTOR_E2E_URL || 'http://localhost:3006';
const HEADED = process.argv.includes('--headed');
const course = process.argv.find((a, i) => i >= 2 && !a.startsWith('-'));

type Expect = 'render' | 'rejected';
interface Fixture { tool: string; args: Record<string, unknown>; label: string; expect: Expect; }
interface RenderResult { rejected: boolean; reason?: string; action?: string; error?: string | null; }
interface FixtureResult extends RenderResult { label: string; tool: string; expect: Expect; pass: boolean; pageError?: string; screenshot: string; }

function log(m: string) { console.log(`[render-harness] ${m}`); }

function loadFixtures(courseName: string): Fixture[] {
  const dir = path.join(__dirname, 'fixtures', courseName);
  if (!fs.existsSync(dir)) { console.error(`No fixtures dir: ${dir}`); process.exit(1); }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  const out: Fixture[] = [];
  for (const f of files) {
    const base = f.replace(/\.json$/, '');
    const raw = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const items = Array.isArray(raw) ? raw : [raw];
    items.forEach((it: { tool?: string; args?: Record<string, unknown>; label?: string; expect?: Expect }, i: number) => {
      if (typeof it.tool !== 'string') return; // skip non-fixture JSON (e.g. _harvest-report.json)
      out.push({ tool: it.tool, args: it.args ?? {}, label: it.label || (items.length > 1 ? `${base}-${i}` : base), expect: it.expect ?? 'render' });
    });
  }
  return out;
}

async function main() {
  if (!course) { console.error('Usage: npm run test:render-tools -- <course> [--headed]'); process.exit(1); }
  const fixtures = loadFixtures(course);
  log(`${fixtures.length} fixtures for ${course}`);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(process.cwd(), 'artifacts', 'tutor-render-harness', `${course}-${stamp}`);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: !HEADED });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const results: FixtureResult[] = [];

  // Warm: load the route once (first-compile may be slow) and wait for the
  // client component to mount (it sets __renderResult even with no fixture).
  log('Warming route (first client compile)…');
  await page.goto(`${BASE_URL}/tutor/render-harness`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => (window as unknown as { __renderResult?: unknown }).__renderResult !== undefined, { timeout: 120000 });
  // Best-effort: wait for Desmos so graph fixtures render via the production
  // DesmosGraphRenderer (not the Mafs fallback). If it doesn't load, graphs
  // still render via Mafs — they just won't exercise the primary path.
  await page.waitForFunction(() => !!(window as unknown as { Desmos?: unknown }).Desmos, { timeout: 30000 })
    .then(() => log('Desmos loaded — graph fixtures use the primary renderer'))
    .catch(() => log('Desmos did NOT load — graph fixtures fall back to Mafs'));

  for (let i = 0; i < fixtures.length; i++) {
    const fx = fixtures[i];
    const num = String(i + 1).padStart(2, '0');
    let pageError = '';
    page.removeAllListeners('pageerror');
    page.on('pageerror', (e) => { pageError = e.message; });

    const b64 = Buffer.from(JSON.stringify({ tool: fx.tool, args: fx.args }), 'utf8').toString('base64');
    let rr: RenderResult = { rejected: false, error: 'no __renderResult' };
    try {
      // Hash-only navigation: clear the prior result and set the hash, which
      // fires `hashchange` → the route re-processes this fixture.
      await page.evaluate((h) => {
        (window as unknown as { __renderResult?: unknown }).__renderResult = undefined;
        window.location.hash = h;
      }, b64);
      await page.waitForFunction(() => (window as unknown as { __renderResult?: unknown }).__renderResult !== undefined, { timeout: 30000 });
      // settle async renderers + any error-boundary catch. Graph fixtures render
      // through Desmos (async script + calculator paint), so give them longer.
      const action0 = await page.evaluate(() => (window as unknown as { __renderResult?: { action?: string } }).__renderResult?.action);
      await page.waitForTimeout(action0 === 'showGraph' ? 3000 : 900);
      rr = await page.evaluate(() => (window as unknown as { __renderResult: RenderResult }).__renderResult);
    } catch (e) {
      rr = { rejected: false, error: e instanceof Error ? e.message : String(e) };
    }
    const shot = `${num}-${fx.label}.png`;
    await page.screenshot({ path: path.join(outDir, shot) }).catch(() => {});
    const pass = fx.expect === 'rejected'
      ? rr.rejected === true
      : !rr.rejected && !rr.error && !pageError;
    results.push({ ...rr, label: fx.label, tool: fx.tool, expect: fx.expect, pass, pageError: pageError || undefined, screenshot: shot });
    log(`${pass ? 'PASS' : 'FAIL'}  ${fx.label} (${fx.tool}, expect=${fx.expect})${rr.rejected ? ` — rejected: ${rr.reason}` : ''}${rr.error ? ` — error: ${rr.error}` : ''}${pageError ? ` — pageerror: ${pageError}` : ''}`);
  }

  await browser.close();

  const passCount = results.filter((r) => r.pass).length;
  const summary = { course, baseUrl: BASE_URL, total: results.length, passed: passCount, failed: results.length - passCount, results };
  fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(summary, null, 2));
  log(`\n${passCount}/${results.length} passed · bundle: ${path.relative(process.cwd(), outDir)}`);
  if (passCount < results.length) {
    log('Failures: ' + results.filter((r) => !r.pass).map((r) => r.label).join(', '));
    process.exitCode = 1;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
