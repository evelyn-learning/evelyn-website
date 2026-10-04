/**
 * Idle re-engagement nudge (round-7g, session portal-b2fe010e 2026-07-28).
 *
 * THE HOLE THIS CLOSES: the tutor ended a full-correct confirmation turn
 * with no question and no next move ("Nailed it … between two beats.") —
 * a Rule-20 violation by the model — and NOTHING re-engaged: 7.7 minutes
 * of mutual silence until the student finally said "carry on". The prompt
 * already promises hands-off mode ends when "a long silence passes"
 * (system-prompt-builder Absorption/hands-off rules), but no client code
 * implemented it. This module is the timing/caps brain of that behavior.
 *
 * Shape: after a tutor turn is genuinely DELIVERED (left 'speaking' with
 * no recent barge-in kill — the cancel-storm recordDelivery predicate),
 * VTR arms a timer. Student activity (speech onset, a real dispatched
 * turn) restarts the clock. When it fires quiet, VTR dispatches a silent
 * bracketed directive (noise-nag precedent) so the tutor speaks ONE short
 * re-engagement line. The nudge's own delivery re-arms the timer at the
 * longer repeat gap; caps stop it from nagging a student who has walked
 * away.
 *
 * Decisions only — timers and refs live in VoiceTutorRealtime. The one
 * thing kept here is the IdleNudgeState object the caller passes back in
 * (counts, and planIdleNudge's clock bookkeeping).
 */

/** Quiet time after a delivered tutor turn before the first nudge. Long
 *  enough for reading a dense render or working a step ("take a moment to
 *  look this over" hand-offs land well inside it); short enough that the
 *  b2fe010e 7.7-minute hole can't recur. */
export const IDLE_NUDGE_FIRST_MS = 75_000;
/** Gap before a second nudge in the SAME silence stretch. */
export const IDLE_NUDGE_REPEAT_MS = 120_000;
/** Re-poll delay when the fire moment lands busy (tutor talking, student
 *  mid-utterance/typing, brain in flight) or the tab is hidden. */
export const IDLE_NUDGE_RECHECK_MS = 15_000;
/** Nudges per silence stretch — after two unanswered check-ins, go quiet
 *  and wait for the student (nagging an empty room is worse than silence). */
export const IDLE_NUDGE_MAX_PER_STRETCH = 2;
/** Session-wide cap — a student who repeatedly goes long-quiet has a
 *  working style; stop policing it. */
export const IDLE_NUDGE_MAX_PER_SESSION = 6;

export interface IdleNudgeState {
  /** Nudges fired since the student last engaged. */
  stretchCount: number;
  /** Nudges fired this session (VTR remounts per session). */
  sessionCount: number;
  /** Onset-class deferral (ms) spent since the last dispatched student turn.
   *  Maintained by planIdleNudge; cleared by recordStudentEngagement. */
  onsetDeferredMs?: number;
  /** Ceiling restarts granted for a genuine absence since the last
   *  dispatched student turn. Same ownership as onsetDeferredMs. */
  absenceRestarts?: number;
  /** planIdleNudge's bookkeeping for the timer currently armed. */
  arm?: IdleNudgeArmClock;
}

/** Per-arm clock bookkeeping, kept on the state the caller already holds. */
export interface IdleNudgeArmClock {
  /** Due time the caller is expected to pass on the next check of this arm;
   *  any other value (or no previous postponement) means a new arm. */
  dueAtMs: number;
  /** Ceiling restarts granted after a SHORT hidden/busy postponement. */
  shortRestarts: number;
  /** First check of the current unbroken run of hidden/busy checks. */
  postponedSinceMs: number | null;
  lastCheckAtMs: number;
}

export function createIdleNudgeState(): IdleNudgeState {
  return { stretchCount: 0, sessionCount: 0 };
}

/** Arm delay for the next timer: first nudge of a stretch waits the long
 *  threshold; follow-ups in the same stretch wait the repeat gap. */
export function idleNudgeArmDelayMs(state: IdleNudgeState): number {
  return state.stretchCount === 0 ? IDLE_NUDGE_FIRST_MS : IDLE_NUDGE_REPEAT_MS;
}

export type IdleNudgeDecision = 'fire' | 'recheck' | 'stand-down';

export function decideIdleNudge(args: {
  /** Tutor speaking / brain in flight / student mid-utterance or typing /
   *  a dispatch pending — the armStudentMarkIdleSend busy predicate. */
  busy: boolean;
  /** document.visibilityState === 'hidden' — don't speak into a
   *  backgrounded tab; re-check instead (foreground fires it). */
  hidden: boolean;
  /** R38: elapsed ≥ wrapAtMinutes on a time-boxed demo — the wrap
   *  directive owns the endgame; a nudge here collides with the one-
   *  sign-off rule. Never true for non-demo sessions. */
  wrapPhase: boolean;
  /** R58 student-declared hold ("wait until I say candle") — the student
   *  ASKED for the silence, so nudging is exactly what they asked us not
   *  to do. The hold's own single 5-minute check-in replaces it. */
  hold?: boolean;
  state: IdleNudgeState;
}): IdleNudgeDecision {
  if (args.wrapPhase) return 'stand-down';
  if (args.hold) return 'stand-down';
  if (
    args.state.stretchCount >= IDLE_NUDGE_MAX_PER_STRETCH ||
    args.state.sessionCount >= IDLE_NUDGE_MAX_PER_SESSION
  ) {
    return 'stand-down';
  }
  if (args.busy || args.hidden) return 'recheck';
  return 'fire';
}

export function recordIdleNudgeFired(state: IdleNudgeState): void {
  state.stretchCount++;
  state.sessionCount++;
}

/** Any real student engagement (speech onset, a dispatched turn) ends the
 *  silence stretch — the next nudge waits the full first-threshold again. */
export function recordStudentEngagement(state: IdleNudgeState): void {
  state.stretchCount = 0;
  state.onsetDeferredMs = 0;
  state.absenceRestarts = 0;
}

/** Bracketed silent directive ([System note:] convention from
 *  tutor-reactions.ts): synthetic throughout the orchestrator — no student
 *  bubble, skips covers, never starts the session clock. */
export const IDLE_NUDGE_DIRECTIVE =
  '[System note: the student has been quiet for a while since your last turn. ' +
  'Re-engage gently in ONE short sentence. If your last turn asked a question, ' +
  "softly check in or offer a choice — a hint, or more time. If it handed them " +
  'time to read or work, ask how it\'s going. If it ended without a question, ' +
  'offer the next small step. Do not repeat or summarize earlier content, and ' +
  'never scold the silence.]';

/**
 * R49b nudge directive v2 (live 2026-08-20, portal-2d53e403 at 1003.4s).
 *
 * The tutor asked "What's a common denominator for fourths and halves?" at
 * 911.2s. After 95 seconds of student silence the idle nudge fired and the
 * tutor said:
 *
 *   "Fourths — since half is just two fourths. No rush, Praveen — take a
 *    look at that. Once both sides speak 'fourths,' who's pulling harder —
 *    negative one fourth or positive two fourths?"
 *
 * It answered its own outstanding question and then advanced to the next
 * one. The student, who was still working on the first, was skipped
 * entirely — and this happened on a session with six nudges.
 *
 * What makes this worth a rule rather than a tweak: v1's intent was ALREADY
 * correct. It says "If your last turn asked a question, softly check in or
 * offer a choice — a hint, or more time." The brain read "a hint" as
 * licence to supply the answer, because a hint that gives the answer is
 * still, technically, a hint. The failure was not a missing instruction but
 * an under-specified one, so v2 states the prohibition directly instead of
 * relying on "hint" carrying it by implication.
 *
 * v2 also forbids advancing to a new question. A nudge that moves the
 * lesson forward is not a nudge — it is a turn the student never got to
 * take, and it converts their thinking time into a skipped question.
 */
export interface IdleNudgeDirectiveOpts {
  /** TUTOR_IDLE_NUDGE_V2. Absent/false ⇒ IDLE_NUDGE_DIRECTIVE verbatim. */
  v2?: boolean;
}

export function idleNudgeDirective(opts: IdleNudgeDirectiveOpts): string {
  if (!opts?.v2) return IDLE_NUDGE_DIRECTIVE;
  return (
    '[System note: the student has been quiet for a while since your last turn. ' +
    'Re-engage gently in ONE short sentence. The question you last asked is ' +
    'STILL OUTSTANDING and still theirs to answer — DO NOT ANSWER IT, and do not ' +
    'say the word, value, or term you asked them for. Silence means they are ' +
    'thinking, not that they have given up. Offer a choice: more time, or a hint. ' +
    'A hint must NARROW the search — point at what to look at, or rule something ' +
    'out — and must not give the answer inside it. Do not ask a NEW question and ' +
    'do not move on to the next step; this turn exists only to hand the same ' +
    'question back warmly. If your last turn handed them something to read or ' +
    "work through, ask how it's going. If it ended without a question, offer the " +
    'next small step. Do not repeat or summarize earlier content, and never scold ' +
    'the silence.]'
  );
}

/**
 * Dispatch-anchored nudge clock (2026-10-03).
 *
 * THE HOLE THIS CLOSES: production — one nudge at 378 s, then 229 s of dead
 * air with no second nudge, while the student mic showed many sound bursts
 * and NO transcript. Every speech ONSET called recordStudentEngagement +
 * re-armed the full timer, so sound that never became a turn (room noise, a
 * TV, breathing) pushed the nudge out forever and also wiped the per-stretch
 * count. An onset is not engagement; a DISPATCHED turn is.
 *
 * The rule: only a dispatched student turn (or typed input) resets the
 * stretch / restarts the clock. An onset may defer a due nudge by a short
 * grace — the tutor should not speak over someone who has just started
 * talking — but all onset-class deferral (recent onset, or "mid-utterance"
 * with no transcript) is bounded by a hard ceiling measured from when the
 * nudge first came due. Hidden-tab and hard-busy (tutor speaking, brain in
 * flight, a transcript awaiting dispatch, typing) still defer, and every
 * postponement carries a reason so the caller can log it — the silent 15 s
 * recheck loop was why the production stall left no trace.
 */

/** How long after a speech onset a due nudge holds off. */
export const IDLE_NUDGE_ONSET_GRACE_MS = 8_000;
/** Hard bound on ALL onset-class deferral, measured from the moment the
 *  nudge came due. First nudge is therefore at most FIRST_MS + this after
 *  the delivered tutor turn, however many onsets arrive. */
export const IDLE_NUDGE_ONSET_MAX_DEFER_MS = 30_000;

/**
 * Bounds on the ceiling RESTART (2026-10-04). A hidden/busy postponement that
 * ends on an onset restarts the ceiling, so that a student back from a long
 * absence is not nudged over their first words. Unbounded, that restart was
 * itself a stall: a busy blip 8 s of every 16 s, or a tab flapping hidden
 * 10 s of every 40 s, restarted the ceiling on every cycle and room noise
 * then held the nudge off indefinitely. So:
 *   · a short postponement restarts the ceiling at most ONCE per arm;
 *   · a postponement seen on every check for IDLE_NUDGE_GENUINE_ABSENCE_MS
 *     is a genuine absence and restarts it regardless of that one — but
 *     "every check" is a 15 s SAMPLE, and a blip whose period is close to
 *     the recheck interval looks continuous, so these too are limited, to
 *     IDLE_NUDGE_MAX_ABSENCE_RESTARTS since the last dispatched student turn;
 *   · all onset-class deferral since the last dispatched student turn —
 *     across arms and restarts — is capped at IDLE_NUDGE_ONSET_TOTAL_DEFER_MS.
 * A student who really speaks leaves all three behind at once: the turn is
 * dispatched, which resets the stretch.
 */
export const IDLE_NUDGE_MAX_SHORT_RESTARTS_PER_ARM = 1;
export const IDLE_NUDGE_GENUINE_ABSENCE_MS = 60_000;
export const IDLE_NUDGE_MAX_ABSENCE_RESTARTS = 2;
export const IDLE_NUDGE_ONSET_TOTAL_DEFER_MS = 90_000;

export type IdleNudgePostponeReason = 'busy' | 'hidden' | 'onset-grace';

export interface IdleNudgePlan {
  decision: IdleNudgeDecision;
  /** Set when decision === 'recheck'. */
  reason?: IdleNudgePostponeReason;
  /** Set when decision === 'recheck': delay until the next check. */
  recheckMs?: number;
  /** decision === 'fire' although an onset-class signal was live — the
   *  ceiling overrode it. */
  ceilingHit?: boolean;
  /** Set when the ceiling clock was restarted on this check (a hidden/busy
   *  postponement just ended, and a restart was still allowed): the caller
   *  stores it as the new due time. */
  dueAtMs?: number;
}

export function planIdleNudge(args: {
  nowMs: number;
  /** When the armed timer was due (arm time + idleNudgeArmDelayMs). */
  dueAtMs: number;
  /** Last speech-onset time, or null if none this session. */
  lastOnsetAtMs: number | null;
  /** Tutor speaking / brain in flight / a transcript awaiting dispatch /
   *  student typing. NOT bounded by the ceiling: each of these resolves on
   *  its own into a delivery or a dispatch, which re-arms the clock. */
  hardBusy: boolean;
  /** Perception says the student is mid-utterance. Onset-class: sound with
   *  no transcript can hold this true, so the ceiling bounds it. */
  midUtterance: boolean;
  hidden: boolean;
  wrapPhase: boolean;
  hold?: boolean;
  /** Also carries this function's clock bookkeeping (`arm`,
   *  `onsetDeferredMs`) from one check to the next — pass the same object. */
  state: IdleNudgeState;
  /** Reason of the PREVIOUS check's postponement since this timer was armed
   *  (null / omitted = none — which also tells this function the timer was
   *  just armed). When that was 'hidden' or 'busy' and this check is
   *  neither, the postponement has just ended: the ceiling clock restarts
   *  from now, so onset grace applies again — subject to the restart bounds
   *  above. Without the restart a long hidden tab (or a long typing spell)
   *  used the ceiling up, and the nudge fired over the returning student's
   *  first words (2026-10-04). */
  lastPostponeReason?: IdleNudgePostponeReason | null;
}): IdleNudgePlan {
  const base = decideIdleNudge({
    busy: false, hidden: false, wrapPhase: args.wrapPhase, hold: args.hold, state: args.state,
  });
  if (base === 'stand-down') return { decision: 'stand-down' };

  // Bookkeeping for this arm lives on the caller's state. No previous
  // postponement, or a due time other than the one this arm was left with,
  // means the timer was re-armed: start afresh.
  const state = args.state;
  const known = state.arm;
  const sameArm = !!known && args.lastPostponeReason != null && known.dueAtMs === args.dueAtMs;
  const arm: IdleNudgeArmClock = sameArm
    ? known
    : { dueAtMs: args.dueAtMs, shortRestarts: 0, postponedSinceMs: null, lastCheckAtMs: args.nowMs };
  state.arm = arm;
  if (sameArm && args.lastPostponeReason === 'onset-grace') {
    state.onsetDeferredMs = (state.onsetDeferredMs ?? 0) + Math.max(0, args.nowMs - arm.lastCheckAtMs);
  }
  arm.lastCheckAtMs = args.nowMs;

  if (args.hidden || args.hardBusy) {
    if (arm.postponedSinceMs == null) arm.postponedSinceMs = args.nowMs;
    return { decision: 'recheck', reason: args.hidden ? 'hidden' : 'busy', recheckMs: IDLE_NUDGE_RECHECK_MS };
  }
  const postponedForMs = arm.postponedSinceMs == null ? 0 : args.nowMs - arm.postponedSinceMs;
  arm.postponedSinceMs = null;

  const sinceOnset = args.lastOnsetAtMs == null ? Infinity : args.nowMs - args.lastOnsetAtMs;
  const inGrace = sinceOnset >= 0 && sinceOnset < IDLE_NUDGE_ONSET_GRACE_MS;
  const onsetLive = args.midUtterance || inGrace;
  if (!onsetLive) return { decision: 'fire' };

  const allowanceLeft = IDLE_NUDGE_ONSET_TOTAL_DEFER_MS - (state.onsetDeferredMs ?? 0);
  if (allowanceLeft <= 0) return { decision: 'fire', ceilingHit: true };

  const postponementEnded = args.lastPostponeReason === 'hidden' || args.lastPostponeReason === 'busy';
  const genuineAbsence = postponedForMs >= IDLE_NUDGE_GENUINE_ABSENCE_MS
    && (state.absenceRestarts ?? 0) < IDLE_NUDGE_MAX_ABSENCE_RESTARTS;
  const restart = postponementEnded && (genuineAbsence || arm.shortRestarts < IDLE_NUDGE_MAX_SHORT_RESTARTS_PER_ARM);
  if (restart && genuineAbsence) state.absenceRestarts = (state.absenceRestarts ?? 0) + 1;
  else if (restart) arm.shortRestarts++;
  const dueAtMs = restart ? args.nowMs : args.dueAtMs;
  arm.dueAtMs = dueAtMs;
  const ceilingAtMs = dueAtMs + IDLE_NUDGE_ONSET_MAX_DEFER_MS;
  if (args.nowMs >= ceilingAtMs) return { decision: 'fire', ceilingHit: true };
  const graceLeft = inGrace ? IDLE_NUDGE_ONSET_GRACE_MS - sinceOnset : IDLE_NUDGE_ONSET_GRACE_MS;
  const recheckMs = Math.max(1_000, Math.min(graceLeft, ceilingAtMs - args.nowMs, allowanceLeft));
  return { decision: 'recheck', reason: 'onset-grace', recheckMs, ...(restart ? { dueAtMs } : {}) };
}

/** `idle_nudge_postponed` is persisted; at the 15 s recheck a backgrounded
 *  tab wrote ~240 rows an hour. */
export const IDLE_NUDGE_POSTPONED_LOG_EVERY_MS = 60_000;

/** Log a postponement when its reason changes, and at most once per
 *  IDLE_NUDGE_POSTPONED_LOG_EVERY_MS while the same reason persists. */
export function shouldLogIdleNudgePostponed(args: {
  reason: IdleNudgePostponeReason;
  /** Reason last LOGGED since this timer was armed (null = nothing yet). */
  lastReason: IdleNudgePostponeReason | null;
  lastLoggedAtMs: number;
  nowMs: number;
}): boolean {
  if (args.lastReason == null || args.reason !== args.lastReason) return true;
  return args.nowMs - args.lastLoggedAtMs >= IDLE_NUDGE_POSTPONED_LOG_EVERY_MS;
}

/** Does a speech onset count as student engagement (stretch reset + timer
 *  restart)? Only with the dispatch-anchored clock OFF (the pre-fix rule). */
export function onsetResetsIdleNudge(dispatchAnchored: boolean): boolean {
  return !dispatchAnchored;
}
