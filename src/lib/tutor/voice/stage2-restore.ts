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

/** R42 (2026-08-10, session portal-cb2addf5): how recently VAD activity
 *  (speech_started OR speech_stopped — either edge of a speech window)
 *  must have been seen to still defer a 'speaking'-cancel timeout-resume.
 *  `midUtterance` alone only catches the INSTANT the check runs — an
 *  inter-clause pause (a breath between "the answer is..." and "...42")
 *  fires speech_stopped and clears it, even though the student is still
 *  mid-answer and about to resume. Observed live: gate passed, TTS
 *  cancelled, then stage3_timeout_resume fired 7002ms later and talked
 *  over the student while their 13.9s utterance was still 6+ seconds from
 *  finalizing. 4s comfortably covers a clause-boundary breath without
 *  meaningfully delaying recovery from a genuinely abandoned utterance. */
export const RECENT_VAD_ACTIVITY_WINDOW_MS = 4_000;

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
  /** R42 (2026-08-10): ms since the last VAD edge (speech_started OR
   *  speech_stopped) of ANY kind — covers the inter-clause-pause gap that
   *  bare `midUtterance` misses (see RECENT_VAD_ACTIVITY_WINDOW_MS above).
   *  Undefined ⇒ no recency signal available; falls back to `midUtterance`
   *  alone (today's behavior, unchanged). Only consulted in the 'speaking'
   *  branch — 'processing' cancels are unaffected by this fix. */
  msSinceLastVadActivity?: number;
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
    // Mirrors the 'processing' branch's own newBrainCallInFlight check below:
    // if a new brain turn is already speaking, the stall self-resolved —
    // replaying the old unplayed sentences now would talk over the new turn.
    if (args.newBrainCallInFlight) return 'drop';
    // R42: defer if the student is mid-utterance RIGHT NOW, or VAD saw
    // activity recently enough that they're plausibly mid-clause-pause
    // rather than genuinely done. Computed once, used by both sub-branches
    // below.
    const recentActivity = args.midUtterance ||
      (args.msSinceLastVadActivity !== undefined && args.msSinceLastVadActivity <= RECENT_VAD_ACTIVITY_WINDOW_MS);
    if (!args.hasUnplayedSnapshot) {
      // Round-6c (live 2026-07-28, portal-28ee6557): empty snapshot used to
      // hard-drop, which swallowed the whole turn when the cancel hit with
      // every emitted sentence already dispatched to TTS (queue empty) while
      // the brain was still STREAMING — the abort cut the rest of the
      // response and nothing ever re-delivered it (observed: 27s dead air,
      // checkpoint only cleared by the next transcript's stale sweep). The
      // verdict-driven path has had exactly this fallback since Stage 3.1
      // ("refire-on-noise": empty snapshot + brain in flight → re-fire);
      // mirror it here, with the same genuinely-cut-off guard so a
      // completed turn is never duplicated.
      if (!args.brainWasInFlight || !args.brainTurnAborted) return 'drop';
      if (recentActivity) return 'defer';
      if (args.ageMs < timeoutMs) return 'defer';
      return 'restore';
    }
    if (recentActivity) return 'defer';
    if (args.ageMs < timeoutMs) return 'defer';
    return 'resume-tts';
  }
  if (args.newBrainCallInFlight) return 'drop';
  // Mirrors the RESTORE-after-finished guard: if the turn wasn't genuinely
  // cut off, the answer was already delivered — re-firing duplicates it.
  if (!args.brainWasInFlight || !args.brainTurnAborted) {
    // Round-6d (portal-37c0e0bf): …unless the cancel killed QUEUED TTS. A
    // 'processing' cancel in the inter-sentence gap clears sentences the
    // brain already emitted but the student never heard — "brain done" is
    // not "delivered". Resume the snapshot (replay-only, no re-fire, no
    // duplication risk); pure-drop only when nothing was queued.
    if (args.hasUnplayedSnapshot) {
      if (args.ageMs > STALE_CUTOFF_MS) return 'drop';
      if (args.midUtterance) return 'defer';
      if (args.ageMs < timeoutMs) return 'defer';
      return 'resume-tts';
    }
    return 'drop';
  }
  if (args.ageMs > STALE_CUTOFF_MS) return 'drop';
  if (args.midUtterance) return 'defer';
  if (args.ageMs < timeoutMs) return 'defer';
  return 'restore';
}
