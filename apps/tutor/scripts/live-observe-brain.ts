/**
 * Live observation session (brain-model evaluation, 2026-08-31): drives a
 * multi-turn prod session probing verdict correctness (right + wrong student
 * answers) and self-initiated rendering, then prints the full transcript.
 */
import { chromium } from 'playwright';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const NAME = process.argv[2] || 'HaikuObserve Smoketest';
const CARD = process.argv[3] || 'Area & Perimeter';
const DEFAULT_TURNS = [
  'What is the area of a 5 by 8 rectangle?',
  'I think it is 40 square units.',                       // correct — expect affirmation
  'And the perimeter of that same rectangle is 13, right?', // WRONG (26) — expect correction
  'Hmm, can you draw a different rectangle on the board and let me try that one?', // render probe
  'Okay for your new rectangle I say the area is 54.',     // graded against ITS OWN problem
];
const TURNS = process.env.OBSERVE_TURNS ? JSON.parse(process.env.OBSERVE_TURNS) as string[] : DEFAULT_TURNS;
(async () => {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const ctx = await browser.newContext({ permissions: ['microphone'] });
  const page = await ctx.newPage();
  await page.goto('https://www.evelynlearning.com/tutor?tts=silent', { waitUntil: 'networkidle' });
  await sleep(2000);
  await page.fill('input[placeholder="Enter your name"]', NAME);
  await page.fill('input[type="email"]', 'deepseek-smoke-20260830@evelynlearning.com');
  await page.click(`button:has-text("${CARD}")`);
  await sleep(800);
  await page.click('button:has-text("Start Voice Session")');
  await sleep(12000);
  const tap = page.locator('text=Tap to start');
  if (await tap.count()) await tap.first().click().catch(() => {});
  const box = page.locator('input[placeholder="Type here if you can\'t speak..."]');
  await box.waitFor({ state: 'visible', timeout: 90000 });
  await sleep(6000);
  for (const [i, turn] of TURNS.entries()) {
    await box.fill(turn);
    await box.press('Enter');
    // Wait for the reply to land (turn text appears + ~fixed settle time).
    for (let w = 0; w < 30; w++) {
      await sleep(2000);
      const t = await page.evaluate(() => document.body.innerText);
      if (t.includes(turn.slice(0, 24))) break;
    }
    await sleep(14000);
    console.log(`— turn ${i + 1} sent`);
  }
  await sleep(8000);
  const transcript = await page.evaluate(() => {
    const el = [...document.querySelectorAll('*')].find((e) => e.textContent?.trim() === 'Transcript');
    return (el?.parentElement?.innerText ?? document.body.innerText);
  });
  console.log('\n===== TRANSCRIPT =====\n' + transcript.slice(-3500));
  await page.screenshot({ path: `/tmp/observe-${Date.now()}.png`, fullPage: false });
  await browser.close();
})();
