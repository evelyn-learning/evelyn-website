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
import { TUTOR_V2_ECHO_BY_PLAYBACK } from '../orchestrator/flags';

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

export interface V2PlayedPart { text: string; words: string[]; base: number; startMs: number; endMs: number | null }
/** Where playback stands in the part playing (getSpokenProgress). */
export interface V2PlayProgress { sentence: string | null; elapsedSec: number; arrivedTotalSec: number; playing: boolean }
export interface V2EchoJudgement { own: boolean; score: number; part: string | null; timing: string }

export class V2EchoClock {
  readonly parts: V2PlayedPart[] = [];
  /** Where the utterance being heard began, and the signs of it since: its last stop, its latest words. One utterance:
   *  cleared when it ends (words, a failure, words lost) and replaced by the next one's start. Task 7h fix round 1 C1: a
   *  start whose turn ended with no words (Ink drops an empty turn.end without a callback) left it standing, and a
   *  learner's repeat ten seconds later was matched against everything played since. */
  private onset: { atMs: number; pos: number; stopAtMs: number | null; wordsAtMs: number | null } | null = null;
  private nextBase = 0;
  constructor(private readonly tailMs = V2_ECHO_TAIL_MS, private readonly lagWords = V2_ECHO_LAG_WORDS, private readonly leadWords = V2_ECHO_LEAD_WORDS) {}

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
    if (cur && cur.endMs === null) cur.endMs = nowMs;
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
    if (!o || nowMs - (o.wordsAtMs ?? o.atMs) > V2_ECHO_ONSET_MAX_MS) this.onset = { atMs: nowMs, pos: this.position(progress, 'low') - ownVoiceWords(text).length, stopAtMs: null, wordsAtMs: nowMs };
    else o.wordsAtMs = nowMs;
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
    const timing = `words began ${since(onset.atMs)} ago at word ${Math.max(0, onset.pos - part.base)} of this part; part began ${since(part.startMs)} ago, ${part.endMs === null ? 'still playing' : `ended ${since(part.endMs)} ago`}; ${said.length} word(s) played in reach`;
    return { own: m.own, score: Math.round(m.score * 100) / 100, part: part.text, timing };
  }
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
