/**
 * Fixed-script plans (GDI trial, 2026-10-28). A tester runs the SAME scripted
 * lesson several times, so a plan with `metadata.fixedScript === true`:
 *   - skips segments marked `metadata.skipWhenLevelKnown` once the working
 *     level is known (a returning learner gets no second level check);
 *   - recalls nothing from earlier sessions and never rotates its content
 *     (the second run must look like the same lesson).
 * Generic: any plan can carry the flags. Plans without `fixedScript` are
 * never affected — every helper below returns the pre-existing answer.
 */
import type { LessonPlan, Segment } from './types';

export function isFixedScriptPlan(plan: LessonPlan | null | undefined): boolean {
  return plan?.metadata?.fixedScript === true;
}

/** Content variety (rotating examples/problems a learner has seen) is off for
 *  a fixed script: rotation would make the repeat run a different lesson. */
export function shouldRotatePlanContent(plan: LessonPlan | null | undefined): boolean {
  return !isFixedScriptPlan(plan);
}

function skipsForKnownLevel(plan: LessonPlan, seg: Segment, levelKnown: boolean): boolean {
  return levelKnown && isFixedScriptPlan(plan) && seg.metadata?.skipWhenLevelKnown === true;
}

/** Where a fresh session starts: the first segment, past any leading segment
 *  that is skipped because the level is already known. */
export function initialSegmentId(plan: LessonPlan, levelKnown: boolean): string {
  const first = plan.segments.find((s) => !skipsForKnownLevel(plan, s, levelKnown));
  return (first ?? plan.segments[0]).id;
}

/** advance_lesson({to:"next"}) on a fixed script: the next segment in order,
 *  skipping off-topic segments (as resolveAdvanceTarget does) and, when the
 *  level is known, the level-check segments. An unknown/empty cursor resumes
 *  from the start. null ⇒ end of plan. */
export function nextSegmentId(plan: LessonPlan, fromId: string, levelKnown: boolean): string | null {
  const idx = plan.segments.findIndex((s) => s.id === fromId);
  for (let j = idx < 0 ? 0 : idx + 1; j < plan.segments.length; j++) {
    const s = plan.segments[j];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((s as any).offTopic === true) continue;
    if (skipsForKnownLevel(plan, s, levelKnown)) continue;
    return s.id;
  }
  return null;
}

/** The brain-stream route resolves advance_lesson "next" from the segment
 *  index the client sends (it has no plan metadata or level), so the client
 *  marks the entries to skip. Nothing to mark ⇒ the SAME array (the request
 *  body is byte-identical for every other plan). */
export function markSkippedSegments<T extends { id: string }>(
  index: T[],
  plan: LessonPlan | null | undefined,
  levelKnown: boolean,
): Array<T & { skipForKnownLevel?: true }> {
  if (!plan || !levelKnown || !isFixedScriptPlan(plan)) return index;
  const skip = new Set(plan.segments.filter((s) => skipsForKnownLevel(plan, s, true)).map((s) => s.id));
  if (skip.size === 0) return index;
  return index.map((e) => (skip.has(e.id) ? { ...e, skipForKnownLevel: true as const } : e));
}

export function isSkippedForKnownLevel(entry: { skipForKnownLevel?: boolean }): boolean {
  return entry.skipForKnownLevel === true;
}

/** Turns a tutor may spend in one segment before the client's "segment
 *  overlong" note nudges it to advance. A fixed script times its segments in
 *  minutes (a 5-minute conversation is ~12 tutor turns, not 6), so its
 *  threshold comes from the segment's `estimatedMinutes` (~2.4 turns a
 *  minute), never below `defaultTurns`. Any other plan, or a segment without
 *  minutes, keeps `defaultTurns` unchanged. */
/** GDI run 3 (2026-10-29): the brain improvised inside parts, so a
 *  fixed-script segment may carry its author's turn budget,
 *  `metadata.maxTurns` (a positive integer). undefined for any other plan, a
 *  missing segment, or a segment without one. */
export function segmentMaxTurns(plan: LessonPlan | null | undefined, segmentId: string | null | undefined): number | undefined {
  if (!plan || !segmentId || !isFixedScriptPlan(plan)) return undefined;
  const v = plan.segments.find((s) => s.id === segmentId)?.metadata?.maxTurns;
  return typeof v === 'number' && Number.isInteger(v) && v > 0 ? v : undefined;
}

export function overlongTurnThreshold(
  plan: LessonPlan | null | undefined,
  segmentId: string | null | undefined,
  defaultTurns: number,
): number {
  if (!plan || !isFixedScriptPlan(plan) || !segmentId) return defaultTurns;
  // An authored turn budget: the note lands one turn before the advance.
  const maxTurns = segmentMaxTurns(plan, segmentId);
  if (maxTurns !== undefined) return Math.max(1, maxTurns - 1);
  const mins = plan.segments.find((s) => s.id === segmentId)?.estimatedMinutes;
  if (typeof mins !== 'number' || !Number.isFinite(mins) || mins <= 0) return defaultTurns;
  return Math.max(defaultTurns, Math.round(mins * 2.4));
}

/** Fixed-script segments advance on the CLIENT (live run 1: the brain never
 *  called advance_lesson in a conversation lesson and the cursor sat on the
 *  first segment for 15 minutes, overlong note or not). Once a segment has
 *  run past its overlong note by a couple of turns, or past its minutes by a
 *  margin, the client moves the pointer itself. */
export interface AutoAdvanceInput {
  plan: LessonPlan | null | undefined;
  segmentId: string | null | undefined;
  /** substantive tutor turns spent in this segment (the overlong counter) */
  turns: number;
  /** the overlong note threshold already computed for this segment */
  overlongTurns: number;
  /** ms since the segment became current */
  elapsedMs: number;
  /** the learner's working level is known (level-check segments are skipped) */
  levelKnown: boolean;
}
export const FIXED_SCRIPT_AUTO_ADVANCE_EXTRA_TURNS = 2;
export const FIXED_SCRIPT_AUTO_ADVANCE_TIME_FACTOR = 1.5;
export const FIXED_SCRIPT_AUTO_ADVANCE_MIN_MS = 120_000;

/** 'turns' | 'time' | null — why a fixed-script segment must advance now.
 *  null for any other plan, a missing plan/segment, or a segment with nothing
 *  after it (nextSegmentId semantics). Turns are checked before time; a
 *  segment without finite positive `estimatedMinutes` never advances on time. */
export function fixedScriptAutoAdvanceReason(input: AutoAdvanceInput): 'turns' | 'time' | null {
  const { plan, segmentId, levelKnown } = input;
  if (!plan || !segmentId || !isFixedScriptPlan(plan)) return null;
  if (nextSegmentId(plan, segmentId, levelKnown) === null) return null;
  return segmentDueReason(input);
}

/** Task 14 §H (GDI run 4: the summary looped 7 minutes — the last segment
 *  can never auto-advance): the same "due" rule on the LAST on-topic segment
 *  of a fixed script (nextSegmentId null) ⇒ the lesson must close now. null
 *  for any other plan or segment. */
export function fixedScriptCloseReason(input: AutoAdvanceInput): 'turns' | 'time' | null {
  const { plan, segmentId, levelKnown } = input;
  if (!plan || !segmentId || !isFixedScriptPlan(plan)) return null;
  if (nextSegmentId(plan, segmentId, levelKnown) !== null) return null;
  return segmentDueReason(input);
}

/** The FACT note planted when the last part is due (urgent, like the other
 *  fixed-script FACT notes). */
export const FIXED_SCRIPT_CLOSE_NOTE =
  '[runtime note — not from the student] The lesson is complete. Give the closing summary now in two or three sentences and call close_session_notes in this turn; do not ask another question. Apply this silently; never mention this note.]';
/** Tutor turns after the close note without close_session_notes before the
 *  client closes the lesson itself. */
export const FIXED_SCRIPT_CLOSE_GRACE_TURNS = 2;
/** True ⇒ close the lesson now (`turnsSinceNote` = tutor turns delivered
 *  after the one the note was planted on). */
export function fixedScriptCloseForced(turnsSinceNote: number, lessonClosed: boolean): boolean {
  return !lessonClosed && turnsSinceNote >= FIXED_SCRIPT_CLOSE_GRACE_TURNS;
}

function segmentDueReason(input: AutoAdvanceInput): 'turns' | 'time' | null {
  const { plan, segmentId, turns, overlongTurns, elapsedMs } = input;
  if (!plan || !segmentId) return null;
  const seg = plan.segments.find((s) => s.id === segmentId);
  if (!seg) return null;
  // An authored turn budget replaces both the +2 margin and the time rule.
  const maxTurns = segmentMaxTurns(plan, segmentId);
  if (maxTurns !== undefined) return turns >= maxTurns ? 'turns' : null;
  if (turns >= overlongTurns + FIXED_SCRIPT_AUTO_ADVANCE_EXTRA_TURNS) return 'turns';
  const mins = seg.estimatedMinutes;
  if (typeof mins !== 'number' || !Number.isFinite(mins) || mins <= 0) return null;
  const dueMs = Math.max(FIXED_SCRIPT_AUTO_ADVANCE_MIN_MS, mins * 60_000 * FIXED_SCRIPT_AUTO_ADVANCE_TIME_FACTOR);
  return elapsedMs >= dueMs ? 'time' : null;
}

/** The runtime note the client plants after it moved a fixed-script pointer
 *  itself: a FACT (the move is done), never an instruction to advance.
 *  `lead` is the first sentence (why/where the pointer moved). */
export function fixedScriptAdvancedNote(lead: string, next: string): string {
  return `[runtime note — not from the student] ${lead} If the student is mid-exchange, close it in one sentence, then teach "${next}" from its notes. Do not call advance_lesson for this move. Apply this silently; never mention this note.]`;
}
export function fixedScriptAutoAdvanceLead(from: string, next: string, kind: string): string {
  return `The "${from}" part of the lesson is over and the lesson pointer has ALREADY moved to segment "${next}" (${kind}).`;
}
/** Task 16: the brain announced the move into the next part itself (no
 *  advance_lesson) and the client moved the pointer on that announcement. */
export function fixedScriptAnnouncedAdvanceLead(from: string, next: string, kind: string): string {
  return `The "${from}" part is over — you announced the move yourself — and the lesson pointer has ALREADY moved to segment "${next}" (${kind}).`;
}
/** Task 16 §C: the announcing turn ended without a question — one silent
 *  continuation starts the new part once the audio has finished. */
export const FIXED_SCRIPT_CONTINUE_DIRECTIVE =
  '[System note: you announced the next part and then stopped without a question. The lesson pointer has moved; begin that part now from its notes — its first question or card — in one or two sentences. Do not repeat the announcement, do not recap.]';
/** GDI run 3: the client moved off the level check before the brain stored a
 *  level, so no level was ever kept. Leaving a `skipWhenLevelKnown` segment
 *  with no working level ⇒ the note asks for set_working_level first. */
export const LEVEL_CAPTURE_LEAD =
  'Before anything else this turn, call set_working_level with the level you heard in the level check. ';
/** The refusal a brain advance_lesson gets off a level check with no level. */
export const FIXED_SCRIPT_LEVEL_MISSING_REASON =
  'Set the working level first: call set_working_level({level}) with the level you heard in this check, then advance.';
export function needsLevelCaptureLead(plan: LessonPlan | null | undefined, fromId: string | null | undefined, levelKnown: boolean): boolean {
  if (levelKnown || !plan || !fromId || !isFixedScriptPlan(plan)) return false;
  return plan.segments.find((s) => s.id === fromId)?.metadata?.skipWhenLevelKnown === true;
}
export function fixedScriptLevelAdvanceLead(next: string, kind: string): string {
  return `The level check is complete and the lesson pointer has ALREADY moved to segment "${next}" (${kind}).`;
}

/** Plant `note` (about segment `next`) as the pending runtime note. A pending
 *  note about the segment just LEFT (`from`) is dropped — the delivery-time
 *  stale check would drop it anyway, and it would tell the brain to call
 *  advance_lesson for a move already made. Any other pending note survives,
 *  with the new one appended after it. */
export function mergePendingRuntimeNote(
  pending: { note: string | null; segId: string | null },
  from: string,
  next: string,
  note: string,
): { note: string; segId: string } {
  if (pending.note && pending.segId !== from) return { note: `${pending.note}\n\n${note}`, segId: next };
  return { note, segId: next };
}

/** §3: set_working_level just applied the level while the cursor sits on a
 *  fixed-script level-check segment ⇒ the segment to move to now (null ⇒
 *  stay: not fixed-script, not a level-check segment, or nothing after it). */
export function levelSetAdvanceTarget(plan: LessonPlan | null | undefined, segmentId: string | null | undefined): string | null {
  if (!plan || !segmentId || !isFixedScriptPlan(plan)) return null;
  const seg = plan.segments.find((s) => s.id === segmentId);
  if (seg?.metadata?.skipWhenLevelKnown !== true) return null;
  return nextSegmentId(plan, segmentId, true);
}

/** A due auto-advance waits while a pronunciation clip is armed (advancing
 *  would disarm it and the learner's repeat would never be measured), but at
 *  most this many consecutive turns — a brain that re-arms every turn (a
 *  drill) must not pin the segment forever. */
export const FIXED_SCRIPT_AUTO_ADVANCE_MAX_HELD_TURNS = 3;
/** True ⇒ hold this turn. `heldTurns` = consecutive turns already held. */
export function holdAutoAdvanceForPronunciation(armed: boolean, heldTurns: number): boolean {
  return armed && heldTurns < FIXED_SCRIPT_AUTO_ADVANCE_MAX_HELD_TURNS;
}

/** GDI trial run 2 (2026-10-29): the opening turn called
 *  advance_lesson({to:"next"}) before the scripted overview was ever said, so
 *  the overview segment was skipped. The phrases of `seg.requiredPhrases` that
 *  appear in none of `narration` (case-insensitive substring — the same rule
 *  as the end-of-turn required-phrase check). No required phrases ⇒ []. */
export function missingRequiredPhrases(seg: { requiredPhrases?: string[] } | undefined, narration: readonly string[]): string[] {
  const required = Array.isArray(seg?.requiredPhrases) ? seg.requiredPhrases.filter((p) => typeof p === 'string' && p.trim()) : [];
  if (!required.length) return [];
  const haystack = narration.join(' ').toLowerCase();
  return required.filter((p) => !haystack.includes(p.toLowerCase()));
}

/** The refusal the brain gets for an advance off a script it has not said. */
export function scriptMissingAdvanceReason(missing: readonly string[]): string {
  return `This part's script has not been said yet — it must include: ${missing.map((p) => `"${p}"`).join(', ')}. Say it in this turn; the lesson can move on in a later turn.`;
}

/** Task 18 §B (GDI run 6): the level check's first brain turn said
 *  "Question 1: Can you tell me a little about your job?" with no tool call —
 *  the authored card never went up. On a fixed-script plan the CLIENT puts the
 *  part's authored card up after the FIRST substantive turn in the part when
 *  nothing put it there. True only when all hold: fixed-script plan; not the
 *  opening turn; the turn counter belongs to this segment and reads 1; the
 *  segment has an authored card (`hasAuthoredCard` — a question / problem;
 *  overview, concept, conversation-with-no-question and summary parts have
 *  none); no problem card rendered this turn; the card is not on the board
 *  already; the segment is not completed. */
export function segmentNeedsAutoCard(input: {
  fixedScript: boolean;
  openingTurn: boolean;
  /** turnsInSegment's segId === the current segment */
  counterForSegment: boolean;
  turnsInSegment: number;
  hasAuthoredCard: boolean;
  renderedProblemThisTurn: boolean;
  alreadyOnBoard: boolean;
  completed?: boolean;
}): boolean {
  return input.fixedScript
    && !input.openingTurn
    && input.counterForSegment
    && input.turnsInSegment === 1
    && input.hasAuthoredCard
    && !input.renderedProblemThisTurn
    && !input.alreadyOnBoard
    && !input.completed;
}

/** Tool calls that put a problem / question card up (fix round 2, m3: the
 *  generate_problem / show_quiz renders count too). */
export const PROBLEM_CARD_TOOLS: ReadonlySet<string> = new Set(['show_problem', 'show_segment_card', 'show_try_yourself', 'generate_problem', 'show_quiz']);

const normStatement = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/** True when a showProblem card with this statement (case, punctuation and
 *  spacing ignored) is anywhere in the session's command log and not wiped by
 *  a later clear of its page. */
export function problemStatementOnBoard(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  statement: string,
): boolean {
  const target = normStatement(statement ?? '');
  if (!target) return false;
  let onPage = false;
  let earlier = false;
  for (const c of commands) {
    if (c.action === 'newPage') { earlier = earlier || onPage; onPage = false; continue; }
    if (c.action === 'clear') { onPage = false; continue; }
    if (c.action !== 'showProblem') continue;
    const p = c.problem as { statement?: unknown } | undefined;
    if (p && typeof p.statement === 'string' && normStatement(p.statement) === target) onPage = true;
  }
  return earlier || onPage;
}
