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
import type { Scenario, ScenarioTurn, StudentProfile } from './types';
import { askClaude } from './llm';

/** Behavior directives per student profile — drive realistic, non-deterministic
 *  student turns. The "sometimes/often/frequently" cues inject variation so the
 *  tutor's coherence is tested against real situations, not an idealized learner. */
const PROFILE_BEHAVIORS: Record<StudentProfile, string> = {
  cooperative:
    'You are engaged and trying. Answer the tutor\'s questions and attempt the work yourself; being a little unsure or occasionally wrong is realistic. Keep moving forward.',
  struggling:
    'You find this genuinely hard. You often do NOT follow the explanation — ask "why?", say "I don\'t get it", give halting or partially-wrong attempts, and need things re-explained more simply before you can go on.',
  distractible:
    'Your attention drifts. You sometimes answer, but you frequently go off on tangents — ask whether this is on the exam, say it\'s boring, ask an unrelated question, or try to change the subject — and can be gently brought back.',
  skeptical:
    'You question things. When the tutor asserts an answer or step, sometimes push back — "are you sure?", "I think that\'s wrong", "why isn\'t it ___?" — even when the tutor is actually right, to see whether it holds its ground or wrongly caves.',
  'gives-up':
    'You disengage easily. After a little effort you tend to give up — "idk", "I\'m not sure", "can you just show me?" — and would rather the tutor reveal the answer than work it yourself.',
  'brings-problem':
    'You brought your OWN problem from homework. Open by asking the tutor to help with YOUR specific problem (state it with concrete numbers), and steer the session toward solving that one.',
};

const BASE_URL = process.env.TUTOR_E2E_URL || 'http://localhost:3006';
// Silent TTS by default (Crimsora v2 Phase 2E): automated runs must not
// burn Cartesia/OpenAI credits on audio nobody hears. The zero-filled
// silent buffers still drive sentence-start/drain, so render-sync works
// (and headless runs stop falling back to the 6s stall timer). For live
// ear-tests, opt back into a real engine: TUTOR_E2E_TTS=cartesia|mini.
const TTS_PARAM = process.env.TUTOR_E2E_TTS || 'silent';
// TUTOR_E2E_VIDEO=1 records a webm of the run into the bundle (UI-jank audits).
const VIDEO = process.env.TUTOR_E2E_VIDEO === '1';
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
  const context = await browser.newContext({
    permissions: ['microphone'],
    acceptDownloads: true,
    viewport: { width: 1440, height: 900 },
    ...(VIDEO ? { recordVideo: { dir: outDir, size: { width: 1440, height: 900 } } } : {}),
  });
  // Jank probe: buffer layout-shifts, long main-thread tasks, and scroll events
  // (with target + position) so a UI audit can quantify "jerky" — dumped to
  // perf.json in the bundle. Arrays are capped so a long run can't blow memory.
  await context.addInitScript(() => {
    const perf = { layoutShifts: [] as unknown[], longTasks: [] as unknown[], scrolls: [] as unknown[] };
    (window as unknown as Record<string, unknown>).__wbPerf = perf;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as Array<{ startTime: number; value: number; hadRecentInput: boolean; sources?: Array<{ node?: Node }> }>) {
          if (perf.layoutShifts.length >= 2000) return;
          perf.layoutShifts.push({
            t: Math.round(e.startTime), value: e.value, input: e.hadRecentInput,
            sources: (e.sources ?? []).map((s) => {
              const n = s.node as (Element | null);
              return n && n.nodeName ? `${n.nodeName}${n.className ? '.' + String(n.className).slice(0, 60) : ''}` : '?';
            }),
          });
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (perf.longTasks.length >= 2000) return;
          perf.longTasks.push({ t: Math.round(e.startTime), dur: Math.round(e.duration) });
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch { /* observer types unsupported — leave arrays empty */ }
    document.addEventListener('scroll', (ev) => {
      if (perf.scrolls.length >= 5000) return;
      const el = (ev.target === document ? document.scrollingElement : ev.target) as Element | null;
      perf.scrolls.push({
        t: Math.round(performance.now()),
        el: el ? `${el.nodeName}${el.className ? '.' + String(el.className).slice(0, 40) : ''}` : '?',
        top: el ? Math.round((el as HTMLElement).scrollTop) : 0,
      });
    }, { capture: true, passive: true });
  });
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
    log(`navigating to ${BASE_URL}/tutor?tts=${TTS_PARAM}`);
    await page.goto(`${BASE_URL}/tutor?tts=${TTS_PARAM}`, { waitUntil: 'domcontentloaded' });
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
      const fireTrigger = async () => {
        log(`trigger ${t.trigger}(${t.triggerArg ?? ''})`);
        await page.evaluate(({ trig, arg }) => (window as unknown as Record<string, (a?: string) => void>)[trig]?.(arg), { trig: t.trigger!, arg: t.triggerArg });
      };
      if (t.trigger && !t.triggerDelayMs) await fireTrigger();
      let delayedTrigger: Promise<void> | null = null;
      if (t.trigger && t.triggerDelayMs) {
        delayedTrigger = (async () => { await sleep(t.triggerDelayMs!); await fireTrigger(); })();
      }
      if (t.say) {
        const before = (await getState()).turnsCompleted;
        log(`${label} say: ${t.say.slice(0, 80)}`);
        await page.evaluate((text) => window.__tutorSendText(text), t.say);
        await waitForTurn(before, t.timeoutMs ?? 150_000, t.say);
        await delayedTrigger;
      }
      await sleep(SETTLE_MS); // let buffered renders flush + paint
      await shot(label);
    };

    let i = 0;
    for (const t of scenario.seedTurns ?? []) { await runTurn(t, 'seed', i++); }

    if (scenario.cooperativeStudent) {
      // LLM-driven cooperative student: read the tutor's last turn, reply as an
      // engaged student working toward the goal, so completion/coherence is
      // fairly tested (vs uncooperative fixed turns that change subject).
      const coop = scenario.cooperativeStudent;
      const turns = coop.turns ?? 6;
      const profile = coop.profile ?? 'cooperative';
      const persona = coop.persona ?? `a ${scenario.start.level} student`;
      // NOTE: the student LLM is deliberately NOT given coop.goal — that string
      // embeds the known ANSWER (for the judge). A student that "knows" the
      // answer is unrealistic and risks blurting it. The student works from its
      // opening message + the tutor's turns only.
      const sys = `You are ${persona} talking to your tutor in a one-on-one session. ${PROFILE_BEHAVIORS[profile]} Stay engaged with the problem/topic from your opening message; do NOT state a final answer unless you have actually worked it out with the tutor. Reply ONLY as the student, in ONE short, natural sentence — real students aren't formal: fillers, fragments, and being unsure are all fine, and vary your phrasing turn to turn. Never act as the tutor, never narrate stage directions, no quotation marks.`;
      let nextSay = coop.firstSay ?? 'Can we get started?';
      for (let k = 0; k < turns; k++) {
        const before = (await getState()).turnsCompleted;
        log(`coop-${k} say: ${nextSay.slice(0, 80)}`);
        await page.evaluate((text) => window.__tutorSendText(text), nextSay);
        await waitForTurn(before, 150_000, nextSay);
        await sleep(SETTLE_MS);
        await shot(`coop-${k}`);
        if (k === turns - 1) break;
        const tr = await page.evaluate(() =>
          (window.__tutorTestState() as { transcript?: Array<{ role: string; text: string }> }).transcript ?? []);
        const lastTutor = [...tr].reverse().find((e) => e.role === 'tutor')?.text ?? '';
        try {
          const reply = await askClaude(sys, `The tutor just said:\n"${lastTutor}"\n\nYour reply (one short sentence):`);
          nextSay = reply.replace(/^["']|["']$/g, '').replace(/^Student:\s*/i, '').trim() || 'Okay, what next?';
        } catch (e) {
          anomalies.push(`cooperative student LLM failed: ${(e as Error).message}`);
          nextSay = 'Okay, can you walk me through the next step?';
        }
      }
    } else {
      i = 0;
      for (const t of scenario.testTurns) { await runTurn(t, 'test', i++); }
    }

    if (typeof scenario.reloadAfterTurn === 'number') {
      log('resume check: hard reload');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => typeof window.__tutorTestState === 'function', { timeout: 30_000 }).catch(() => null);
      await sleep(2000);
      const cont = page.getByRole('button', { name: /continue lesson/i }).first();
      if (await cont.isVisible().catch(() => false)) await cont.click();
      await shot('resume-immediate');
      await sleep(3000);
      await shot('resume-settled');
    }

    // Export PDF (best-effort — capture the download).
    try {
      const btn = page.getByRole('button', { name: /export pdf/i }).first();
      if (await btn.isVisible()) {
        const dl = await Promise.all([page.waitForEvent('download', { timeout: 60_000 }), btn.click()]).then((r) => r[0]);
        await dl.saveAs(path.join(outDir, 'session.pdf'));
        log('saved session.pdf');
      } else { anomalies.push('Export PDF button not visible'); }
    } catch (e) { anomalies.push(`PDF export failed: ${(e as Error).message}`); }

    // Transcript dump — pull the FULL per-turn transcript off __tutorTestState
    // (untruncated; the console turn-ok lines cap spoken text at ~80 chars, which
    // is useless for the Phase-2 judge). Fall back to the console-derived lines
    // if the hook is unavailable.
    try {
      const turns = await page.evaluate(() =>
        (window.__tutorTestState() as { transcript?: Array<{ role: string; text: string }> }).transcript ?? []);
      if (turns.length > 0) {
        const full = turns.map((t) => `${t.role.toUpperCase()}: ${t.text}`).join('\n\n');
        fs.writeFileSync(path.join(outDir, 'transcript.txt'), full);
        fs.writeFileSync(path.join(outDir, 'transcript.json'), JSON.stringify(turns, null, 2));
        log(`saved transcript.txt (${turns.length} turns, full text)`);
      } else {
        const transcript = consoleLines
          .filter((l) => l.includes('[brain-orchestrator] turn ok') || l.includes('turn start, transcript:'))
          .map((l) => l.replace(/^\[\w+\]\s*/, ''));
        fs.writeFileSync(path.join(outDir, 'transcript.txt'), transcript.join('\n'));
        log('saved transcript.txt (console fallback — full transcript hook empty)');
      }
    } catch (e) { anomalies.push(`transcript dump failed: ${(e as Error).message}`); }

    // Debug-event telemetry (render-sync / kill-recovery / substitution). The
    // page POSTs these to /api/demos/session, which 500s headless, so pull them
    // straight off __tutorTestState (exposed for e2e). High-signal for studying
    // what paints/dims/rolls-back on a kill.
    try {
      const dbg = await page.evaluate(() => (window.__tutorTestState() as { debugEvents?: unknown[] }).debugEvents ?? []);
      fs.writeFileSync(path.join(outDir, 'debug-events.json'), JSON.stringify(dbg, null, 2));
      log(`saved debug-events.json (${(dbg as unknown[]).length} events)`);
    } catch (e) { anomalies.push(`debug-events dump failed: ${(e as Error).message}`); }

    // Jank-probe dump (layout shifts, long tasks, scroll events) → perf.json.
    try {
      const perf = await page.evaluate(() => (window as unknown as Record<string, unknown>).__wbPerf ?? null);
      if (perf) {
        fs.writeFileSync(path.join(outDir, 'perf.json'), JSON.stringify(perf, null, 2));
        const p = perf as { layoutShifts: unknown[]; longTasks: unknown[]; scrolls: unknown[] };
        log(`saved perf.json (${p.layoutShifts.length} layout-shifts, ${p.longTasks.length} long-tasks, ${p.scrolls.length} scroll events)`);
      }
    } catch (e) { anomalies.push(`perf dump failed: ${(e as Error).message}`); }
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
      ...(scenario.cooperativeStudent ? {
        cooperativeGoal: scenario.cooperativeStudent.goal,
        studentProfile: scenario.cooperativeStudent.profile ?? 'cooperative',
      } : {}),
      anomalies,
    };
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
    await browser.close();
    log(`done. ${anomalies.length} anomaly flag(s). Bundle: ${outDir}`);
    if (anomalies.length) { log('anomalies:'); anomalies.forEach((a) => log(`  - ${a}`)); }
  }
}

main();
