/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7y: mic test 8 (embed-1795115593161), the voice client: a paused voice (echo clock, board), the sentence
 * playing at a barge-in, and the language of a mixed sentence. The session's real texts and timings (task-7y-investigation.md A1,
 * A2, A4, B). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic8-7y
 *
 *  1 PAUSE_NOT_ECHO        T95 (wall 19:09.57, paused at word 7 of the repeat model): partials "I", "I have", "I have worked with"
 *                          keep the pause; no resume before his transcript, which is his; a true echo while playing still own
 *  2 PAUSE_HOLDS_BOARD     a held item not painted at 45 s while paused (the flag at 10:24.58), painted after resume with its
 *                          remaining time; WB34/WB35 arriving for a started sentence during the pause (10:15) held, then dropped
 *  3 MOSTLY_HEARD          the sentence playing counts heard at ≥ 80 % of its words played, not below
 *  4 MIXED_SENTENCE_PARTS  T16: "with an s." ends a sentence; the next is spoken en / ja / en; "— washing machines —" in English
 *  v1's split unchanged; each switch off alone (a child process per switch).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import { V2EchoClock, v2HeardCount, v2IsEcho, v2PartialVerdict, V2_ECHO_TAIL_MS, type V2PlayProgress } from '../src/lib/tutor/v2/echo-window';
import { isOwnVoice } from '../src/lib/tutor/v2/own-voice';
import { V2BoardPause, v2BoardDropSplit, v2PlaceHold, type V2BoardClock } from '../src/lib/tutor/v2/board-pause';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { splitSentenceForTts, ttsLanguageFor } from '../src/lib/tutor/voice/tts-language';
import { targetPunctuation, withTargetPauses } from '../src/lib/tutor/v2/target-pauses';
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';
import { trimToSpoken } from '../src/lib/tutor/v2/interrupted';
import { newV2State } from '../src/lib/tutor/v2/types';
import { TUTOR_V2_PAUSE_NOT_ECHO } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC8_7Y_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (CHILD) return;
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const LANGS = ['en', 'ja'];

// ── 1. T95: the repeat model, paused at word 7 ─────────────────────────────────────────────────────────────────────────────────
// Times in ms from the part's start (wall 19:06.24, "part began 3.9s ago" at 19:10.14). Speech began 19:09.07 (2830), the sound
// pause 19:09.57 (3330, sound held 500 ms), "I" 19:10.14 (3900); "I have" and "I have worked with" as his words grew; his final
// transcript (5637 ms of speech) at 8900. The audio clock stands still while paused (the playback context is suspended).
const T95 = 'Please say it once more: "I have worked with international customers for several years."';
const SOUND_PAUSE_MS = 2500; const PAUSE_GIVE_UP_MS = 8000;
function progressAt(ms: number, pausedAt: number | null): V2PlayProgress {
  const played = (pausedAt !== null ? Math.min(ms, pausedAt) : ms) / 1000;
  return { sentence: T95, elapsedSec: played, arrivedTotalSec: 6, playing: true };
}
/** The component's partial path (TutorVoiceV2 hearingPartial / onSpeechStart): pause on a sound, partials keep or convert it. */
function runT95(partials: Array<[number, string]>, finalAt: number, finalText: string) {
  const clock = new V2EchoClock();
  clock.started(T95, 0);
  let pausedAt: number | null = null; let timerAt: number | null = null; let sound = false; let words = 0;
  const resumes: number[] = []; const log: string[] = [];
  const fire = (until: number) => { if (timerAt !== null && timerAt <= until) { resumes.push(timerAt); log.push(`resume@${timerAt}`); clock.resumed(); pausedAt = null; timerAt = null; sound = false; } };
  clock.speechStart(2830, progressAt(2830, null));
  pausedAt = 3330; clock.paused(3330); sound = true; timerAt = 3330 + SOUND_PAUSE_MS;
  for (const [t, text] of partials) {
    fire(t);
    clock.heardWords(text, t, progressAt(t, pausedAt));
    const n = text.split(/\s+/).length; const grew = n > words; words = n;
    const echo = v2IsEcho({ text, nowMs: t, clock, progress: progressAt(t, pausedAt), speechPending: true, written: [T95], minWords: 1, share: 1, isOwnVoice });
    const verdict = v2PartialVerdict(echo, text);
    log.push(`${t} "${text}" ${verdict}`);
    if (verdict !== 'learner') {
      if (TUTOR_V2_PAUSE_NOT_ECHO && grew && timerAt !== null) timerAt = t + (sound ? SOUND_PAUSE_MS : PAUSE_GIVE_UP_MS);
      continue;
    }
    if (sound) sound = false;
    if (timerAt !== null) { timerAt = t + PAUSE_GIVE_UP_MS; continue; }
    pausedAt = t; clock.paused(t); timerAt = t + PAUSE_GIVE_UP_MS;
  }
  fire(finalAt);
  const final = v2IsEcho({ text: finalText, nowMs: finalAt, clock, progress: progressAt(finalAt, pausedAt), speechPending: true, written: [T95], isOwnVoice });
  return { resumes, log, finalOwn: final.own, finalTiming: final.timing, pausedAtFinal: pausedAt };
}

// ── 2. the board ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
function fakeClock() {
  let now = 0; let seq = 0; const timers = new Map<number, { at: number; fn: () => void }>();
  const clock: V2BoardClock = {
    now: () => now,
    setTimer: (fn, ms) => { seq += 1; timers.set(seq, { at: now + ms, fn }); return seq as unknown as ReturnType<typeof setTimeout>; },
    clearTimer: (t) => { timers.delete(t as unknown as number); },
  };
  const advance = (to: number) => {
    for (;;) {
      const due = [...timers.entries()].filter(([, x]) => x.at <= to).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      now = due[1].at; timers.delete(due[0]); due[1].fn();
    }
    now = to;
  };
  return { clock, advance };
}
function boardCase() {
  // T54 (wall 10:22.40): the show_problem held for sentence 2; the flag opened at 10:24.58 (2180 ms later) and closed at 11:29.8.
  const { clock, advance } = fakeClock();
  const bp = new V2BoardPause(45000, clock);
  const painted: Array<[string, number]> = [];
  const t = bp.arm(() => painted.push(['Yesterday, I ___ a customer in Osaka.', clock.now()]));
  advance(2180); bp.pause([t]);
  advance(45000); const at45 = painted.length;
  advance(2180 + 65220); const atClose = painted.length;
  bp.resume([t]);
  advance(2180 + 65220 + 42819); const beforeLeft = painted.length;
  advance(2180 + 65220 + 42820);
  // 10:15.35: WB34/WB35 arrive during the barge-in pause (10:13.77), both anchored to sentence 1 of 3, 1 started.
  const b2 = new V2BoardPause(45000, fakeClock().clock);
  b2.pause([]);
  const wb = ['show_sentence: Past simple of show.', 'show_sentence: I have to fill.'];
  const holdDuring = wb.map(() => v2PlaceHold({ idx: 0, started: 1, pageHeld: false, opening: false, holding: b2.holding }));
  const holdPlaying = v2PlaceHold({ idx: 0, started: 1, pageHeld: false, opening: false, holding: false });
  const held = wb.filter((_, i) => holdDuring[i]).map((what) => ({ idx: 0, what }));
  const drop = v2BoardDropSplit(held, 1);
  return { at45, atClose, beforeLeft, painted, holdDuring, holdPlaying, lost: drop.lost.map((x) => x.what), kept: drop.kept.length };
}

// ── 3. the sentence playing at a barge-in ──────────────────────────────────────────────────────────────────────────────────────
const ASK = 'Next is Pronunciation, which is optional: would you like to practise it, or go straight to the summary?';
// Fix round 1 (I1): realistic timings, elapsed never past arrived. The ask is 103 characters: at a normal English rate (14.7 a
// second) its audio is 7.0 s, all arrived well before it has played (the voice streams faster than it plays).
const JA_ASK = '次は発音の練習です。やってみますか？'; // 18 characters, 2.6 s at a normal Japanese rate
function heardCase(elapsedSec: number, arrivedTotalSec = 7, text = ASK, playing = true) {
  const clock = new V2EchoClock();
  clock.started('Good.', 0); clock.started(text, 1000);
  const share = clock.playedShare(playing ? { sentence: text, elapsedSec, arrivedTotalSec, playing: true } : { sentence: null, elapsedSec: 0, arrivedTotalSec: 0, playing: false });
  const count = v2HeardCount(2, share);
  const st = { ...newV2State(0), history: [{ role: 'user' as const, content: 'x' }, { role: 'assistant' as const, content: `Good. ${text}` }] as Anthropic.MessageParam[] };
  const trimmed = trimToSpoken(st, ['Good.', text], count, true);
  return { share, count, unheard: trimmed.unheard ?? null };
}
/** Fix round 1 (I2): sentences as at ce416b5b (the cut off) and now. */
const LONE = ['A. Add the numbers. B. Cool it.', 'Q. What is it?', 'Part I. Introduction to the topic.', 'J. K. Rowling wrote it.', 'a. Add the numbers.', 'point A. Draw a line.', 'Use f. g for the composite.', 'The e. coli grew.', 'Dr. J. Smith came.'];
const cutAll = (t: string, on: boolean) => { const st = new SentenceStream(on); return [...st.push(t), ...st.flush()]; };

// ── 4. T16 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const T16 = 'Good, you used "sold" for last year. That is the past simple, for a finished event at a specific time. One small thing: we say "washing machines" with an s. Your question is about China, so ask me one more: 「中国で誰に売りましたか？」 What kind of customers did you sell to in China?';
function t16Case() {
  const s = new SentenceStream(); const sentences = [...s.push(T16), ...s.flush()];
  const parts = sentences.flatMap((x) => v2SpeechParts(x, LANGS));
  const voice = parts.map((x) => ({ text: x, language: ttsLanguageFor(x, LANGS), spoken: withTargetPauses(x, (y) => rewriteForTTS(y), true, true) }));
  const piece = 'One small thing: we say "washing machines" with an s. Your question is about China, so ask me one more: 「中国で誰に売りましたか？」';
  const s2 = new SentenceStream(); const others = [...s2.push('Use f. g for the composite. We add an s. then we stop. Write a. b. c.'), ...s2.flush()];
  return { sentences, voice, wholePiece: withTargetPauses(piece, (y) => rewriteForTTS(y), true, true), others };
}

function probe() {
  const on95 = runT95([[3900, 'I'], [4700, 'I have'], [5600, 'I have worked with']], 8900, 'I have worked with international customers for several years.');
  // A true echo while the voice plays (not paused): the voice at 4.2 s of 6 (word 10 of 13 at the most), the microphone gives back
  // "worked with international" begun 1 s before.
  const echoClock = new V2EchoClock(); echoClock.started(T95, 0);
  echoClock.speechStart(3200, { sentence: T95, elapsedSec: 3.2, arrivedTotalSec: 6, playing: true });
  echoClock.heardWords('worked with international', 4200, { sentence: T95, elapsedSec: 4.2, arrivedTotalSec: 6, playing: true });
  const trueEcho = v2IsEcho({ text: 'worked with international', nowMs: 4200, clock: echoClock, progress: { sentence: T95, elapsedSec: 4.2, arrivedTotalSec: 6, playing: true }, speechPending: true, written: [T95], minWords: 1, share: 1, isOwnVoice });
  const oneWord = v2IsEcho({ text: 'worked', nowMs: 4200, clock: echoClock, progress: { sentence: T95, elapsedSec: 4.2, arrivedTotalSec: 6, playing: true }, speechPending: true, written: [T95], minWords: 1, share: 1, isOwnVoice });
  // An echo of the last words before a pause, inside the tail: still the tutor's.
  const tailClock = new V2EchoClock(); tailClock.started(T95, 0);
  tailClock.speechStart(3000, { sentence: T95, elapsedSec: 3.0, arrivedTotalSec: 6, playing: true });
  tailClock.paused(3330);
  tailClock.heardWords('once more I have', 3330 + V2_ECHO_TAIL_MS - 200, { sentence: T95, elapsedSec: 3.33, arrivedTotalSec: 6, playing: true });
  const tailEcho = v2IsEcho({ text: 'once more I have', nowMs: 3330 + V2_ECHO_TAIL_MS - 200, clock: tailClock, progress: { sentence: T95, elapsedSec: 3.33, arrivedTotalSec: 6, playing: true }, speechPending: true, written: [T95], minWords: 1, share: 1, isOwnVoice });
  const t16 = t16Case();
  return {
    on95,
    trueEcho: { own: trueEcho.own, verdict: v2PartialVerdict(trueEcho, 'worked with international') },
    oneWord: { own: oneWord.own, verdict: v2PartialVerdict(oneWord, 'worked') },
    tailEcho: { own: tailEcho.own, verdict: v2PartialVerdict(tailEcho, 'once more I have') },
    board: boardCase(),
    heard90: heardCase(6.3), heard70: heardCase(4.2),
    heardAll: heardCase(7.0), heardYes: heardCase(6.5),
    heardJa90: heardCase(2.34, 2.6, JA_ASK), heardJa60: heardCase(1.56, 2.6, JA_ASK),
    heardStreaming: heardCase(3.0, 3.0), heardGap: heardCase(0, 0, ASK, false),
    lone: LONE.map((t) => ({ on: cutAll(t, true), off: cutAll(t, false) })),
    t16,
    v1Piece: splitSentenceForTts('One small thing: we say "washing machines" with an s. Your question is about China, so ask me one more: 「中国で誰に売りましたか？」', LANGS),
    v1Ja: splitSentenceForTts('「My manager showed me slogans he had written earlier」ですね、いい文です。', LANGS),
    punctWhole: targetPunctuation('One small thing: we say washing machines with an s. ask me: 「中国で誰に売りましたか？」'),
  };
}

async function main() {
  const on = probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }

  console.log('1 PAUSE_NOT_ECHO: T95, his words over the paused repeat model');
  check('"I" (one word, 0.6 s into the pause) is undecided, never the echo', /3900 "I" undecided/.test(on.on95.log.join(' | ')), on.on95.log);
  check('"I have worked with" (grew 2.3 s after the pause, more than the tail) is his', /5600 "I have worked with" learner/.test(on.on95.log.join(' | ')), on.on95.log);
  check('the pause is kept: no resume before his transcript at 8.9 s', on.on95.resumes.length === 0 && on.on95.pausedAtFinal !== null, on.on95.log);
  check('his transcript is his (a barge-in), not the tutor\'s own voice', !on.on95.finalOwn, on.on95.finalTiming);
  check('a true echo while the voice plays (3 words just played) is still the tutor\'s own', on.trueEcho.own && on.trueEcho.verdict === 'own', on.trueEcho);
  check('one echoed word while playing: undecided (not paused for, as before)', on.oneWord.verdict === 'undecided', on.oneWord);
  check('an echo of the last words before the pause, inside the tail: still own', on.tailEcho.own && on.tailEcho.verdict === 'own', on.tailEcho);

  console.log('2 PAUSE_HOLDS_BOARD');
  check('the held question is not painted at 45 s while the flag has the voice paused', on.board.at45 === 0 && on.board.atClose === 0);
  check('…and painted after the resume, once its remaining 42.82 s have run', on.board.beforeLeft === 0 && on.board.painted.length === 1 && on.board.painted[0]![1] === 2180 + 65220 + 42820, on.board.painted);
  check('WB34/WB35 (sentence 1 of 3, 1 started) arriving in the pause are held; while playing the same item is "now"', on.board.holdDuring.every(Boolean) && on.board.holdPlaying === false, on.board);
  check('…and the confirmed barge-in drops both (reported as never shown)', on.board.lost.length === 2 && on.board.kept === 0, on.board.lost);

  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  console.log('3 MOSTLY_HEARD');
  check('fully played (7.0 of 7.0 s): counted heard', on.heardAll.count === 2 && on.heardAll.unheard === null, on.heardAll);
  check('cut at 90 % (6.3 of 7.0 s): counted heard, nothing unheard', on.heard90.share! >= 0.8 && on.heard90.count === 2 && on.heard90.unheard === null, on.heard90);
  check('cut at 60 % (4.2 of 7.0 s): unheard, as before (state.unheard holds the ask)', on.heard70.share! < 0.8 && on.heard70.count === 1 && JSON.stringify(on.heard70.unheard) === JSON.stringify([ASK]), on.heard70);
  check('the session\'s "Yes." over the last words of the part ask (voice paused at 6.5 of 7.0 s, "the summary?" left): heard, not asked again', on.heardYes.count === 2 && on.heardYes.unheard === null, on.heardYes);
  check('a Japanese ask at a normal rate: 90 % heard, 60 % unheard', on.heardJa90.count === 2 && on.heardJa60.count === 1, [on.heardJa90, on.heardJa60]);
  check('audio still arriving (3.0 s arrived and played of a 103-character ask): not taken for the whole, unheard', on.heardStreaming.count === 1, on.heardStreaming);
  check('fix round 1 (M4): its playback finished (between parts, nothing playing): heard', on.heardGap.share === 1 && on.heardGap.count === 2, on.heardGap);

  console.log('4 MIXED_SENTENCE_PARTS: T16');
  const voice = on.t16.voice;
  check('"…with an s." ends the sentence', on.t16.sentences.includes('One small thing: we say "washing machines" with an s.'), on.t16.sentences);
  const i = voice.findIndex((v) => v.text.startsWith('Your question'));
  check('the next sentence is three parts: en / ja / en', i >= 0 && voice.slice(i).map((v) => v.language).join('/') === 'en/ja/en' && voice[i + 1]!.text === '中国で誰に売りましたか？' && voice[i + 2]!.text === 'What kind of customers did you sell to in China?', voice.slice(i));
  const ws = voice.find((v) => /washing machines/.test(v.text));
  check('"— washing machines —" in the English part', !!ws && ws.language === 'en' && /— washing machines —/.test(ws.spoken), ws);
  check('target marks by the part\'s language: the whole piece (Japanese only in its quote) gets dashes', /— washing machines —/.test(on.t16.wholePiece) && /— washing machines —/.test(on.punctWhole), [on.t16.wholePiece, on.punctWhole]);
  check('"f. g" and a lone letter before a lowercase word stay inside the sentence', on.t16.others[0] === 'Use f. g for the composite.' && on.t16.others[1] === 'We add an s. then we stop.', on.t16.others);
  check('fix round 1 (I2): uppercase lone letters, list labels, initials and a sentence-opening letter split exactly as at ce416b5b', on.lone.every((x) => same(x.on, x.off)) && same(on.lone[0]!.on, ['A. Add the numbers.', 'B. Cool it.']) && same(on.lone[3]!.on, ['J. K. Rowling wrote it.']), on.lone.filter((x) => !same(x.on, x.off)));
  check('v1\'s split unchanged: the piece whole to the Japanese voice; a Japanese sentence quoting English as before', JSON.stringify(on.v1Piece) === JSON.stringify([{ text: 'One small thing: we say "washing machines" with an s. Your question is about China, so ask me one more: 「中国で誰に売りましたか？」', language: 'ja' }]) && JSON.stringify(on.v1Ja.map((x) => x.language)) === '["en","ja"]', [on.v1Piece, on.v1Ja]);
  check('a one-language session: one part, no language', JSON.stringify(v2SpeechParts('Your question: 「中国」 What?', undefined)) === JSON.stringify(['Your question: 「中国」 What?']));

  console.log('source pins (TutorVoiceV2)');
  const src = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
  check('a partial that grows keeps the pause; pause/resume go through the echo clock and the board', /TUTOR_V2_PAUSE_NOT_ECHO && grew && pauseTimerRef\.current/.test(src) && /echoRef\.current\.paused\(Date\.now\(\)\); boardPauseRef\.current\.pause\(/.test(src) && /if \(boardPauseRef\.current\.holding\) return;/.test(src) && /v2HeardCount\(startedCountRef\.current, playedShare\)/.test(src));

  console.log('each switch off alone (a child process per switch): as at HEAD for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC8_7Y_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as ReturnType<typeof probe>;
  };
  {
    const off = child('PAUSE_NOT_ECHO');
    check('PAUSE_NOT_ECHO off: "I" taken for the echo and the sound pause runs out at 5.83 s, the voice over him', /3900 "I" own/.test(off.on95.log.join(' | ')) && off.on95.resumes[0] === 3330 + SOUND_PAUSE_MS, off.on95.log);
    check('PAUSE_NOT_ECHO off: the other items unchanged', same(off.board, on.board) && same(off.heard90, on.heard90) && same(off.t16, on.t16));
  }
  {
    const off = child('PAUSE_HOLDS_BOARD');
    check('PAUSE_HOLDS_BOARD off: painted by the 45 s timer during the pause; the cards paint at once', off.board.at45 === 1 && off.board.painted[0]![1] === 45000 && off.board.holdDuring.every((x) => !x), off.board);
    check('PAUSE_HOLDS_BOARD off: the other items unchanged', same(off.on95, on.on95) && same(off.heard90, on.heard90) && same(off.t16, on.t16));
  }
  {
    const off = child('MOSTLY_HEARD');
    check('MOSTLY_HEARD off: the sentence playing is always unheard', off.heard90.count === 1 && same(off.heard90.unheard, [ASK]), off.heard90);
    check('MOSTLY_HEARD off: the other items unchanged', same(off.on95, on.on95) && same(off.board, on.board) && same(off.t16, on.t16));
  }
  {
    const off = child('MIXED_SENTENCE_PARTS');
    const piece = off.t16.voice.find((v) => /washing machines/.test(v.text));
    check('MIXED_SENTENCE_PARTS off: one sentence to the Japanese voice with Japanese commas, as at HEAD', !!piece && piece.language === 'ja' && /Your question/.test(piece.text) && /、washing machines、/.test(piece.spoken) && !off.t16.sentences.includes('One small thing: we say "washing machines" with an s.'), piece);
    check('MIXED_SENTENCE_PARTS off: the other items unchanged', same(off.on95, on.on95) && same(off.board, on.board) && same(off.heard90, on.heard90) && same(off.v1Piece, on.v1Piece));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
