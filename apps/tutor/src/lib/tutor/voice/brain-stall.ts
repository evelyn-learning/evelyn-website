/**
 * Brain-stream stall guard — pure decision, no I/O.
 *
 * ROOT CAUSE (R49, 2026-08-20, session portal-2d53e403): the brain fetch in
 * VoiceTutorRealtime's callBrainOnce creates an AbortController purely so the
 * perception layer can cancel on a student barge-in. Nothing else ever aborts
 * it — there is no request timeout and no stream timeout. When the upstream
 * stream wedges, the call simply hangs. One did, for 125143ms
 * (`brain_turn Brain 125143ms`).
 *
 * What the student experienced while it hung: they answered at 159.6s and
 * again at 193.4s — both dispatched (`perception_direct_dispatch`), neither
 * reaching a transcript entry — then sat through 78 SECONDS of silence
 * before the 90s `brain_watchdog_reset` fired. That watchdog is not a fix for
 * this: it only force-clears `brainBusy` and requeues the queued utterances
 * (which it did correctly — nothing was lost). The wedged fetch is left
 * running, and 90s of dead air has already happened.
 *
 * So this guard sits one level lower: watch the SSE frames, and when they
 * stop arriving for long enough that the student is plainly stranded, abort
 * the call so the normal retry path can run.
 *
 * The two windows differ because the COST of being wrong differs:
 *
 *  - Pre-audio (no sentence has been spoken yet) the student is in pure
 *    silence with no idea anything is happening. Aborting early costs a
 *    retry; not aborting costs dead air. Sized well under the 90s watchdog —
 *    a guard that fires after it would change nothing.
 *
 *  - Mid-turn (at least one sentence has gone to TTS) audio is playing and
 *    the student is occupied. Here a premature abort truncates a turn they
 *    are actively listening to, which is the worse outcome, so the window is
 *    substantially longer.
 *
 * Exercised by `npm run test:brain-stall`.
 */

export interface BrainStallInput {
  /** TUTOR_BRAIN_STALL_GUARD. False ⇒ always false; pre-R49 behaviour. */
  enabled: boolean;
  /** Milliseconds since the last SSE frame (or since the fetch dispatched,
   *  when no frame has arrived at all). */
  msSinceLastFrame: number;
  /** Has any sentence from THIS turn been handed to TTS yet? */
  spokeAnySentence: boolean;
  /** Is the call's AbortController already aborted? A perception barge-in
   *  owns that signal; a stall must never be reported on top of it. */
  alreadyAborted: boolean;
}

/** No SSE frame for this long BEFORE any audio ⇒ the student is stranded in
 *  silence. Deliberately a fraction of the 90s brain watchdog. */
export const BRAIN_STALL_PRE_AUDIO_MS = 22_000;

/** No SSE frame for this long once the turn is already speaking. Long enough
 *  that a slow-but-alive brain finishes its turn rather than being cut. */
export const BRAIN_STALL_MID_TURN_MS = 45_000;

export function shouldAbortStalledBrain(input: BrainStallInput): boolean {
  if (!input.enabled) return false;
  // The perception layer's barge-in abort already owns this controller.
  // Re-reporting it as a stall would mislabel a student interruption and
  // could trigger a retry of a turn the student deliberately cut off.
  if (input.alreadyAborted) return false;
  const window = input.spokeAnySentence ? BRAIN_STALL_MID_TURN_MS : BRAIN_STALL_PRE_AUDIO_MS;
  return input.msSinceLastFrame >= window;
}
