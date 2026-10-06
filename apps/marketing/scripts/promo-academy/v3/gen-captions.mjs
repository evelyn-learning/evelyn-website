/**
 * Burned-in captions + scene labels, composited onto a finished master in one
 * ffmpeg pass (this box's ffmpeg has no drawtext/libass, so text is rasterised
 * by Chromium into transparent PNG strips).
 *
 *   node scripts/promo/gen-captions.mjs <captions.json> <in.mp4> <out.mp4>
 *
 * captions.json: { band: { top }, accent, cues: [{ a, b, text }],
 *                  labels: [{ a, b, text, accent? }] }
 * `band.top` is where the caption band starts — the master's framed scenes
 * (assemble.mjs `frame`) leave that strip empty, so text never covers footage.
 * A small uppercase label sits on the band's first line, the caption below it.
 * Cue times come from a word-timed transcript of the assembled master; the
 * TEXT comes from the scripts, never from the ASR output.
 */
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [capPath, inPath, outPath] = process.argv.slice(2);
if (!capPath || !inPath || !outPath) { console.error('usage: gen-captions.mjs <captions.json> <in.mp4> <out.mp4>'); process.exit(1); }
const { band = { top: 920 }, accent = '#a51c30', labelColor = '#e8b4bc', cues, labels = [] } = JSON.parse(fs.readFileSync(capPath, 'utf8'));
const dir = path.join(path.dirname(outPath), 'captions-tmp');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

const LABEL_H = 40;                       // first line of the band
const CAP_TOP = band.top + LABEL_H;       // captions fill the rest
const CAP_H = 1080 - CAP_TOP - 8;
const FONT = `font-family:-apple-system,'Helvetica Neue',Arial,sans-serif`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const b = await chromium.launch({ headless: true });
const p = await (await b.newContext({ viewport: { width: 1920, height: 200 }, deviceScaleFactor: 1 })).newPage();
const shot = async (html, h, file) => {
  await p.setViewportSize({ width: 1920, height: h });
  await p.setContent(`<body style="margin:0;background:transparent;width:1920px;height:${h}px;display:flex;align-items:center;justify-content:center">${html}</body>`);
  await p.screenshot({ path: file, omitBackground: true });
};
const overlays = [];
for (const [i, l] of labels.entries()) {
  const file = path.join(dir, `label-${String(i).padStart(2, '0')}.png`);
  const style = l.accent
    ? `color:#fff;background:${accent};padding:4px 14px;border-radius:999px`
    : `color:${labelColor}`;
  await shot(`<div style="${FONT};font-size:19px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;${style}">${esc(l.text)}</div>`, LABEL_H, file);
  overlays.push({ file, y: band.top + 4, a: l.a, b: l.b });
}
for (const [i, c] of cues.entries()) {
  const file = path.join(dir, `cap-${String(i).padStart(2, '0')}.png`);
  await shot(`<div style="${FONT};font-size:38px;line-height:1.24;font-weight:600;color:#fff;text-align:center;white-space:pre-line;text-shadow:0 2px 10px rgba(0,0,0,.45)">${esc(c.text)}</div>`, CAP_H, file);
  overlays.push({ file, y: CAP_TOP, a: c.a, b: c.b });
}
await b.close();

const inputs = overlays.flatMap((o) => ['-i', o.file]);
let graph = '';
let prev = '[0:v]';
overlays.forEach((o, i) => {
  const out = i === overlays.length - 1 ? '[vout]' : `[v${i}]`;
  graph += `${prev}[${i + 1}:v]overlay=0:${o.y}:enable='between(t,${o.a},${o.b})'${out};`;
  prev = out;
});
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', inPath, ...inputs, '-filter_complex', graph.slice(0, -1),
  '-map', '[vout]', '-map', '0:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
  '-c:a', 'copy', '-movflags', '+faststart', outPath], { stdio: ['ignore', 'inherit', 'inherit'] });
console.log(`captions: ${cues.length} cues, ${labels.length} labels → ${outPath}`);
