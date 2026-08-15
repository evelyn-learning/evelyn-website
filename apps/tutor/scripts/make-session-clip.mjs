#!/usr/bin/env node
/**
 * make-session-clip — produce a shareable MP4 (both voices + whiteboard) from
 * a recorded tutor session's time range. Proven pipeline from 2026-08-06
 * (portal-825d1906… 22:28–25:54); see memory/docs for the discovery story.
 *
 *   node scripts/make-session-clip.mjs --session <sessionId> --start 22:28 --end 25:54 \
 *        [--preset board|full] [--out clip.mp4]
 *
 * presets: board = whiteboard column only, full brightness (default)
 *          full  = whole replay modal incl. transcript drawer (board is dimmed
 *                  by the drawer scrim — deliberate tradeoff)
 *
 * Prereqs: ssh root@PROD (audio + secrets live there), ffmpeg/ffprobe on PATH,
 * Google Chrome installed (Playwright's bundled headless shell has a frozen
 * AudioContext clock — the replay player's clock anchors to it), repo
 * node_modules (playwright).
 *
 * How it works:
 *  1. Session doc + audio meta fetched over ssh; refuses resumed sessions
 *     (their PCM is concatenated active time, not wall time) and non-24kHz
 *     tracks (see scripts/rescue-tutor-audio-rates.ts).
 *  2. Audio: both PCM tracks are wall-clock zero-filled from session T0, so
 *     the range is a byte slice (sec*48000); slices are mixed + loudnormed.
 *  3. Video: Chrome (new headless) records the replay page; playback is
 *     1x-only. The player clamps seeks to the audio download frontier, so we
 *     preload ~120s after opening (NOT longer — an idle muted AudioContext
 *     suspends and freezes the clock), seek via synthetic PointerEvents on the
 *     timeline bar, and inject follow-scroll (replay lacks it).
 *  4. The timeline label (m:ss) is polled during playback; label-flip epochs
 *     are regressed against video time (t0 = closeEpoch - ffprobe duration),
 *     giving a ±0.1s session→video mapping for the cut.
 */
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHmac } from 'node:crypto';
import { chromium } from 'playwright';

const PROD = 'root@84.247.185.169';
const PROD_APP = '/root/evelynlearning';
const AUDIO_DIR = '/var/data/evelyn/audio';
const REPLAY_ORIGIN = 'https://www.evelynlearning.com';
const SAMPLE_RATE = 24000;
const SEEK_MARGIN_S = 68;   // park this far before the clip start
const PRELOAD_MS = 120_000; // diagnostic-proven; longer idle freezes the ctx clock
const CROPS = { board: '752:730:336:165', full: '1280:760:320:135' }; // at 1920x1080 viewport

const args = Object.fromEntries(
  process.argv.slice(2).map((a, i, all) => (a.startsWith('--') ? [a.slice(2), all[i + 1]] : null)).filter(Boolean),
);
const sessionId = args.session;
const preset = args.preset ?? 'board';
const parseTs = (s) => { const m = /^(\d+):(\d{2})$/.exec(s ?? ''); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
const startS = parseTs(args.start);
const endS = parseTs(args.end);
if (!sessionId || startS === null || endS === null || endS <= startS || !CROPS[preset]) {
  console.error('usage: make-session-clip.mjs --session <id> --start m:ss --end m:ss [--preset board|full] [--out file.mp4]');
  process.exit(1);
}
const outFile = args.out ?? `${sessionId}-${args.start.replace(':', '')}-${args.end.replace(':', '')}.mp4`;
const clipLen = endS - startS;
const work = mkdtempSync(join(tmpdir(), 'session-clip-'));
const sh = (cmd, opts = {}) => {
  const r = spawnSync('bash', ['-c', cmd], { encoding: 'utf8', maxBuffer: 1 << 28, ...opts });
  if (r.status !== 0) throw new Error(`command failed: ${cmd}\n${r.stderr}`);
  return r.stdout;
};

// ---- 1. Session facts + preflight (over ssh) --------------------------------
console.log('[1/5] fetching session doc + audio meta…');
const remoteInfo = `${work}/info.mjs`;
writeFileSync(remoteInfo, `
import mongoose from '${PROD_APP}/node_modules/mongoose/index.js';
await mongoose.connect(process.env.MURI);
const doc = await mongoose.connection.db.collection('tutorsessions').findOne(
  { sessionId: ${JSON.stringify(sessionId)} },
  { projection: { startedAt:1, endedAt:1, duration:1, hasAudio:1, studentId:1, sourcePartnerId:1 } });
console.log(JSON.stringify(doc));
await mongoose.disconnect();
`);
sh(`scp -q ${remoteInfo} ${PROD}:/tmp/session-clip-info.mjs`);
const doc = JSON.parse(sh(`ssh ${PROD} 'cd ${PROD_APP} && MURI=$(grep "^MONGODB_URI=" .env.local | cut -d= -f2-) node /tmp/session-clip-info.mjs && rm /tmp/session-clip-info.mjs'`));
if (!doc) throw new Error('session not found');
const wallSpanS = (new Date(doc.endedAt).getTime() - new Date(doc.startedAt).getTime()) / 1000;
if (Math.abs(wallSpanS - doc.duration) > 30) {
  throw new Error(`session looks paused/resumed (wallSpan ${wallSpanS}s vs duration ${doc.duration}s) — PCM byte math would be wrong; refusing`);
}
if (endS > doc.duration) throw new Error(`end ${endS}s beyond session duration ${doc.duration}s`);
const metas = sh(`ssh ${PROD} 'cat ${AUDIO_DIR}/${sessionId}/student.meta.json ${AUDIO_DIR}/${sessionId}/tutor.meta.json'`);
for (const m of metas.match(/"sampleRate":\s*(\d+)/g) ?? []) {
  if (!m.endsWith(String(SAMPLE_RATE))) throw new Error(`unexpected sample rate (${m}) — run rescue-tutor-audio-rates.ts first`);
}
console.log(`  session ok: ${doc.duration}s, partner=${doc.sourcePartnerId}, hasAudio=${doc.hasAudio}`);

// ---- 2. Audio slice + mix ---------------------------------------------------
console.log('[2/5] slicing + mixing audio…');
const skip = startS * SAMPLE_RATE * 2;
const count = clipLen * SAMPLE_RATE * 2;
for (const role of ['student', 'tutor']) {
  sh(`ssh ${PROD} 'dd if=${AUDIO_DIR}/${sessionId}/${role}.pcm16 bs=1M iflag=skip_bytes,count_bytes skip=${skip} count=${count} 2>/dev/null' > ${work}/${role}.pcm`);
}
sh(`ffmpeg -y -v error -f s16le -ar ${SAMPLE_RATE} -ac 1 -i ${work}/student.pcm -f s16le -ar ${SAMPLE_RATE} -ac 1 -i ${work}/tutor.pcm ` +
   `-filter_complex "[0:a][1:a]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5" -ar 48000 ${work}/audio.m4a`);

// ---- 3. Replay token --------------------------------------------------------
console.log('[3/5] minting replay token…');
const secrets = JSON.parse(sh(`ssh ${PROD} 'grep "^PORTAL_PARTNER_SECRETS=" ${PROD_APP}/.env.local | cut -d= -f2-'`));
const partner = doc.sourcePartnerId ?? Object.keys(secrets)[0];
const b64u = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const header = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const payload = b64u(JSON.stringify({ mode: 'replay', partner_id: partner, student_id: doc.studentId, session_id: sessionId, exp: Math.floor(Date.now() / 1000) + 6 * 3600 }));
const sig = createHmac('sha256', secrets[partner]).update(`${header}.${payload}`).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const token = `${header}.${payload}.${sig}`;

// ---- 4. Capture -------------------------------------------------------------
console.log('[4/5] recording replay (preload 2min + playback at 1x — total ≈', Math.round((PRELOAD_MS / 1000 + SEEK_MARGIN_S + clipLen + 30) / 60), 'min)…');
const seekS = Math.max(0, startS - SEEK_MARGIN_S);
const stopS = endS + 4;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: work, size: { width: 1920, height: 1080 } } });
const page = await context.newPage();
const log = { samples: [], status: 'started' };
try {
  await page.goto(`${REPLAY_ORIGIN}/tutor-portal/replay?token=${token}`, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.getByRole('button', { name: 'Open Session Replay' }).click({ timeout: 30_000 });
  if (preset === 'full') {
    try { await page.locator('button:has(svg.lucide-message-square-text)').first().click({ timeout: 5000 }); } catch { /* drawer optional */ }
  }
  await page.evaluate(() => setInterval(() => {
    document.querySelectorAll('.fixed.z-50 .overflow-y-auto').forEach((el) => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight > 40) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, 600));
  await page.waitForTimeout(PRELOAD_MS);

  const readClock = () => page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('div')).find(
      (d) => typeof d.className === 'string' && d.className.includes('justify-between') && d.className.includes('font-mono'));
    if (!row) return null;
    const parse = (el) => { const m = (el?.textContent || '').trim().match(/^(\d{1,3}):(\d{2})/); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
    const spans = Array.from(row.querySelectorAll(':scope > span'));
    const cur = parse(spans[0]); const total = parse(spans[spans.length - 1]);
    return cur !== null && total !== null ? { cur, total } : null;
  });
  let clock = await readClock();
  if (!clock || clock.total < doc.duration - 30) throw new Error(`bad clock read: ${JSON.stringify(clock)}`);
  await page.evaluate(([t, tot]) => {
    const bar = document.querySelector('div.h-6.bg-gray-200.cursor-pointer');
    const r = bar.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, clientX: r.left + r.width * (t / tot), clientY: r.top + r.height / 2, pointerId: 1, isPrimary: true, button: 0 };
    bar.dispatchEvent(new PointerEvent('pointerdown', opts));
    bar.dispatchEvent(new PointerEvent('pointerup', opts));
  }, [seekS, clock.total]);
  await page.waitForTimeout(1500);
  clock = await readClock();
  if (!clock || Math.abs(clock.cur - seekS) > 5) throw new Error(`seek rejected: ${JSON.stringify(clock)}`);
  await page.locator('button:has(svg.lucide-play)').last().click();

  const t0 = Date.now();
  let lastCur = clock.cur; let lastAdvance = Date.now();
  while (Date.now() - t0 < (SEEK_MARGIN_S + clipLen + 120) * 1000) {
    const c = await readClock();
    if (c) {
      log.samples.push({ e: Date.now(), s: c.cur });
      if (c.cur !== lastCur) { lastCur = c.cur; lastAdvance = Date.now(); }
      if (c.cur >= stopS) { log.status = 'done'; break; }
    }
    if (Date.now() - lastAdvance > 60_000) { log.status = 'stalled'; break; }
    await new Promise((r) => setTimeout(r, 150));
  }
} catch (err) { log.status = `error: ${err.message}`; }
log.closeEpoch = Date.now();
const videoObj = page.video();
await context.close();
const videoPath = videoObj ? await videoObj.path() : null;
await browser.close();
if (log.status !== 'done') throw new Error(`capture failed: ${log.status}`);

// ---- 5. Map + cut + mux -----------------------------------------------------
console.log('[5/5] mapping clock → video and rendering…');
const dur = Number(JSON.parse(execFileSync('ffprobe', ['-v', 'quiet', '-show_format', '-of', 'json', videoPath], { encoding: 'utf8' })).format.duration);
const tRec0 = log.closeEpoch - dur * 1000;
const flips = new Map();
for (const x of log.samples) if (!flips.has(x.s)) flips.set(x.s, x.e);
const pts = [...flips.entries()].filter(([s]) => s > seekS && s < stopS).map(([s, e]) => [s, (e - tRec0) / 1000]);
const n = pts.length;
const sx = pts.reduce((a, p) => a + p[0], 0), sy = pts.reduce((a, p) => a + p[1], 0);
const sxx = pts.reduce((a, p) => a + p[0] * p[0], 0), sxy = pts.reduce((a, p) => a + p[0] * p[1], 0);
const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
const a = (sy - b * sx) / n;
const cutStart = a + b * startS;
console.log(`  slope=${b.toFixed(5)} cutStart=${cutStart.toFixed(3)}s (${n} flips)`);
if (Math.abs(b - 1) > 0.01) throw new Error(`playback clock slope ${b} too far from 1x — refusing to cut`);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', cutStart.toFixed(3), '-i', videoPath, '-i', `${work}/audio.m4a`,
  '-t', String(clipLen), '-map', '0:v', '-map', '1:a', '-vf', `crop=${CROPS[preset]}`,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-r', '30', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', outFile]);
rmSync(work, { recursive: true, force: true });
console.log(`done: ${outFile} (${clipLen}s, preset=${preset})`);
