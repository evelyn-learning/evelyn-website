/**
 * Hero-image capture (Crimsora v2 Phase 2E, hero v2).
 *
 * Drives a REAL tutor session (same __tutorTestStart/__tutorSendText rig as
 * run.ts) with scripted student turns against local dev, using the silent
 * TTS mode (?tts=silent — no Cartesia/OpenAI spend), and screenshots the
 * LIVE session UI at several whiteboard-rich moments. The viewport is
 * exactly the marketing HeroFrame aspect (1600×820 logical) at
 * deviceScaleFactor 2, so the winning frame drops into
 * academy/apps/web/public/screenshots/hero-session.png (3200×1640) uncropped.
 *
 * Usage: npx ts-node -r tsconfig-paths/register --compiler-options \
 *          '{"module":"commonjs","baseUrl":"./"}' scripts/tutor-e2e/hero-capture.ts
 * Output: artifacts/hero-capture/<stamp>/*.png
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.TUTOR_E2E_URL || 'http://localhost:3006';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { __tutorTestStart: any; __tutorSendText: any; __tutorTestState: any; }
}

interface TestState { stage: string; brainBusy: boolean; connected: boolean; turnsCompleted: number; error: string | null }

const START = {
  subject: 'math',
  level: 'AP',
  topic: 'ap-stats',
  lessonPlanId: 'evelyn.ap.stats.binomial-distribution.v1',
  studentName: 'Maya',
};

// Scripted student turns building toward a visually rich board: worked
// combination/probability steps, then an explicit ask for a graph of the
// distribution (chart/Desmos render — the money shot).
const TURNS = [
  'Can we work through a binomial probability — say 2 successes out of 10 tries with a 0.3 chance each?',
  'I think 10 choose 2 is 45 — so what do we do with the 0.3 and the 0.7?',
  'So it’s 45 times 0.09 times 0.05765… about 0.2335, right?',
  'Can you show me what the whole distribution looks like as a graph?',
];

const log = (m: string) => console.log(`[hero-capture] ${m}`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = path.join(process.cwd(), 'artifacts', 'hero-capture', stamp);
  fs.mkdirSync(outDir, { recursive: true });
  log(`output → ${outDir}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({
    permissions: ['microphone'],
    viewport: { width: 1600, height: 820 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => log(`pageerror: ${e.message.slice(0, 120)}`));

  let shotN = 0;
  const shot = async (label: string) => {
    const file = `${String(shotN++).padStart(2, '0')}-${label}.png`;
    await page.screenshot({ path: path.join(outDir, file) });
    log(`shot: ${file}`);
  };
  const getState = () => page.evaluate(() => window.__tutorTestState() as TestState);

  // Quiescence bracket, same rationale as run.ts.
  const QUIET_MS = 3500;
  const waitForTurn = async (timeoutMs: number, what: string) => {
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
    log(`TIMEOUT waiting for turn: ${what}`);
  };
  const SETTLE_MS = 7500;

  try {
    log(`navigating to ${BASE_URL}/tutor?tts=silent`);
    await page.goto(`${BASE_URL}/tutor?tts=silent`, { waitUntil: 'domcontentloaded' });
    // Hide the Next.js dev-tools indicator (bottom-left "N" bubble) — it's a
    // dev-server overlay, not product UI, and it photobombed hero v2 rev 1.
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
    await page.waitForFunction(() => typeof window.__tutorTestStart === 'function', { timeout: 30_000 });

    log(`starting session: ${JSON.stringify(START)}`);
    await page.evaluate((cfg) => window.__tutorTestStart(cfg), START);
    {
      const deadline = Date.now() + 60_000;
      while (Date.now() < deadline && !(await getState()).connected) await sleep(500);
    }
    await sleep(3000);

    log('kickoff: [start lesson]');
    await page.evaluate(() => window.__tutorSendText('[start lesson]'));
    await waitForTurn(120_000, '[start lesson]');
    await sleep(SETTLE_MS);
    await shot('kickoff');

    for (let i = 0; i < TURNS.length; i++) {
      const say = TURNS[i];
      log(`turn-${i} say: ${say.slice(0, 70)}`);
      await page.evaluate((t) => window.__tutorSendText(t), say);
      if (i === TURNS.length - 1) {
        // Mid-speech candidate on the final (graph) turn: voice bars + caption
        // while the board is already rich.
        await sleep(12_000);
        await shot(`turn-${i}-midspeech`);
      }
      await waitForTurn(150_000, say);
      await sleep(SETTLE_MS);
      await shot(`turn-${i}-settled`);
    }

    // Drawer-open variant: transcript/chat panel over the finished board.
    try {
      await page.click('text=Transcript', { timeout: 5000 });
      await sleep(1200);
      await shot('final-drawer-open');
    } catch {
      log('transcript button not clickable — skipping drawer variant');
    }
  } finally {
    await browser.close();
  }
  log('done');
}

main().catch((e) => { console.error(e); process.exit(1); });
