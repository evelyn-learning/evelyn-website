/// <reference types="node" />
/**
 * Layer-2 fixture harvester (brain-in-the-loop).
 *
 * Drives a few REAL claude-brain Macro sessions through targeted typed
 * utterances and captures the RAW {tool, args} the brain emits (via the
 * dev-only window.__tutorToolCalls hook). Output:
 *   - one Layer-1 fixture per distinct tool/kind it emitted (harvested-*.json)
 *   - a reconcile report vs the curated expected-tool set
 *
 *   TUTOR_E2E_URL=http://localhost:3007 npm run test:render-harvest -- macro
 *
 * Requires a healthy dev server. Spends API tokens (real brain turns).
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.TUTOR_E2E_URL || 'http://localhost:3006';
const HEADED = process.argv.includes('--headed');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { __tutorTestStart: any; __tutorSendText: any; __tutorTestState: any; __tutorToolCalls: any; } }
interface TestState { brainBusy: boolean; connected: boolean; turnsCompleted: number; error: string | null }
interface ToolCall { name: string; args: Record<string, unknown> }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function log(m: string) { console.log(`[harvest] ${m}`); }

// ---- per-course harvest configs (scripted, tool-targeted) ----
// Each session: a BASE turn, then (where meaningful) a follow-up turn that
// exercises a related/dynamic render — the more bug-prone param path.
interface CourseConfig {
  start: { subject: string; level: string; topic: string; studentName: string };
  idPrefix: string;
  sessions: Array<{ plan: string; says: string[] }>;
  expected: string[];
}
const COURSES: Record<string, CourseConfig> = {
  macro: {
    start: { subject: 'social-studies', level: 'AP', topic: 'ap-macroeconomics', studentName: 'Harvest' },
    idPrefix: 'evelyn.ap.macro.',
    sessions: [
      { plan: 'evelyn.ap.macro.equilibrium-ad-as.v1', says: [
        'Draw the AD-AS diagram showing long-run equilibrium.',
        'Now show what happens when aggregate demand increases — shift AD to the right and mark the new equilibrium.' ] },
      { plan: 'evelyn.ap.macro.money-market.v1', says: [
        'Draw the money market graph.',
        'Now show what happens when the Fed increases the money supply — shift MS right and mark the new lower interest rate.' ] },
      { plan: 'evelyn.ap.macro.loanable-funds-market.v1', says: [
        'Draw the loanable funds market.',
        'Now show crowding out — a large government deficit raises the demand for loanable funds and pushes the real interest rate up.' ] },
      { plan: 'evelyn.ap.macro.phillips-curve.v1', says: [
        'Draw the short-run Phillips curve.',
        'Now add the long-run Phillips curve (vertical at the natural rate) and show what happens when inflation expectations rise — shift the short-run Phillips curve up.' ] },
      { plan: 'evelyn.ap.macro.ppc.v1', says: [
        'Draw a production possibilities curve and mark an efficient point, an inefficient point, and an unattainable point.',
        'Now show economic growth — shift the production possibilities curve outward.' ] },
      { plan: 'evelyn.ap.macro.fx-market.v1', says: [
        'Draw the foreign exchange market for the US dollar.',
        'Now show the dollar appreciating — shift the demand for dollars to the right and mark the new exchange rate.' ] },
      { plan: 'evelyn.ap.macro.business-cycle.v1', says: [
        'Show the business cycle diagram with expansion, peak, recession, and trough.' ] },
    ],
    expected: [
      'show_diagram:aggregate_demand_supply', 'show_diagram:money_market', 'show_diagram:loanable_funds',
      'show_diagram:phillips_curve', 'show_diagram:foreign_exchange_market', 'show_diagram:production_possibilities',
      'show_diagram:business_cycle', 'show_equation', 'show_table',
    ],
  },
  stats: {
    start: { subject: 'math', level: 'AP', topic: 'ap-stats', studentName: 'Harvest' },
    idPrefix: 'evelyn.ap.stats.',
    sessions: [
      { plan: 'evelyn.ap.stats.quantitative-graphs.v1', says: [
        'Make a histogram of a sample of 40 exam scores.',
        'Now show the same data as a dotplot.' ] },
      { plan: 'evelyn.ap.stats.normal-distribution.v1', says: [
        'Draw a normal distribution curve.',
        'Now shade the region within one standard deviation of the mean.' ] },
      { plan: 'evelyn.ap.stats.summary-statistics.v1', says: [
        'Make a boxplot of a sample of data and mark the five-number summary.' ] },
      { plan: 'evelyn.ap.stats.scatterplots.v1', says: [
        'Make a scatterplot of height versus weight for a sample of students.' ] },
      { plan: 'evelyn.ap.stats.linear-regression.v1', says: [
        'Make a scatterplot of the data and add the least-squares regression line.' ] },
      { plan: 'evelyn.ap.stats.two-categorical-relationships.v1', says: [
        'Make a two-way table of survey responses (likes coffee: yes/no) by class year.' ] },
      { plan: 'evelyn.ap.stats.probability-basics.v1', says: [
        'Draw a probability tree for flipping a fair coin twice.',
        'Now draw a Venn diagram for two events A and B that can overlap.' ] },
    ],
    expected: [
      'show_stats', 'show_diagram:normal_curve', 'show_diagram:scatterplot_regression', 'show_diagram:histogram',
      'show_scatter_plot', 'show_table', 'show_tree', 'show_venn_diagram', 'show_equation',
    ],
  },
  calcbc: {
    start: { subject: 'math', level: 'AP', topic: 'ap-calcbc', studentName: 'Harvest' },
    idPrefix: 'evelyn.ap.calcbc.',
    sessions: [
      { plan: 'evelyn.ap.calcbc.riemann-sums.v1', says: [
        'Draw a left Riemann sum with 6 rectangles approximating the area under a curve.',
        'Now show the midpoint Riemann sum for the same curve.' ] },
      { plan: 'evelyn.ap.calcbc.slope-fields.v1', says: [
        'Draw the slope field for the differential equation dy/dx = x - y.' ] },
      { plan: 'evelyn.ap.calcbc.polar-coordinates.v1', says: [
        'Graph the polar curve r = 2 + 2 cos(theta), a cardioid.' ] },
      { plan: 'evelyn.ap.calcbc.parametric.v1', says: [
        'Graph the parametric curve x = cos(t), y = sin(t) for t from 0 to 2 pi.' ] },
      { plan: 'evelyn.ap.calcbc.taylor-polynomial.v1', says: [
        'Show the degree-4 Taylor polynomial approximation of e^x overlaid on the function.' ] },
      { plan: 'evelyn.ap.calcbc.first-derivative-analysis.v1', says: [
        'Graph f of x equals x cubed minus 3x, and mark where it is increasing and decreasing.' ] },
    ],
    expected: [
      'show_diagram:riemann_sum', 'show_diagram:slope_field', 'show_diagram:polar_graph',
      'show_diagram:parametric_curve', 'show_diagram:taylor_polynomial_overlay',
      'show_function_graph', 'show_equation', 'show_table',
    ],
  },
};
const course = process.argv.find((a, i) => i >= 2 && !a.startsWith('-')) || '';
const cfg = COURSES[course];
if (!cfg) { console.error(`Usage: npm run test:render-harvest -- <course>  (known: ${Object.keys(COURSES).join(', ')})`); process.exit(1); }

/** identity used for dedup/reconcile — show_diagram is keyed by its kind. */
function ident(c: ToolCall): string {
  if (c.name === 'show_diagram' && c.args && typeof c.args.type === 'string') return `show_diagram:${c.args.type}`;
  return c.name;
}
function safeName(id: string): string { return id.replace(/[^a-z0-9]+/gi, '-'); }

async function main() {
  const fixturesDir = path.join(__dirname, 'fixtures', course);
  fs.mkdirSync(fixturesDir, { recursive: true });

  const browser = await chromium.launch({
    headless: !HEADED,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const getState = () => page.evaluate(() => window.__tutorTestState() as TestState);

  const QUIET_MS = 3500;
  async function waitForTurn(timeoutMs: number, what: string): Promise<void> {
    const startDeadline = Date.now() + 30_000;
    while (Date.now() < startDeadline && !(await getState()).brainBusy) await sleep(500);
    const deadline = Date.now() + timeoutMs;
    let lastBusy = Date.now();
    while (Date.now() < deadline) {
      const s = await getState();
      if (s.brainBusy) lastBusy = Date.now();
      else if (Date.now() - lastBusy >= QUIET_MS) return;
      await sleep(500);
    }
    log(`  ! timeout waiting for turn: ${what}`);
  }

  const allCalls: Array<ToolCall & { session: string }> = [];

  for (const sess of cfg.sessions) {
    const label = sess.plan.replace(cfg.idPrefix, '').replace('.v1', '');
    log(`session: ${label}`);
    try {
      let navOk = false;
      for (let attempt = 0; attempt < 2 && !navOk; attempt++) {
        try {
          await page.goto(`${BASE_URL}/tutor`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
          await page.waitForFunction(() => typeof window.__tutorTestStart === 'function', { timeout: 45_000 });
          navOk = true;
        } catch (e) { log(`  ! nav attempt ${attempt + 1} failed: ${e instanceof Error ? e.message : String(e)}`); }
      }
      if (!navOk) { log('  ! could not load /tutor — skipping'); continue; }
      await page.evaluate((c) => window.__tutorTestStart(c), { ...cfg.start, lessonPlanId: sess.plan });
      // wait for connect
      const cd = Date.now() + 60_000;
      while (Date.now() < cd && !(await getState()).connected) await sleep(500);
      if (!(await getState()).connected) { log('  ! did not connect — skipping'); continue; }
      await sleep(3000);
      // kickoff
      await page.evaluate(() => window.__tutorSendText('[start lesson]'));
      await waitForTurn(120_000, 'kickoff');
      // targeted utterances
      for (const say of sess.says) {
        log(`  say: ${say.slice(0, 70)}…`);
        await page.evaluate((t) => window.__tutorSendText(t), say);
        await waitForTurn(150_000, say);
        await sleep(2000);
      }
      const calls = (await page.evaluate(() => window.__tutorToolCalls || [])) as ToolCall[];
      log(`  → ${calls.length} tool calls: ${[...new Set(calls.map(ident))].join(', ') || '(none)'}`);
      calls.forEach((c) => allCalls.push({ ...c, session: label }));
    } catch (e) {
      log(`  ! session error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await browser.close();

  // Clear prior harvested fixtures + report (keep _smoke-*).
  for (const f of fs.readdirSync(fixturesDir)) {
    if (f.startsWith('harvested-') || f === '_harvest-report.json') fs.unlinkSync(path.join(fixturesDir, f));
  }

  const argHash = (o: unknown) => { const s = JSON.stringify(o); let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i); return (h >>> 0).toString(36); };

  // Keep every DISTINCT payload (base vs shifted differ), keyed by ident+hash.
  const seen = new Map<string, ToolCall & { session: string }>();
  for (const c of allCalls) { const key = `${ident(c)}|${argHash(c.args)}`; if (!seen.has(key)) seen.set(key, c); }

  const variantsPerIdent = new Map<string, number>();
  for (const c of seen.values()) variantsPerIdent.set(ident(c), (variantsPerIdent.get(ident(c)) || 0) + 1);

  const written: string[] = [];
  const idxPerIdent = new Map<string, number>();
  for (const c of seen.values()) {
    const id = ident(c);
    const n = (idxPerIdent.get(id) || 0) + 1; idxPerIdent.set(id, n);
    const suffix = (variantsPerIdent.get(id) || 1) > 1 ? `-v${n}` : '';
    const label = `harvested-${safeName(id)}${suffix}`;
    fs.writeFileSync(path.join(fixturesDir, `${label}.json`), JSON.stringify({ tool: c.name, args: c.args, label, _source: c.session }, null, 2) + '\n');
    written.push(`${label}.json`);
  }

  const fired = [...new Set([...seen.values()].map(ident))];
  const missing = cfg.expected.filter((e) => !fired.includes(e));
  const unexpected = fired.filter((f) => !cfg.expected.includes(f));
  const report = {
    course, sessions: cfg.sessions.length, totalToolCalls: allCalls.length,
    expected: cfg.expected, fired, missing, unexpected,
    variantsPerIdent: Object.fromEntries(variantsPerIdent),
    fixturesWritten: written,
  };
  fs.writeFileSync(path.join(fixturesDir, '_harvest-report.json'), JSON.stringify(report, null, 2) + '\n');

  log(`\n===== HARVEST RECONCILE (${course}) =====`);
  log(`tool calls captured: ${allCalls.length} across ${cfg.sessions.length} sessions`);
  log(`distinct tools/kinds fired (${fired.length}): ${fired.join(', ')}`);
  log(`variants captured per kind (base + shifted): ${[...variantsPerIdent.entries()].map(([k, v]) => `${k}×${v}`).join(', ')}`);
  log(`EXPECTED but NOT fired (${missing.length}): ${missing.join(', ') || '— none —'}`);
  log(`fired but NOT expected (${unexpected.length}): ${unexpected.join(', ') || '— none —'}`);
  log(`fixtures written: ${written.length} → scripts/tutor-render-harness/fixtures/${course}/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
