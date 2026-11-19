/**
 * Tutor brain v2 — Task 7h: the tutor's own voice is only what it has actually played.
 *
 * The echo guard (own-voice.ts) compared the microphone's words with the tutor's last sentences as they were WRITTEN,
 * before they played. In a language lesson the learner says the model sentence back, word for word, and was taken for
 * the tutor's echo: in mic test 2 (embed-1794941004529, flag 6) "I attended a robotics exhibition in Tokyo 2 year ago."
 * was dropped as own voice and the tutor talked on over him, twice.
 *
 * Here the words the microphone hears can be the tutor's echo only where they could have come out of the speakers:
 *   - a part (a sentence, or a language part of one, as sent to the voice) counts only once its audio has begun
 *     (the speech queue's 'sentence-start'), and only while it plays or for ECHO_TAIL_MS after it ended, measured to
 *     when the heard words began;
 *   - within those parts, only the words played between where the heard speech began (less a couple of words of lag)
 *     and where playback stands now (plus one): an echo of a sentence follows the voice through it, so a learner who
 *     begins the model sentence after the voice has passed its start is not an echo of it;
 *   - the tutor silent for longer than the tail when the words began: nothing is its own voice.
 * Playback position: the speech queue's per-part start and end (sentence-start, drain, a cut) and, inside the part
 * playing, the audio clock (useOpenAIRealtime getSpokenProgress: seconds played of the part, seconds of it arrived),
 * mapped proportionally onto the part's words. Where it is uncertain the bounds lean towards echo: the start is taken
 * no later than a slow speaking rate puts it, the end no earlier than the audio that has arrived allows.
 */
import { ownVoiceMatch, ownVoiceWords } from './own-voice';
import { TUTOR_V2_ECHO_BY_PLAYBACK, TUTOR_V2_MOSTLY_HEARD, TUTOR_V2_PAUSE_NOT_ECHO, TUTOR_V2_REPEAT_NOT_ECHO } from '../orchestrator/flags';

/** How long after a part stops sounding its echo can still begin (room, output latency, the recogniser's onset). */
export const V2_ECHO_TAIL_MS = 1500;
/** Words of slack before where the heard speech began: the recogniser's onset comes a little after the sound. */
export const V2_ECHO_LAG_WORDS = 2;
/** Words of slack past where playback stands: only the estimate's error (an echo cannot run ahead of the voice). */
export const V2_ECHO_LEAD_WORDS = 1;
/** A slow speaking rate, characters per second: the earliest the voice can be through a part. */
const SLOW_CHARS_PER_SEC = 11.8;
const KEEP_PARTS = 16;
/** An utterance's start older than this with no words since is stale whatever else is known (the recogniser's own
 *  words watch gives up on a start after 45 s). */
export const V2_ECHO_ONSET_MAX_MS = 45_000;

export interface V2PlayedPart { text: string; words: string[]; base: number; startMs: number; endMs: number | null; /** Task 7y: the voice paused in this part since then (null: playing). */ pausedAtMs?: number | null }

/** Task 7y (PAUSE_NOT_ECHO): heard words fewer than this, matched to the played stretch, are undecided: never the tutor's own voice
 *  (one common word such as "I" sits in nearly any played stretch), and not yet the learner's either. */
export const V2_ECHO_MIN_OWN_WORDS = 2;
/** Task 7y (MOSTLY_HEARD): the sentence playing at a barge-in counts as heard when at least this share of its words had played. */
export const V2_MOSTLY_HEARD_SHARE = 0.8;
/** Where playback stands in the part playing (getSpokenProgress). */
export interface V2PlayProgress { sentence: string | null; elapsedSec: number; arrivedTotalSec: number; playing: boolean }
export interface V2EchoJudgement { own: boolean; score: number; part: string | null; timing: string }

export class V2EchoClock {
  readonly parts: V2PlayedPart[] = [];
  /** Where the utterance being heard began, and the signs of it since: its last stop, its latest words. One utterance:
   *  cleared when it ends (words, a failure, words lost) and replaced by the next one's start. Task 7h fix round 1 C1: a
   *  start whose turn ended with no words (Ink drops an empty turn.end without a callback) left it standing, and a
   *  learner's repeat ten seconds later was matched against everything played since. */
  private onset: { atMs: number; pos: number; stopAtMs: number | null; wordsAtMs: number | null; /** Task 7y: heard words so far, when they last grew, and whether they grew over a paused voice (then never its echo, resumed or not). */ words?: number; grewAtMs?: number | null; overPause?: boolean } | null = null;
  private nextBase = 0;
  constructor(private readonly tailMs = V2_ECHO_TAIL_MS, private readonly lagWords = V2_ECHO_LAG_WORDS, private readonly leadWords = V2_ECHO_LEAD_WORDS, private readonly aheadOn: boolean = TUTOR_V2_REPEAT_NOT_ECHO, private readonly pauseOn: boolean = TUTOR_V2_PAUSE_NOT_ECHO) {}

  /** Task 7y (PAUSE_NOT_ECHO): the voice was paused (a barge-in pause, a sound pause, the flag panel): the speakers are silent from
   *  now, so the played stretch ends here for the echo clock until resumed(). Mic test 8 (embed-1795115593161, wall 19:09.57): the
   *  part paused at word 7 still counted as "still playing", and his "I" over the pause was matched as its echo. */
  paused(nowMs: number): void {
    const cur = this.current();
    if (this.pauseOn && cur && cur.endMs === null && cur.pausedAtMs == null) cur.pausedAtMs = nowMs;
  }

  /** The paused voice goes on. */
  resumed(): void {
    const cur = this.current();
    if (cur) cur.pausedAtMs = null;
  }

  /** Task 7y (MOSTLY_HEARD): the share (0–1) of the words of the part playing that have played, at the fewest (the 'low' bound).
   *  Null: nothing is playing. */
  playedShare(progress: V2PlayProgress | null): number | null {
    const cur = this.current();
    if (!cur || cur.endMs !== null) return null;
    if (!cur.words.length) return 1;
    return Math.min(1, Math.max(0, (this.position(progress, 'low') - cur.base) / cur.words.length));
  }

  private current(): V2PlayedPart | undefined { return this.parts[this.parts.length - 1]; }

  /** A part's audio has begun; the part before it has finished. */
  started(text: string, nowMs: number): void {
    this.stopped(nowMs);
    const words = ownVoiceWords(text);
    this.parts.push({ text, words, base: this.nextBase, startMs: nowMs, endMs: null });
    this.nextBase += words.length;
    if (this.parts.length > KEEP_PARTS) this.parts.shift();
  }

  /** Playback stopped: the queue drained, or it was cut. */
  stopped(nowMs: number): void {
    const cur = this.current();
    if (cur && cur.endMs === null) { cur.endMs = cur.pausedAtMs ?? nowMs; cur.pausedAtMs = null; }
  }

  /** How many words of the stream have played. low: the fewest it can be; high: the most. */
  position(progress: V2PlayProgress | null, bound: 'low' | 'high'): number {
    const cur = this.current();
    if (!cur) return 0;
    const n = cur.words.length;
    if (cur.endMs !== null) return cur.base + n;
    if (!progress?.playing || !progress.sentence) return cur.base + (bound === 'low' ? 0 : n);
    const total = bound === 'low' ? Math.max(progress.arrivedTotalSec, progress.sentence.length / SLOW_CHARS_PER_SEC) : progress.arrivedTotalSec;
    const f = total > 0 ? Math.min(1, Math.max(0, progress.elapsedSec / total)) : bound === 'low' ? 0 : 1;
    return cur.base + (bound === 'low' ? Math.floor(f * n) : Math.min(n, Math.ceil(f * n)));
  }

  /** The recogniser heard speech begin. `resume`: the recogniser says this is the same turn going on (Ink's
   *  turn.resume, marked in its payload), and the utterance goes on (unless its start is stale). Anything else is a new
   *  turn and a new utterance, whatever came before: fix round 2, a time window could not tell a resume from a new turn
   *  after an empty one, and the learner's start 4.5 s after an empty echo turn kept the echo's onset. */
  speechStart(nowMs: number, progress: V2PlayProgress | null, resume = false): void {
    const o = this.onset;
    if (resume && o && nowMs - (o.wordsAtMs ?? o.atMs) <= V2_ECHO_ONSET_MAX_MS) { o.stopAtMs = null; return; }
    this.onset = { atMs: nowMs, pos: this.position(progress, 'low'), stopAtMs: null, wordsAtMs: null };
  }

  /** The recogniser's speech stopped (its eager end): words may still follow, or a resume. */
  speechStop(nowMs: number): void { if (this.onset) this.onset.stopAtMs = nowMs; }

  /** Words so far: with no utterance under way (or a stale one), they began about as many words back as they hold. */
  heardWords(text: string, nowMs: number, progress: V2PlayProgress | null): void {
    const o = this.onset;
    const n = ownVoiceWords(text).length;
    if (!o || nowMs - (o.wordsAtMs ?? o.atMs) > V2_ECHO_ONSET_MAX_MS) this.onset = { atMs: nowMs, pos: this.position(progress, 'low') - n, stopAtMs: null, wordsAtMs: nowMs, words: n, grewAtMs: nowMs };
    else { o.wordsAtMs = nowMs; if (n > (o.words ?? 0)) { o.words = n; o.grewAtMs = nowMs; } }
  }

  /** The utterance is over (its words arrived, its turn ended with none, the recogniser failed, the words were lost, or
   *  the session reset): the next speech is a new utterance. */
  settled(): void { this.onset = null; }

  /** Whether these heard words are the tutor's own voice. `minWords`, `share`: as isOwnVoice. */
  judge(text: string, nowMs: number, progress: V2PlayProgress | null, minWords = 4, share = 0.7): V2EchoJudgement {
    const heard = ownVoiceWords(text);
    const stale = !!this.onset && nowMs - (this.onset.wordsAtMs ?? this.onset.atMs) > V2_ECHO_ONSET_MAX_MS;
    const onset = this.onset && !stale ? this.onset : { atMs: nowMs, pos: this.position(progress, 'low') - heard.length, stopAtMs: null, wordsAtMs: null };
    const since = (t: number) => `${((nowMs - t) / 1000).toFixed(1)}s`;
    const last = this.current();
    // Whatever the start says: the tutor silent for longer than the tail when these words were last heard (their latest
    // words so far, else now) means nothing is its own voice.
    const heardAt = onset.wordsAtMs ?? nowMs;
    const silentFor = last && last.endMs !== null ? heardAt - last.endMs : 0;
    // Task 7y (PAUSE_NOT_ECHO): a paused voice is silent too: words that began, or last grew, more than the tail after the pause
    // cannot be its echo (an echo cannot grow while the speakers are silent).
    const pausedAt = this.pauseOn && last && last.endMs === null ? last.pausedAtMs ?? null : null;
    const grewAt = Math.max(onset.atMs, onset.grewAtMs ?? onset.atMs);
    if ((pausedAt !== null && grewAt - pausedAt > this.tailMs) || (this.pauseOn && onset.overPause)) {
      if (this.onset === onset) onset.overPause = true;
      return { own: false, score: 0, part: last!.text, timing: pausedAt !== null ? `words began ${since(onset.atMs)} ago and grew ${since(grewAt)} ago; the voice paused ${since(pausedAt)} ago (longer than the tail)` : `words began ${since(onset.atMs)} ago and grew over the paused voice` };
    }
    const live = silentFor > this.tailMs ? [] : this.parts.filter((p) => p.startMs <= nowMs && (p.endMs === null || p.endMs >= onset.atMs - this.tailMs));
    if (!live.length) {
      return { own: false, score: 0, part: null, timing: `words began ${since(onset.atMs)} ago; ${last?.endMs != null ? `the tutor silent since ${since(last.endMs)} ago` : 'nothing played yet'}` };
    }
    const from = onset.pos - this.lagWords;
    const to = this.position(progress, 'high') + this.leadWords;
    const said: string[] = []; const owner: V2PlayedPart[] = [];
    for (const p of live) {
      for (let g = Math.max(from, p.base); g < Math.min(to, p.base + p.words.length); g++) { said.push(p.words[g - p.base]!); owner.push(p); }
    }
    const m = ownVoiceMatch(heard, said, minWords, share);
    const part = m.at >= 0 ? owner[m.at]! : live[live.length - 1]!;
    // Task 7v (REPEAT_NOT_ECHO): heard words that run ahead of the voice (words of a part playing that it has not played yet) are the
    // learner saying the sentence with it, never its echo: an echo cannot hold what the speakers have not yet sounded. Mic test 6
    // (embed-1795067373124, 13:38): "Yesterday I wrote an email to the customer." said with the model sentence, two words ahead of
    // the voice, was dropped as its own voice (score 0.75) and he had to say it again. 7h's window did not cover it: he began with
    // the model sentence, not after the voice had passed its start.
    const ahead = m.own && this.aheadOn ? aheadWords(heard, said, live.filter((p) => p.endMs === null).flatMap((p) => p.words.slice(Math.max(0, to - p.base)))) : 0;
    const timing = `words began ${since(onset.atMs)} ago at word ${Math.max(0, onset.pos - part.base)} of this part; part began ${since(part.startMs)} ago, ${part.endMs === null ? 'still playing' : `ended ${since(part.endMs)} ago`}; ${said.length} word(s) played in reach${ahead ? `; ${ahead} word(s) ahead of the voice` : ''}`;
    return { own: m.own && ahead < V2_ECHO_AHEAD_WORDS, score: Math.round(m.score * 100) / 100, part: part.text, timing };
  }
}

/** Task 7v (REPEAT_NOT_ECHO): heard words of the part playing that the voice has not reached, this many or more: not an echo. */
export const V2_ECHO_AHEAD_WORDS = 2;
/** How many of the heard words, matched in order against the played stretch and then the words not yet played, fall among the words
 *  not yet played (each found within a few words of the last match). */
function aheadWords(heard: readonly string[], played: readonly string[], unplayed: readonly string[]): number {
  const all = [...played, ...unplayed]; let j = 0; let n = 0;
  for (const w of heard) {
    let k = -1;
    for (let x = j; x < (j === 0 ? all.length : Math.min(all.length, j + 4)); x++) if (all[x] === w) { k = x; break; }
    if (k < 0) continue;
    if (k >= played.length) n += 1;
    j = k + 1;
  }
  return n;
}

/** The echo decision for heard words. Under TUTOR_V2_ECHO_BY_PLAYBACK the played stretch decides (above); off, as before:
 *  any of the last sentences written, and only while speech is pending. */
export function v2IsEcho(args: { text: string; nowMs: number; clock: V2EchoClock; progress: V2PlayProgress | null; speechPending: boolean; written: string[]; minWords?: number; share?: number; isOwnVoice: (t: string, said: string[], minWords?: number, share?: number) => boolean }, enabled: boolean = TUTOR_V2_ECHO_BY_PLAYBACK): V2EchoJudgement {
  if (!enabled) {
    const own = args.speechPending && args.isOwnVoice(args.text, args.written, args.minWords, args.share);
    return { own, score: own ? 1 : 0, part: null, timing: 'by the sentences written (ECHO_BY_PLAYBACK off)' };
  }
  return args.clock.judge(args.text, args.nowMs, args.progress, args.minWords, args.share);
}

/** Task 7y (PAUSE_NOT_ECHO): what a partial heard over the voice is. 'own': the tutor's echo (two heard words or more matched to the
 *  played stretch); 'undecided': one word matched, never enough to call it the echo (mic test 8, embed-1795115593161: all five
 *  partials taken for the echo were his one-word "I"), and not yet the learner's either; 'learner': not matched. Off: as before
 *  (any match is 'own'). */
export function v2PartialVerdict(echo: V2EchoJudgement, text: string, on: boolean = TUTOR_V2_PAUSE_NOT_ECHO): 'own' | 'undecided' | 'learner' {
  if (!echo.own) return 'learner';
  return on && ownVoiceWords(text).length < V2_ECHO_MIN_OWN_WORDS ? 'undecided' : 'own';
}

/** Task 7y (MOSTLY_HEARD): how many of the reply's sentences (as sent to the voice) were heard at a barge-in, `started` of them
 *  begun. The one playing counts when at least V2_MOSTLY_HEARD_SHARE of its words had played (`share`, V2EchoClock.playedShare,
 *  read before the cut); below that, or off, it is unheard, as before: cut at "What's your first…", the question did not get
 *  through. Mic test 8 (embed-1795115593161, wall 12:03): a bare "Yes." over the last words of a part ask got "Sorry, I missed
 *  part of my last question" and the ask again. */
export function v2HeardCount(started: number, share: number | null, on: boolean = TUTOR_V2_MOSTLY_HEARD): number {
  if (started <= 0) return 0;
  return on && share !== null && share >= V2_MOSTLY_HEARD_SHARE ? started : started - 1;
}
