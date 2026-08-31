/** One-turn live session to verify model-aware cost persistence (2026-08-30). One-off. */
import { chromium } from 'playwright';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const ctx = await browser.newContext({ permissions: ['microphone'] });
  const page = await ctx.newPage();
  await page.goto('https://www.evelynlearning.com/tutor?tts=silent', { waitUntil: 'networkidle' });
  await sleep(2000);
  await page.fill('input[placeholder="Enter your name"]', 'CostCheck Smoketest');
  await page.fill('input[type="email"]', 'deepseek-smoke-20260830@evelynlearning.com');
  await page.click('button:has-text("Area & Perimeter")');
  await sleep(800);
  await page.click('button:has-text("Start Voice Session")');
  await sleep(12000);
  const tap = page.locator('text=Tap to start');
  if (await tap.count()) await tap.first().click().catch(() => {});
  const box = page.locator('input[placeholder="Type here if you can\'t speak..."]');
  await box.waitFor({ state: 'visible', timeout: 90000 });
  await box.fill('What is the area of a 5 by 8 rectangle?');
  await box.press('Enter');
  await sleep(25000); // let the turn complete + the periodic saveSessionUsage fire
  const t = await page.evaluate(() => document.body.innerText);
  console.log('[tail]', t.slice(-300).replace(/\n+/g, ' | '));
  await sleep(10000);
  await browser.close();
  console.log('done');
})();
