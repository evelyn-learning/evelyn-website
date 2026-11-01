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
import type { LessonPlan, Segment, SegmentTransition } from './types';

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
// Task 22 §I (GDI run 10, 1238–1321 s): the student's last answer was wrong
// and the brain spent both grace turns probing it ("Which of the two
// sentences…?") — the note now says what to do with an open wrong answer.
export const FIXED_SCRIPT_CLOSE_NOTE =
  "[runtime note — not from the student] The lesson is complete. If the student's last answer was wrong or incomplete, give the correct answer in one sentence (no question). Then give the closing summary in two or three sentences and call close_session_notes in this turn; do not ask another question. Apply this silently; never mention this note.]";
/** Tutor turns after the close note without close_session_notes before the
 *  client closes the lesson itself. */
export const FIXED_SCRIPT_CLOSE_GRACE_TURNS = 2;
/** Task 26 §B2 (GDI run 13, 1338–1435 s): a recap part's check question
 *  needs the student's answer and the tutor's reply before the close — three
 *  tutor turns there. */
export const FIXED_SCRIPT_CLOSE_RECAP_GRACE_TURNS = 3;
/** True ⇒ close the lesson now (`turnsSinceNote` = tutor turns delivered
 *  after the one the note was planted on; `kind` = the closing segment's
 *  kind — 'recap' waits FIXED_SCRIPT_CLOSE_RECAP_GRACE_TURNS). */
export function fixedScriptCloseForced(turnsSinceNote: number, lessonClosed: boolean, kind = ''): boolean {
  const grace = kind.toLowerCase() === 'recap' ? FIXED_SCRIPT_CLOSE_RECAP_GRACE_TURNS : FIXED_SCRIPT_CLOSE_GRACE_TURNS;
  return !lessonClosed && turnsSinceNote >= grace;
}
/** Task 26 §B1 (GDI run 13, 1435 s: the fixed goodbye right after the
 *  tutor's own question): when the forced close is due on a turn that asked
 *  the student something, ONE wrap turn runs first — carried by the
 *  student's next turn as an urgent note, or dispatched with this text as a
 *  synthetic turn after the silence window. */
export const FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE =
  "[Wrap now — not from the student] Reply to the student's last answer in one sentence, then say goodbye in one sentence and call close_session_notes. No new question.";
/** Quiet (no tutor speech, no brain turn, no student activity) before the
 *  wrap turn is dispatched without a student answer — shorter than the
 *  language idle nudge's first window (30 s), so the wrap goes first. */
export const FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS = 20_000;
/** The bound: from arming, the wrap turn waits at most this long for a quiet
 *  moment (tutor-speech state left stale counts as quiet past it). */
export const FIXED_SCRIPT_CLOSE_WRAP_MAX_MS = 45_000;

/** Task 20 §B (GDI run 8, 1543 s): in the pronunciation part the brain said
 *  「今日はここまでです」… Goodbye! and called close_session_notes — the
 *  summary part ("never end the lesson before it") never ran. On a fixed
 *  script the brain may close only from the last non-extension segment (or a
 *  recap); a student who asked to stop may always close. Any other plan, or an
 *  unknown segment ⇒ true (never refuse a close it cannot place). */
export function fixedScriptCloseAllowed(
  plan: LessonPlan | null | undefined,
  segmentId: string | null | undefined,
  opts: { studentEndSignal?: boolean } = {},
): boolean {
  if (!plan || !isFixedScriptPlan(plan) || !segmentId || opts.studentEndSignal) return true;
  const seg = plan.segments.find((s) => s.id === segmentId);
  if (!seg) return true;
  if ((seg.kind ?? '').toLowerCase() === 'recap') return true;
  return segmentId === fixedScriptLastSegmentId(plan);
}

/** The plan's last non-extension segment id (the one a close belongs to). */
export function fixedScriptLastSegmentId(plan: LessonPlan): string | null {
  const real = plan.segments.filter((s) => (s.kind ?? '').toLowerCase() !== 'extension');
  return real.length ? real[real.length - 1]!.id : null;
}

/** Planted for the next turn when a premature close_session_notes is refused. */
export const FIXED_SCRIPT_CLOSE_REFUSED_NOTE =
  '[runtime note — not from the student] The lesson is not over: the summary part has not been taught yet. Do not say goodbye or call close_session_notes; finish the current item in one sentence, then move on to the summary. Apply this silently; never mention this note.';

/** Validator rejection reason for an attempt that says goodbye too early. */
export const PREMATURE_FAREWELL_REASON =
  'The lesson is not over — the summary part has not been taught yet. Do not say goodbye, thank the student for the lesson or say 今日はここまで; continue the current part, or move on to the summary in one sentence.';

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
  return `[runtime note — not from the student] ${lead} Reply to the student's last answer in ONE sentence with no follow-up question about it, then teach "${next}" from its notes. Do not call advance_lesson for this move. Apply this silently; never mention this note.]`;
}
/** Task 22 §D2 (GDI run 10, 1138 s): the student asked "Can you give me some
 *  other sentence?" as the part's budget ran out; the advance turn ignored the
 *  request. Budget advances only — an announced move was the brain's own. */
export const FIXED_SCRIPT_MORE_OF_PART_LEAD =
  "If the student's last words asked for more of the part that just ended, say in one short sentence that the time for that part is up, then continue.";
export function fixedScriptAutoAdvanceLead(from: string, next: string, kind: string): string {
  return `The "${from}" part of the lesson is over and the lesson pointer has ALREADY moved to segment "${next}" (${kind}). ${FIXED_SCRIPT_MORE_OF_PART_LEAD}`;
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
/** Task 23 fix round 2 (m5): the level-set advance's silent continuation —
 *  the brain announced nothing there, so the new part opens with a bridge. */
export const FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE =
  '[System note: the level check is complete and the lesson pointer has moved to the next part; begin that part now from its notes — a one-sentence bridge, then its first question or card. Do not recap the level check.]';
/** Task 24 §B2 (GDI run 12, 352 s: "Let me put the correct sentence on the
 *  board and move on." — then 30 s of silence): the silent continuation after
 *  a fixed-script turn that left the learner nothing to answer. */
export const FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE =
  '[System note: your last turn ended without a question or an instruction for the student. Continue now with the next question or item of the current part, in one or two sentences. Do not repeat what you just said; do not recap.]';
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

/** Task 26 §A (GDI run 13, 475 s): the budget advance between the two
 *  grammar parts was one sentence ("We're moving on to the next part, the
 *  past simple.") and the information parts closed with nothing learned. A
 *  fixed-script segment may carry `metadata.transition`:
 *  `{ kind: "offer" }` (a practice part: at its budget the student is offered
 *  ONE more practice sentence or the move on) or `{ kind: "bridge" }` (an
 *  information part: the advance note asks for one sentence of what the part
 *  learned). Absent / unknown / not a fixed script ⇒ null (today's advance). */
export type FixedScriptTransitionKind = SegmentTransition['kind'];
export function segmentTransitionKind(plan: LessonPlan | null | undefined, segmentId: string | null | undefined): FixedScriptTransitionKind | null {
  if (!plan || !segmentId || !isFixedScriptPlan(plan)) return null;
  const t = plan.segments.find((s) => s.id === segmentId)?.metadata?.transition;
  const kind = t && typeof t === 'object' ? (t as { kind?: unknown }).kind : undefined;
  return kind === 'offer' || kind === 'bridge' ? kind : null;
}
/** The part's name as the plan authors it (`metadata.label`), else its
 *  title, else its id — the labels the transition notes quote. */
export function fixedScriptPartLabel(plan: LessonPlan | null | undefined, segmentId: string): string {
  const seg = plan?.segments.find((s) => s.id === segmentId);
  const label = seg?.metadata?.label;
  if (typeof label === 'string' && label.trim()) return label.trim();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const title = (seg as any)?.title;
  return typeof title === 'string' && title.trim() ? title.trim() : segmentId;
}
/** Turns a due advance waits after the offer note was planted: the offer
 *  turn + one practice turn. */
export const FIXED_SCRIPT_AUTO_ADVANCE_MAX_OFFER_HELD_TURNS = 2;
/** True ⇒ hold this turn. `heldTurns` = turns already held after the offer. */
export function holdAutoAdvanceForOffer(offerMade: boolean, heldTurns: number): boolean {
  return offerMade && heldTurns < FIXED_SCRIPT_AUTO_ADVANCE_MAX_OFFER_HELD_TURNS;
}
/** What a DUE fixed-script advance does now. 'offer' ⇒ plant the offer note
 *  instead of advancing (an offer part, no offer made yet); 'hold-offer' ⇒
 *  the offer was made and its two turns are not spent; 'advance' ⇒ the
 *  ordinary advance path (its own pronunciation / ask holds included). An
 *  announced move (the brain's own) is never offered or held. One offer per
 *  segment (`offerMade`). */
export function fixedScriptTransitionDecision(input: {
  plan: LessonPlan | null | undefined;
  segmentId: string | null | undefined;
  reason: 'turns' | 'time' | 'announced';
  offerMade: boolean;
  offerHeldTurns: number;
}): 'offer' | 'hold-offer' | 'advance' {
  if (input.reason === 'announced') return 'advance';
  if (segmentTransitionKind(input.plan, input.segmentId) !== 'offer') return 'advance';
  if (!input.offerMade) return 'offer';
  return holdAutoAdvanceForOffer(true, input.offerHeldTurns) ? 'hold-offer' : 'advance';
}
/** The FACT note planted (urgent) instead of the advance on an offer part. */
export function fixedScriptOfferNote(plan: LessonPlan | null | undefined, from: string, next: string): string {
  return `[runtime note — not from the student] This part ("${fixedScriptPartLabel(plan, from)}") is complete. Close it in one sentence, then ask the student whether they want ONE more practice sentence on it or to move on to "${fixedScriptPartLabel(plan, next)}". If they want one more, give exactly one and then move on; if they want to move on, or do not answer the question, move on now (call advance_lesson). Apply this silently; never mention this note.]`;
}
/** The extra clause of the advance lead when the part just left is a bridge
 *  part (leading space); '' otherwise. */
export function fixedScriptBridgeClause(plan: LessonPlan | null | undefined, from: string, next: string): string {
  if (segmentTransitionKind(plan, from) !== 'bridge') return '';
  return ` Before the new part's first question, say in one sentence what you learned about the student in "${fixedScriptPartLabel(plan, from)}" (their level / their job / their answers — whatever that part gathered), then start "${fixedScriptPartLabel(plan, next)}".`;
}

/** Task 22 §A (GDI run 10, 574 s / 882 s): a due auto-advance on a turn that
 *  ENDS with a question to the student flipped the page at turn end — the
 *  answer and its card landed on the NEXT part's page. Held like the
 *  pronunciation hold, but for one turn only (the answer is the very next
 *  student turn). The 'announced' reason is never held (the caller skips it:
 *  an announced move already skips questions — Task 19 §B). */
export const FIXED_SCRIPT_AUTO_ADVANCE_MAX_ASK_HELD_TURNS = 1;
/** True ⇒ hold this turn. `heldTurns` = consecutive turns already held for an ask. */
export function holdAutoAdvanceForPendingAsk(endsWithAsk: boolean, heldTurns: number): boolean {
  return endsWithAsk && heldTurns < FIXED_SCRIPT_AUTO_ADVANCE_MAX_ASK_HELD_TURNS;
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

/** Task 23 §B1: the id of the latest showProblem card with this statement
 *  (problemStatementOnBoard's comparison), not wiped by a later clear of its
 *  page — the card a repeated single-line show_problem points back at. */
export function problemCardIdOnBoard(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  statement: string,
): string | null {
  const target = normStatement(statement ?? '');
  if (!target) return null;
  let pageIds: string[] = [];
  let found: string | null = null;
  for (const c of commands) {
    if (c.action === 'newPage') { pageIds = []; continue; }
    if (c.action === 'clear') { if (found && pageIds.includes(found)) found = null; pageIds = []; continue; }
    if (c.action !== 'showProblem') continue;
    const p = c.problem as { statement?: unknown } | undefined;
    if (p && typeof p.statement === 'string' && normStatement(p.statement) === target && typeof c.id === 'string') {
      found = c.id;
      pageIds.push(c.id);
    }
  }
  return found;
}
