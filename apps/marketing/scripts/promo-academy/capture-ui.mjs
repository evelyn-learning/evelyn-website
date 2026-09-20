// UI scenes for the Evelyn Academy tour — against the LOCAL in-memory mock backend only
// (fixture data, fictional accounts). Usage: node capture-ui.mjs <scene|all>
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const API = 'http://127.0.0.1:4000';
const WEB = process.env.WEB ?? 'http://127.0.0.1:3011';
const OUT = path.resolve('ui');
const ZOOM = Number(process.env.ZOOM ?? 1.3);
const want = process.argv[2] ?? 'all';
fs.mkdirSync(OUT, { recursive: true });

async function api(p, token, body) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;
  const r = await fetch(API + p, { method: body ? 'POST' : 'GET', headers, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, json: await r.json().catch(() => null) };
}
async function student(email, displayName, courseKeys) {
  const su = await api('/api/auth/signup', null, { email, password: 'password12', displayName, gradeLevel: '11' });
  if (!su.json?.token) {
    const li = await api('/api/auth/login', null, { email, password: 'password12' });
    if (!li.json?.token) throw new Error(`signup+login failed ${su.status}/${li.status}`);
    return li.json.token;
  }
  for (const key of courseKeys) {
    const c = (await api(`/api/courses/${key}`)).json;
    await api('/api/enroll', su.json.token, { courseId: c.id });
    await api('/api/diagnostic/skip', su.json.token, { courseId: c.id });
  }
  return su.json.token;
}

const browser = await chromium.launch({ headless: true });
async function scene(name, token, fn) {
  if (want !== 'all' && want !== name) return;
  const dir = path.join(OUT, `.raw-${name}`);
  fs.rmSync(dir, { recursive: true, force: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, screen: { width: 1920, height: 1080 }, recordVideo: { dir, size: { width: 1920, height: 1080 } } });
  await ctx.addCookies([{ name: 'academy_session', value: token, url: WEB }]);
  await ctx.addInitScript((zoom) => {
    const apply = () => { document.documentElement.style.zoom = String(zoom); const s = document.createElement('style'); s.textContent = 'nextjs-portal{display:none!important}'; document.head.appendChild(s); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
  }, ZOOM);
  const page = await ctx.newPage();
  const SWAPS = [
    ['What is 1 + 1?', 'If 3x + 7 = 22, what is the value of 6x \u2212 4?'],
    ['What is 2 + 1?', 'A line has slope 2 and passes through (2, 34). What is its y-intercept?'],
    ['["2","3","4","5"]', '["26","30","34","41"]'],
    ['Fixture Form A', 'Practice Test 1'],
  ];
  await page.route('**/*', async (route) => {
    const req = route.request();
    if (!['document', 'fetch', 'xhr'].includes(req.resourceType())) return route.continue();
    try {
      const res = await route.fetch();
      const ct = res.headers()['content-type'] ?? '';
      if (!/json|html|x-component|text\/plain/.test(ct)) return route.fulfill({ response: res });
      let body = await res.text(); let hit = false;
      for (const [a, b] of SWAPS) if (body.includes(a)) { body = body.split(a).join(b); hit = true; }
      return route.fulfill({ response: res, body: hit ? body : undefined });
    } catch { return route.continue().catch(() => {}); }
  });
  const t0 = Date.now();
  const mark = (m) => console.log(`[${name}] ${((Date.now() - t0) / 1000).toFixed(1)}s ${m}`);
  try { await fn(page, mark); } catch (e) { console.error(`[${name}] FAILED: ${e.message.split('\n')[0]}`); }
  await ctx.close();
  const f = fs.readdirSync(dir).find((x) => x.endsWith('.webm'));
  if (f) { fs.renameSync(path.join(dir, f), path.join(OUT, `${name}.webm`)); fs.rmSync(dir, { recursive: true, force: true }); console.log(`[${name}] wrote ui/${name}.webm`); }
}
const pause = (page, ms) => page.waitForTimeout(ms);
async function glide(page, px, ms) {
  await page.evaluate(([px, ms]) => new Promise((res) => {
    const start = window.scrollY, t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; window.scrollTo(0, start + px * e); k < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  }), [px, ms]);
}

const stamp = Date.now();
const main = await student(process.env.MAIN_EMAIL ?? 'aarav.mehta@northfield.example', 'Aarav Mehta', ['AP_STATISTICS', 'DIGITAL_SAT']);

await scene('lessons', main, async (page, mark) => {
  await page.goto(`${WEB}/app/courses/ap-statistics?tab=lessons`, { waitUntil: 'networkidle' });
  mark('loaded'); await pause(page, 1800); await glide(page, 520, 3200); await pause(page, 800);
  const study = page.getByRole('button', { name: /^(Study|Resume)$/ }).first();
  await study.hover().catch(() => {}); mark('hover study'); await pause(page, 1500);
});

await scene('practice', main, async (page, mark) => {
  await page.goto(`${WEB}/app/courses/ap-statistics?tab=practice`, { waitUntil: 'networkidle' });
  mark('loaded'); await pause(page, 1400); await glide(page, 560, 2600); await pause(page, 700);
  const practice = page.getByRole('button', { name: 'Practice', exact: true }).first();
  if (await practice.count()) { await practice.click(); mark('drill opened'); await pause(page, 2500);
    const choice = page.locator('[data-testid^="drill-choice"], [role="radio"], label:has(input[type=radio])').first();
    if (await choice.count()) { await choice.click().catch(() => {}); mark('choice'); await pause(page, 1500); } }
  await pause(page, 1200);
});

await scene('overview', main, async (page, mark) => {
  await page.goto(`${WEB}/app/courses/ap-statistics?tab=overview`, { waitUntil: 'networkidle' });
  await page.getByTestId('overview-heatmap').waitFor({ timeout: 20000 });
  mark('loaded'); await pause(page, 1800); await glide(page, 620, 3600); await pause(page, 1500);
});

await scene('mock', main, async (page, mark) => {
  await page.goto(`${WEB}/app/courses/digital-sat?tab=exams`, { waitUntil: 'networkidle' });
  mark('exams tab'); await pause(page, 1500);
  const card = page.getByTestId('mock-form-card').first();
  await card.getByRole('button', { name: 'Start', exact: true }).click(); await pause(page, 1200);
  await card.getByTestId('mock-start-confirm').click();
  await page.getByTestId('exam-player').waitFor({ timeout: 30000 }); mark('player'); await pause(page, 2200);
  await page.getByTestId('exam-choice-0').click(); mark('choice 1'); await pause(page, 1300);
  await page.getByRole('button', { name: 'Next' }).click(); await pause(page, 1300);
  await page.getByTestId('exam-choice-1').click(); mark('choice 2'); await pause(page, 1300);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByTestId('exam-module-review').waitFor(); mark('module review'); await pause(page, 1800);
  await page.getByTestId('exam-submit-module').click(); await pause(page, 900);
  await page.getByTestId('exam-numeric').fill('42'); await pause(page, 700);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByTestId('exam-module-review').waitFor(); await page.getByTestId('exam-submit-module').click();
  await page.getByTestId('exam-break').waitFor(); mark('break'); await pause(page, 800);
  await page.getByRole('button', { name: /Continue/ }).click(); await pause(page, 900);
  await page.getByTestId('exam-frq-editor').fill('Two evens are 2k and 2m; their sum 2(k+m) is even.'); await pause(page, 900);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByTestId('exam-module-review').waitFor(); await page.getByTestId('exam-submit-module').click();
  await page.getByTestId('mock-report').waitFor({ timeout: 40000 }); mark('REPORT'); await pause(page, 2500); await glide(page, 420, 2600); await pause(page, 1500);
});

if (want.startsWith('brand')) await scene(want, main, async (page, mark) => {
  await page.goto(`${WEB}/app/courses/ap-statistics?tab=lessons`, { waitUntil: 'networkidle' });
  mark('loaded'); await pause(page, 3500);
});

if (want === 'all' || want === 'admin') {
  const names = ['Diya Kapoor', 'Kabir Shah', 'Meera Rao', 'Rohan Thomas', 'Sana Pillai', 'Vikram Joshi', 'Zoya Hussain'];
  for (const [i, n] of names.entries()) await student(`${n.toLowerCase().replace(' ', '.')}@northfield.example`, n, i % 3 === 2 ? [] : ['AP_STATISTICS']);
  let adminTok = (await api('/api/auth/signup', null, { email: 'admin@northfield.example', password: 'password12', displayName: 'Academy Admin', gradeLevel: '12' })).json?.token;
  if (!adminTok) adminTok = (await api('/api/auth/login', null, { email: 'admin@northfield.example', password: 'password12' })).json?.token;
  await scene('admin', adminTok, async (page, mark) => {
    await page.goto(`${WEB}/admin/students`, { waitUntil: 'networkidle' });
    mark(`loaded url=${page.url()}`); await pause(page, 2200); await glide(page, 300, 2400); await pause(page, 1500);
  });
}
await browser.close();
console.log('UI-CAPTURE-DONE');
