/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8k: mic test 13 (embed-1795453600266; task-8k-report.md). Pronunciation item #1, "I have worked with
 * international customers for several years.", armed at 17:05.74. The real timings (session row debugEvents + the dev log):
 *   - his speech began 17:16.66 (the recogniser's final came 4989 ms after its start);
 *   - the recogniser's stop at 17:21.61 sent the clip (4949 ms of his speech): "I have worked with", scored not_attempted (completeness 44);
 *   - the final "I have worked with" at 17:21.65 took the floor; T89 "Please say the whole sentence once more…" was spoken;
 *   - his next stretch began 17:21.77 (its final came 4092 ms after its start, at ~17:25.86), 160 ms after the stop: "international
 *     customers for several years." was left out as another voice at 17:26.43 (the tutor was speaking).
 * Now (PRON_PAUSE_HOLD) the stop holds the clip open V2_PRON_PAUSE_HOLD_MS; speech again within it is the same attempt: one clip, one
 * turn with the whole sentence. Speech after a longer silence is not the attempt (by timing: its start came after the hold ran out).
 * No network (a stub assess call), no model, nothing to the speech vendor or the scorer.
 *   npm run test:brain-v2-mic13-8k
 *
 *  1 the session: the attempt with the 160 ms pause is one clip (both parts in it) and one turn of the whole sentence; its score is taken
 *  2 a true room voice after a long silence (2.4 s, and just past the hold, 1.3 s): not the attempt; the attempt went alone
 *  3 a part's final late (after the hold ran out): waited for; a final that never comes: the attempt goes after V2_PRON_FINAL_WAIT_MS
 *  4 the recogniser's resume of the same turn: one part, one final
 *  5 8g still holds: the onset 50 ms before the voice end is recorded; a tail echo within 400 ms is dropped (nothing released, arm kept)
 *  6 the capture's blip rule still holds (a stop with < 400 ms of speech is not held)
 *  7 outside an armed attempt: nothing held, every transcript goes to the filter as before; no release callback: as before
 *  8 the voice client's wiring (source): the hold diverts only the attempt's words; the first part goes through main's filter unchanged
 *  9 NEXT_PUBLIC_TUTOR_V2_PRON_PAUSE_HOLD=off (child process): as at 70911952 (the clip sent at the stop, nothing held)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { V2PronunciationRecorder, V2_PRON_ATTEMPT_MAX_MS, V2_PRON_FINAL_WAIT_MS, V2_PRON_PAUSE_HOLD_MS } from '../src/lib/tutor/v2/pronunciation-recorder';
import { TUTOR_V2_PRON_PAUSE_HOLD } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC13_8K_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ ${label}`); if (detail !== undefined) console.log('    ', JSON.stringify(detail).slice(0, 1500)); }
};
const src = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');

const REF = 'I have worked with international customers for several years.';
const PART1 = 'I have worked with';
const PART2 = 'international customers for several years.';
/** mm:ss.cc of the lesson → ms. */
const at = (m: number, s: number) => Math.round((m * 60 + s) * 1000);

/** A recorder on a fake clock with fake timers; frames of 20 ms move the clock and fire due timers. */
function rig(opts: { release?: boolean; pauseHold?: boolean } = {}) {
  let t = at(17, 5.74); const log: string[] = []; const posted: Array<{ ms: number }> = []; const released: string[][] = [];
  let timers: Array<{ at: number; fn: () => void; id: number }> = []; let nextId = 1;
  const fetchImpl = (async (_u: string, init: { body: string }) => {
    const body = JSON.parse(init.body) as { audio: string };
    posted.push({ ms: Math.round((Buffer.from(body.audio, 'base64').length / 2 / 24000) * 1000) });
    return { ok: true, status: 200, json: async () => ({ status: 'ok', measured: true, result: { overall: 73, words: [] } }) };
  }) as unknown as typeof fetch;
  const rec = new V2PronunciationRecorder({
    sessionId: 's', now: () => t, fetchImpl, log: (type, m) => log.push(`${type} ${m}`),
    ...(opts.pauseHold !== undefined ? { pauseHold: opts.pauseHold } : {}),
    setTimer: (fn, ms) => { const id = nextId++; timers.push({ at: t + ms, fn, id }); return id; },
    clearTimer: (h) => { timers = timers.filter((x) => x.id !== h); },
  });
  if (opts.release !== false) rec.holdPauses((parts) => released.push(parts));
  const fire = () => { for (;;) { const due = timers.filter((x) => x.at <= t).sort((a, b) => a.at - b.at)[0]; if (!due) return; timers = timers.filter((x) => x !== due); due.fn(); } };
  /** Advance the clock to `to`, pushing mic frames (speech or silence alike: the capture keeps what it is given). */
  const until = (to: number) => { while (t + 20 <= to) { rec.frame(new Float32Array(480).fill(0.2)); t += 20; fire(); } t = to; fire(); };
  return { rec, log, posted, released, until, now: () => t, sent: () => log.filter((x) => x.startsWith('pronunciation_clip_sent')) };
}

async function main() {
  if (!CHILD) await sections();
  await wiring();
  await offChild();
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

async function sections() {
  console.log(`1 the session (17:16.66 start, 17:21.61 stop, 17:21.65 "${PART1}", 17:21.77 speech again, ~17:25.86 "${PART2}")`);
  {
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false);
    r.until(at(17, 21.61)); r.rec.speechStop();
    check('the stop sends nothing yet (the attempt is held)', r.sent().length === 0 && r.rec.holdsAttempt(), r.log);
    r.until(at(17, 21.65));
    const took1 = r.rec.attemptWords(PART1);
    check(`"${PART1}" is kept for the attempt (it does not take the floor)`, took1 && r.released.length === 0, r.log);
    r.until(at(17, 21.77)); r.rec.speechStart(false);
    check('speech again 160 ms after the stop: the same attempt', r.log.some((x) => x.startsWith('pronunciation_pause_held #1 speech again 160 ms')), r.log);
    r.until(at(17, 25.82)); r.rec.speechStop();
    r.until(at(17, 25.86));
    const took2 = r.rec.attemptWords(PART2);
    check(`"${PART2}" is kept for the same attempt (never judged apart)`, took2 && r.released.length === 0, r.log);
    r.until(at(17, 25.82) + V2_PRON_PAUSE_HOLD_MS - 20);
    check('nothing sent before the hold runs out', r.sent().length === 0, r.log);
    r.until(at(17, 25.82) + V2_PRON_PAUSE_HOLD_MS);
    check('one clip sent when the hold runs out', r.sent().length === 1 && r.posted.length === 1, r.log);
    // Speech 17:16.66 → 17:25.82 (9160 ms, the 160 ms pause in it) plus the 1200 ms hold; the 600 ms pre-roll in the audio posted.
    const expectMs = at(17, 25.82) - at(17, 16.66) + V2_PRON_PAUSE_HOLD_MS;
    const sentMs = Number(/#1 (\d+)ms/.exec(r.sent()[0] ?? '')?.[1]);
    check(`the clip holds both parts: ~${expectMs} ms of speech (20 ms frames), under the 15 s cap`, Math.abs(sentMs - expectMs) <= 60 && Math.abs(r.posted[0]!.ms - (sentMs + 600)) <= 20 && sentMs < 15000, { posted: r.posted, sent: r.sent() });
    check('one turn: the whole sentence, both parts in order', r.released.length === 1 && r.released[0]!.join(' ') === REF, r.released);
    check('the attempt is over (nothing held)', !r.rec.holdsAttempt());
    const heard = await r.rec.take(1000);
    check('the turn takes the score of the whole attempt', heard?.status === 'measured' && heard.overall === 73, heard);
  }

  console.log('2 a true room voice during the armed attempt, after a long silence');
  for (const gapMs of [2390, V2_PRON_PAUSE_HOLD_MS + 100]) {
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false);
    r.until(at(17, 21.61)); r.rec.speechStop();
    r.until(at(17, 21.65)); r.rec.attemptWords(PART1);
    r.until(at(17, 21.61) + gapMs); r.rec.speechStart(false);
    const sentMs = Number(/#1 (\d+)ms/.exec(r.sent()[0] ?? '')?.[1]);
    check(`speech ${gapMs} ms after the stop: the hold had run out, the clip went with "${PART1}" alone`, r.sent().length === 1 && Math.abs(sentMs - (4950 + V2_PRON_PAUSE_HOLD_MS)) <= 60 && r.released.length === 1 && r.released[0]!.join(' ') === PART1, { sent: r.sent(), released: r.released });
    r.until(at(17, 21.61) + gapMs + 3000); r.rec.speechStop();
    const took = r.rec.attemptWords('He is on the phone with the bank.');
    check(`  its words are not the attempt's: they go to the other-voices filter (attemptWords false)`, !took && r.released.length === 1 && !r.log.some((x) => x.startsWith('pronunciation_pause_held')), r.log);
    check('  no second clip (one clip per arm)', r.sent().length === 1, r.sent());
  }

  console.log('3 a part\'s final after the hold ran out; a final that never comes');
  {
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false);
    r.until(at(17, 21.61)); r.rec.speechStop(); r.rec.attemptWords(PART1);
    r.until(at(17, 21.77)); r.rec.speechStart(false);
    r.until(at(17, 25.82)); r.rec.speechStop();
    r.until(at(17, 25.82) + V2_PRON_PAUSE_HOLD_MS + 500);
    check('the hold ran out: the clip sent, the words wait for the second part\'s final', r.sent().length === 1 && r.released.length === 0 && r.rec.holdsAttempt(), r.log);
    r.rec.attemptWords(PART2);
    check('the late final joins: one turn of the whole sentence', r.released.length === 1 && r.released[0]!.join(' ') === REF, r.released);

    const m = rig(); m.rec.arm(1, REF);
    m.until(at(17, 16.66)); m.rec.speechStart(false);
    m.until(at(17, 21.61)); m.rec.speechStop(); m.rec.attemptWords(PART1);
    m.until(at(17, 21.77)); m.rec.speechStart(false);
    m.until(at(17, 25.82)); m.rec.speechStop();
    m.until(at(17, 25.82) + V2_PRON_PAUSE_HOLD_MS + V2_PRON_FINAL_WAIT_MS - 40);
    check('a final that never comes: still waiting just before the bound', m.released.length === 0, m.log);
    m.until(at(17, 25.82) + V2_PRON_PAUSE_HOLD_MS + V2_PRON_FINAL_WAIT_MS + 20);
    check(`  after ${V2_PRON_FINAL_WAIT_MS} ms the attempt goes with what it has`, m.released.length === 1 && m.released[0]!.join(' ') === PART1, m.released);
    check('  a final arriving after that is not the attempt\'s', !m.rec.attemptWords(PART2));

    const e = rig(); e.rec.arm(1, REF);
    e.until(at(17, 16.66)); e.rec.speechStart(false);
    e.until(at(17, 21.61)); e.rec.speechStop(); e.rec.attemptWords(PART1);
    e.until(at(17, 21.77)); e.rec.speechStart(false);
    e.until(at(17, 22.2)); e.rec.speechStop(); e.rec.attemptPartEmpty();
    e.until(at(17, 22.2) + V2_PRON_PAUSE_HOLD_MS);
    check('a part that ended with no words (empty end) is not waited for', e.released.length === 1 && e.released[0]!.join(' ') === PART1, e.released);
  }

  console.log('4 the recogniser\'s resume of the same turn (eager end, then resume)');
  {
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false);
    r.until(at(17, 18.9)); r.rec.speechStop();
    r.until(at(17, 19.3)); r.rec.speechStart(false, true);
    r.until(at(17, 25.82)); r.rec.speechStop(); r.rec.attemptWords(REF);
    r.until(at(17, 25.82) + V2_PRON_PAUSE_HOLD_MS);
    check('one part, one final: one clip, one turn', r.sent().length === 1 && r.released.length === 1 && r.released[0]!.join(' ') === REF, { log: r.log, released: r.released });
  }

  console.log('5 Task 8g still holds (onset grace, the voice-end echo drop)');
  {
    // The 8g session: he began about 50 ms before the reply's last sentence ended and kept speaking.
    const g = rig(); g.rec.arm(2, REF);
    g.until(at(17, 30)); g.rec.speechStart(true);
    g.until(at(17, 30.06)); g.rec.tutorVoiceEnded(true);
    check('the onset 50 ms before the voice end opens the capture', g.log.some((x) => x.startsWith('pronunciation_start_at_voice_end #2')), g.log);
    g.until(at(17, 37.2)); g.rec.speechStop(); g.rec.attemptWords(REF);
    g.until(at(17, 37.2) + V2_PRON_PAUSE_HOLD_MS);
    check('  its clip sent (after the hold) and its words released once', g.sent().length === 1 && g.released.length === 1, { log: g.log, released: g.released });
    // The tail echo: speech stops within 400 ms of the voice end.
    const e = rig(); e.rec.arm(2, REF);
    e.until(at(17, 30)); e.rec.speechStart(true);
    e.until(at(17, 30.06)); e.rec.tutorVoiceEnded(true);
    e.until(at(17, 30.26)); e.rec.speechStop();
    e.until(at(17, 33));
    check('a tail echo within 400 ms: dropped unsent, nothing held or released, the arm kept', e.log.some((x) => x.startsWith('pronunciation_voice_end_echo_dropped #2')) && e.sent().length === 0 && !e.rec.holdsAttempt() && e.released.length === 0 && e.rec.isArmed(), e.log);
    check('  the echo\'s final is not taken as the attempt', !e.rec.attemptWords('several years'));
    e.rec.speechStart(false); e.until(at(17, 38)); e.rec.speechStop(); e.rec.attemptWords(REF); e.until(at(17, 38) + V2_PRON_PAUSE_HOLD_MS);
    check('  the real attempt after it: recorded and released', e.sent().length === 1 && e.released.length === 1 && e.released[0]!.join(' ') === REF, { log: e.log, released: e.released });
  }

  console.log('6 the capture\'s blip rule (a stop with less than 400 ms of speech)');
  {
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16)); r.rec.speechStart(false);
    r.until(at(17, 16.2)); r.rec.speechStop();
    check('the blip is not held: the capture re-armed, nothing sent, its final goes to the filter', !r.rec.holdsAttempt() && r.sent().length === 0 && r.rec.isArmed() && !r.rec.attemptWords('Um.'), r.log);
    r.until(at(17, 17)); r.rec.speechStart(false); r.until(at(17, 22)); r.rec.speechStop(); r.rec.attemptWords(REF); r.until(at(17, 22) + V2_PRON_PAUSE_HOLD_MS);
    check('  the attempt after it is held and released as one', r.sent().length === 1 && r.released.length === 1, r.released);
  }

  console.log('6b a disarm while the attempt is held: the words kept are still theirs');
  {
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false); r.until(at(17, 21.61)); r.rec.speechStop(); r.rec.attemptWords(PART1);
    r.rec.disarm();
    check('released at once, nothing held after', r.released.length === 1 && r.released[0]!.join(' ') === PART1 && !r.rec.holdsAttempt(), r.log);
    r.until(at(17, 25));
    check('  no timer fires later (no clip, no second release)', r.sent().length === 0 && r.released.length === 1, r.log);
  }

  console.log('fix round 1 (I1): a final with no stop before it; the backstop');
  {
    // Ink: eager end (the hold starts), resume within 1.2 s (the hold cleared), then the end with no second eager end.
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false);
    r.until(at(17, 19)); r.rec.speechStop();
    r.until(at(17, 19.4)); r.rec.speechStart(false, true);
    r.until(at(17, 25.82)); const kept = r.rec.attemptWords(REF);
    check('the final is kept and starts the hold (it is the stop)', kept && r.released.length === 0 && r.rec.holdsAttempt(), r.log);
    r.until(at(17, 25.82) + V2_PRON_PAUSE_HOLD_MS);
    check('  released when the hold runs out: one clip, one turn of the whole sentence', r.sent().length === 1 && r.released.length === 1 && r.released[0]!.join(' ') === REF && !r.rec.holdsAttempt(), { log: r.log, released: r.released });
    // The recogniser gives up on a part (its failure): counted, so the attempt does not wait for it.
    const f = rig(); f.rec.arm(1, REF);
    f.until(at(17, 16.66)); f.rec.speechStart(false); f.until(at(17, 21.61)); f.rec.speechStop(); f.rec.attemptWords(PART1);
    f.until(at(17, 21.77)); f.rec.speechStart(false); f.until(at(17, 23)); f.rec.attemptPartEmpty();
    f.until(at(17, 23) + V2_PRON_PAUSE_HOLD_MS);
    check('a part the recogniser gave up on (no stop, no final): the hold starts at its failure, the words go', f.released.length === 1 && f.released[0]!.join(' ') === PART1, { log: f.log, released: f.released });
    // A reconnect mid-attempt: speech again within the hold, then neither a stop nor a final ever comes.
    const b = rig(); b.rec.arm(1, REF);
    const start = at(17, 16.66);
    b.until(start); b.rec.speechStart(false); b.until(at(17, 21.61)); b.rec.speechStop(); b.rec.attemptWords(PART1);
    b.until(at(17, 21.77)); b.rec.speechStart(false);
    b.until(start + V2_PRON_ATTEMPT_MAX_MS - 40);
    check(`the backstop: still held just before ${V2_PRON_ATTEMPT_MAX_MS} ms (the clip went at its 15 s cap)`, b.released.length === 0 && b.rec.holdsAttempt() && b.sent().length === 1, b.log);
    b.until(start + V2_PRON_ATTEMPT_MAX_MS + 20);
    check('  at the bound the attempt ends: its words take the floor, nothing held', b.released.length === 1 && b.released[0]!.join(' ') === PART1 && !b.rec.holdsAttempt() && b.log.some((x) => x.startsWith('pronunciation_attempt_bound #1')), { log: b.log, released: b.released });
    check(`  the bound is the clip cap + the hold + the transcript wait (${V2_PRON_ATTEMPT_MAX_MS} ms)`, V2_PRON_ATTEMPT_MAX_MS === 15000 + V2_PRON_PAUSE_HOLD_MS + V2_PRON_FINAL_WAIT_MS);
    // A released attempt leaves no backstop behind.
    const n = rig(); n.rec.arm(1, REF);
    n.until(at(17, 16.66)); n.rec.speechStart(false); n.until(at(17, 21.61)); n.rec.speechStop(); n.rec.attemptWords(PART1);
    n.until(at(17, 16.66) + V2_PRON_ATTEMPT_MAX_MS + 1000);
    check('  a released attempt: no second release from the backstop', n.released.length === 1 && !n.log.some((x) => x.startsWith('pronunciation_attempt_bound')), n.log);
  }

  console.log('fix round 1 (I2): the voice client goes away during a hold');
  {
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false); r.until(at(17, 21.61)); r.rec.speechStop(); r.rec.attemptWords(PART1);
    r.rec.dispose();
    r.until(at(17, 21.61) + V2_PRON_ATTEMPT_MAX_MS + 1000);
    check('dispose: nothing released (no turn), no clip sent, nothing held, disarmed; no timer fires later', r.released.length === 0 && r.sent().length === 0 && !r.rec.holdsAttempt() && !r.rec.isArmed(), r.log);
  }

  console.log('7 outside an armed attempt: nothing held');
  {
    const r = rig();
    r.rec.speechStart(false); r.until(at(17, 8)); r.rec.speechStop();
    check('not armed: no attempt, every transcript to the filter', !r.rec.holdsAttempt() && !r.rec.attemptWords('international customers for several years.') && r.sent().length === 0);
    const a = rig(); a.rec.arm(1, REF);
    check('armed, their speech not begun: nothing held, a transcript goes to the filter', !a.rec.holdsAttempt() && !a.rec.attemptWords('Hello?'));
    const n = rig({ release: false }); n.rec.arm(1, REF);
    n.until(at(17, 16.66)); n.rec.speechStart(false); n.until(at(17, 21.61)); n.rec.speechStop();
    check('no release callback (the hold needs one): the clip sent at the stop, as before', n.sent().length === 1 && /#1 49[2-6]0ms/.test(n.sent()[0]!) && !n.rec.attemptWords(PART1), n.log);
    const o = rig({ pauseHold: false }); o.rec.arm(1, REF);
    o.until(at(17, 16.66)); o.rec.speechStart(false); o.until(at(17, 21.61)); o.rec.speechStop();
    check('pauseHold false: as before (the clip of the first part sent at the stop)', o.sent().length === 1 && !o.rec.attemptWords(PART1) && o.released.length === 0, o.log);
  }

}

async function wiring() {
  console.log('8 the voice client\'s wiring (TutorVoiceV2.tsx)');
  {
    const v = src('src/app/tutor/components/v2/TutorVoiceV2.tsx');
    const heard = v.slice(v.indexOf('  const heard = useCallback('), v.indexOf('  const releaseAttempt = useCallback('));
    const decide = v.slice(v.indexOf('  const decideTurn = useCallback('), v.indexOf('  const heard = useCallback('));
    check('heard: the attempt\'s words are diverted only when the recorder holds an attempt (typed text never)', /if \(!opts\?\.typed && pronRef\.current\?\.attemptWords\(rest\)\) \{ liftPause\(\); return; \}\n    decideTurn\(rest, early, opts\);/.test(heard), heard.slice(-600));
    check('heard: the ending, noise, own-voice and closing checks run first, as before', heard.indexOf('v2_heard_while_ending') < heard.indexOf('attemptWords') && heard.indexOf('v2_own_voice_dropped') < heard.indexOf('attemptWords') && heard.indexOf('v2_heard_while_closing') < heard.indexOf('attemptWords'));
    check('decideTurn: main\'s filter as before (waitsForCheck on the first part, studentWords, the own-voice test while speaking)', decide.includes('waitsForCheck({ text: rest, typed: opts?.typed, speaking, suspect: roomHitsRef.current > 0 })') && decide.includes('void studentWords(rest).then((found) => {') && decide.includes('const words = found && !(speaking && isOwnVoice(found, spokenRef.current)) ? found : null;'));
    check('decideTurn: the rest of the attempt rides with the words taken (never judged apart); without it, the words alone', decide.includes("const withThen = (w: string) => (then ? `${w} ${then}` : w);") && decide.includes('takeFloor(withThen(rest), opts)') && decide.includes('takeFloor(withThen(words), opts)'));
    check('releaseAttempt: the first part decided by the filter, the rest after it', v.includes("decideTurn(parts[0]!, 'none', undefined, parts.slice(1).join(' '));"));
    check('the hold is handed its release only with the switch on', v.includes('pronRef.current?.holdPauses(TUTOR_V2_PRON_PAUSE_HOLD ? (parts) => releaseAttemptRef.current?.(parts) : null);'));
    check('the recogniser\'s resume reaches the recorder; an empty end counts a part', v.includes('pronRef.current?.speechStart(!!realtimeRef.current?.isSpeechPending(), !!e?.resume);') && v.includes('pronRef.current?.attemptPartEmpty();'));
    check('the noisy room\'s early look does not take a held attempt in pieces', /if \(pronRef\.current\?\.holdsAttempt\(\)\) return;/.test(v.slice(v.indexOf('const lookForStudent'), v.indexOf('const judgePartial'))));
    check('fix round 1 (I2): the unmount disposes the recorder (no release), never a flushing disarm', /stopSoundGate\(\); pronRef\.current\?\.dispose\(\); releaseBoard\(\);/.test(v) && !/pronRef\.current\?\.disarm\(\); releaseBoard/.test(v));
    check('fix round 1 (I1): a transcription failure counts the held part', /'v2_transcription_failed'[^\n]*\n[^\n]*\n\s+pronRef\.current\?\.attemptPartEmpty\(\);/.test(v));
    check('the switch is default ON', CHILD ? TUTOR_V2_PRON_PAUSE_HOLD === false : TUTOR_V2_PRON_PAUSE_HOLD === true);
  }

}

async function offChild() {
  if (CHILD) {
    console.log('9 NEXT_PUBLIC_TUTOR_V2_PRON_PAUSE_HOLD=off: as at 70911952');
    const r = rig(); r.rec.arm(1, REF);
    r.until(at(17, 16.66)); r.rec.speechStart(false);
    r.until(at(17, 21.61)); r.rec.speechStop();
    check('the clip of the first part sent at the stop (4950 ms; the session: 4949 ms)', r.sent().length === 1 && /#1 49[2-6]0ms/.test(r.sent()[0]!), r.log);
    check('"I have worked with" not held: it goes to the filter and takes the floor', !r.rec.attemptWords(PART1) && !r.rec.holdsAttempt());
    r.until(at(17, 21.77)); r.rec.speechStart(false);
    check('the continuation is not the attempt (as in the session)', !r.rec.attemptWords(PART2) && r.released.length === 0 && r.sent().length === 1);
  } else {
    console.log('\n── NEXT_PUBLIC_TUTOR_V2_PRON_PAUSE_HOLD=off ──');
    const r = spawnSync('npx', ['tsx', __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_PRON_PAUSE_HOLD: 'off', MIC13_8K_CHILD: '1' }, encoding: 'utf8' });
    process.stdout.write(r.stdout);
    check('NEXT_PUBLIC_TUTOR_V2_PRON_PAUSE_HOLD=off child passes', r.status === 0, r.stderr?.slice(-2000));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
