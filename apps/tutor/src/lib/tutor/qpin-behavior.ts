/**
 * Q-pin collapse/drag behavior — pure helpers, unit-tested by
 * scripts/test-qpin-behavior.ts. Spec:
 * docs/superpowers/specs/2026-07-23-qpin-collapse-drag-design.md
 */

/** Pointer must move MORE than this (px, euclidean) before a press counts as a drag. */
import { classifyCover } from './voice/cover-layer';
import { readPacingVerdict } from './voice/pacing-verdict';

export const QPIN_DRAG_THRESHOLD_PX = 5;
/** Collapse this long after the tutor finishes speaking the ask. */
export const QPIN_POST_SPEECH_MS = 6000;
/** Collapse no later than this after the pin appears (covers a missing TTS-end signal). */
export const QPIN_HARD_CAP_MS = 15000;

// Reserved bands inside the stage (px) the dragged pin may not enter: the
// floating header (top) and the floating caption+dock bar (bottom), plus a
// small side gutter. The stage rect already includes iOS safe-area insets
// (the stage root is `fixed inset-0`).
export const QPIN_TOP_MIN_PX = 60;
export const QPIN_BOTTOM_RESERVED_PX = 96;
export const QPIN_SIDE_PX = 8;

/** Pin top-left corner as fractions of the stage size — survives resizes/rotation. */
export interface QpinFraction {
  x: number;
  y: number;
}

export function exceedsDragThreshold(dx: number, dy: number): boolean {
  return Math.hypot(dx, dy) > QPIN_DRAG_THRESHOLD_PX;
}

/**
 * Absolute epoch-ms deadline for auto-collapse. speechEndedAt is null while
 * the tutor is still speaking (or the signal never arrived) — then only the
 * hard cap applies. The cap also bounds a very late speech-end.
 */
export function qpinCollapseDeadline(shownAt: number, speechEndedAt: number | null): number {
  const cap = shownAt + QPIN_HARD_CAP_MS;
  if (speechEndedAt === null) return cap;
  return Math.min(speechEndedAt + QPIN_POST_SPEECH_MS, cap);
}

/** R38: the pin's owning turn no longer needs to be the LATEST tutor turn —
 *  an idle-nudge line or a board-only (historyOnly) turn must not kill an
 *  unanswered question. The pin dies only by ✕ dismiss or replacement
 *  (the gist effect sets a NEW pin when a newer turn asks a question). */
export function latestSubstantiveTutorEntry<T extends { role: string; historyOnly?: boolean }>(
  transcript: T[],
): T | undefined {
  return [...transcript].reverse().find((t) => t.role === 'tutor' && !t.historyOnly);
}

/** R47 Task 3c: a pinned question is scoped to the problem/segment it was
 *  asked in. R38's persist-until-replaced semantics deliberately keep a pin
 *  alive across non-question tutor turns WITHIN that segment (idle nudge,
 *  board-only) — but nothing previously bounded it across a SEGMENT
 *  advance, so a question pinned against an earlier problem could still be
 *  showing several turns later at, e.g., the Recap segment (live: session
 *  portal-1349716e, ~22:37 — "Ready for one with a billionaire in the mix?"
 *  stuck at Recap). The lesson cursor's segment id (`activeSegmentId` /
 *  `lessonProgress.currentSegmentId` — the same signal the rail uses) is
 *  the obsoleting event: once it changes, the pin's problem context is
 *  gone and it must clear, regardless of whether a new question has
 *  arrived yet.
 *
 *  Design call: clear on ANY segment-id change, including a `to:'free'`
 *  cursor release (segId → '') and a later resume back into the plan
 *  ('' → segId). A pin surviving into free-conversation is exactly as
 *  stale as one surviving into Recap — its problem is off the board
 *  either way — so there is no case where keeping it "because the
 *  conversation might still be relevant" beats the student re-asking if
 *  they actually want it back. Two equal, non-empty ids (no advance) or
 *  two equal empty ids (never entered a plan) are NOT a change. */
export function shouldClearQpinOnSegmentChange(prevSegmentId: string, nextSegmentId: string): boolean {
  return prevSegmentId !== nextSegmentId;
}

export function clampQpinFraction(
  pos: QpinFraction,
  stage: { width: number; height: number },
  pin: { width: number; height: number },
): QpinFraction {
  const minX = QPIN_SIDE_PX;
  const maxX = Math.max(minX, stage.width - pin.width - QPIN_SIDE_PX);
  const minY = QPIN_TOP_MIN_PX;
  const maxY = Math.max(minY, stage.height - pin.height - QPIN_BOTTOM_RESERVED_PX);
  const px = Math.min(Math.max(pos.x * stage.width, minX), maxX);
  const py = Math.min(Math.max(pos.y * stage.height, minY), maxY);
  return { x: px / stage.width, y: py / stage.height };
}

/**
 * R50 T2 — how many SUBSTANTIVE tutor turns a pin may fall behind before it
 * is cleared as stale.
 *
 * R38 deliberately removed the "pin dies when it stops being the latest
 * turn" rule, because an idle-nudge line or a board-only turn must not kill
 * a question the student is still working on. R47 then bounded the pin to
 * its SEGMENT. Neither bound helps inside one long segment, which is where
 * it broke live.
 *
 * portal-14bbe45a (Grade 7 fractions, 2026-08-21): the pin showed "What's
 * 0.625 as a percent?" — asked at t=630.3 — while the board had moved on to
 * "Two thirds" (rendered t=899.5). The lesson cursor did not advance between
 * t=213 and t=1152.9, so ONE segment ran 940s and the tutor asked at least
 * six distinct questions inside it; the student tapped the stale pin twice.
 * The gist service was verified healthy against those exact turns (it
 * returns correct gists for all four, null for non-questions), so the
 * replacement was being dropped client-side and the pin simply never moved.
 *
 * This is the belt to that braces: independent of WHY a replacement was
 * missed, a pin more than `max` substantive tutor turns behind is stale by
 * construction. Counting only substantive turns is what preserves R38 —
 * nudges and history-only turns still cannot age a pin out.
 */
export const QPIN_MAX_TUTOR_TURNS_BEHIND = 2;

/**
 * True when the pinned turn has fallen more than `max` substantive tutor
 * turns behind the end of the transcript. Unknown pin id => false (never
 * clear a pin we cannot locate; that would be a worse failure than a stale
 * one). Pure, total, never throws.
 */
export function isQpinStaleByTurns<T extends { id?: string; role: string; historyOnly?: boolean }>(
  transcript: readonly T[],
  pinTurnId: string | null | undefined,
  max: number = QPIN_MAX_TUTOR_TURNS_BEHIND,
): boolean {
  if (!pinTurnId) return false;
  const idx = transcript.findIndex((t) => t.id === pinTurnId);
  if (idx < 0) return false;
  let behind = 0;
  for (let i = idx + 1; i < transcript.length; i++) {
    const t = transcript[i];
    if (t.role === 'tutor' && !t.historyOnly) behind++;
    if (behind > max) return true;
  }
  return false;
}


/**
 * R55 — CLEAR THE PIN WHEN THE QUESTION IS ANSWERED.
 *
 * A Q-pin's lifetime was bounded by REPLACEMENT, SEGMENT ADVANCE (R47) and a
 * TURN-COUNT BACKSTOP (R50) — but never by the question actually being
 * answered. Two live windows, portal-8a9685e1 (2026-08-22, Grade 7 geography),
 * measured from the qpin telemetry R54 unblocked:
 *
 *   pin t=29.5   -> answered t=50.5   -> "Right — those are exactly the three
 *                   ingredients" t=62.4 -> pin survived to t=150.0   (87s)
 *   pin t=1398.3 -> answered t=1430.3 -> "Right — once." t=1435.8
 *                                      -> pin survived to t=1602.7  (167s)
 *
 * WHY NOT TURN COUNT: a pin can remain valid across many turns. If the student
 * did not understand and the tutor RE-EXPLAINS, the same question is still
 * live. Turn count is not the signal; "has it been answered?" is.
 *
 * WHY NOT PACING CREDIT (the first design, discarded on measurement): pacing
 * credit only runs on turns classified as verification, and there are ZERO
 * `pacing_*` events in that entire session — a concept-explanation lesson has
 * none. `readPacingVerdict` reads any turn's TEXT and needs no pacing
 * machinery, so it is available on the surface where the bug actually happens.
 *
 * CONDITION 2 IS LOAD-BEARING, NOT DEFENSIVE. `AFFIRM_OPENER_RE` includes
 * "good", so a tutor replying "Good question." to a student TANGENT reads as
 * an affirmation. Requiring the student turn to be ANSWER-SHAPED is the only
 * thing that blocks it — handled by construction rather than a special case.
 *
 * ANSWER-SHAPED IS A WHITELIST OF `classifyCover` OUTCOMES, NOT A BLACKLIST OF
 * THREE. The design note said "exclude question/request/stuck"; that is not
 * sufficient, because `classifyCover` returns a KIND as well as a CATEGORY and
 * every `kind:'silent'` outcome is also a non-answer (backchannel "mm-hmm",
 * continuation fragments, student stalls, synthetic bracketed dispatches).
 * Blacklisting three of them would have let a grunt arm the clear.
 *
 * Every refusal returns a REASON so the skip ratio is readable in telemetry.
 * A guard whose refusals are unobservable cannot be tuned, only guessed at —
 * three ack guards were tuned against silence in one night before that lesson
 * landed. Pure, total, never throws.
 */
export type QpinAnswerReason =
  | 'answered'
  | 'pin-not-found'
  | 'no-student-turn'
  | 'not-answer-shaped'
  | 'awaiting-tutor-turn'
  | 'no-affirm'
  | 'correction';

export interface QpinAnswerDecision {
  clear: boolean;
  reason: QpinAnswerReason;
  /** Populated on 'not-answer-shaped' so the skip ratio is diagnosable. */
  coverCategory?: string;
}

/** `classifyCover` outcomes that count as the student having ANSWERED.
 *  Whitelist on purpose — see the note above. */
const ANSWER_SHAPED_CATEGORIES = new Set(['numeric-echo', 'think-aloud', 'generic']);

export function shouldClearQpinOnAnswer<
  T extends { id?: string; role: string; text?: string; historyOnly?: boolean },
>(transcript: readonly T[], pinTurnId: string | null | undefined): QpinAnswerDecision {
  if (!pinTurnId) return { clear: false, reason: 'pin-not-found' };
  const idx = transcript.findIndex((t) => t.id === pinTurnId);
  if (idx < 0) return { clear: false, reason: 'pin-not-found' };

  // 1+2. FORWARD SCAN to the first ANSWER-SHAPED student turn since the pin.
  //
  // Taking only the FIRST student turn was wrong: a backchannel, a stall or a
  // clarifying question routinely precedes the answer, and stopping there made
  // the guard refuse and the pin persist to the R50 backstop — the exact
  // failure this function exists to remove. `firstCategory` remembers why the
  // earliest candidate was rejected, so the refusal reason stays diagnosable
  // rather than reporting whichever non-answer happened to come last.
  let sIdx = -1;
  let sawStudent = false;
  let firstCategory = '';
  for (let i = idx + 1; i < transcript.length; i++) {
    if (transcript[i].role !== 'student') continue;
    sawStudent = true;
    const cover = classifyCover(transcript[i].text || '');
    if (cover.kind === 'cover' && ANSWER_SHAPED_CATEGORIES.has(cover.category)) { sIdx = i; break; }
    if (!firstCategory) firstCategory = cover.kind === 'cover' ? cover.category : cover.kind;
  }
  if (!sawStudent) return { clear: false, reason: 'no-student-turn' };
  if (sIdx < 0) return { clear: false, reason: 'not-answer-shaped', coverCategory: firstCategory };

  // 3. the tutor's following SUBSTANTIVE turn must read as an affirmation.
  //    historyOnly turns are skipped — R38's guarantee, same as the turn bound.
  let tIdx = -1;
  for (let i = sIdx + 1; i < transcript.length; i++) {
    const t = transcript[i];
    if (t.role === 'tutor' && !t.historyOnly) { tIdx = i; break; }
  }
  if (tIdx < 0) return { clear: false, reason: 'awaiting-tutor-turn' };

  const read = readPacingVerdict(transcript[tIdx].text || '');
  if (read.isCorrection) return { clear: false, reason: 'correction' };
  if (!read.isAffirm) return { clear: false, reason: 'no-affirm' };
  return { clear: true, reason: 'answered' };
}
