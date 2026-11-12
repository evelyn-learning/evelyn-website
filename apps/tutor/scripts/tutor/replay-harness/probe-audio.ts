/// <reference types="node" />
/**
 * Replay harness — audio schedule probe. Opens one embed link, starts the session, types the given
 * lines, and prints every audio buffer the page scheduled (when it starts, how long it is, on which
 * AudioContext). Overlaps and gaps in that schedule are what a listener hears as garbled speech.
 *   npx tsx scripts/tutor/replay-harness/probe-audio.ts '<embed url>' 'line one' 'line two'
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

type Sched = { st?: string; t: number; ctx: number; now: number; when: number; dur: number; rate: number; ch: number; sr: number };
declare global { interface Window { __sched?: Sched[]; __ctxN?: number } }

async function main() {
  const [url, ...lines] = process.argv.slice(2);
  // PROBE_WAV=<file>: what the fake microphone hears (played once), to check the tutor hears a spoken turn.
  const wav = process.env.PROBE_WAV ? `${process.env.PROBE_WAV}%noloop` : path.join(process.cwd(), 'artifacts', 'replay-harness', 'silence.wav');
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', ...(fs.existsSync(wav.replace('%noloop', '')) ? [`--use-file-for-fake-audio-capture=${wav}`] : []), '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1000, height: 820 } });
  // A string, not a function: tsx wraps named functions in a helper the page does not have.
  await ctx.addInitScript(`
    window.__sched = []; window.__ctxN = 0;
    (function () {
      var ids = new WeakMap();
      function idOf(c) { if (!ids.has(c)) ids.set(c, ++window.__ctxN); return ids.get(c); }
      var orig = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (when, offset, duration) {
        var b = this.buffer;
        window.__sched.push({ t: Date.now(), ctx: idOf(this.context), now: this.context.currentTime, when: when || 0, dur: b ? b.duration : 0, rate: this.playbackRate.value, ch: b ? b.numberOfChannels : 0, sr: b ? b.sampleRate : 0, st: window.__sched.length < 40 ? String(new Error().stack).split('\\n').slice(2, 7).map(function (l) { return l.trim().replace(/\\(?http.*\\/([^\\/?]+)[^:]*(:\\d+):\\d+\\)?/, '$1$2'); }).join(' < ') : '' });
        return arguments.length ? orig.apply(this, arguments) : orig.call(this);
      };
    })();
  `);
  await ctx.route('**/api/tutor/session-audio*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"stub":true}' }));
  await ctx.route('**/api/tutor/practice-assign**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"stub":true,"assigned":[]}' }));
  const page = await ctx.newPage();
  page.on('console', (m) => { const s = m.text(); if (/Realtime|Sonic|TTS|perception|Perception|shared-mic|Ink|v2\]/.test(s) && !/tts-default/.test(s)) console.log(`  [page] ${s.slice(0, 220)}`); });
  page.on('pageerror', (e) => console.log(`  PAGEERROR ${String(e).slice(0, 200)}`));
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const orb = page.locator('[data-testid="tutor-orb-start"]');
  await orb.waitFor({ state: 'visible', timeout: 60000 });
  for (let i = 0; i < 6 && await orb.isVisible().catch(() => false); i++) { await page.waitForTimeout(2500); await orb.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(3000); }
  const t0 = Date.now();
  console.log('started');
  await page.waitForTimeout(Number(process.env.PROBE_WAIT_MS ?? 22000));
  const input = page.locator('input[name="studentText"]');
  for (const line of lines) { await input.click(); await input.fill(line); await input.press('Enter'); console.log(`typed @${((Date.now() - t0) / 1000).toFixed(1)}s: ${line}`); await page.waitForTimeout(Number(process.env.PROBE_TURN_MS ?? 28000)); if (process.env.PROBE_SHOT) await page.screenshot({ path: process.env.PROBE_SHOT.replace(/\.png$/, `-${lines.indexOf(line) + 1}.png`) }).catch(() => {}); }
  // PROBE_SHOT=<file.png>: a picture of the page at the end, to look at the board.
  // PROBE_SHOT_AT=<css selector>: bring that element into view first (a figure further up the board).
  if (process.env.PROBE_SHOT_AT) await page.locator(process.env.PROBE_SHOT_AT).last().scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => {});
  if (process.env.PROBE_SHOT) await page.screenshot({ path: process.env.PROBE_SHOT, fullPage: false }).catch(() => {});
  const sched = await page.evaluate(() => window.__sched ?? []);
  const byCtx = new Map<number, Sched[]>();
  for (const s of sched) byCtx.set(s.ctx, [...(byCtx.get(s.ctx) ?? []), s]);
  for (const [id, list] of byCtx) {
    let overlaps = 0; let gaps = 0; let prevEnd = -1;
    for (const s of list) {
      const start = Math.max(s.when, s.now); const end = start + s.dur / (s.rate || 1);
      if (prevEnd >= 0) { if (start < prevEnd - 0.005) overlaps += 1; else if (start > prevEnd + 0.02 && start < prevEnd + 0.5) gaps += 1; }
      prevEnd = Math.max(prevEnd, end);
    }
    const durs = list.map((s) => s.dur);
    console.log(`context ${id}: ${list.length} buffers, ${durs.reduce((a, b) => a + b, 0).toFixed(1)}s of audio, sampleRate ${[...new Set(list.map((s) => s.sr))].join('/')}, rate ${[...new Set(list.map((s) => s.rate))].join('/')}, overlaps ${overlaps}, short gaps ${gaps}`);
    for (const s of list.slice(0, 14)) console.log(`    +${((s.t - t0) / 1000).toFixed(2)}s now=${s.now.toFixed(3)} when=${s.when.toFixed(3)} dur=${s.dur.toFixed(3)}${process.env.PROBE_STACKS ? `  ${s.st ?? ''}` : ''}`);
  }
  // Seconds (since start) in which audio was started, in 2 s bins: silences and resumptions show here.
  const bins = new Map<number, number>();
  for (const s of sched) { const b = Math.floor((s.t - t0) / 2000) * 2; bins.set(b, (bins.get(b) ?? 0) + s.dur); }
  console.log('audio started per 2 s: ' + [...bins.entries()].sort((a, b) => a[0] - b[0]).map(([b, d]) => `${b}s:${d.toFixed(1)}`).join(' '));
  fs.writeFileSync(path.join(process.cwd(), 'artifacts', 'replay-harness', 'probe-audio.json'), JSON.stringify(sched));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
