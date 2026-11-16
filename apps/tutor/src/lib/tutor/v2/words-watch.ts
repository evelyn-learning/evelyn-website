/**
 * Tutor brain v2 — speech heard, words owed (Task 6e fix round 1, F6).
 *
 * The voice client stops its silence timer when speech starts and shows "Got it / One moment…" when it stops, then
 * waits for the transcript. Two ways the transcript never comes, and no failure is reported either:
 *  - the recogniser ends the turn with no words: Ink's empty turn.end is dropped without a callback
 *    (useCartesiaInkWS finalizeTurn);
 *  - its watchdog closes the socket for a reconnect, which tells the page nothing.
 * Tester B's stalled first try (v2audio-6e/stall): "I'm ready." played after the part-change ask, no transcript and no
 * failure came, the page sat on "Thinking… / One moment…" and no idle nudge came for four minutes: the timer had been
 * cleared at the speech's start and nothing armed it again.
 *
 * The watch: any sign of speech (start, words so far, stop) starts a wait; words or a reported failure end it; a wait
 * that runs out calls `lost`, and the page goes back to listening with the idle nudge armed.
 */
/** After the speech stopped (or its last partial words), how long the transcript may take. Ink's own watchdog is 12 s. */
export const V2_WORDS_AFTER_STOP_MS = 15_000;
/** After the speech started with no stop and no words: a long turn still sends partial words, which restart the wait. */
export const V2_WORDS_AFTER_START_MS = 45_000;

type Timer = ReturnType<typeof setTimeout>;
export interface WordsWatchClock { set: (fn: () => void, ms: number) => Timer; clear: (t: Timer) => void }
const realClock: WordsWatchClock = { set: (fn, ms) => setTimeout(fn, ms), clear: (t) => clearTimeout(t) };

export class WordsWatch {
  private timer: Timer | null = null;
  constructor(private readonly lost: () => void, private readonly clock: WordsWatchClock = realClock, private readonly enabled: boolean = true) {}
  /** Speech began, words so far arrived, or speech stopped: words are owed. */
  speech(kind: 'start' | 'partial' | 'stop'): void {
    if (!this.enabled) return;
    this.cancel();
    this.timer = this.clock.set(() => { this.timer = null; this.lost(); }, kind === 'start' ? V2_WORDS_AFTER_START_MS : V2_WORDS_AFTER_STOP_MS);
  }
  /** A transcript arrived, the recogniser reported a failure, or the session is ending: nothing is owed. */
  settled(): void { this.cancel(); }
  get waiting(): boolean { return this.timer !== null; }
  private cancel(): void { if (this.timer) { this.clock.clear(this.timer); this.timer = null; } }
}
