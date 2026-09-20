// Burned-in caption cards as transparent PNGs (this box's ffmpeg has no drawtext/libass).
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const cues = JSON.parse(fs.readFileSync('captions.json', 'utf8'));
const b = await chromium.launch({ headless: true });
const p = await (await b.newContext({ viewport: { width: 1700, height: 320 }, deviceScaleFactor: 2 })).newPage();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
for (const [i, c] of cues.entries()) {
  const pill = c.who === 'tutor'
    ? `<div style="display:inline-block;font-size:20px;font-weight:700;letter-spacing:.08em;color:#fff;background:#4f46e5;padding:5px 14px;border-radius:999px;margin-bottom:10px">MR. COLE · AI TUTOR</div><br>` : '';
  await p.setContent(`<body style="margin:0;background:transparent;display:flex;justify-content:center;align-items:flex-start">
    <div id="c" style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:40px;line-height:1.28;font-weight:600;color:#fff;text-align:center;
      background:rgba(15,23,42,.80);padding:16px 34px 18px;border-radius:18px;display:inline-block;white-space:pre-line;
      ${c.who === 'tutor' ? 'border-bottom:4px solid #6366f1;' : ''}">${pill}${esc(c.text)}</div></body>`);
  await p.locator('#c').screenshot({ path: `captions/cap-${String(i).padStart(2, '0')}.png`, omitBackground: true });
}
await b.close(); console.log('captions:', cues.length);
