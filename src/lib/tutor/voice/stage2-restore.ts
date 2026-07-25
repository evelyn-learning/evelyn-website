/**
 * STAGE-2 no-verdict timeout-RESTORE (round-28, live 2026-07-18, session
 * portal-f31017f0).
 *
 * A STAGE-2 perception cancel aborts the in-flight brain turn and arms a
 * checkpoint that a later perception VERDICT is supposed to resolve
 * (RESTORE / MERGE / FRESH). But when the interrupting sound never
 * resolves to a transcript at all — a couple of words swallowed by the
 * ASR, ambient noise, a false VAD onset — no verdict ever runs, nothing
 * re-fires the aborted turn, and the tutor sits silent until the student
 * speaks again (observed: 38s of dead air; "stale checkpoint cleared by
 * watchdog (age=68669ms)"). The opening-turn variant of this class was
 * fixed by suppressing cancels pre-first-turn; this is the mid-session
 * recovery: a timer armed at cancel time asks this pure function what to
 * do once the no-verdict window elapses.
 *
 * Kept pure and React-free so it's script-testable (test:stage2-restore),
 * matching the bargein-gate / view-follow pattern.
 */

/** How long after a STAGE-2 cancel to wait for a verdict/transcript before
 *  re-firing the aborted turn. Transcripts normally land well under 1s
 *  after speech_stopped; 7s is far past any real resolution and still an
 *  order of magnitude quicker than the student re-prompting. */
export const STAGE2_NO_VERDICT_RESTORE_MS = 7_000;

/** Anything older than this is the next-turn watchdog's mess to clean —
 *  re-firing a minute-old turn out of nowhere would be worse than silence. */
const STALE_CUTOFF_MS = 60_000;

export function decideStage2TimeoutRestore(args: {
  /** The armed checkpoint is still unresolved (same object, not cleared).
   *  Optional — omitted/undefined is treated as still-active; only an
   *  explicit `false` means the checkpoint was already resolved. */
  checkpointActive?: boolean;
  cancelledDuringState: 'processing' | 'speaking';
  /** Snapshot taken at cancel time (checkpoint.brainWasInFlight). */
  brainWasInFlight: boolean;
  /** The abort genuinely cut the stream (brainTurnAbortedRef). */
  brainTurnAborted: boolean;
  /** Student is speaking right now — their transcript will resolve this. */
  midUtterance: boolean;
  /** A new brain call is already running — the stall self-resolved. */
  newBrainCallInFlight: boolean;
  ageMs: number;
  timeoutMs?: number;
  /** R32 (H3): checkpoint.unplayedSentencesSnapshot had entries at cancel
   *  time — only 'speaking' cancels use this field. */
  hasUnplayedSnapshot?: boolean;
}): 'restore' | 'defer' | 'drop' | 'resume-tts' {
  const timeoutMs = args.timeoutMs ?? STAGE2_NO_VERDICT_RESTORE_MS;
  if (args.checkpointActive === false) return 'drop';
  if (args.cancelledDuringState !== 'processing') {
    // R32 (H3): a 'speaking'-state cancel used to be out of scope here — the
    // unplayed-sentence resume is verdict-driven, so a cancel whose
    // interrupting sound never transcribes dangled until the next transcript's
    // 20s stale sweep (unbounded dead air, silence audit). On timeout, resume
    // the cut TTS tail ourselves. Order matters: stale check precedes this.
    if (args.ageMs > STALE_CUTOFF_MS) return 'drop';
    if (!args.hasUnplayedSnapshot) return 'drop';
    if (args.midUtterance) return 'defer';
    if (args.ageMs < timeoutMs) return 'defer';
    return 'resume-tts';
  }
  if (args.newBrainCallInFlight) return 'drop';
  // Mirrors the RESTORE-after-finished guard: if the turn wasn't genuinely
  // cut off, the answer was already delivered — re-firing duplicates it.
  if (!args.brainWasInFlight || !args.brainTurnAborted) return 'drop';
  if (args.ageMs > STALE_CUTOFF_MS) return 'drop';
  if (args.midUtterance) return 'defer';
  if (args.ageMs < timeoutMs) return 'defer';
  return 'restore';
}
