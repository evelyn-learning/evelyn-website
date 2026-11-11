/// <reference types="node" />
/**
 * Replay harness — tester's flag probe (V2FlagBar, local development only). Opens one embed link, starts the
 * session, raises a flag while the tutor speaks, types a note, takes a shot, closes the flag, and prints how
 * much audio started before, during and after the flag.
 *   npx tsx scripts/tutor/replay-harness/probe-flag.ts '<embed url>'
 */
import { chromium } from 'playwright';

declare global { interface Window { __starts?: number[] } }

async function main() {
  const [url] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--auto-accept-this-tab-capture', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1000, height: 820 } });
  await ctx.addInitScript(`
    window.__starts = [];
    (function () { var orig = AudioBufferSourceNode.prototype.start; AudioBufferSourceNode.prototype.start = function () { window.__starts.push(Date.now()); return orig.apply(this, arguments); }; })();
  `);
  await ctx.route('**/api/tutor/session-audio*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"stub":true}' }));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  PAGEERROR ${String(e).slice(0, 200)}`));
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const orb = page.locator('[data-testid="tutor-orb-start"]');
  await orb.waitFor({ state: 'visible', timeout: 60000 });
  for (let i = 0; i < 6 && await orb.isVisible().catch(() => false); i++) { await page.waitForTimeout(2500); await orb.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(3000); }
  const bar = page.locator('[data-v2-flag-bar]');
  await bar.waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(9000);
  const count = async (from: number, to: number) => (await page.evaluate(() => window.__starts ?? [])).filter((t) => t >= from && t < to).length;
  const tFlag = Date.now();
  await page.locator('body').click({ position: { x: 500, y: 300 } }).catch(() => {});
  await page.keyboard.press('Backquote');
  await page.waitForTimeout(1500);
  console.log(`bar after key: ${(await bar.innerText()).replace(/\s+/g, ' ')}`);
  const input = page.locator('input[name="studentText"]');
  await input.click(); await input.fill('the graph went up on the wrong page'); await input.press('Enter');
  await bar.locator('button', { hasText: 'Shot' }).click();
  await page.waitForTimeout(7000);
  console.log(`bar while open: ${(await bar.innerText()).replace(/\s+/g, ' ')}`);
  const tClose = Date.now();
  await bar.locator('button', { hasText: 'Done' }).click();
  await page.waitForTimeout(12000);
  console.log(`bar after close: ${(await bar.innerText()).replace(/\s+/g, ' ')}`);
  console.log(`audio buffers started: before flag ${await count(0, tFlag)}, during flag (after its first second) ${await count(tFlag + 1000, tClose)}, after close ${await count(tClose, Date.now())}`);
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
