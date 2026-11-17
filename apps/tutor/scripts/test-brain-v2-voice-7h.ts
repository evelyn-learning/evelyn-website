/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7h: mic test 2 (embed-1794941004529), the voice. No network, no model, no audio.
 *   npm run test:brain-v2-voice-7h
 *
 *  1  ECHO_BY_PLAYBACK: the learner saying the tutor's model sentence is not its echo (flag 6, 18:55): heard before, while
 *     (the tutor paused on his voice) and after its audio; a real echo of a sentence playing is still dropped; the tutor
 *     silent for longer than the tail: nothing is its own voice
 *  2  CLOSE_HEARS: the microphone stays open while the closing reply is said (flags 9, 10); words over it reopen the
 *     lesson, thanks and a goodbye do not; the time box's hard stop is not interruptible
 *  3  TARGET_PAUSE: a short quoted target is set apart by the voice's break tag (flag 8); a Japanese sentence with English
 *     quoted; three targets in one sentence; a long quoted sentence; an ending like "-ed"
 *  each switch off alone (a child process per switch): the behaviour before this task for that item, the others as on.
 *
 * The tutor's sentences are the session's own (apps/tutor/.v2-flags/gdi-trial-praveen-ton6ag/flags.jsonl, flag 6
 * `speaking.sentences`); the learner's final is the recogniser's (the dev log), the partials as the investigation
 * reconstructs them. Playback is simulated: each part's audio lasts its length at 14 characters a second.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { V2EchoClock, V2_ECHO_TAIL_MS, v2IsEcho, type V2PlayProgress } from '../src/lib/tutor/v2/echo-window';
import { isOwnVoice } from '../src/lib/tutor/v2/own-voice';
import { V2ClosingWords, v2BoxDuringClose, v2CloseCalledOff, v2CloseHears } from '../src/lib/tutor/v2/close-mic';
import { V2_HARD_STOP_TAIL_MAX_MS } from '../src/lib/tutor/v2/time-box';
import { V2_TARGET_PAUSE_MS, markTargets, targetPauses, withTargetPauses } from '../src/lib/tutor/v2/target-pauses';
import { v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { v2SpeakSounds } from '../src/lib/tutor/v2/spoken-sounds';
import { rewriteForTTS, speakDataRuns, speakLessonNotation, speakNumberPlurals, speakSlashes } from '../src/lib/tutor/voice/tts-pronunciation';
import { V2Captions } from '../src/lib/tutor/v2/captions';
import { TUTOR_V2_CLOSE_HEARS, TUTOR_V2_ECHO_BY_PLAYBACK, TUTOR_V2_TARGET_PAUSE } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const CHILD = !!process.env.VOICE_7H_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (CHILD) return;
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};

// ── Flag 6: the reply being spoken (7 parts, all written at 18:55:13.774, before any of it played).
const REPLY = [
  'Yes, "I attended" is the right past simple, because "last year" and "2 years ago" are finished times.',
  'One small thing: after a number, we say "years", so "two years ago".',
  'Here is the full sentence:',
  'I attended a robotics exhibition in Tokyo two years ago.',
  'That finishes "Past simple".',
  'Next is Conversation, where we talk about a project you are proud of.',
  'Shall we go on, or do you have a question first?',
];
const CPS = 14;
/** A simulated speech queue: each part plays back to back from t0, `pausedAt` freezes the clock. */
class Playback {
  readonly clock = new V2EchoClock();
  starts: number[] = []; durs: number[] = [];
  pausedAt: number | null = null; pausedFor = 0;
  constructor(readonly parts: string[], readonly t0: number) { let t = t0; for (const p of parts) { this.starts.push(t); const d = (p.length / CPS) * 1000; this.durs.push(d); t += d; } }
  get endMs(): number { return this.starts[this.starts.length - 1]! + this.durs[this.durs.length - 1]!; }
  /** Feed the clock every start and stop up to `t` (as the queue's sentence-start and drain would). */
  advance(t: number): void {
    for (let i = 0; i < this.parts.length; i++) if (this.starts[i]! <= t && this.clock.parts.length <= i) this.clock.started(this.parts[i]!, this.starts[i]!);
    if (t >= this.endMs) this.clock.stopped(this.endMs);
  }
  progress(t: number): V2PlayProgress | null {
    const at = this.pausedAt ?? t;
    const i = this.starts.findIndex((s, k) => at >= s && at < s + this.durs[k]!);
    if (i < 0) return null;
    return { sentence: this.parts[i]!, elapsedSec: (at - this.starts[i]!) / 1000, arrivedTotalSec: this.durs[i]! / 1000, playing: true };
  }
  /** The time at which part i is a fraction f through. */
  at(i: number, f: number): number { return this.starts[i]! + this.durs[i]! * f; }
}
const judge = (pb: Playback, text: string, t: number, partial = false) => {
  pb.advance(t);
  return v2IsEcho({ text, nowMs: t, clock: pb.clock, progress: pb.progress(t), speechPending: pb.pausedAt !== null || t < pb.endMs, written: REPLY.slice(-8), isOwnVoice, ...(partial ? { minWords: 1, share: 1 } : {}) });
};
const FINAL = 'I attended a robotics exhibition in Tokyo 2 year ago.';
const PERFECT = 'I attended a robotics exhibition in Tokyo two years ago.';

// ── Flag 8 and the speech path.
const restOfPath = (s: string) => rewriteForTTS(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(v2SpeakSounds(s))))));
const speak = (sentence: string, on: boolean, languages: string[] = ['en', 'ja']) => v2SpeechParts(sentence, languages).map((part) => withTargetPauses(part, restOfPath, on));
const BREAK = `<break time="${V2_TARGET_PAUSE_MS}ms"/>`;
const FLAG8 = 'Please add "an" before "important customer".';

/** Everything observed, for the parent (all on) and for each child (one switch off). */
function scenario(): Record<string, unknown> {
  const out: Record<string, unknown> = { flags: { echo: TUTOR_V2_ECHO_BY_PLAYBACK, close: TUTOR_V2_CLOSE_HEARS, pause: TUTOR_V2_TARGET_PAUSE } };
  // 1. Flag 6: he starts the model sentence as the voice finishes it (onset at 95% of part 4), the sound gate pauses the
  //    tutor 0.5 s later (in part 5), his final comes 6 s after he began.
  const pb = new Playback(REPLY, 0);
  const onset = pb.at(3, 0.95);
  pb.advance(onset); pb.clock.speechStart(onset, pb.progress(onset));
  pb.pausedAt = onset + 500; pb.advance(onset + 500);
  out.flag6Partial = judge(pb, 'I attended', onset + 1200, true).own;
  out.flag6Partial2 = judge(pb, 'I attended a robotics exhibition in Tokyo', onset + 2500, true).own;
  out.flag6Final = judge(pb, FINAL, onset + 6000).own;
  out.flag6Perfect = judge(pb, PERFECT, onset + 6000).own;
  // 2. The close: does a spoken close keep the microphone open (the voice client waits for its speech).
  out.closeHears = v2CloseHears('voice', true);
  // 3. Flag 8 as the voice client sends it in a two-language lesson (TutorVoiceV2 plainSpeech: the switch and the lesson).
  out.flag8 = speak(FLAG8, TUTOR_V2_TARGET_PAUSE)[0];
  return out;
}

async function main() {
  const on = scenario();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }

  console.log('1  ECHO_BY_PLAYBACK — the learner repeating the tutor is heard; the tutor\'s echo is not');
  {
    check('flag 6 as it ran: his partials pause the tutor and his final is his (not own voice)', on.flag6Partial === false && on.flag6Partial2 === false && on.flag6Final === false && on.flag6Perfect === false, on);
    check('before this task the same words were the tutor\'s own (sentences as written, speech pending)', isOwnVoice('I attended', REPLY, 1, 1) && isOwnVoice(FINAL, REPLY) && isOwnVoice(PERFECT, REPLY));

    // Before: he says sentence 4 while part 2 plays (it is written, not yet played).
    const b = new Playback(REPLY, 0); const tb = b.at(1, 0.3); b.advance(tb); b.clock.speechStart(tb, b.progress(tb));
    check('BEFORE its audio: the sentence written but not played is no ground to drop him', !judge(b, 'I attended', tb + 800, true).own && !judge(b, PERFECT, tb + 5000).own);
    b.clock.settled();

    // While: he begins it with the voice 40% through it; the gate pauses the voice half a second later.
    const w = new Playback(REPLY, 0); const tw = w.at(3, 0.4); w.advance(tw); w.clock.speechStart(tw, w.progress(tw)); w.pausedAt = tw + 500;
    const wPart = judge(w, 'I attended a', tw + 1200, true); const wFinal = judge(w, PERFECT, tw + 6000);
    check('WHILE its audio (the tutor paused on his voice): his words run past what was played, so they are his', !wPart.own && !wFinal.own, { wPart, wFinal });

    // After: part 4 ended 0.3 s before he began (inside the tail), part 5 playing.
    const a = new Playback(REPLY, 0); const ta = a.starts[4]! + 300; a.advance(ta); a.clock.speechStart(ta, a.progress(ta));
    check('AFTER its audio, inside the tail: an echo then would be its last words, not its start: his', !judge(a, 'I attended', ta + 700, true).own && !judge(a, FINAL, ta + 6000).own);
    // After the whole reply, the tutor silent longer than the tail.
    const s = new Playback(REPLY, 0); const ts = s.endMs + V2_ECHO_TAIL_MS + 500; s.advance(ts); s.clock.speechStart(ts, s.progress(ts));
    const silent = judge(s, 'Shall we go on, or do you have a question first?', ts + 4000);
    check('the tutor silent longer than the tail: nothing is its own voice, even its last sentence word for word', !silent.own && /silent since/.test(silent.timing), silent);

    // Real echo: the speakers carry part 6 into the microphone; the recogniser hears speech begin 0.4 s into it.
    const e = new Playback(REPLY, 0); const te = e.starts[5]! + 400; e.advance(te); e.clock.speechStart(te, e.progress(te));
    const ePart = judge(e, 'Next is conversation where', te + 1500, true);
    const eFinal = judge(e, 'Next is conversation where we talk about a project you are proud of.', te + 5000);
    check('a real echo of the sentence playing: its partials are ignored and its final dropped, naming the sentence', ePart.own && eFinal.own && eFinal.part === REPLY[5] && eFinal.score >= 0.9, { ePart, eFinal });
    e.clock.settled();
    // Its final arrives after the reply has drained (the recogniser's turn-end wait): still the echo, measured to its onset.
    const e2 = new Playback(REPLY, 0); const te2 = e2.starts[6]! + 300; e2.advance(te2); e2.clock.speechStart(te2, e2.progress(te2));
    const lp = (t: number, words: string) => { e2.advance(t); e2.clock.heardWords(words, t, e2.progress(t)); };
    lp(te2 + 900, 'Shall we'); lp(te2 + 2000, 'Shall we go on or do you'); lp(e2.endMs + 600, 'Shall we go on or do you have a question first');
    const late = judge(e2, 'Shall we go on or do you have a question first', e2.endMs + 3500);
    check('an echo whose final comes 3.5 s after the voice stopped is still dropped (its words were heard while the sentence played)', late.own && late.part === REPLY[6], late);
    // An echo that begins late in one part and runs into the next (the recogniser hears speech begin 70% into part 6).
    const e4 = new Playback(REPLY, 0); const te4 = e4.at(5, 0.7); e4.advance(te4); e4.clock.speechStart(te4, e4.progress(te4));
    check('an echo from late in one sentence on into the next is still dropped', judge(e4, 'a project you are proud of shall we go on', e4.at(6, 0.45)).own && judge(e4, 'project you are', te4 + 900, true).own);
    // An echo with no speech start seen (the recogniser went straight to words).
    const e3 = new Playback(REPLY, 0); const te3 = e3.at(5, 0.6);
    e3.advance(te3); e3.clock.heardWords('Next is conversation where we talk', te3, e3.progress(te3));
    check('an echo with no speech start: placed as many words back as it holds, still dropped', judge(e3, 'Next is conversation where we talk about a project', te3 + 1500).own);
    // Fix round 1 C1 (the reviewer's sequence): the recogniser hears speech begin on the echo of "Here is the full
    // sentence:" and the turn ends with no words (Ink drops an empty turn.end with no callback). The model sentence and
    // "Now you say it." play and drain; ten seconds later the learner says it.
    const c1 = new Playback(['Here is the full sentence:', 'I attended a robotics exhibition in Tokyo two years ago.', 'Now you say it.'], 0);
    c1.advance(500); c1.clock.speechStart(500, c1.progress(500));
    const tc = c1.endMs + 10_000; c1.advance(tc);
    c1.clock.speechStart(tc, c1.progress(tc)); c1.clock.heardWords('I attended a robotics', tc + 1200, c1.progress(tc + 1200));
    const c1Final = judge(c1, PERFECT, tc + 6000);
    check('C1: a speech start that ended with no words does not stand for the next utterance: his repeat after silence is heard', !c1Final.own && /silent since/.test(c1Final.timing), c1Final);
    // The same with no new speech start and no partials (only a final): the silence alone decides.
    const c1b = new Playback(['Here is the full sentence:', 'I attended a robotics exhibition in Tokyo two years ago.', 'Now you say it.'], 0);
    c1b.advance(500); c1b.clock.speechStart(500, c1b.progress(500));
    const tcb = c1b.endMs + 10_000;
    check('C1: start → no words → long silence → the learner repeats the sentence (a final alone): heard, whatever the stale start says', !judge(c1b, PERFECT, tcb).own);
    // A start, its stop, then a start 10 s later: a new utterance, not the recogniser resuming.
    const c1c = new Playback(REPLY, 0); c1c.advance(500); c1c.clock.speechStart(500, c1c.progress(500)); c1c.clock.speechStop(900);
    const tcc = c1c.at(3, 0.95); c1c.advance(tcc); c1c.clock.speechStart(tcc, c1c.progress(tcc)); c1c.pausedAt = tcc + 500;
    check('C1: a start long after the last stop begins a new utterance (flag 6 then plays as it should: heard)', !judge(c1c, 'I attended', tcc + 1200, true).own && !judge(c1c, FINAL, tcc + 6000).own);
    // Words lost (the words watch gives up) settle the clock as a final does.
    const c1d = new Playback(REPLY, 0); c1d.advance(500); c1d.clock.speechStart(500, c1d.progress(500)); c1d.clock.settled();
    const tcd = c1d.at(3, 0.95); c1d.advance(tcd); c1d.clock.speechStart(tcd, c1d.progress(tcd)); c1d.pausedAt = tcd + 500;
    check('C1: after words lost (settled) the next start is its own utterance', !judge(c1d, FINAL, tcd + 6000).own);
    // A resume shortly after the stop (Ink's turn.resume) keeps the utterance: a real echo across it is still dropped.
    const c1e = new Playback(REPLY, 0); const te5 = c1e.starts[5]! + 300; c1e.advance(te5); c1e.clock.speechStart(te5, c1e.progress(te5));
    c1e.clock.speechStop(te5 + 1500); const tr = te5 + 2200; c1e.advance(tr); c1e.clock.speechStart(tr, c1e.progress(tr));
    check('C1: a resume within the turn-end wait keeps the utterance: the echo across it is still dropped', judge(c1e, 'Next is conversation where we talk about a project you are proud of.', c1e.at(5, 0.98)).own);
    const voiceC1 = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('C1: the voice client tells the clock of every stop, words lost and the reset', /onSpeechStop = useCallback\(\(\) => \{ echoRef\.current\.speechStop\(Date\.now\(\)\);/.test(voiceC1) && /'v2_words_lost'[^\n]*\n[^\n]*\n\s+echoRef\.current\.settled\(\);/.test(voiceC1) && /useEffect\(\(\) => \(\) => \{ wordsWatchRef\.current\.settled\(\); echoRef\.current\.settled\(\);/.test(voiceC1));
    // Japanese echo (the Task 6 case, test-brain-v2-languages): a Japanese part playing, heard back.
    const ja = new Playback(['次の文を英語で言ってみてください。', '私は3年間ここで働いています。'], 0); const tj = ja.at(0, 0.15); ja.advance(tj); ja.clock.speechStart(tj, ja.progress(tj));
    check('a Japanese echo of the part playing is still dropped', judge(ja, '次の文を英語で言ってみてください', tj + 2500).own);
    check('the learner\'s own words over the tutor are never echo', !judge(e3, 'wait can you explain why that works', te3 + 2000).own);
    check('ECHO_BY_PLAYBACK off: matched against the sentences written while speech is pending, as before', v2IsEcho({ text: PERFECT, nowMs: 0, clock: new V2EchoClock(), progress: null, speechPending: true, written: REPLY, isOwnVoice }, false).own && !v2IsEcho({ text: PERFECT, nowMs: 0, clock: new V2EchoClock(), progress: null, speechPending: false, written: REPLY, isOwnVoice }, false).own);
    const voice = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('the voice client logs a dropped final and an ignored partial with the sentence, the score and the timing, and a sound pause that expires', /'v2_own_voice_dropped', `\$\{text\.slice\(0, 80\)\} · matched "\$\{\(echo\.part/.test(voice) && /'v2_own_voice_partial'/.test(voice) && /'v2_bargein_pause_expired'/.test(voice));
    check('the voice client feeds the clock from the queue (sentence-start, drain, every cut)', /echoRef\.current\.started\(turnSentencesRef\.current\[startedCountRef\.current - 1\]/.test(voice) && /event === 'drain'\) \{ echoRef\.current\.stopped/.test(voice) && (voice.match(/echoRef\.current\.stopped\(Date\.now\(\)\)/g) ?? []).length >= 4);
  }

  console.log('2  CLOSE_HEARS — the microphone through the closing words');
  {
    check('a spoken close keeps the microphone open (voice, waiting for the speech); a typed one does not', v2CloseHears('voice', true) && !v2CloseHears('text', true) && !v2CloseHears('voice', false));
    const c = new V2ClosingWords();
    c.begin();
    check('flag 10: "Can you please—" over the closing words reopens the lesson; its turn runs', c.active && c.heard('Can you please—') === 'reopen' && !c.active);
    check('the session is then not closed when the closing words end (they were cut)', c.said() === false);
    c.begin();
    check('"What are you doing?" reopens it too', c.heard('What are you doing?') === 'reopen');
    c.begin();
    check('thanks and a goodbye do not: the close goes on and the session closes once it has been said', c.heard('Okay, thank you so much. Bye!') === 'let-end' && c.heard(null) === 'let-end' && c.active && c.said() === true && !c.active);
    check('Japanese: thanks and a goodbye let it end, a request or a question reopens it', !v2CloseCalledOff('ありがとうございました。') && !v2CloseCalledOff('はい、ありがとうございます、先生。') && !v2CloseCalledOff('お疲れ様でした、また来週！') && v2CloseCalledOff('もう少し練習したいです') && v2CloseCalledOff('ちょっと待ってください') && v2CloseCalledOff('これは何ですか？') && v2CloseCalledOff('Wait, ありがとう, but one more question'));
    const r1 = c.begin(); c.heard('wait, one more question'); const r2 = c.begin();
    check('a close called off and begun again: the first close\'s end does not close the second early', c.said(r1) === false && c.active && c.said(r2) === true);
    c.begin(); c.stop();
    check('the box (or the host) ends it first: nothing is reopened or closed by the close after that', c.heard('Can you please wait') === 'not-closing' && c.said() === false);
    const turns = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    check('useV2Turns: the box\'s stop is uninterruptible (no reopening once ending; a close under way closes the microphone)', /const overClose = endingRef\.current \? 'not-closing'/.test(turns) && /endingRef\.current = true; closingRef\.current\.stop\(\);[\s\S]{0,200}if \(wasClosing\) \{\s*setClosed\(true\);[\s\S]{0,600}void v2BoxDuringClose\([\s\S]{0,400}end: \(\) => endOnce\(\),[\s\S]{0,200}return;/.test(turns) && /if \(farewell\) setClosed\(true\);/.test(turns));
    check('useV2Turns: a spoken close is closed once its words are said; a reopen clears the state\'s close and cuts the voice', /if \(!hears\) setClosed\(true\);/.test(turns) && /if \(!closingRef\.current\.said\(round\)\) return;\s*setClosed\(true\);/.test(turns) && /stateRef\.current = \{ \.\.\.stateRef\.current, closed: false \};/.test(turns) && /'v2_close_called_off'/.test(turns));
    const voice = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('the voice client: the microphone follows `closed`; thanks over the close do not cut it; the ending words are not paused', /const listening = started && realtime\.isConnected && !props\.standby && !turns\.closed;/.test(voice) && /isClosing\(\) && !v2CloseCalledOff\(text\)/.test(voice) && (voice.match(/turnsRef\.current\?\.isEnding\(\)\) return;/g) ?? []).length >= 1);
  }

  console.log('2b CLOSE_HEARS fix round 1 (I1) — the box during the closing words');
  {
    const run = async (speechMs: number) => {
      const log: string[] = []; let t = 0;
      await v2BoxDuringClose({
        untilQuiet: async (max) => { t += Math.min(speechMs, max); log.push(`quiet ${Math.min(speechMs, max)}`); return speechMs <= max; },
        cut: () => log.push(`cut at ${t}`),
        settle: async () => { log.push('settled'); },
        end: () => log.push('end'),
        ended: () => false,
      });
      return log.join(' | ');
    };
    const short = await run(12_000); const long = await run(55_000);
    check('the box landing 12 s before the closing words end: they play out, then the session ends (no cut, no second goodbye)', short === 'quiet 12000 | settled | end', short);
    check('a closing reply still going past the bound (V2_HARD_STOP_TAIL_MAX_MS) is cut there, as any speech at the box', long === `quiet ${V2_HARD_STOP_TAIL_MAX_MS} | cut at ${V2_HARD_STOP_TAIL_MAX_MS} | settled | end`, long);
    const gone: string[] = [];
    await v2BoxDuringClose({ untilQuiet: async () => true, cut: () => gone.push('cut'), settle: async () => {}, end: () => gone.push('end'), ended: () => true });
    check('ended meanwhile (the End button, the host): nothing more', gone.length === 0, gone);
  }

  console.log('3  TARGET_PAUSE — a short quoted target is set apart by a pause');
  {
    const f8 = speak(FLAG8, true);
    check('flag 8: one break before "an" and one after "important customer", none between (one word apart: they share them)', f8.length === 1 && f8[0] === `Please add ${BREAK}an before important customer${BREAK}.`, f8);
    const lone = speak('Please add "an" here.', true)[0]!;
    check('one target: a pause before it and after it', lone === `Please add ${BREAK}an${BREAK} here.`, lone);
    const adj = speak('Use "a" "an" "the".', true)[0]!;
    check('adjacent targets: never two tags back to back (the first two share theirs)', adj === `Use ${BREAK}a an${BREAK} the.` && !/\/>[\s.,]*<break/.test(adj), adj);
    const far = speak('We say "went" when the time is finished, not "goed".', true)[0]!;
    check('two targets four or more words apart: each keeps its own break before and after (round 1b)', far === `We say ${BREAK}went${BREAK} when the time is finished, not ${BREAK}goed${BREAK}.`, far);
    const near = speak('Say "went" and not "goed".', true)[0]!;
    check('two targets fewer than four words apart share: before the first, after the last, none between', near === `Say ${BREAK}went and not goed${BREAK}.`, near);
    const gaps = (t: string) => { const w = t.split(/<break[^>]*\/>/).slice(1, -1).map((x) => (x.match(/[\p{L}\p{N}]+/gu) ?? []).length); return w; };
    check('within one part, breaks of different targets are never closer than four words, never back to back', [f8[0]!, adj, far, near].every((t) => { const g = gaps(t); const tags = t.split(/<break[^>]*\/>/); const inner = tags.slice(1, -1); return inner.every((x, k) => (k % 2 === 0 ? true : (x.match(/[\p{L}\p{N}]+/gu) ?? []).length >= 4)) && !/\/>[\s.,]*<break/.test(t); }), [gaps(far)]);
    check('before this task (or with it off) the quotes are stripped and nothing marks the words', speak(FLAG8, false)[0] === 'Please add an before important customer.' && !speak(FLAG8, false)[0]!.includes('<break'));
    const ja = speak('「an」を「important customer」の前に付けてください。', true);
    check('a Japanese sentence quoting short English: the targets get their pauses inside the Japanese part (shared: one particle apart)', ja.length === 1 && ja[0] === `${BREAK}anをimportant customer${BREAK}の前に付けてください。`, ja);
    const jaLong = speak('例えば「I attended an exhibition last year.」です。', true);
    check('a Japanese sentence quoting an English sentence: its own English part (split as before), no pause', jaLong.length === 3 && jaLong[1] === 'I attended an exhibition last year.' && !jaLong.join('').includes('<break'), jaLong);
    const three = speak('We say "went", "saw" and "met", never "goed".', true)[0]!;
    check('three or more targets in one sentence: only the first two are targets (sharing their breaks), the rest as before', three === `We say ${BREAK}went, saw${BREAK} and met, never goed.`, three);
    const long = speak('Say "I attended a robotics exhibition in Tokyo two years ago." now.', true)[0]!;
    check('a quoted sentence (more than three words) gets none', !long.includes('<break') && long === restOfPath('Say "I attended a robotics exhibition in Tokyo two years ago." now.'), long);
    const ed = speak('Add "-ed" to "work".', true)[0]!;
    const edAlone = speak('Add "-ed" to the verb.', true)[0]!;
    check('an ending: "-ed" is set apart and reaches the voice as -ed (unchanged by the path; no "minus", no "dash")', edAlone === `Add ${BREAK}-ed${BREAK} to the verb.` && ed === `Add ${BREAK}-ed to work${BREAK}.` && !/minus|dash/i.test(ed + edAlone), [edAlone, ed]);
    check('no tag is written before the rest of the path (it would be read: "less than break time equals…"); the marks pass through it', /less than break/.test(restOfPath(`x ${BREAK} y`)) && restOfPath(markTargets(FLAG8)).includes('an') && targetPauses('a  b') === 'a  b');
    check('a number or a sound in quotes is not a target ("6", "/z/"): as before', speak('The "6" inch pipe and the "/z/" sound.', true)[0] === restOfPath('The "6" inch pipe and the "/z/" sound.'));
    // The tags are only in what goes to the voice: the caption shows the sentence as written.
    const cap = new V2Captions(); cap.begin(); cap.sentence(FLAG8, v2SpeechParts(FLAG8, ['en', 'ja']));
    const shown = cap.poll({ sentence: FLAG8, elapsedSec: 9, arrivedTotalSec: 3, playing: true }).text;
    check('the caption and the transcript never show a tag (they carry the sentence as written)', !shown.includes('<break') && !shown.includes(''), shown);
    const voice = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('the voice client: pauses only in plain speech (not maths or science), only in a lesson that teaches a language', /const plainSpeech = useCallback\(\(sentence: string, rewrite: \(s: string\) => string\) => withTargetPauses\(sentence, .*TUTOR_V2_TARGET_PAUSE && \(\(p\.current\.tutorLanguages\?\.length \?\? 0\) >= 2 \|\| !!p\.current\.pronunciation\)\), \[\]\);/.test(voice) && !/(mathsSpeech|scienceSpeech) = useCallback[^\n]*withTargetPauses/.test(voice));
  }

  console.log('each switch off alone');
  {
    const child = (flag: string) => {
      const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', VOICE_7H_CHILD: '1' }, encoding: 'utf8' });
      const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
      return line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: res.stderr };
    };
    const a = child('ECHO_BY_PLAYBACK');
    check('ECHO_BY_PLAYBACK off: flag 6 as it ran (his partials and his final taken for the tutor); the rest as on', a.flags?.echo === false && a.flags?.close === true && a.flags?.pause === true && a.flag6Partial === true && a.flag6Final === true && a.closeHears === true && String(a.flag8).includes('<break'), a);
    const b = child('CLOSE_HEARS');
    check('CLOSE_HEARS off: the microphone closes as end_lesson is accepted; the rest as on', b.flags?.close === false && b.closeHears === false && b.flags?.echo === true && b.flag6Final === false && String(b.flag8).includes('<break'), b);
    const c = child('TARGET_PAUSE');
    check('TARGET_PAUSE off: no pause; the rest as on', c.flags?.pause === false && c.flag8 === 'Please add an before important customer.' && c.flags?.echo === true && c.closeHears === true && c.flag6Final === false, c);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
