/** Round 4 (E5): when the text-mode tutor speaks first. Round 2: a homework
 *  session once its problems are loaded. Round 4: ANY goal when the host sets
 *  the `tutor_opens` claim — once the plan is loaded, or at once when there is
 *  no plan. Voice never (the mic tap starts it). Pure. */
export function textKickoffReady(i: {
  sessionMode: string;
  sessionGoal: string;
  tutorOpens: boolean;
  homeworkReady: boolean;
  hasPlanId: boolean;
  planLoaded: boolean;
}): boolean {
  if (i.sessionMode !== 'text') return false;
  if (i.sessionGoal === 'homework-help' && i.homeworkReady) return true;
  if (!i.tutorOpens) return false;
  return i.hasPlanId ? i.planLoaded : true;
}

/** Same opener the mic-tap start sends: a plan → [start lesson], else [start session]. */
export function textKickoffMessage(hasPlan: boolean): '[start lesson]' | '[start session]' {
  return hasPlan ? '[start lesson]' : '[start session]';
}

/** The two session-start kickoffs — the only turns that are "the opening turn". */
export function isKickoffMessage(t: string | null | undefined): boolean {
  const s = (t ?? '').trim();
  return s === '[start lesson]' || s === '[start session]';
}

/**
 * A typed message submitted in the composer while a brain turn is in flight.
 *
 * 2026-10-08 (portal-09624999): the automatic opening turn was dispatched at
 * 0.4 s; the student typed at 8.0 s, before any of it had been shown. The
 * composer cleared the busy flag WITHOUT aborting that turn, so the typed
 * message was neither queued nor a replacement: two brain turns overlapped
 * (0.4–11.6 s, 8.1–19.7 s) and the student got two tutor messages back to
 * back, the first unrelated to what they had written.
 *
 *  - 'dispatch'            nothing in flight: sent as before.
 *  - 'supersede_opening'   the opening turn is in flight and has shown
 *                          nothing: abort it; the student's message is the
 *                          first turn (it carries the opening directive, as
 *                          on the "student started first" stand-down).
 *  - 'queue_after_opening' the opening turn has already shown a sentence:
 *                          leave it running and the busy flag set, so the
 *                          message queues and runs right after it.
 *  - 'force_clear'         any other turn in flight, a stale busy flag, or
 *                          voice: the busy flag is force-cleared, as before.
 * Pure.
 */
export type TypedDuringTurn = 'dispatch' | 'supersede_opening' | 'queue_after_opening' | 'force_clear';

export function decideTypedDuringTurn(i: {
  sessionMode: string;
  brainBusy: boolean;
  /** Trigger text of the brain turn in flight; null when none is on record. */
  inFlightTranscript: string | null;
  /** A sentence of that turn has reached the student. */
  inFlightShown: boolean;
}): TypedDuringTurn {
  if (!i.brainBusy) return 'dispatch';
  if (i.sessionMode !== 'text' || !isKickoffMessage(i.inFlightTranscript)) return 'force_clear';
  return i.inFlightShown ? 'queue_after_opening' : 'supersede_opening';
}
