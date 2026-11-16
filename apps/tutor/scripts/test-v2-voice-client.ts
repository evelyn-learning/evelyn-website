/// <reference types="node" />
/**
 * Tutor brain v2 — the voice client's maturity pieces carried over from v1 (VoiceTutorRealtime): the sustained-energy
 * gate on a pause for a sound, the microphone re-acquired when the device changes, and captions in step with the
 * voice. Pure logic plus source pins; no network, no audio device.
 *   npm run test:v2-voice-client
 *
 * The offline section reads real learner audio from ~/.evelyn/gdi-audio/<name>/{student,tutor}.pcm16 (24 kHz mono
 * pcm16 from session start; private, laptop only, never copied into git) and is skipped when it is absent. It checks
 * the gate's numbers against the tutor's own Japanese and English speech reaching the microphone and against the
 * learners' real barge-ins in those sessions.
 */
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { BargeInFrame } from '../src/lib/tutor/voice/bargein-gate';
import { armV2SoundGate, stepV2SoundGate } from '../src/lib/tutor/v2/sound-gate';
import { V2MicWatch, type V2MicWatchDeps } from '../src/lib/tutor/v2/mic-watch';
import { V2Captions } from '../src/lib/tutor/v2/captions';
import { v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { v2CanRunSession } from '../src/lib/tutor/portal/partner-session-options';
import { BARGEIN_ENERGY_FLOOR, BARGEIN_ENERGY_THRESHOLD, BARGEIN_SUSTAIN_MS } from '../src/lib/tutor/orchestrator/flags';
import { MIC_TRACK_MUTED_REACQUIRE_MS } from '../src/lib/tutor/voice/mic-reacquire';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const src = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');

/** Frames at the recogniser's cadence (4096 samples at 24 kHz ≈ 171 ms), `levels` from `fromMs`. */
const FRAME_MS = 4096 / 24;
const framesOf = (fromMs: number, levels: number[]): BargeInFrame[] => levels.map((energy, i) => ({ tMs: fromMs + (i + 1) * FRAME_MS, energy }));
/** Step the gate every 50 ms from the onset until it says something other than 'wait'; the time it took, or null. */
function runGate(frames: BargeInFrame[], onsetMs: number, untilMs: number, speaking: (now: number) => boolean = () => true): { step: string; afterMs: number } | null {
  const gate = armV2SoundGate(frames.filter((f) => f.tMs <= onsetMs), onsetMs);
  if (!gate) return null;
  for (let now = onsetMs + 50; now <= untilMs; now += 50) {
    const step = stepV2SoundGate(gate, frames.filter((f) => f.tMs <= now), now, speaking(now));
    if (step !== 'wait') return { step, afterMs: now - onsetMs };
  }
  return { step: 'wait', afterMs: untilMs - onsetMs };
}

function soundGate() {
  console.log('the energy gate on a pause for a sound');
  const quiet = Array(6).fill(0.01);
  // A learner talking over the tutor: the level jumps far above the floor and stays (josh, 384 s: .47 1.0 1.0 .94).
  const talk = framesOf(0, [...quiet, 0.47, 1, 1, 0.94, 0.6, 0.5]);
  const onset = 6 * FRAME_MS;
  const t = runGate(talk, onset, onset + 2000);
  check('a learner talking over the tutor passes the gate within about three recogniser frames (under 600 ms)', t?.step === 'pause' && t.afterMs <= 600, t);
  // The tutor's own voice leaking in at a sentence start (tester-2, 1160 s: .15 .12 then the floor) is gone before
  // the sustain is met.
  const leak = framesOf(0, [...quiet, 0.15, 0.01, 0.01, 0.01, 0.01, 0.01]);
  check('a one-frame leak of the tutor\'s voice does not pause it', runGate(leak, onset, onset + 1500)?.step === 'wait', runGate(leak, onset, onset + 1500));
  // A cough: two loud frames, then quiet.
  const cough = framesOf(0, [...quiet, 0.8, 0.01, 0.01, 0.01, 0.01, 0.01]);
  check('a cough does not pause the tutor', runGate(cough, onset, onset + 1500)?.step === 'wait');
  // A loud room: the floor before the onset is high, so the bar rises with it (never above v1's fixed bar).
  const loud = armV2SoundGate(framesOf(0, Array(6).fill(0.05)), onset);
  const still = armV2SoundGate(framesOf(0, quiet), onset);
  check('the bar follows the level before the onset, between v1\'s floor and its fixed bar', !!loud && !!still && loud.threshold > still.threshold && still.threshold === BARGEIN_ENERGY_FLOOR && loud.threshold <= BARGEIN_ENERGY_THRESHOLD, { loud, still });
  const humming = framesOf(0, [...Array(6).fill(0.05), 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
  check('a level only just above a loud room\'s floor does not pause the tutor', runGate(humming, onset, onset + 1500)?.step === 'wait');
  check('a recogniser that reports no levels gives no gate: the sound pauses at once, as before', armV2SoundGate([], onset) === null);
  const stopped = runGate(talk, onset, onset + 2000, (now) => now < onset + 120);
  check('the tutor stopping on its own ends the gate', stopped?.step === 'drop', stopped);
  const g = armV2SoundGate(framesOf(0, quiet), onset)!;
  check('the gate gives up after v1\'s longest wait', stepV2SoundGate(g, framesOf(0, quiet), onset + 5001, true) === 'drop' && stepV2SoundGate(g, framesOf(0, quiet), onset + 4000, true) === 'wait');
  check('the sustain is v1\'s', BARGEIN_SUSTAIN_MS === 350);
}

function micWatch() {
  console.log('the microphone re-acquired on a device change');
  const make = (o: Partial<{ captureOpen: boolean; inFlight: boolean; muted: boolean; label: string; devices: Array<{ kind: string; deviceId: string; label: string }>; fail: boolean }> = {}) => {
    const st = { captureOpen: true, inFlight: false, muted: false, label: 'AirPods Pro', devices: [{ kind: 'audioinput', deviceId: 'default', label: 'Default - MacBook Microphone' }], fail: false, ...o };
    let clock = 0; const timers: Array<{ at: number; fn: () => void; id: number }> = []; let nextId = 1;
    const log: string[] = []; const notices: boolean[] = []; const reacquired: string[] = [];
    const deps: V2MicWatchDeps = {
      captureOpen: () => st.captureOpen, inFlight: () => st.inFlight, trackMuted: () => st.muted, label: () => st.label,
      listDevices: async () => st.devices,
      reacquire: (reason) => { reacquired.push(reason); return st.fail ? Promise.reject(new Error('NotAllowedError: denied')) : Promise.resolve({ label: 'MacBook Microphone' }); },
      log: (type, message) => log.push(`${type}: ${message}`),
      notice: (on) => notices.push(on),
      now: () => clock,
      setTimer: (fn, ms) => { const id = nextId++; timers.push({ at: clock + ms, fn, id }); return id; },
      clearTimer: (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); },
    };
    const advance = (ms: number) => { clock += ms; for (const t of [...timers].sort((a, b) => a.at - b.at)) if (t.at <= clock && timers.includes(t)) { timers.splice(timers.indexOf(t), 1); t.fn(); } };
    return { st, deps, log, notices, reacquired, advance, watch: new V2MicWatch(deps) };
  };
  const flush = () => new Promise((r) => setTimeout(r, 0));
  return (async () => {
    // AirPods taken out mid-lesson: the default input is now the laptop's microphone (v1 Task 27 §G, run 14).
    const a = make();
    a.watch.deviceChange(); await flush(); await flush();
    check('the default input changed: the microphone is opened again and the student is told', a.reacquired.join() === 'devicechange' && a.notices[0] === true && a.log.some((l) => /^mic_device_changed: devicechange/.test(l)) && a.log.some((l) => /^mic_reacquired: MacBook Microphone/.test(l)), a.log);
    a.watch.frame();
    check('the first sound from the new microphone takes the notice down', a.notices.at(-1) === false);
    a.advance(500); a.watch.deviceChange(); await flush(); await flush();
    check('the burst of device events while a device connects re-acquires once', a.reacquired.length === 1, a.reacquired);
    const b = make({ label: 'MacBook Microphone' });
    b.watch.deviceChange(); await flush(); await flush();
    check('a device change that leaves the default input alone (headphones for output) changes nothing', b.reacquired.length === 0 && b.log.some((l) => /^mic_device_change_ignored/.test(l)), b.log);
    const c = make();
    c.watch.trackEvent('ended'); await flush();
    check('the microphone track ending re-acquires at once', c.reacquired.join() === 'track-ended');
    const d = make({ muted: true });
    d.watch.trackEvent('mute'); d.advance(1000); d.watch.trackEvent('unmute'); d.advance(MIC_TRACK_MUTED_REACQUIRE_MS); await flush();
    check('a short mute at the source (a Bluetooth hiccup) is waited out', d.reacquired.length === 0);
    const e = make({ muted: true });
    e.watch.trackEvent('mute'); e.advance(MIC_TRACK_MUTED_REACQUIRE_MS + 100); await flush();
    check('muted at the source for more than three seconds: re-acquired', e.reacquired.length === 1 && /^track-muted 3\.\ds$/.test(e.reacquired[0]), e.reacquired);
    const f = make({ fail: true });
    f.watch.trackEvent('ended'); await flush(); await flush();
    check('a re-acquire that fails is logged and the notice comes down', f.log.some((l) => /^mic_reacquire_failed: Error: NotAllowedError/.test(l)) && f.notices.at(-1) === false, f.log);
    const g = make({ captureOpen: false });
    g.watch.deviceChange(); await flush(); await flush();
    check('no capture open (typed only, or before the start): nothing is done', g.reacquired.length === 0);
    const h = make({ muted: true });
    h.watch.trackEvent('mute'); h.watch.dispose(); h.advance(MIC_TRACK_MUTED_REACQUIRE_MS + 100); await flush();
    check('after the session is gone, a pending check does nothing', h.reacquired.length === 0);
  })();
}

function captions() {
  console.log('captions in step with the voice');
  const prog = (sentence: string | null, elapsedSec: number, arrivedTotalSec: number) => ({ sentence, elapsedSec, arrivedTotalSec, playing: sentence !== null });
  const c = new V2Captions();
  check('before the first reply nothing is live (the caption shows the transcript)', c.poll(null).live === false);
  c.begin();
  const s1 = 'Great, let\'s begin.'; const s2 = 'Can you tell me a little about your job?';
  c.sentence(s1, v2SpeechParts(s1, ['en'])); c.sentence(s2, v2SpeechParts(s2, ['en']));
  const mid = c.poll(prog(s2, 1.0, 2.6));
  check('the caption shows what has been said so far, to a whole word', mid.live && mid.text.startsWith(s1) && mid.text.length < `${s1} ${s2}`.length && mid.text.length > s1.length, mid);
  // A Japanese explanation quoting an English sentence is spoken in parts (v2/languages.ts); each part is reported
  // by the voice as it plays, and the caption covers its share of the sentence.
  const mixed = 'ただ、「I often attend a meeting.」は「会議によく出席する」という意味です。';
  const parts = v2SpeechParts(mixed, ['en', 'ja']);
  const m = new V2Captions(); m.begin(); m.sentence(mixed, parts);
  const first = m.poll(prog(parts[0], 0.4, 0.4)); const later = m.poll(prog(parts[parts.length - 1], 0.1, 3));
  check('a sentence spoken in language parts is captioned part by part', parts.length > 1 && first.live && later.text.length > first.text.length && later.text.length < mixed.length, { parts, first, later });
  c.cut();
  const cut = c.poll(prog(null, 0, 0));
  check('cut short by the student, the caption keeps what was heard and goes no further', cut.live && cut.text === mid.text, cut);
  c.streamEnd(); c.drain();
  check('a cut reply is not filled in when its stream ends', c.poll(null).text === mid.text);
  const d = new V2Captions(); d.begin(); d.sentence(s1, [s1]); d.poll(prog(s1, 1.5, 1.5)); d.streamEnd(); d.drain();
  const done = d.poll(null);
  check('a reply heard to the end shows whole and is no longer live', !done.live && done.text === s1, done);
  d.begin();
  check('the next reply starts a new caption under a new key', d.poll(null).text === '' && d.poll(null).turnKey !== done.turnKey);
}

function wiring() {
  console.log('the voice client');
  const v = src('src/app/tutor/components/v2/TutorVoiceV2.tsx');
  check('the pause on a sound waits for the energy gate, read from the recogniser that owns the microphone (no second tap of its frames)', /armV2SoundGate\(/.test(v) && /stepV2SoundGate\(/.test(v) && /getEnergyWindow/.test(v) && /TUTOR_V2_BARGEIN_ENERGY_GATE/.test(v));
  check('speech stopping before the gate passes ends the gate', /onSpeechStop = useCallback\(\(\) => \{[^\n]*stopSoundGate\(/.test(v));
  check('the microphone is watched for device changes', /new V2MicWatch\(/.test(v) && /'devicechange'/.test(v) && /evelyn:shared-mic-track/.test(v) && /evelyn:shared-mic-frame/.test(v) && /TUTOR_MIC_REACQUIRE/.test(v));
  check('the caption is polled from the voice, not a stub', /getSpokenCaption: \(\) => captionsRef\.current\.poll\(/.test(v) && /getSpokenProgress\(\)/.test(v));
  check('the header no longer lists these as missing', !/sustained-energy barge-in gate/.test(v.slice(0, 2000)) && !/caption sync/.test(v.slice(0, 2000)));
  check('the host passes its stage notice to the v2 voice client', /<TutorVoiceV2[\s\S]{0,4000}onStageNotice=\{setStageNotice\}/.test(src('src/app/tutor/components/session/TutorSession.tsx')));
  check('the pronunciation tap is unchanged: the recogniser\'s frames go to the recorder once', (v.match(/pronRef\.current\?\.frame\(f\)/g) ?? []).length === 2);
}

function admission() {
  console.log('a second teaching language');
  check('a lesson in English with a second language for help runs on v2', v2CanRunSession({ tutorLanguages: ['en', 'ja'] }) && v2CanRunSession({ tutorLanguages: ['en'] }) && v2CanRunSession({}));
  check('a lesson taught in another language still goes to v1', !v2CanRunSession({ tutorLanguages: ['ja'] }) && !v2CanRunSession({ tutorLanguages: ['ja', 'en'] }));
  check('the other kinds v2 has not taken over still go to v1, languages or not', !v2CanRunSession({ tutorLanguages: ['en', 'ja'], standby: true }) && !v2CanRunSession({ tutorLanguages: ['en', 'ja'], targetKind: 'diagnostic' }) && !v2CanRunSession({ tutorLanguages: ['en', 'ja'], sessionGoal: 'mock-review' }));
}

/** Real learner audio (offline). */
function realAudio() {
  const root = join(homedir(), '.evelyn', 'gdi-audio');
  console.log('real learner audio');
  if (!existsSync(root)) { console.log('  - skipped: no learner audio on this machine'); return; }
  const level = (path: string) => { const b = readFileSync(path); const n = Math.floor(b.length / 2 / 4096); const out = new Float64Array(n); for (let k = 0; k < n; k++) { let s = 0; for (let i = 0; i < 4096; i++) { const x = b.readInt16LE((k * 4096 + i) * 2) / 32768; s += x * x; } out[k] = Math.min(1, Math.sqrt(s / 4096) * 6); } return out; };
  const q = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? NaN; };
  // Each session: seconds from the start of the recording to the session's own clock (its log), and the seconds on
  // that clock at which v1 logged the learner coming in over the tutor (perception_bargein_* events). `held`: v1 armed
  // its gate there and the learner was not speaking over the tutor (the gate must hold).
  const sessions: Array<{ name: string; offsetS: number; bargeIns: number[]; held: number[] }> = [
    { name: 'josh', offsetS: 57.103, bargeIns: [384], held: [] },
    { name: 'james', offsetS: 20.259, bargeIns: [732], held: [] },
    { name: 'tester-2', offsetS: 18.931, bargeIns: [1106, 1190], held: [148] },
  ];
  const rows: string[] = [];
  for (const s of sessions) {
    const dir = join(root, s.name);
    if (!existsSync(join(dir, 'student.pcm16')) || !existsSync(join(dir, 'tutor.pcm16'))) { console.log(`  - ${s.name}: skipped (missing)`); continue; }
    const mic = level(join(dir, 'student.pcm16')); const tutor = level(join(dir, 'tutor.pcm16'));
    const n = Math.min(mic.length, tutor.length);
    const frames: BargeInFrame[] = Array.from({ length: n }, (_, k) => ({ tMs: (k + 1) * FRAME_MS, energy: mic[k] }));
    // The microphone while the tutor speaks: frames inside the tutor's speech (it on in this frame and both
    // neighbours), excluding three seconds around each logged barge-in.
    const near = (k: number) => s.bargeIns.some((t) => Math.abs(k * FRAME_MS / 1000 - (t + s.offsetS)) < 3);
    const echo: number[] = []; for (let k = 1; k < n - 1; k++) if (tutor[k - 1] > 0.02 && tutor[k] > 0.02 && tutor[k + 1] > 0.02 && !near(k)) echo.push(mic[k]);
    const thresholds: number[] = []; for (let k = 8; k < n; k += 7) if (tutor[k] > 0.02) thresholds.push(armV2SoundGate(frames.slice(k - 8, k), k * FRAME_MS)!.threshold);
    rows.push(`${s.name}: mic during the tutor's speech p50 ${q(echo, 0.5).toFixed(3)} p90 ${q(echo, 0.9).toFixed(3)} p99 ${q(echo, 0.99).toFixed(3)} (${echo.length} frames); the bar at onsets in its speech p50 ${q(thresholds, 0.5).toFixed(3)} p90 ${q(thresholds, 0.9).toFixed(3)}`);
    check(`${s.name}: the tutor's own voice reaches the microphone below the gate's floor nine times in ten`, q(echo, 0.9) < BARGEIN_ENERGY_FLOOR, q(echo, 0.9));
    for (const t of s.bargeIns) {
      // The onset: the first frame, from the tutor's speech on (within 2 s before the logged second), where the learner's
      // level rises above 0.1.
      const k0 = Math.floor((t + s.offsetS - 2) * 1000 / FRAME_MS); const k1 = Math.floor((t + s.offsetS + 1) * 1000 / FRAME_MS);
      let ktutor = -1; for (let k = k0; k <= k1; k++) if (tutor[k] > 0.02) { ktutor = k; break; }
      let kon = -1; for (let k = Math.max(ktutor, k0); k <= k1 && ktutor >= 0; k++) if (mic[k] > 0.1) { kon = k; break; }
      const r = kon < 0 ? null : runGate(frames.slice(0, kon + 20), kon * FRAME_MS, kon * FRAME_MS + 2000);
      const r300 = kon < 0 ? null : runGate(frames.slice(0, kon + 20), kon * FRAME_MS + 300, kon * FRAME_MS + 2300);
      rows.push(`${s.name} ${t}s barge-in: levels ${Array.from(mic.slice(kon, kon + 4)).map((x) => x.toFixed(2)).join(' ')}; gate ${r?.step} after ${r?.afterMs} ms from the sound (${r300?.step} after ${r300?.afterMs} ms with the onset reported 300 ms late)`);
      check(`${s.name} at ${t}s: the learner coming in over the tutor passes the gate within 600 ms`, r?.step === 'pause' && r.afterMs <= 600, r);
    }
    for (const t of s.held) {
      const k = Math.floor((t + s.offsetS) * 1000 / FRAME_MS);
      const r = runGate(frames.slice(0, k + 20), k * FRAME_MS, k * FRAME_MS + 1500);
      rows.push(`${s.name} ${t}s (v1's gate armed, no barge-in): gate ${r?.step}`);
      check(`${s.name} at ${t}s: an onset with only the tutor speaking does not pass the gate`, r?.step === 'wait', r);
    }
  }
  for (const r of rows) console.log(`    ${r}`);
}

async function main() {
  soundGate();
  await micWatch();
  captions();
  wiring();
  admission();
  realAudio();
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
