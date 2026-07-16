/**
 * Task E8 headless verification harness.
 *
 * Loads the real /tutor-portal/embed route inside a real <iframe> hosted by
 * a same-origin parent page (public/_e8-harness/parent.html — same-origin
 * so Chromium doesn't OOPIF-isolate the iframe away from our fullscreenEnabled
 * stub), stubs document.fullscreenEnabled inside the iframe (iPhone-Safari-
 * like when false), and asserts:
 *   1. fullscreenEnabled=false + iframed -> expand button renders, native
 *      fullscreen button absent.
 *   2. Tapping it posts {type:'evelyn:expand'} to the parent window.
 *   3. Tapping again posts {type:'evelyn:collapse'} and the button flips
 *      back to the expand icon/title.
 *   4. fullscreenEnabled=true (native API present) -> native "Full screen"
 *      button shows and NO expand button is rendered.
 *
 * NOTE: addInitScript is passed as a STRING (not a JS function reference).
 * tsx/esbuild injects a `__name` helper when bundling certain arrow-function
 * shapes (observed with a try/catch + typed catch binding); Playwright
 * serializes function-form init scripts via toString() and re-evaluates the
 * body alone in the browser, where that helper doesn't exist, so the stub
 * silently throws ReferenceError and never applies. A plain string body sidesteps
 * this bundler artifact entirely.
 *
 * Run: npx tsx scripts/test-e8-expand-harness.ts (dev server must be up on
 * :3006). The tiny same-origin fixture page this needs is written to
 * public/_e8-harness/parent.html on the fly (below) rather than committed —
 * it's a throwaway test double, not a production asset.
 */
import { chromium, type Frame, type Page } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function ensureFixture() {
  const dir = join(__dirname, '..', 'public', '_e8-harness');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'parent.html'), `<!doctype html><html><body>
<iframe id="f" src="about:blank" style="width:500px;height:900px"></iframe>
<script>
  window.__messages = [];
  window.addEventListener('message', (e) => { window.__messages.push(e.data); });
  window.__setIframeSrc = (url) => { document.getElementById('f').src = url; };
</script>
</body></html>
`);
}

function buildDemoToken() {
  const config = {
    subject: 'math',
    level: 'hs',
    topic: 'algebra',
    student_name: 'Harness',
    session_goal: 'practice',
    input_mode: 'voice',
    engine: 'claude-brain',
  };
  return Buffer.from(JSON.stringify(config)).toString('base64');
}

const BASE = 'http://localhost:3006';
const EMBED_URL = `${BASE}/tutor-portal/embed?token=${encodeURIComponent(buildDemoToken())}`;
const HARNESS_URL = `${BASE}/_e8-harness/parent.html`;

let failures = 0;
function check(label: string, cond: boolean) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`);
  if (!cond) failures++;
}

async function findEmbedFrame(page: Page): Promise<Frame | undefined> {
  let f = page.frames().find((fr) => fr.url().includes('/tutor-portal/embed'));
  for (let i = 0; i < 100 && !f; i++) {
    await page.waitForTimeout(150);
    f = page.frames().find((fr) => fr.url().includes('/tutor-portal/embed'));
  }
  return f;
}

async function loadEmbedInFrame(page: Page): Promise<Frame | undefined> {
  await page.goto(HARNESS_URL);
  await page.evaluate((url) => { (window as any).__setIframeSrc(url); }, EMBED_URL);
  return findEmbedFrame(page);
}

async function scenarioA(browser: import('playwright').Browser) {
  const page = await browser.newPage();
  const messages: any[] = [];
  await page.exposeFunction('__harnessRecordMessage', (m: unknown) => { messages.push(m); });
  // Same-origin parent + string-form addInitScript reaches the child iframe
  // reliably (see file header for both gotchas this dodges).
  await page.addInitScript({
    content: `
      Object.defineProperty(document, 'fullscreenEnabled', { get: function() { return false; }, configurable: true });
      Object.defineProperty(document, 'webkitFullscreenEnabled', { get: function() { return false; }, configurable: true });
      window.addEventListener('message', function(e) { if (window.__harnessRecordMessage) window.__harnessRecordMessage(e.data); });
    `,
  });

  const frame = await loadEmbedInFrame(page);
  check('Scenario A: iframe reached /tutor-portal/embed', !!frame);
  if (!frame) { await page.close(); return; }

  await frame.waitForSelector('button[title="Expand"], button[title="Full screen"]', { timeout: 20000 }).catch(() => {});
  const hasExpand = await frame.locator('button[title="Expand"]').count();
  const hasFullscreen = await frame.locator('button[title="Full screen"]').count();
  check('Scenario A: expand button renders (fullscreenEnabled=false, iframed)', hasExpand === 1);
  check('Scenario A: native fullscreen button absent', hasFullscreen === 0);

  if (hasExpand === 1) {
    await frame.locator('button[title="Expand"]').click();
    await page.waitForTimeout(300);
    check('Scenario A: tap posted {type:"evelyn:expand"} to parent', messages.some((m) => m?.type === 'evelyn:expand'));

    const collapseBtn = frame.locator('button[title="Exit expanded view"]');
    const collapseCount = await collapseBtn.count();
    check('Scenario A: button flips to collapse affordance after expand', collapseCount === 1);

    if (collapseCount === 1) {
      await collapseBtn.click();
      await page.waitForTimeout(300);
      check('Scenario A: tap posted {type:"evelyn:collapse"} to parent', messages.some((m) => m?.type === 'evelyn:collapse'));
      const expandAgain = await frame.locator('button[title="Expand"]').count();
      check('Scenario A: button flips back to expand affordance after collapse', expandAgain === 1);
    }
  }
  await page.close();
}

async function scenarioC(browser: import('playwright').Browser) {
  // Session-end reset: expand, then fire the same window event TutorSession
  // dispatches at its single onEndSession choke point (handleEndSession),
  // and confirm SessionStage's local `expanded` resets without needing a
  // full voice-session teardown.
  const page = await browser.newPage();
  await page.addInitScript({
    content: `
      Object.defineProperty(document, 'fullscreenEnabled', { get: function() { return false; }, configurable: true });
      Object.defineProperty(document, 'webkitFullscreenEnabled', { get: function() { return false; }, configurable: true });
    `,
  });

  const frame = await loadEmbedInFrame(page);
  check('Scenario C: iframe reached /tutor-portal/embed', !!frame);
  if (!frame) { await page.close(); return; }

  await frame.waitForSelector('button[title="Expand"]', { timeout: 20000 }).catch(() => {});
  await frame.locator('button[title="Expand"]').click();
  await page.waitForTimeout(200);
  const expandedNow = await frame.locator('button[title="Exit expanded view"]').count();
  check('Scenario C: expanded before session-end signal', expandedNow === 1);

  await frame.evaluate(() => { window.dispatchEvent(new Event('evelyn:session-ending')); });
  await page.waitForTimeout(200);
  const backToExpand = await frame.locator('button[title="Expand"]').count();
  const stillCollapseUi = await frame.locator('button[title="Exit expanded view"]').count();
  check('Scenario C: evelyn:session-ending resets local expanded state', backToExpand === 1 && stillCollapseUi === 0);

  await page.close();
}

async function scenarioB(browser: import('playwright').Browser) {
  const page = await browser.newPage();
  await page.addInitScript({
    content: `
      Object.defineProperty(document, 'fullscreenEnabled', { get: function() { return true; }, configurable: true });
    `,
  });

  const frame = await loadEmbedInFrame(page);
  check('Scenario B: iframe reached /tutor-portal/embed', !!frame);
  if (!frame) { await page.close(); return; }

  await frame.waitForSelector('button[title="Expand"], button[title="Full screen"]', { timeout: 20000 }).catch(() => {});
  const hasExpand = await frame.locator('button[title="Expand"]').count();
  const hasFullscreen = await frame.locator('button[title="Full screen"]').count();
  check('Scenario B: native fullscreen button renders (canFullscreen=true)', hasFullscreen === 1);
  check('Scenario B: no expand button when canFullscreen=true', hasExpand === 0);
  await page.close();
}

async function main() {
  ensureFixture();
  const browser = await chromium.launch();
  await scenarioA(browser);
  await scenarioB(browser);
  await scenarioC(browser);
  await browser.close();
  console.log(`\n${failures === 0 ? 'ALL PASSED' : failures + ' FAILURES'}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
