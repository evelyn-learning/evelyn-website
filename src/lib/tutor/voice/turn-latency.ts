/**
 * Per-turn latency ledger — pure, side-effect-free.
 *
 * Fills the instrumentation gap in front of the brain: the server's
 * [brain.stream] line times first_sentence/first_tool/total from the brain
 * fetch onward, but eager_end→turn.end (Ink-2 semantic confirm),
 * turn.end→brain-fetch (client classify), and TTS-fetch→first-audio were
 * invisible. Marks are absolute ms timestamps supplied by the caller
 * (performance.now() or Date.now() — caller's choice, must be consistent
 * within a turn). First mark wins on duplicates: turn.resume can re-fire
 * eager_end, and we want the ORIGINAL provisional endpoint.
 */

export type TurnLatencyMark =
  | 'eagerEnd'     // Ink-2 turn.eager_end received (provisional endpoint)
  | 'turnEnd'      // Ink-2 turn.end received (authoritative transcript)
  | 'brainFetch'   // POST /api/tutor/brain/stream dispatched
  | 'firstSentence'// first `sentence` SSE event parsed
  | 'firstTtsFetch'// first sentence handed to fetchTTSPromise
  | 'firstAudio';  // first playback-start stamp of the turn

export interface TurnLatencySummary {
  eagerToEndMs: number | null;
  endToBrainFetchMs: number | null;
  brainFirstSentenceMs: number | null;
  ttsToFirstAudioMs: number | null;
  /** turnEnd → firstAudio: the number the student feels. */
  totalMs: number | null;
  complete: boolean;
}

export interface TurnLatencyLedger {
  mark(name: TurnLatencyMark, tMs: number): void;
  /** Whether a mark was recorded. Lets the caller detect a stale ledger
   *  (e.g. a noise turn that marked turnEnd but never dispatched). */
  has(name: TurnLatencyMark): boolean;
  summarize(): TurnLatencySummary;
}

/** One-line debug-event rendering shared by every emit site. */
export function formatTurnLatency(s: TurnLatencySummary): string {
  return (
    `eager→end=${s.eagerToEndMs}ms end→fetch=${s.endToBrainFetchMs}ms ` +
    `brain_first=${s.brainFirstSentenceMs}ms tts→audio=${s.ttsToFirstAudioMs}ms ` +
    `TOTAL=${s.totalMs}ms complete=${s.complete}`
  );
}

/**
 * R42 (2026-08-10, session portal-cb2addf5): negative-latency backstop.
 *
 * `turn_latency end→fetch=-75941ms TOTAL=-70934ms` was observed live —
 * a synthetic/nudge dispatch's `mark('brainFetch', …)` landed on a ledger
 * that a genuinely LATER real turn's `mark('turnEnd', …)` also wrote into
 * (the ref is reused across calls via `??=`), so `diff('turnEnd',
 * 'brainFetch')` computed a real turn's later timestamp minus a synthetic
 * turn's earlier one — chronologically backwards, and meaningless as a
 * latency number. A genuine measurement can never be negative; this is a
 * pure predicate the caller uses to skip the misleading emit rather than
 * publish garbage. See VoiceTutorRealtime.tsx's turn_latency emit sites
 * (skip-with-debug-note) and the callBrainOnce brainFetch-mark site
 * (synthetic dispatches now start a fresh ledger instead of reusing one
 * that might belong to a concurrent real turn).
 */
export function hasNegativeLatency(s: TurnLatencySummary): boolean {
  return [s.eagerToEndMs, s.endToBrainFetchMs, s.brainFirstSentenceMs, s.ttsToFirstAudioMs, s.totalMs]
    .some((v) => v !== null && v < 0);
}

export function createTurnLatencyLedger(): TurnLatencyLedger {
  const marks = new Map<TurnLatencyMark, number>();
  const diff = (a: TurnLatencyMark, b: TurnLatencyMark): number | null => {
    const ta = marks.get(a); const tb = marks.get(b);
    return ta !== undefined && tb !== undefined ? tb - ta : null;
  };
  return {
    mark(name, tMs) { if (!marks.has(name)) marks.set(name, tMs); },
    has(name) { return marks.has(name); },
    summarize() {
      const totalMs = diff('turnEnd', 'firstAudio');
      return {
        eagerToEndMs: diff('eagerEnd', 'turnEnd'),
        endToBrainFetchMs: diff('turnEnd', 'brainFetch'),
        brainFirstSentenceMs: diff('brainFetch', 'firstSentence'),
        ttsToFirstAudioMs: diff('firstTtsFetch', 'firstAudio'),
        totalMs,
        complete: totalMs !== null,
      };
    },
  };
}
