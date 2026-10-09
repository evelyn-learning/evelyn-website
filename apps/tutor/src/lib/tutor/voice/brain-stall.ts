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

import { TUTOR_BRAIN_STALL_RETRY } from '@/lib/tutor/orchestrator/turn-round-flags';

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
  /** The server has said this turn is reasoning before it replies (a
   *  `thinking` frame arrived — text-mode thinking, text-thinking.ts). The
   *  model is silent while it reasons, so the nothing-shown window is the
   *  longer one below. Absent/false ⇒ exactly the windows as before. */
  thinking?: boolean;
}

/** No SSE frame for this long BEFORE any audio ⇒ the student is stranded in
 *  silence. Deliberately a fraction of the 90s brain watchdog. */
export const BRAIN_STALL_PRE_AUDIO_MS = 22_000;

/** The nothing-shown window for a turn that is reasoning first (2026-10-06).
 *  The server cuts a deliberation that has shown nothing at 14 s and
 *  re-issues the turn without thinking (TEXT_THINKING_DEADLINE_MS), and its
 *  own 30 s inactivity ceiling retries a wedged upstream; this window sits
 *  past both so the client does not abort a turn the server is already
 *  recovering, and is still finite — a dead stream is aborted. */
export const BRAIN_STALL_PRE_AUDIO_THINKING_MS = 35_000;

/** No SSE frame for this long once the turn is already speaking. Long enough
 *  that a slow-but-alive brain finishes its turn rather than being cut. */
export const BRAIN_STALL_MID_TURN_MS = 45_000;

export function shouldAbortStalledBrain(input: BrainStallInput): boolean {
  if (!input.enabled) return false;
  // The perception layer's barge-in abort already owns this controller.
  // Re-reporting it as a stall would mislabel a student interruption and
  // could trigger a retry of a turn the student deliberately cut off.
  if (input.alreadyAborted) return false;
  const window = input.spokeAnySentence
    ? BRAIN_STALL_MID_TURN_MS
    : input.thinking ? BRAIN_STALL_PRE_AUDIO_THINKING_MS : BRAIN_STALL_PRE_AUDIO_MS;
  return input.msSinceLastFrame >= window;
}

// ── 2026-10-05: recovery after a stall with nothing shown ─────────────────
//
// Live (AP World History portal-ef16abed): the student's first, correct
// answer drew no reply for 120 s. The 22 s pre-audio abort fired, the catch
// spoke its cover line — and a TYPED session shows nothing for a spoken line,
// so the transcript carries two student turns in a row and the answer was
// never acknowledged. A stall with nothing shown costs the student nothing to
// retry, so retry the same turn once; if that stalls too, say so where the
// student is looking: a transcript line for a typed turn, speech otherwise.

/** The line shown (typed turn) or spoken (voice turn) after the second stall. */
export const BRAIN_STALL_APOLOGY = 'Sorry — I lost my train of thought. Could you send that again?';

/** A stall retry is "the retry of this turn" only this soon after the first. */
export const BRAIN_STALL_RETRY_WINDOW_MS = 120_000;

export type StallRecovery = 'retry' | 'apology' | 'default';

export function decideStallRecovery(input: {
  /** Unset ⇒ TUTOR_BRAIN_STALL_RETRY. False ⇒ 'default' (the single spoken
   *  cover line). */
  enabled?: boolean;
  /** This call ended by the stall guard's own abort. */
  stalled: boolean;
  /** Nothing of this turn reached the student (no sentence dispatched). */
  nothingShown: boolean;
  /** The turn's trigger text. A bracketed runtime dispatch is never retried
   *  here (the opener has its own retry; nudges simply lapse). */
  transcript: string;
  /** The last stall retry: the text retried and when. */
  lastRetry: { transcript: string; at: number } | null | undefined;
  now: number;
}): StallRecovery {
  if ((input?.enabled ?? TUTOR_BRAIN_STALL_RETRY) !== true || !input.stalled || !input.nothingShown) return 'default';
  const t = (input.transcript ?? '').trim();
  if (!t || t.startsWith('[')) return 'default';
  const prev = input.lastRetry;
  const alreadyRetried = !!prev && prev.transcript === t && input.now - prev.at <= BRAIN_STALL_RETRY_WINDOW_MS;
  return alreadyRetried ? 'apology' : 'retry';
}

// ── 2026-10-08: a stalled OPENER ──────────────────────────────────────────
//
// Live (text-mode partner session): the opening request stalled, the 22 s
// pre-audio abort fired, the fallback card rendered — and that was the whole
// opening. decideStallRecovery leaves bracketed dispatches alone, and the
// opener's own retry (F6, 2026-09-05) covered only a client-side fetch
// failure. A stalled opener that showed nothing is retried once, on the same
// single-use guard as F6, so an opener is never sent more than twice.

export function shouldRetryStalledOpener(input: {
  /** This call ended by the stall guard's own abort. */
  stalled: boolean;
  /** Nothing of this attempt reached the student (no sentence dispatched). */
  nothingShown: boolean;
  /** The turn's trigger text — only the session-start kickoffs qualify. */
  transcript: string;
  /** The opener's one retry (network failure or stall) is already spent. */
  retryUsed: boolean;
}): boolean {
  if (!input.stalled || !input.nothingShown || input.retryUsed) return false;
  const t = (input.transcript ?? '').trim();
  return t === '[start lesson]' || t === '[start session]';
}
