/**
 * resolveOpeningBehavior — Session-Mode & Journey Matrix, encoded as a single
 * pure decision function. Given the session mode + journey signals, decides
 * the opener + calibration behavior for the start of a tutoring session.
 *
 * This is the single source of truth a later orchestrator task (folded into
 * B2) consumes to decide whether/what opener fires and whether/what
 * calibration runs. See project_tutor_pedagogy_opener_calibration and
 * .superpowers/sdd/task-B6-brief.md for the full design.
 *
 * Pure, total, no I/O. Rules are evaluated in the exact precedence order
 * below — the first matching rule wins.
 */

export type SessionMode = 'lessonNode' | 'freestyle' | 'diagnostic';

export type OpenerKind = 'proactive' | 'warm-resume' | 'pickup' | 'none';

export type CalibrationKind = 'full' | 'light' | 'none';

export type Journey =
  | 'diagnostic'
  | 'resume-live'
  | 'resume-stale'
  | 'course-complete'
  | 'node-revisit'
  | 'demo-logged-out'
  | 'demo-trial'
  | 'subscribed-returning'
  | 'subscribed-new-diagnosed'
  | 'subscribed-new';

export interface OpeningInput {
  targetKind: SessionMode;
  isTrial: boolean;
  hasPortalContext: boolean; // false = logged-out showcase demo (no StudentContext)
  hasPriorSessions: boolean; // subscribed returning
  diagnosticTaken: boolean; // placement diagnostic already done
  resume: { hasLiveCheckpoint: boolean; checkpointStale: boolean };
  nodeCompleted: boolean; // revisiting an already-studied node
  courseComplete: boolean;
}

export interface OpeningBehavior {
  mode: SessionMode;
  journey: Journey;
  opener: OpenerKind;
  calibration: CalibrationKind;
}

/**
 * Resolves the opener + calibration behavior for a session start.
 *
 * Precedence (first match wins):
 *  1. Diagnostic session — opener/calibration MUST no-op.
 *  2. Live (fresh) checkpoint — silent pickup, no calibration.
 *  3. Stale checkpoint — cold restart of the node + light re-orient.
 *  4. Course complete.
 *  5. Node revisit (already-studied node).
 *  6. Trial demo — full calibration, proactive opener.
 *  7. Logged-out showcase demo (no portal context) — full calibration.
 *  8. Subscribed returning (has prior sessions).
 *  9. Subscribed new, diagnostic already taken — warmstart, do NOT re-quiz.
 * 10. Subscribed new, no diagnostic — catch-all.
 *
 * `mode` is always input.targetKind (passthrough); `targetKind === 'freestyle'`
 * does not change opener/calibration — freestyle only disables
 * completion-gating downstream (a Phase-C concern, not decided here).
 */
export function resolveOpeningBehavior(input: OpeningInput): OpeningBehavior {
  const mode = input.targetKind;

  // Rule 1: assessment session — opener/calibration features MUST no-op.
  if (input.targetKind === 'diagnostic') {
    return { mode, journey: 'diagnostic', opener: 'none', calibration: 'none' };
  }

  // Rule 2: live checkpoint — silent pickup, no calibration.
  if (input.resume.hasLiveCheckpoint && !input.resume.checkpointStale) {
    return { mode, journey: 'resume-live', opener: 'pickup', calibration: 'none' };
  }

  // Rule 3: stale checkpoint — cold restart of the node + light re-orient
  // (NOT full calibration).
  if (input.resume.hasLiveCheckpoint && input.resume.checkpointStale) {
    return { mode, journey: 'resume-stale', opener: 'proactive', calibration: 'light' };
  }

  // Rule 4: course complete.
  if (input.courseComplete) {
    return { mode, journey: 'course-complete', opener: 'warm-resume', calibration: 'none' };
  }

  // Rule 5: node revisit.
  if (input.nodeCompleted) {
    return { mode, journey: 'node-revisit', opener: 'warm-resume', calibration: 'none' };
  }

  // Rule 6: trial demo.
  if (input.isTrial) {
    return { mode, journey: 'demo-trial', opener: 'proactive', calibration: 'full' };
  }

  // Rule 7: logged-out showcase demo (no StudentContext).
  if (!input.hasPortalContext) {
    return { mode, journey: 'demo-logged-out', opener: 'proactive', calibration: 'full' };
  }

  // Rule 8: subscribed returning.
  if (input.hasPriorSessions) {
    return { mode, journey: 'subscribed-returning', opener: 'warm-resume', calibration: 'none' };
  }

  // Rule 9: subscribed new, diagnostic already taken — warmstart from seeded
  // mastery, do NOT re-quiz.
  if (input.diagnosticTaken) {
    return {
      mode,
      journey: 'subscribed-new-diagnosed',
      opener: 'proactive',
      calibration: 'none',
    };
  }

  // Rule 10: subscribed new, no diagnostic — catch-all.
  return { mode, journey: 'subscribed-new', opener: 'proactive', calibration: 'light' };
}

/**
 * ── Task B2 — orchestrator-wiring pure helpers ──────────────────────────
 * Co-located with resolveOpeningBehavior so the orchestrator (VoiceTutorRealtime
 * / page.tsx) has a single import for the whole opener decision surface.
 * Both helpers are pure/total — no I/O, no env reads — so they're fully
 * unit-testable outside the (un-runnable-here) live app. See
 * .superpowers/sdd/task-B2-brief.md.
 */

export type EntryMode = 'button' | 'typed-content' | 'typed-greeting';

// Bare-greeting openers the tutor should treat as "no real content yet" —
// mirrors the transcript-filter greeting list in spirit but scoped to this
// decision (a short greeting with no question mark, <= 4 words).
const BARE_GREETING_RE = /^(hi|hey|hello|yo|hiya|sup|hey there)\b/i;
const MAX_BARE_GREETING_WORDS = 4;

/**
 * Classifies how the student entered the session, from the first thing
 * they typed (if anything) before the tutor's opener fires.
 *  - no/empty/whitespace-only message -> 'button' (tutor acts first)
 *  - a short bare greeting (matches BARE_GREETING_RE, <= 4 words, no '?')
 *    -> 'typed-greeting'
 *  - anything else -> 'typed-content'
 */
export function detectEntryMode(firstStudentMessage?: string | null): EntryMode {
  const trimmed = firstStudentMessage?.trim();
  if (!trimmed) return 'button';
  const wordCount = trimmed.split(/\s+/).length;
  const isBareGreeting =
    BARE_GREETING_RE.test(trimmed) &&
    wordCount <= MAX_BARE_GREETING_WORDS &&
    !trimmed.includes('?');
  return isBareGreeting ? 'typed-greeting' : 'typed-content';
}

/** Orchestrator-supplied signals used to assemble an `OpeningInput`. Every
 *  field beyond the three the orchestrator always has (targetKind, isTrial,
 *  hasPortalContext) is optional — `assembleOpeningInput` defaults each
 *  missing one conservatively (false / no-checkpoint) so a caller that
 *  can't yet plumb a given signal doesn't have to fake it. */
export interface OpeningSignals {
  targetKind: SessionMode;
  isTrial: boolean;
  hasPortalContext: boolean;
  hasPriorSessions?: boolean;
  diagnosticTaken?: boolean;
  resume?: { hasLiveCheckpoint: boolean; checkpointStale: boolean };
  nodeCompleted?: boolean;
  courseComplete?: boolean;
}

/**
 * Thin, pure mapper from orchestrator-signals to the B6 `OpeningInput`.
 * Missing/unknown booleans default to false (and a missing `resume`
 * defaults to no checkpoint) — the conservative choice per the B2 brief:
 * an unknown signal should never cause resolveOpeningBehavior to short-
 * circuit into a journey the orchestrator can't actually back up.
 */
export function assembleOpeningInput(sig: OpeningSignals): OpeningInput {
  return {
    targetKind: sig.targetKind,
    isTrial: sig.isTrial,
    hasPortalContext: sig.hasPortalContext,
    hasPriorSessions: sig.hasPriorSessions ?? false,
    diagnosticTaken: sig.diagnosticTaken ?? false,
    resume: sig.resume ?? { hasLiveCheckpoint: false, checkpointStale: false },
    nodeCompleted: sig.nodeCompleted ?? false,
    courseComplete: sig.courseComplete ?? false,
  };
}

/**
 * Pure predicate for the `NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER` flag value —
 * mirrors the existing `=== 'true'` flag pattern (VoiceTutorRealtime.tsx)
 * but also accepts `'on'`. Split out as a pure function purely so the
 * accepted-value set is unit-testable; the orchestrator still reads
 * `process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER` itself (this file does
 * no env I/O).
 */
export function isPedagogyOpenerFlagValue(raw: string | undefined): boolean {
  return raw === 'true' || raw === 'on';
}
