/**
 * Deterministic repro driver for the T1 "duplicate turn 2–3" hiccup
 * (2026-07-04): a student reply sent while the tutor's previous turn is
 * still speaking (TTS in flight) vanished — no student transcript entry,
 * no brain turn — so the pedagogy harness re-captured the same tutor text
 * as two consecutive turns.
 *
 * The stock harness only hits that window by luck (it waits for brain
 * quiescence + settle before replying). This driver FORCES the window:
 * as soon as a NEW tutor transcript entry appears (text stream landed,
 * TTS still playing), it waits a short beat and fires a canned reply.
 *
 * Usage: npx tsx scripts/tutor/pedagogy-harness/repro-midtts-send.ts [--turns 5] [--beat-ms 2000]
 * Requires the dev server (npm run dev, port 3006).
 *
 * Verdict per send: did a student entry with our text appear in the
 * transcript within the follow-up window, and did a NEW tutor entry follow?
 * Artifacts (console.log, transcript.json, verdicts) land in
 * artifacts/pedagogy-harness/repro-midtts-<stamp>/.
 */
import { chromium, type ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { loadPersona } from './fixtures/personas';
import { personaToPickerStart } from './run-harness';

interface StateShape {
  brainBusy: boolean;
  connected: boolean;
  transcript?: Array<{ role: string; text: string }>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const log = (m: string) => console.log(`[repro-midtts] ${m}`);

const argv = process.argv.slice(2);
function argNum(flag: string, dflt: number): number {
  const i = argv.indexOf(flag);
  if (i >= 0 && argv[i + 1]) { const v = Number(argv[i + 1]); if (!Number.isNaN(v)) return v; }
  return dflt;
}
const MAX_TURNS = argNum('--turns', 5);
const BEAT_MS = argNum('--beat-ms', 2000);
const BASE_URL = process.env.TUTOR_E2E_URL ?? 'http://localhost:3006';

const CANNED_REPLIES = [
  'Okay, so one of the factors has to be zero, right?',
  'Hmm, I think x would be negative 2 then. Is that right?',
  'And the other one would make x negative 3?',
  'So both of those are solutions to the equation?',
  'Got it. Can we try another problem like this one?',
  'Sure, let me look at it. What should I do first?',
  'I think I move everything to one side first?',
];

async function main() {
  const persona = loadPersona('maya');
  const start = personaToPickerStart(persona, { teacherId: 'ms-elena-vasquez' });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = path.join(process.cwd(), 'artifacts', 'pedagogy-harness', `repro-midtts-${stamp}`);
  fs.mkdirSync(outDir, { recursive: true });
  log(`artifacts → ${outDir}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleLines: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    consoleLines.push(`[${new Date().toISOString()}] [${m.type()}] ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleLines.push(`[${new Date().toISOString()}] [pageerror] ${e.message}`));

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getState = (): Promise<StateShape> => page.evaluate(() => (window as any).__tutorTestState());
  const sendText = (text: string) => page.evaluate((t) => (window as any).__tutorSendText(t), text);

  const verdicts: Array<{ turn: number; sent: string; studentEntryAppeared: boolean; newTutorEntryAppeared: boolean; sentAtTutorCount: number }> = [];

  try {
    await page.goto(`${BASE_URL}/tutor`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof (window as any).__tutorTestStart === 'function', { timeout: 30_000 });
    log(`starting session: ${JSON.stringify(start).slice(0, 200)}`);
    await page.evaluate((cfg) => (window as any).__tutorTestStart(cfg), start);
    {
      const deadline = Date.now() + 60_000;
      while (Date.now() < deadline && !(await getState()).connected) await sleep(500);
    }
    await sleep(3000);
    log('kickoff: [start lesson]');
    await sendText('[start lesson]');

    const tutorEntries = (s: StateShape) => (s.transcript ?? []).filter((e) => e.role === 'tutor');
    const studentEntries = (s: StateShape) => (s.transcript ?? []).filter((e) => e.role === 'student');
    let lastTutorCount = 0;

    for (let i = 0; i < MAX_TURNS; i++) {
      // Wait for a NEW tutor entry (the moment the streaming bubble lands —
      // TTS for it is still playing / captions still revealing).
      const deadline = Date.now() + 120_000;
      let state = await getState();
      while (Date.now() < deadline && tutorEntries(state).length <= lastTutorCount) {
        await sleep(250);
        state = await getState();
      }
      const tCount = tutorEntries(state).length;
      if (tCount <= lastTutorCount) {
        log(`TIMEOUT waiting for tutor turn ${i} — aborting loop`);
        break;
      }
      lastTutorCount = tCount;
      const lastTutor = tutorEntries(state)[tCount - 1];
      log(`turn ${i}: new tutor entry #${tCount}: "${(lastTutor?.text ?? '').slice(0, 70)}"`);

      // THE WINDOW: reply a beat after the entry appears, while TTS is
      // still delivering the turn.
      await sleep(BEAT_MS);
      const reply = CANNED_REPLIES[i % CANNED_REPLIES.length];
      const preStudent = studentEntries(await getState()).length;
      log(`turn ${i}: sending mid-TTS reply: "${reply}"`);
      await sendText(reply);

      // Verdict window: 45s for the student entry + a new tutor turn.
      let studentEntryAppeared = false;
      let newTutorEntryAppeared = false;
      const vDeadline = Date.now() + 45_000;
      while (Date.now() < vDeadline) {
        const s = await getState();
        if (!studentEntryAppeared && studentEntries(s).length > preStudent) studentEntryAppeared = true;
        if (tutorEntries(s).length > lastTutorCount) { newTutorEntryAppeared = true; break; }
        await sleep(500);
      }
      verdicts.push({ turn: i, sent: reply, studentEntryAppeared, newTutorEntryAppeared, sentAtTutorCount: tCount });
      log(`turn ${i}: verdict — studentEntry=${studentEntryAppeared} newTutorEntry=${newTutorEntryAppeared}`);
      await page.screenshot({ path: path.join(outDir, `${String(i).padStart(2, '0')}-after-turn-${i}.png`), fullPage: false });
    }

    const finalState = await getState();
    fs.writeFileSync(path.join(outDir, 'transcript.json'), JSON.stringify(finalState.transcript ?? [], null, 2));
    fs.writeFileSync(path.join(outDir, 'verdicts.json'), JSON.stringify(verdicts, null, 2));

    const dropped = verdicts.filter((v) => !v.studentEntryAppeared || !v.newTutorEntryAppeared);
    log('');
    log(`==== RESULT: ${verdicts.length} mid-TTS sends, ${dropped.length} swallowed ====`);
    for (const v of dropped) log(`  SWALLOWED turn ${v.turn}: "${v.sent}" (studentEntry=${v.studentEntryAppeared}, newTutor=${v.newTutorEntryAppeared})`);
    if (dropped.length === 0) log('  no drops this run — window not hit, or bug needs another trigger');
  } finally {
    fs.writeFileSync(path.join(outDir, 'console.log'), consoleLines.join('\n'));
    await browser.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
