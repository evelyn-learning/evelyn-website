#!/usr/bin/env node
// scripts/make-portal-og-image.mjs — draws the developer portal's share image (2026-11-24).
//
// The portal had no Open Graph image: the root layout names /images/og-image.jpg, which is not in this
// app's public folder, so a shared portal link showed no picture. This renders a 1200×630 card as HTML in
// the repo's Playwright browser and saves it as a static PNG. Static, not Next's opengraph-image file
// convention: a file under public/images/ is served as it is on both hosts (the middleware does not rewrite
// images/), so the og:image URL is the same absolute address on every portal page.
//
// Run it again when the wording or the free-minute figure changes (scripts/test-portal-seo.ts compares the
// figure below with SANDBOX_FREE_MINUTES), then commit the PNG:
//   node scripts/make-portal-og-image.mjs
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const APP = resolve(new URL('..', import.meta.url).pathname);
const OUT = resolve(APP, 'public/images/portal/og-voice-tutor.png');
const SANDBOX_FREE_MINUTES = 300;

// The wordmark is the portal header's (components/PortalNav.tsx): the blue "E" tile, "Voice Tutor", "by Evelyn Learning".
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; font-family: Inter, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
         background: linear-gradient(135deg, #0f172a 0%, #172554 55%, #1e293b 100%); color: #fff;
         display: flex; flex-direction: column; justify-content: space-between; padding: 72px 80px; }
  .brand { display: flex; align-items: center; gap: 20px; }
  .tile { width: 64px; height: 64px; border-radius: 16px; background: #2563eb; display: flex; align-items: center;
          justify-content: center; font-size: 32px; font-weight: 700; }
  .name { font-size: 38px; font-weight: 600; }
  .by { font-size: 22px; color: #94a3b8; margin-left: 14px; }
  h1 { font-size: 68px; line-height: 1.08; font-weight: 700; letter-spacing: -1.5px; max-width: 980px; }
  p { margin-top: 26px; font-size: 30px; line-height: 1.35; color: #bfdbfe; max-width: 940px; }
  .tag { align-self: flex-start; font-size: 24px; font-weight: 600; color: #fff; background: #2563eb;
         border-radius: 999px; padding: 12px 26px; }
</style></head><body>
  <div class="brand"><div class="tile">E</div><div><span class="name">Voice Tutor</span><span class="by">by Evelyn Learning</span></div></div>
  <div>
    <h1>AI voice tutor API for education platforms</h1>
    <p>Voice, live whiteboard and typed chat, embedded with one signed link</p>
  </div>
  <div class="tag">Free sandbox: ${SANDBOX_FREE_MINUTES} minutes</div>
</body></html>`;

const require = createRequire(resolve(APP, '../../package.json'));
const { chromium } = require('playwright');
let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = await chromium.launch(); }
const page = await (await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
await page.setContent(html, { waitUntil: 'load' });
mkdirSync(dirname(OUT), { recursive: true });
await page.screenshot({ path: OUT, type: 'png' });
await browser.close();
console.log(`wrote ${OUT}`);
