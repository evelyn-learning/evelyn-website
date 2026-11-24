/// <reference types="node" />
/**
 * Replay harness — the driver.
 *
 * Plays a fixture's scripted student (./scripted-student.ts) against the REAL
 * embed on a local dev server: a voice session with a silent fake microphone
 * and typed student turns, the same mechanics as scripts/trial-text-session.mjs.
 * Speech recognition and barge-in are not exercised; everything after the
 * student's words is (the client orchestrator, the brain, the checks, the board).
 *
 * LIVE: every run makes real model calls (brain, checks, TTS, one Haiku call
 * per student turn) and writes a session row to the database the dev server
 * points at. Run only with Praveen's go-ahead for the round.
 *
 *   npx tsx scripts/tutor/replay-harness/run-replay.ts --fixture calc-lhopital --arm v1 [--port 3019] [--out <dir>] [--max-min N]
 *
 * Needs: a dev server for this worktree on --port; PORTAL_PARTNER_SECRETS and
 * MONGODB_URI in the repo-root .env.local. Output: <out>/<fixture>-<arm>-<run>.json
 * (a RunBundle) and its scorecard printed and saved beside it.
 *
 * --audio-student <dir> (Task 6d): the student is a REAL learner's recorded turns (<dir>/clips.json and clips/NN.wav,
 * made by ./cut-clips.ts) played into the page through a fake microphone (./audio-student.ts), so the real v2 voice
 * client hears them: energy gate, speech recognition, turn end. Run it with --claims '{"input_mode":"voice"}'. The
 * tutor's speech is never synthesised: every TTS request is answered with silence of about the reply's length (the
 * client's playback clock still runs). The recogniser (Cartesia Ink) is live and billed.
 */
import { chromium } from 'playwright';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { needsOpeningLine, scriptedStudentTurn, type Fixture, type ReplayTurn } from './scripted-student';
import { scoreRun, type RunBundle } from './scorecard';
import { FAKE_MIC_INIT, clipPath, clipPcmBase64, loadClips, pickClip, silentTtsBody, type AudioClip } from './audio-student';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const fixtureName = arg('--fixture', 'calc-lhopital');
const arm = arg('--arm', 'v1');
const port = Number(arg('--port', '3019'));
const outDir = arg('--out', path.join(process.cwd(), 'artifacts', 'replay-harness'));
fs.mkdirSync(outDir, { recursive: true });

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', `${fixtureName}.json`), 'utf8')) as Fixture;
const maxMin = Number(arg('--max-min', String(fixture.maxMinutes)));
const runId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
// --student <id> overrides the generated student id (e.g. gdi-v2-replay-b1-v1).
const studentId = arg('--student', `replay-${fixture.name}-${runId}`);
const audioDir = arg('--audio-student', '').replace(/^~/, process.env.HOME ?? '~');
const audioClips: AudioClip[] = audioDir ? loadClips(audioDir) : [];
// --say-student <macOS voice> (lesson-language check, 2026-11-24): the scripted student's words are SPOKEN: each turn
// the model writes is synthesised with the system voice (`say -v Meijia` for Taiwan Mandarin, `Kyoko` for Japanese)
// and played into the page through the fake microphone, so the live recogniser hears a lesson in that language.
// As with --audio-student the tutor's speech is silence of the reply's length, and the recogniser is live and billed.
const sayVoice = arg('--say-student', '');
const fakeMic = !!audioDir || !!sayVoice;
function sayClip(text: string, n: number): { b64: string; sec: number } {
  const base = path.join(outDir, `say-${runId}-${String(n).padStart(2, '0')}`);
  // `say` has hung for good on a line (2026-11-24, two hours): ten seconds, then one more try.
  try { execFileSync('say', ['-v', sayVoice, '-o', `${base}.aiff`, text], { timeout: 10_000 }); }
  catch { execFileSync('say', ['-v', sayVoice, '-o', `${base}.aiff`, text], { timeout: 20_000 }); }
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', `${base}.aiff`, '-ac', '1', '-ar', '24000', '-c:a', 'pcm_s16le', '-map_metadata', '-1', '-fflags', '+bitexact', `${base}.wav`]);
  fs.rmSync(`${base}.aiff`, { force: true });
  const buf = fs.readFileSync(`${base}.wav`); const at = buf.indexOf(Buffer.from('data')); const pcm = buf.subarray(at + 8);
  return { b64: pcm.toString('base64'), sec: pcm.length / 2 / 24000 };
}

// ── env (repo-root .env.local; values are never printed) ──
const envText = fs.readFileSync(path.resolve(process.cwd(), '../../.env.local'), 'utf8');
const envVal = (k: string) => { const m = envText.match(new RegExp(`^${k}=(.*)$`, 'm')); return m ? m[1].trim().replace(/^(['"])(.*)\1$/, '$2') : ''; };
// REPLAY_PARTNER_SECRET: a partner whose secret is not in PORTAL_PARTNER_SECRETS (greenapple: its academy env's
// ENGINE_EMBED_JWT_SECRET), passed for the run only and never written down.
const secret = process.env.REPLAY_PARTNER_SECRET || (JSON.parse(envVal('PORTAL_PARTNER_SECRETS') || '{}') as Record<string, string>)[fixture.partner];
if (!secret) { console.error(`no secret for partner ${fixture.partner} in PORTAL_PARTNER_SECRETS`); process.exit(1); }
const mongoUri = envVal('MONGODB_URI');

const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const now = Math.floor(Date.now() / 1000);
// --claims '{"input_mode":"text","brain_version":"v2"}' overrides the fixture's claims for this run.
const extraClaims = JSON.parse(arg('--claims', '{}')) as Record<string, unknown>;
const payload = { ...fixture.claims, ...extraClaims, partner_id: fixture.partner, student_id: studentId, iat: now, exp: now + 3 * 3600 };
const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' })); const body = b64(JSON.stringify(payload));
const token = `${head}.${body}.${b64(crypto.createHmac('sha256', secret).update(`${head}.${body}`).digest())}`;
const embedUrl = `http://localhost:${port}/tutor-portal/embed?token=${token}`;

const silentWav = path.join(outDir, 'silence.wav');
if (!fs.existsSync(silentWav)) {
  const rate = 16000; const data = Buffer.alloc(rate * 30 * 2); const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(silentWav, Buffer.concat([h, data]));
}

const log: string[] = [];
const page_note: string[] = [];
const say = (s: string) => { const line = `${new Date().toISOString().slice(11, 19)} ${s}`; console.log(line); log.push(line); };
// A goodbye in either teaching language (お疲れさまでした / また次回 close a bilingual lesson).
const AUDIO_CLOSE_RE = /\bsee you next time\b|\bgoodbye\b|\bbye for now\b|\bthank you for (?:practi[sc]ing|the lesson|your time) (?:with me )?today\b|\bthank you for today'?s lesson\b|ありがとうございました。?\s*$|お疲れさまでした|また次回|再見|再见|下次見|下次见|拜拜|さようなら|また(?:ね|今度|お会い)/i;
const CLOSE_RE = /\bsee you next time\b|\bthat'?s (?:all|it) for today\b|\bwe can wrap up here\b|\bthanks for working through it today\b|\bgoodbye\b|\bbye for now\b/i;

type BrainTurn = { t: number; sentences: string[]; tools: string[]; board: string[]; said?: string; silence?: number };
declare global { interface Window { __brain?: { inFlight: number; turns: BrainTurn[] }; __play?: { end: number; buffers: number }; __mic?: { play: (b64: string) => number; plays: number; gum: number }; __ws?: Array<{ u: string; t0: number; t1: number }> } }

async function main() {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', ...(fakeMic ? [] : [`--use-file-for-fake-audio-capture=${silentWav}`]), '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1000, height: 820 } });
  if (fakeMic) await ctx.addInitScript(FAKE_MIC_INIT);
  // Tee the brain stream inside the page: window.__brain = { inFlight, turns: [{t, sentences, tools}] }.
  await ctx.addInitScript(() => {
    window.__brain = { inFlight: 0, turns: [] };
    const orig = window.fetch;
    window.fetch = async function (this: unknown, ...args: Parameters<typeof fetch>) {
      const input = args[0];
      const url = typeof input === 'string' ? input : (input as Request)?.url ?? '';
      if (!url.includes('/api/tutor/brain/stream') && !url.includes('/api/tutor/brain-v2/turn')) return orig.apply(this as typeof globalThis, args);
      window.__brain!.inFlight += 1;
      // What the turn was asked with: the words the client heard (studentSaid) or a silence.
      let said: string | undefined; let silence: number | undefined;
      try { const b = JSON.parse(String((args[1] as RequestInit | undefined)?.body ?? '{}')) as { studentSaid?: string; silenceSeconds?: number }; said = b.studentSaid; silence = b.silenceSeconds; } catch { /* not JSON */ }
      let res: Response;
      try { res = await orig.apply(this as typeof globalThis, args); } catch (e) { window.__brain!.inFlight -= 1; throw e; }
      try {
        const clone = res.clone();
        void (async () => {
          const sentences: string[] = []; const tools: string[] = []; const board: string[] = []; let buf = '';
          try {
            const reader = clone.body!.getReader(); const dec = new TextDecoder('utf-8');
            for (;;) {
              const { value, done } = await reader.read(); if (done) break;
              buf += dec.decode(value, { stream: true });
              let i: number;
              while ((i = buf.indexOf('\n\n')) >= 0) {
                const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
                for (const line of chunk.split('\n')) {
                  if (!line.startsWith('data: ')) continue;
                  try {
                    const ev = JSON.parse(line.slice(6));
                    if (ev.type === 'sentence' && ev.text) sentences.push(ev.text);
                    // v2 streams text deltas; the whole reply is kept as one "sentence".
                    if (ev.type === 'text' && ev.delta) { if (!sentences.length) sentences.push(''); sentences[sentences.length - 1] += ev.delta; }
                    if (ev.type === 'tool-call' && typeof ev.outcome === 'string' && /^not painted|^saved|^recorded|^not |^the session/.test(ev.outcome)) continue;
                    if (ev.type === 'tool-call' && ev.name) tools.push(ev.name);
                    // What the tool call puts on the board, so the scripted student can "see" it.
                    if (ev.type === 'tool-call' && ev.args && typeof ev.args === 'object') {
                      const g = ev.args as Record<string, unknown>; const prob = (g.problem ?? {}) as Record<string, unknown>;
                      const shown = [prob.title, prob.statement, g.statement, g.latex, g.text, g.title].filter((v) => typeof v === 'string' && v).join(' — ');
                      if (shown) board.push(`${ev.name}: ${shown}`.slice(0, 600));
                    }
                  } catch { /* partial frame */ }
                }
              }
            }
          } catch { /* stream aborted */ }
          window.__brain!.inFlight = Math.max(0, window.__brain!.inFlight - 1);
          window.__brain!.turns.push({ t: Date.now(), sentences, tools, board, said, silence });
        })();
      } catch { window.__brain!.inFlight = Math.max(0, window.__brain!.inFlight - 1); }
      return res;
    } as typeof fetch;
  });
  // No /var/data on a laptop: answer audio uploads with a stub so the recorder clears.
  await ctx.route('**/api/tutor/session-audio*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"stub":true}' }));
  // --no-speech: no paid speech for a run nobody hears. Cartesia (speech out and the mic's transcription) needs a
  // token minted here, and every other voice goes through a tts-* route; refuse them all.
  let silentTts = 0;
  if (fakeMic) {
    // The recogniser stays live (cartesia-token + the stt socket); the tutor's voice is silence of the reply's length.
    await ctx.route(/\/api\/tutor\/tts[a-z-]*(\?|$)/, (route) => {
      let text = ''; try { text = String((JSON.parse(route.request().postData() ?? '{}') as { text?: string }).text ?? ''); } catch { /* none */ }
      silentTts += 1;
      return route.fulfill({ status: 200, contentType: 'application/octet-stream', body: silentTtsBody(text) });
    });
    await ctx.routeWebSocket(/cartesia\.ai\/tts/, (ws) => { say('speech socket refused: cartesia tts'); ws.close(); });
    page_note.push(audioDir ? `audio student ${path.basename(audioDir)} (${audioClips.length} clips), silent tutor voice` : `spoken student (say -v ${sayVoice}), silent tutor voice`);
  } else if (process.argv.includes('--no-speech')) {
    await ctx.route(/\/api\/tutor\/(cartesia-token|tts[a-z-]*)(\?|$)/, (route) => { say(`speech refused: ${route.request().url().replace(/\?.*/, '')}`); return route.fulfill({ status: 403, contentType: 'application/json', body: '{"error":"speech off for this run"}' }); });
    await ctx.route(/cartesia\.ai/, (route) => { say('speech refused: cartesia.ai'); return route.abort(); });
    page_note.push('speech off');
  }
  // A replay student is not a real learner: no practice is assigned for them.
  await ctx.route('**/api/tutor/practice-assign**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"stub":true,"assigned":[]}' }));

  const page = await ctx.newPage();
  page.on('pageerror', (e) => say(`PAGEERROR ${String(e).slice(0, 200)}`));
  const wait = (ms: number) => page.waitForTimeout(ms);
  const heardLog: string[] = [];
  const brainTurns: BrainTurn[] = []; let inFlight = 0; let lastEnd = 0; let lastWords = 0;
  const poll = async () => {
    const b = await page.evaluate(() => { const t = window.__brain?.turns.splice(0) ?? []; return { inFlight: window.__brain?.inFlight ?? 0, turns: t }; }).catch(() => ({ inFlight: 0, turns: [] as BrainTurn[] }));
    inFlight = b.inFlight;
    for (const x of b.turns) {
      brainTurns.push(x); lastEnd = Date.now(); lastWords = x.sentences.join(' ').split(/\s+/).filter(Boolean).length;
      if (fakeMic) { if (typeof x.said === 'string' && x.said) { heardLog.push(x.said); say(`HEARD  ${x.said}`); } else if (x.silence) say(`HEARD  (silence ${x.silence} s)`); }
      say(`TUTOR  ${x.sentences.join(' ').slice(0, 300)}${x.tools.length ? `   [tools: ${x.tools.join(', ')}]` : ''}`);
    }
  };
  // Quiet = no stream in flight and enough time for the last turn to have been spoken.
  const waitQuiet = async (maxMs: number) => {
    const end = Date.now() + maxMs;
    for (;;) {
      await poll();
      const quietFor = Date.now() - lastEnd;
      if (fakeMic) {
        const playEnd = await page.evaluate(() => window.__play?.end ?? 0).catch(() => 0);
        if (inFlight === 0 && lastEnd > 0 && Date.now() > playEnd + 1200 && quietFor >= 2500) return true;
      } else if (inFlight === 0 && lastEnd > 0 && quietFor >= lastWords * 380 + 1500 && quietFor >= 2500) return true;
      if (Date.now() > end) return false;
      await wait(400);
    }
  };

  await page.goto(embedUrl, { waitUntil: 'domcontentloaded' });
  say(`open fixture=${fixture.name} arm=${arm} student=${studentId}${page_note.length ? ` (${page_note.join(', ')})` : ''}`);
  const orb = page.locator('[data-testid="tutor-orb-start"]');
  const input = page.locator('input[name="studentText"]');
  // The start tap is dead until the page's audio relay is ready (seen as "Tap to start" still
  // showing after a click, about 1 start in 3 and every start under load). Tap, look, tap again.
  let started = false;
  for (let attempt = 1; attempt <= 8 && !started; attempt++) {
    try { await orb.waitFor({ state: 'visible', timeout: attempt === 1 ? 45000 : 3000 }); }
    catch { started = true; say(attempt === 1 ? 'no start orb (auto-start?)' : 'start orb gone'); break; }
    await wait(attempt === 1 ? 3000 : 1500);
    await orb.click({ timeout: 5000 }).catch(() => {});
    say(`clicked start (${attempt})`);
    const end = Date.now() + 8000;
    while (Date.now() < end && !started) {
      started = !(await orb.isVisible().catch(() => false)) || (await page.evaluate(() => (window.__brain?.turns.length ?? 0) + (window.__brain?.inFlight ?? 0)).catch(() => 0)) > 0;
      if (!started) await wait(500);
    }
  }
  if (!started) say('start did not take after 8 taps');
  // input_mode "text" shows no start orb and the tutor waits for the learner to type first ("Type your question
  // below to start"). Open with one line (--open "...") so the run does not stall; the line is kept as a student turn.
  let openingLine = '';
  if (needsOpeningLine(payload) && !(await orb.isVisible().catch(() => false)) && (await page.evaluate(() => (window.__brain?.turns.length ?? 0) + (window.__brain?.inFlight ?? 0)).catch(() => 0)) === 0) {
    await wait(8000);
    if ((await page.evaluate(() => (window.__brain?.turns.length ?? 0) + (window.__brain?.inFlight ?? 0)).catch(() => 0)) === 0) {
      openingLine = arg('--open', 'Hello, I am ready.');
      try { await input.click({ timeout: 15000 }); await input.fill(openingLine); await input.press('Enter'); say(`STUDENT(open) ${openingLine}`); } catch (e) { throw new Error(`could not type the opening line (${String((e as Error).message).split('\n')[0].slice(0, 60)})`); }
    }
  }
  const t0 = Date.now();
  const turns: ReplayTurn[] = [];
  let sinceStudent = openingLine ? Date.now() : 0; let studentTurns = 0;
  if (openingLine) turns.push({ role: 'student', text: openingLine, tag: 'ack' });
  let endedBy: RunBundle['endedBy'] = 'cap';
  const usedClips: number[] = [];
  const audioPicks: Array<{ n: number; fit: string; why: string; live: string; heard: string; sec: number; heardFrom?: number; turn?: { heard: string } }> = [];
  while (Date.now() - t0 < maxMin * 60000 && studentTurns < fixture.maxStudentTurns) {
    const quiet = await waitQuiet(150000);
    if (!quiet) { say('no tutor activity for 150 s'); endedBy = 'stall'; break; }
    const text = brainTurns.filter((x) => x.t > sinceStudent).map((x) => x.sentences.join(' ')).join(' ').trim();
    if (!text) {
      if (sinceStudent && Date.now() - sinceStudent > 240000) { say('no tutor turn for 4 min — treating as ended'); endedBy = 'stall'; break; }
      await wait(3000); continue;
    }
    const history = [...turns];
    turns.push({ role: 'tutor', text });
    // The student sees the board; the stored turn keeps only what was spoken.
    const boardNow = brainTurns.filter((x) => x.t > sinceStudent).flatMap((x) => x.board);
    // A figure went up this turn: keep a picture of the board for review (settle so it has drawn).
    if (boardNow.length || brainTurns.some((x) => x.t > sinceStudent && x.tools.length)) {
      await wait(2500);
      await page.screenshot({ path: path.join(outDir, `${fixture.name}-${arm}-${runId}-t${String(studentTurns).padStart(2, '0')}.png`), fullPage: false }).catch(() => {});
    }
    if (audioDir) {
      // The tutor has said goodbye: a clip now would go unheard (the session is closed) and only burn minutes.
      if (AUDIO_CLOSE_RE.test(text.slice(-400))) { say('STUDENT(end) the tutor said goodbye'); endedBy = 'tutor_close'; break; }
      const pick = await pickClip(fixture.student.who, audioClips, usedClips, history, text);
      if ('end' in pick) { say(`STUDENT(end) ${pick.why}`); endedBy = CLOSE_RE.test(text) ? 'tutor_close' : 'student_end'; break; }
      const clip = audioClips.find((c) => c.n === pick.n)!;
      const { b64, sec } = clipPcmBase64(clipPath(audioDir, clip.n));
      await wait(900 + Math.random() * 900);
      const heardBefore = heardLog.length;
      // The tutor's reply to this clip ends after the clip starts: the next turn's text is read from here.
      const playStart = Date.now();
      await page.evaluate((x) => window.__mic!.play(x), b64);
      usedClips.push(clip.n);
      say(`STUDENT(clip #${clip.n} ${pick.fit}${clip.check !== 'ok' ? ` cut=${clip.check}` : ''}, ${sec.toFixed(1)} s) ${clip.text}  — ${pick.why}`);
      // Wait for the clip to play and the client to hear it (a turn asked with its words), up to 20 s after it ends.
      // Everything heard until the next clip plays belongs to this one (the recogniser may split it in two).
      // Wait for the recogniser's final words, not its first fragment: a long clip can arrive as "Oh." and the rest
      // 20 s later (v2audio-6e2, Tester B #22), which shifted every later "heard" by one clip. Done when what was heard
      // holds at least half the clip's words and nothing new came for 2.5 s, or 30 s after the clip ended.
      const playEnd = Date.now() + sec * 1000; const until = playEnd + 30000;
      const want = Math.max(1, Math.ceil(clip.text.split(/\s+/).filter(Boolean).length * 0.5));
      let lastGrow = Date.now(); let seen = heardLog.length;
      while (Date.now() < until) {
        await poll();
        if (heardLog.length !== seen) { seen = heardLog.length; lastGrow = Date.now(); }
        const words = heardLog.slice(heardBefore).join(' ').split(/\s+/).filter(Boolean).length;
        if (heardLog.length > heardBefore && Date.now() > playEnd && Date.now() - lastGrow > 2500 && (words >= want || /[\u3040-\u30ff\u3400-\u9fff]/.test(clip.text))) break;
        await wait(300);
      }
      if (heardLog.length === heardBefore) say(`  (not heard within 20 s of the clip's end)`);
      const turn = { role: 'student' as const, text: clip.text, tag: 'answer' as const, clip: clip.n, fit: pick.fit, heard: '', why: pick.why };
      turns.push(turn);
      audioPicks.push({ n: clip.n, fit: pick.fit, why: pick.why, live: clip.text, heard: '', sec, heardFrom: heardBefore, turn });
      studentTurns += 1; sinceStudent = playStart;
      continue;
    }
    const reply = await scriptedStudentTurn(fixture.student, boardNow.length ? `${text}\n[board now shows] ${boardNow.join(' | ')}` : text, history);
    if (reply.tag === 'end' || !reply.say) {
      say(`STUDENT(end)`); endedBy = CLOSE_RE.test(text) ? 'tutor_close' : 'student_end'; break;
    }
    if (sayVoice) {
      if (AUDIO_CLOSE_RE.test(text.slice(-200))) { say('STUDENT(end) the tutor said goodbye'); endedBy = 'tutor_close'; break; }
      const { b64, sec } = sayClip(reply.say, studentTurns);
      await wait(900 + Math.random() * 900);
      const heardBefore = heardLog.length; const playStart = Date.now();
      await page.evaluate((x) => window.__mic!.play(x), b64);
      say(`STUDENT(${reply.tag}, spoken ${sec.toFixed(1)} s) ${reply.say.slice(0, 300)}`);
      // Wait for the clip to play and the client to hear it: something heard, the clip over, nothing new for 2.5 s.
      const playEnd = Date.now() + sec * 1000; const until = playEnd + 30000; let lastGrow = Date.now(); let seen = heardLog.length;
      while (Date.now() < until) {
        await poll();
        if (heardLog.length !== seen) { seen = heardLog.length; lastGrow = Date.now(); }
        if (heardLog.length > heardBefore && Date.now() > playEnd && Date.now() - lastGrow > 2500) break;
        await wait(300);
      }
      if (heardLog.length === heardBefore) say(`  (not heard within 30 s of the clip's end)`);
      const turn = { role: 'student' as const, text: reply.say, tag: reply.tag, heard: '' };
      turns.push(turn);
      audioPicks.push({ n: studentTurns, fit: 'ok', why: 'spoken', live: reply.say, heard: '', sec, heardFrom: heardBefore, turn });
      studentTurns += 1; sinceStudent = playStart;
      continue;
    }
    await wait(1500 + Math.random() * 2000);
    try { await input.click({ timeout: 8000 }); await input.fill(reply.say); await input.press('Enter'); }
    catch (e) { say(`input gone (${String((e as Error).message).split('\n')[0].slice(0, 60)}) — treating as closed`); endedBy = 'tutor_close'; break; }
    turns.push({ role: 'student', text: reply.say, tag: reply.tag });
    studentTurns += 1; sinceStudent = Date.now();
    say(`STUDENT(${reply.tag}) ${reply.say.slice(0, 300)}`);
    await wait(1500);
  }
  const minutes = (Date.now() - t0) / 60000;
  let audioMeta: Record<string, unknown> | undefined;
  await page.screenshot({ path: path.join(outDir, `${fixture.name}-${arm}-${runId}.png`), fullPage: false }).catch(() => {});
  // Late hearings (a clip heard after the loop moved on) and the socket times, before the page goes.
  if (fakeMic) {
    await poll();
    audioPicks.forEach((pk, i) => { pk.heard = heardLog.slice(pk.heardFrom, audioPicks[i + 1]?.heardFrom ?? heardLog.length).join(' / '); if (pk.turn) pk.turn.heard = pk.heard; delete pk.heardFrom; delete pk.turn; });
    const ws = await page.evaluate(() => window.__ws ?? []).catch(() => [] as Array<{ u: string; t0: number; t1: number }>);
    const stt = ws.filter((w) => /cartesia\.ai\/stt/.test(w.u));
    const sttSec = stt.reduce((a, w) => a + ((w.t1 || Date.now()) - w.t0) / 1000, 0);
    const mic = await page.evaluate(() => ({ plays: window.__mic?.plays ?? 0, gum: window.__mic?.gum ?? 0, buffers: window.__play?.buffers ?? 0 })).catch(() => null);
    audioMeta = { sttSockets: stt.length, sttSocketSeconds: Math.round(sttSec), clipSeconds: Math.round(audioPicks.reduce((a, p) => a + p.sec, 0)), silentTtsReplies: silentTts, mic, otherSockets: [...new Set(ws.filter((w) => !/cartesia\.ai\/stt/.test(w.u)).map((w) => w.u))] };
    say(`audio: ${JSON.stringify(audioMeta)}`);
  }
  say('waiting 35 s for the autosave'); await wait(35000);
  await browser.close();

  // Read the stored session back (read-only) for its events and cost.
  let events: RunBundle['events'] = []; let sessionId: string | undefined; let estimatedCost: number | undefined;
  try {
    await mongoose.connect(mongoUri);
    const row = await mongoose.connection.db!.collection('tutorsessions').find({ studentId }).sort({ createdAt: -1 }).limit(1).next();
    if (row) {
      sessionId = row.sessionId as string; estimatedCost = row.estimatedCost as number | undefined;
      events = ((row.debugEvents ?? []) as Array<{ type: string; message: string }>).map((e) => ({ type: e.type, message: String(e.message ?? '') }));
    } else say('no session row found for this student');
  } catch (e) { say(`session read failed: ${(e as Error).message.slice(0, 120)}`); }
  finally { await mongoose.disconnect().catch(() => {}); }

  const bundle: RunBundle = { fixture: fixture.name, arm, sessionId, startedAt: new Date(t0).toISOString(), minutes, turns, events, estimatedCost, endedBy };
  const base = path.join(outDir, `${fixture.name}-${arm}-${runId}`);
  // A homework-problem plan (GAC): the outcome the academy would read, and any key value the tutor stated.
  if (!process.env.MONGODB_URI) process.env.MONGODB_URI = mongoUri;
  const homework = payload.session_goal === 'homework-help' && payload.curriculum_module
    ? await (await import('./homework-outcome')).homeworkRunOutcome(String(payload.curriculum_module), turns, events).catch((e) => { say(`homework outcome failed: ${(e as Error).message.slice(0, 120)}`); return null; })
    : null;
  if (homework) say(`homework outcome=${homework.outcome} reveals=${homework.reveals.length}`);
  // The stored transcript: what the session itself kept as the student's words (the recogniser's text).
  let stored: Array<{ role: string; text: string }> = [];
  if (fakeMic) {
    try { await mongoose.connect(mongoUri); const row = await mongoose.connection.db!.collection('tutorsessions').find({ studentId }).sort({ createdAt: -1 }).limit(1).next(); stored = ((row?.transcript ?? []) as Array<{ role: string; text: string }>).map((t) => ({ role: t.role, text: t.text })); }
    catch { /* read only, best effort */ } finally { await mongoose.disconnect().catch(() => {}); }
  }
  fs.writeFileSync(`${base}.json`, JSON.stringify({ ...bundle, ...(homework ? { homework } : {}), ...(fakeMic ? { audio: { ...audioMeta, picks: audioPicks, storedTranscript: stored } } : {}) }, null, 2));
  fs.writeFileSync(`${base}.log`, log.join('\n'));
  const card = scoreRun(bundle);
  fs.writeFileSync(`${base}.score.json`, JSON.stringify(card, null, 2));
  console.log(`\n=== ${fixture.name} / ${arm} · ${minutes.toFixed(1)} min · session ${sessionId ?? '?'} · bundle ${base}.json`);
  console.log(JSON.stringify(card, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
