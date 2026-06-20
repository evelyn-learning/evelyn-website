/// <reference types="node" />
/**
 * Tutor e2e harness runner. See project_tutor_test_automation.
 *
 * Drives a REAL claude-brain tutor session in headless Chromium through the
 * typed-input path (window.__tutorSendText) and captures an artifact bundle
 * (console log + per-turn screenshots + PDF + transcript + summary) for review.
 *
 *   npm run test:tutor-e2e -- jee-conics-tangent
 *   npm run test:tutor-e2e -- jee-conics-tangent --headed   # watch it run
 *
 * Requires the dev server running on :3006 (npm run dev). Functional/visual
 * correctness scope: audio doesn't play headless, but renders/coherence/math
 * are driven by the brain independent of TTS, so they're fully exercised.
 */

import { chromium, type ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import type { Scenario, ScenarioTurn } from './types';

const BASE_URL = process.env.TUTOR_E2E_URL || 'http://localhost:3006';
const HEADED = process.argv.includes('--headed');
const scenarioName = process.argv.find((a) => !a.startsWith('-') && a !== process.argv[0] && a !== process.argv[1]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { __tutorTestStart: any; __tutorSendText: any; __tutorTestState: any; __tutorForceKill: any; __tutorForceFalseBargein: any; __tutorFlushRenderBuffer: any; } }

interface TestState { stage: string; brainBusy: boolean; connected: boolean; transcriptLen: number; turnsCompleted: number; error: string | null }

function log(msg: string) { console.log(`[tutor-e2e] ${msg}`); }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!scenarioName) { console.error('Usage: npm run test:tutor-e2e -- <scenario-name> [--headed]'); process.exit(1); }

  // Load scenario.
  let scenario: Scenario;
  try {
    scenario = (await import(`./scenarios/${scenarioName}`)).default as Scenario;
  } catch (e) {
    console.error(`Could not load scenario "${scenarioName}": ${(e as Error).message}`);
    process.exit(1);
  }

  // Dev-server reachability.
  try { await fetch(`${BASE_URL}/tutor`); }
  catch { console.error(`Dev server not reachable at ${BASE_URL}. Start it with: npm run dev`); process.exit(1); }

  // Artifact folder (timestamp from wall clock — this is a plain node script).
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = path.join(process.cwd(), 'artifacts', 'tutor-e2e', `${scenario.name}-${stamp}`);
  fs.mkdirSync(outDir, { recursive: true });
  log(`scenario "${scenario.name}" → ${outDir}`);

  const consoleLines: string[] = [];
  const anomalies: string[] = [];
  const browser = await chromium.launch({
    headless: !HEADED,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({ permissions: ['microphone'], acceptDownloads: true, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const netErrors = new Set<string>();
  page.on('console', (m: ConsoleMessage) => {
    consoleLines.push(`[${m.type()}] ${m.text()}`);
  });
  page.on('pageerror', (e) => { consoleLines.push(`[pageerror] ${e.message}`); anomalies.push(`pageerror: ${e.message.slice(0, 200)}`); });
  // Capture the URL behind any 4xx/5xx (the browser console only says
  // "Failed to load resource: 500" with no URL). Dedup by method+path+status.
  page.on('response', (r) => {
    const st = r.status();
    if (st < 400) return;
    const url = r.url();
    consoleLines.push(`[net ${st}] ${r.request().method()} ${url}`);
    const path0 = url.replace(BASE_URL, '').replace(/\?.*/, '');
    // session-usage is best-effort telemetry; its 500s are known-benign and
    // don't affect tutoring — don't flag them as anomalies (just log them).
    if (path0.includes('/api/tutor/session-usage')) return;
    netErrors.add(`HTTP ${st} ${r.request().method()} ${path0}`);
  });

  const shots: Array<{ label: string; file: string }> = [];
  async function shot(label: string) {
    const file = `${String(shots.length).padStart(2, '0')}-${label.replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}.png`;
    await page.screenshot({ path: path.join(outDir, file), fullPage: false });
    shots.push({ label, file });
    log(`screenshot: ${file}`);
  }
  const getState = () => page.evaluate(() => window.__tutorTestState() as TestState);

  // Bracket a turn: wait until the brain goes BUSY (turn started) and then
  // IDLE (turn done). Requiring sawBusy avoids returning prematurely on an
  // unrelated state tick — a brain turn always drives brainBusy true for
  // several seconds, so a 500ms poll never misses it.
  // Robust turn-sync via QUIESCENCE: (1) wait for the brain to go busy
  // (turn started), then (2) wait until it's been idle for QUIET_MS
  // continuously. This rides through the brain auto-chaining turns (a render
  // turn → a follow-up scribble turn) and isProcessing flicker, which the
  // earlier "busy→idle" bracket false-tripped on.
  const QUIET_MS = 3500;
  async function waitForTurn(_baseline: number, timeoutMs: number, what: string) {
    const startDeadline = Date.now() + 30_000;
    while (Date.now() < startDeadline && !(await getState()).brainBusy) await sleep(500);
    const deadline = Date.now() + timeoutMs;
    let lastBusy = Date.now();
    while (Date.now() < deadline) {
      const s = await getState();
      if (s.error) anomalies.push(`state.error during "${what}": ${s.error}`);
      if (s.brainBusy) lastBusy = Date.now();
      else if (Date.now() - lastBusy >= QUIET_MS) return s;
      await sleep(500);
    }
    anomalies.push(`TIMEOUT waiting for turn after "${what}" (${timeoutMs}ms)`);
    return getState();
  }
  // Headless = no audio playback, so render↔speech-sync flushes buffered
  // renders on its 6s STALL timer (not on sentence-start). Settle past that
  // + paint before screenshotting, else the figure isn't on the board yet.
  const SETTLE_MS = 7500;

  try {
    log(`navigating to ${BASE_URL}/tutor`);
    await page.goto(`${BASE_URL}/tutor`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof window.__tutorTestStart === 'function', { timeout: 30_000 });

    log(`starting session: ${JSON.stringify(scenario.start)}`);
    await page.evaluate((cfg) => window.__tutorTestStart(cfg), scenario.start);

    // Wait for the realtime handle + WS to be ready.
    log('waiting for connect…');
    {
      const deadline = Date.now() + 60_000;
      while (Date.now() < deadline && !(await getState()).connected) await sleep(500);
      if (!(await getState()).connected) anomalies.push('did not connect within 60s');
    }
    await sleep(3000); // WS settle

    // Drive the kickoff explicitly — the real flow fires it on the mic click
    // (handleMicClick), which doesn't happen headless. '[start lesson]' is the
    // same synthetic kickoff transcript; bracketed → treated as silent.
    log('kickoff: [start lesson]');
    {
      const before = (await getState()).turnsCompleted;
      await page.evaluate(() => window.__tutorSendText('[start lesson]'));
      await waitForTurn(before, 120_000, '[start lesson]');
    }
    await shot('after-kickoff');

    const runTurn = async (t: ScenarioTurn, kind: string, i: number) => {
      const label = `${kind}-${i}`;
      if (t.trigger) {
        log(`trigger ${t.trigger}(${t.triggerArg ?? ''})`);
        await page.evaluate(({ trig, arg }) => (window as unknown as Record<string, (a?: string) => void>)[trig]?.(arg), { trig: t.trigger, arg: t.triggerArg });
      }
      if (t.say) {
        const before = (await getState()).turnsCompleted;
        log(`${label} say: ${t.say.slice(0, 80)}`);
        await page.evaluate((text) => window.__tutorSendText(text), t.say);
        await waitForTurn(before, t.timeoutMs ?? 150_000, t.say);
      }
      await sleep(SETTLE_MS); // let buffered renders flush + paint
      await shot(label);
    };

    let i = 0;
    for (const t of scenario.seedTurns ?? []) { await runTurn(t, 'seed', i++); }
    i = 0;
    for (const t of scenario.testTurns) { await runTurn(t, 'test', i++); }

    // Export PDF (best-effort — capture the download).
    try {
      const btn = page.getByRole('button', { name: /export pdf/i }).first();
      if (await btn.isVisible()) {
        const dl = await Promise.all([page.waitForEvent('download', { timeout: 60_000 }), btn.click()]).then((r) => r[0]);
        await dl.saveAs(path.join(outDir, 'session.pdf'));
        log('saved session.pdf');
      } else { anomalies.push('Export PDF button not visible'); }
    } catch (e) { anomalies.push(`PDF export failed: ${(e as Error).message}`); }

    // Transcript dump — pull the brain's own per-turn log lines (reliable,
    // unlike scraping the chat DOM whose class names churn).
    const transcript = consoleLines
      .filter((l) => l.includes('[brain-orchestrator] turn ok') || l.includes('turn start, transcript:'))
      .map((l) => l.replace(/^\[\w+\]\s*/, ''));
    fs.writeFileSync(path.join(outDir, 'transcript.txt'), transcript.join('\n'));
  } catch (e) {
    anomalies.push(`FATAL: ${(e as Error).message}`);
    log(`FATAL: ${(e as Error).message}`);
    try { await shot('fatal'); } catch { /* ignore */ }
  } finally {
    fs.writeFileSync(path.join(outDir, 'console.log'), consoleLines.join('\n'));
    netErrors.forEach((e) => anomalies.push(e));
    const summary = {
      scenario: scenario.name,
      description: scenario.description,
      finishedAt: new Date().toISOString(),
      screenshots: shots,
      watchFor: [...(scenario.seedTurns ?? []), ...scenario.testTurns].map((t, i) => ({ turn: i, say: t.say, watchFor: t.watchFor })),
      anomalies,
    };
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
    await browser.close();
    log(`done. ${anomalies.length} anomaly flag(s). Bundle: ${outDir}`);
    if (anomalies.length) { log('anomalies:'); anomalies.forEach((a) => log(`  - ${a}`)); }
  }
}

main();
