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
import { withSilentClause, withRetryStyle } from '../voice/output-budget';
import { isCorrectionTurn, expectedRepeatFor } from '../voice/correct-retry';
import { boardOffersChoices } from '../voice/sentence-board';
import { sentenceAsksStudent, splitSentences, stripMarkdownEmphasis } from '../question-gist-text';

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
/** Task 31 §G (GDI run 18, 1463 s: the summary's "explain the difference"
 *  question re-asked after it was answered at 1358 s): the close note names
 *  the part's questions already asked AND answered (newest last, ≤ 3). */
export function fixedScriptCloseNote(answeredInPart: readonly string[] | null | undefined): string {
  const qs = [...new Set((answeredInPart ?? []).map((q) => q.trim()).filter(Boolean))].slice(-3);
  if (!qs.length) return FIXED_SCRIPT_CLOSE_NOTE;
  const clause = ` Already covered in this part — asked and answered, do not ask again: ${qs.map((q) => `"${q.replace(/"/g, "'")}"`).join('; ')}.`;
  return FIXED_SCRIPT_CLOSE_NOTE.replace(' Apply this silently; never mention this note.]', `${clause} Apply this silently; never mention this note.]`);
}
/** Tutor turns after the close note without close_session_notes before the
 *  client closes the lesson itself. */
export const FIXED_SCRIPT_CLOSE_GRACE_TURNS = 2;
/** Task 26 §B2 (GDI run 13, 1338–1435 s): a recap part's check question
 *  needs the student's answer and the tutor's reply before the close — three
 *  tutor turns there. */
// Task 31 §G (GDI run 18, 1383–1464 s: three more questions after the close
// note): ONE turn after the note may ask; the second must close — 3 → 2.
export const FIXED_SCRIPT_CLOSE_RECAP_GRACE_TURNS = 2;
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
export const FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE = withSilentClause(
  "[Wrap now — not from the student] Reply to the student's last answer in one sentence, then say goodbye in one sentence and call close_session_notes. No new question.");
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
export const PREMATURE_FAREWELL_REASON = withSilentClause(
  'The lesson is not over — the summary part has not been taught yet. Do not say goodbye, thank the student for the lesson or say 今日はここまで; continue the current part, or move on to the summary in one sentence.');

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
export const FIXED_SCRIPT_CONTINUE_DIRECTIVE = withSilentClause(
  '[System note: you announced the next part and then stopped without a question. The lesson pointer has moved; begin that part now from its notes — its first question or card — in one or two sentences. Do not repeat the announcement, do not recap.]');
/** Task 23 fix round 2 (m5): the level-set advance's silent continuation —
 *  the brain announced nothing there, so the new part opens with a bridge. */
export const FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE = withSilentClause(
  '[System note: the level check is complete and the lesson pointer has moved to the next part; begin that part now from its notes — a one-sentence bridge, then its first question or card. Do not recap the level check.]');
/** Task 24 §B2 (GDI run 12, 352 s: "Let me put the correct sentence on the
 *  board and move on." — then 30 s of silence): the silent continuation after
 *  a fixed-script turn that left the learner nothing to answer. */
export const FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE = withSilentClause(
  '[System note: your last turn ended without a question or an instruction for the student. The student has said nothing since your last turn: do not evaluate, praise or confirm anything. Continue now with the next step of the current part — its next question or item — in one or two sentences. Do not repeat what you just said; do not recap.]');
/** Task 27 §D3 (GDI run 14, 840–886 s): the no-ask continuation after a
 *  CORRECTION turn ("Let's fix one word: … so it's "…"") was told "continue
 *  with the next item" and SPOKE a narration of its own situation ("the last
 *  thing I said was a correction, so …"). After a correction the next item
 *  IS the repeat — asked in one sentence, no narration. */
export const FIXED_SCRIPT_NOASK_CORRECTION_DIRECTIVE = withSilentClause(
  '[System note: The student has not spoken since your correction. Ask the student, in one short sentence, to say the corrected sentence once. Do not praise or evaluate anything. Nothing else.]');
/** Task 27 §I (Task 26 concern 2): the level continuation leaving a
 *  transition.kind=bridge part — the bridge wins over "do not recap". */
export const FIXED_SCRIPT_LEVEL_BRIDGE_PREFIX =
  '[System note: the level check is complete and the lesson pointer has moved to the next part; begin that part now from its notes —';
export function fixedScriptLevelBridgeDirective(plan: LessonPlan | null | undefined, from: string, next: string): string {
  return withSilentClause(`${FIXED_SCRIPT_LEVEL_BRIDGE_PREFIX} say one sentence on what you learned about the student in "${fixedScriptPartLabel(plan, from)}", then start "${fixedScriptPartLabel(plan, next)}" with its first question or card.]`);
}
export type FixedScriptContinueVia = 'announced' | 'level' | 'noask' | 'offer';
/** The silent continuation's directive (Task 16 §C / Task 23 §C / Task 24
 *  §B2), chosen by why it runs: `kind` names the variant for the event.
 *  level + a bridge part left (`from`) ⇒ the bridge wording; noask after a
 *  correction turn (`prevTutorText`) ⇒ the repeat ask; otherwise the
 *  constants as before. */
export function fixedScriptContinueDirective(input: {
  via: FixedScriptContinueVia;
  prevTutorText?: string | null;
  plan?: LessonPlan | null;
  from?: string | null;
  next?: string | null;
}): { directive: string; kind: 'announced' | 'level' | 'bridge' | 'noask' | 'correction' | 'offer' } {
  if (input.via === 'offer' && input.from && input.next) {
    return { directive: fixedScriptOfferContinueDirective(input.plan, input.from, input.next), kind: 'offer' };
  }
  if (input.via === 'level') {
    if (input.from && input.next && segmentTransitionKind(input.plan, input.from) === 'bridge') {
      return { directive: fixedScriptLevelBridgeDirective(input.plan, input.from, input.next), kind: 'bridge' };
    }
    return { directive: FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE, kind: 'level' };
  }
  if (input.via === 'noask') {
    if (isCorrectionTurn(input.prevTutorText ?? '')) return { directive: FIXED_SCRIPT_NOASK_CORRECTION_DIRECTIVE, kind: 'correction' };
    return { directive: FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE, kind: 'noask' };
  }
  return { directive: FIXED_SCRIPT_CONTINUE_DIRECTIVE, kind: 'announced' };
}
/** A dispatch that is one of the continuation directives (the scheduled
 *  continuation does not cancel itself). */
export function isFixedScriptContinueDirective(transcript: string | null | undefined): boolean {
  const t = transcript ?? '';
  return t === FIXED_SCRIPT_CONTINUE_DIRECTIVE || t === FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE || t === FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE
    || t === FIXED_SCRIPT_NOASK_CORRECTION_DIRECTIVE || t.startsWith(FIXED_SCRIPT_LEVEL_BRIDGE_PREFIX)
    || t.startsWith(FIXED_SCRIPT_OFFER_CONTINUE_PREFIX);
}
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
/** Task 26 fix round 1 (I-1): the plant turn counts as the first held turn,
 *  so the re-check advances at the end of the SECOND tutor turn after the
 *  plant (the offer turn + one practice turn), not the third. */
export const FIXED_SCRIPT_OFFER_HELD_AT_PLANT = 1;
/** Task 26 fix round 1 (I-2a): the segment-overlong note ("call
 *  advance_lesson …") lands one turn before the budget and would skip the
 *  offer — on an offer part that has not made its offer, the offer note
 *  takes its place. */
export function overlongNoteYieldsToOffer(plan: LessonPlan | null | undefined, segmentId: string | null | undefined, offerMade: boolean): boolean {
  return !offerMade && segmentTransitionKind(plan, segmentId) === 'offer';
}
/** True ⇒ hold this turn. `heldTurns` = turns already held after the offer
 *  (FIXED_SCRIPT_OFFER_HELD_AT_PLANT at the plant). */
export function holdAutoAdvanceForOffer(offerMade: boolean, heldTurns: number): boolean {
  return offerMade && heldTurns < FIXED_SCRIPT_AUTO_ADVANCE_MAX_OFFER_HELD_TURNS;
}
/** What a DUE fixed-script advance does now. 'offer' ⇒ plant the offer note
 *  instead of advancing (an offer part, no offer made yet); 'await-offer' ⇒
 *  the note is planted but no brain turn has SPOKEN the offer yet (Task 29
 *  §A2: the hold starts at the spoken offer, not at the plant); 'hold-offer'
 *  ⇒ the offer was spoken and its two turns are not spent; 'advance' ⇒ the
 *  ordinary advance path (its own pronunciation / ask holds included). An
 *  announced move (the brain's own) is never offered or held. One offer per
 *  segment (`offerMade`). `offerSpoken` absent ⇒ treated as spoken (the
 *  pre-Task-29 behaviour). Task 29 §A4: the student declined the spoken
 *  offer ("no", "that's enough", "skip", a move-on order) ⇒ 'advance' now. */
export function fixedScriptTransitionDecision(input: {
  plan: LessonPlan | null | undefined;
  segmentId: string | null | undefined;
  reason: 'turns' | 'time' | 'announced';
  offerMade: boolean;
  offerHeldTurns: number;
  offerSpoken?: boolean;
  offerDeclined?: boolean;
  /** Task 30 §A2: false ⇒ a runtime-triggered turn (nudge, nag,
   *  continuation, note-only — no student speech): a spent hold never
   *  advances on it. Absent ⇒ a student turn (the pre-Task-30 behaviour). */
  studentTurn?: boolean;
  /** Task 30 §A2: when the offer was spoken (ms) and now — the wait cap. */
  offerSpokenAtMs?: number | null;
  nowMs?: number;
  /** Task 30 §B1: student turns ended since the student ACCEPTED the offer
   *  (0 = the accepting turn itself); null / absent ⇒ not accepted. Below
   *  FIXED_SCRIPT_OFFER_ACCEPTED_HOLD_TURNS ⇒ 'hold-offer' (the new item is
   *  asked, answered and corrected first). */
  offerAcceptedStudentTurns?: number | null;
}): 'offer' | 'await-offer' | 'hold-offer' | 'advance' {
  if (input.reason === 'announced') return 'advance';
  if (segmentTransitionKind(input.plan, input.segmentId) !== 'offer') return 'advance';
  if (!input.offerMade) return 'offer';
  if (input.offerSpoken === false) return 'await-offer';
  if (input.offerDeclined) return 'advance';
  if (offerWaitExpired(input.offerSpokenAtMs, input.nowMs)) return 'advance';
  if (typeof input.offerAcceptedStudentTurns === 'number' && input.offerAcceptedStudentTurns < FIXED_SCRIPT_OFFER_ACCEPTED_HOLD_TURNS) return 'hold-offer';
  if (holdAutoAdvanceForOffer(true, input.offerHeldTurns)) return 'hold-offer';
  return input.studentTurn === false ? 'hold-offer' : 'advance';
}
/** Task 30 §A2 (GDI run 17, 433–499 s: the offer's two hold turns were an
 *  idle nudge and a noise nag — the student's answer came after the part had
 *  advanced): the hold runs on student turns only, and this cap keeps a
 *  silent student from parking the lesson on the offer. */
export const FIXED_SCRIPT_OFFER_MAX_WAIT_MS = 150_000;
export function offerWaitExpired(offerSpokenAtMs: number | null | undefined, nowMs: number | null | undefined): boolean {
  return typeof offerSpokenAtMs === 'number' && typeof nowMs === 'number' && nowMs - offerSpokenAtMs >= FIXED_SCRIPT_OFFER_MAX_WAIT_MS;
}

/** Task 29 §A1 (GDI run 16, 441–486 s / 672–734 s): the offer note was
 *  planted and the next turn never offered — the part ran out its hold and
 *  advanced with the student never asked. True when some sentence of `text`
 *  asks the student (sentenceAsksStudent) AND names MORE (one more / another
 *  / more practice / again / once more / もう一…) AND a MOVE (move on / go on
 *  / continue / next / 次 / 進). Pure, generic. */
const OFFER_MORE_RE = /\b(?:one more|another|more practice|again|once more)\b|もう(?:一|ひと)/i;
// Task 31 §B (GDI run 18, 438 / 469 s): the offer spans two sentences — the
// splitter breaks at an ellipsis / closing quote ("…using "I have used…" Or
// should we move on …?"), and "one tool" names the item.
// Fix round 1 (B-1: "Let's try it again. What happened next?" read as the
// offer, so the offer was never asked): the ASKING sentence must hold the
// alternative — an "or" / それとも and a STRICT move clause (move on / go on
// to / continue to / the next part …, never a bare "next" or "continue the
// story") — and the MORE side must be an item of the part: one more /
// another + practice / question / sentence / item / example …, "more
// practice", "one more?", もう一つ / 一回 / 一度 — in the asking sentence or
// the one before it; or the "one <noun>" item shape inside the asking
// sentence itself (turn 36).
const OFFER_MORE_ITEM_RE = /\b(?:one more|another)\s+(?:[a-z]+\s+)?(?:practice|question|sentence|item|example|exercise|word|phrase|one|try|round)\b|\bmore practice\b|\bone more\s*[?？,]|もう(?:一|ひと)(?:つ|回|度)/i;
const OFFER_STRICT_MOVE_RE = /\b(?:move on|moving on|go on to|carry on to|continue (?:to|with|on to)|(?:the )?next (?:part|section|topic|point|step|grammar point|lesson part))\b|\bor (?:shall we |should we |we can |to |would you (?:rather|like to) )?(?:go on|continue|carry on|stop)\b|次(?:に進|の(?:パート|部分|セクション|トピック))|進み|進む/i;
const OFFER_ONE_ITEM_RE = /\bone [a-z]+\b/i;
const OFFER_OR_RE = /\bor\b|それとも/i;
export function offerAsked(text: string | null | undefined): boolean {
  const sentences = splitSentences(stripMarkdownEmphasis(text ?? ''));
  return sentences.some((s, i) => {
    if (!sentenceAsksStudent(s) || !OFFER_STRICT_MOVE_RE.test(s) || !OFFER_OR_RE.test(s)) return false;
    if (OFFER_MORE_ITEM_RE.test(s) || OFFER_ONE_ITEM_RE.test(s)) return true;
    return i > 0 && OFFER_MORE_ITEM_RE.test(sentences[i - 1]!);
  });
}
/** Task 31 §B (belt and braces): the student's reply accepts the offer and
 *  the tutor's previous turn asked a STRICT move question (fix round 1 B-1:
 *  "What did you do next?" is none) — the acceptance proves the offer was
 *  heard, whatever its wording. The acceptance must name the item (one more
 *  / another / practice / もう一…) or be a bare yes; a student "again" ("I
 *  called the customer again.") is no acceptance here. Pure. */
const OFFER_HEARD_ACCEPT_RE = /\b(?:one more|another|more practice|practice)\b|もう(?:一|ひと)/i;
export function offerHeardFromAcceptance(studentText: string | null | undefined, lastTutorText: string | null | undefined): boolean {
  const t = (studentText ?? '').trim();
  if (!OFFER_HEARD_ACCEPT_RE.test(t) && !isBareAffirmative(t)) return false;
  if (!offerAccepted(studentText, lastTutorText)) return false;
  return splitSentences(stripMarkdownEmphasis(lastTutorText ?? '')).some((x) => /[?？]/.test(x) && OFFER_STRICT_MOVE_RE.test(x));
}
/** Task 29 §A4: the student's reply declines the spoken offer — "no",
 *  "no thanks", "that's enough", "enough", "skip", "I'm fine / good", or a
 *  move-on order ("let's move on", "next part"). A "no" that goes on to ask
 *  for more ("no, one more please") is not a decline. Pure. */
const OFFER_DECLINE_RE = /^(?:(?:uh+|um+|er|ah|oh|hmm+|ok(?:ay)?|well|so)[\s,.!]+)*(?:no(?:pe)?(?:\s*,?\s*thanks?(?: you)?)?|no need|that['’]?s (?:enough|ok(?:ay)?|fine|all)|enough|skip(?: it)?|i['’]m (?:fine|good|ok(?:ay)?)|(?:let['’]?s |let us |i(?:['’]d| would) like to |i want to |can we |please )?(?:move on|go on|continue|skip)(?: to (?:the )?(?:next(?: part| one)?|summary))?|(?:the )?next(?: part| one)?(?: please)?)(?=[\s,.!]*$|[\s,.!]+(?:please|thanks?|thank you|let['’]?s)\b)/i;
const OFFER_WANTS_MORE_RE = /\b(?:one more|another|more practice|once more|again|yes|yeah|sure)\b/i;
export function offerDeclined(studentText: string | null | undefined): boolean {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  if (OFFER_WANTS_MORE_RE.test(t)) return false;
  return OFFER_DECLINE_RE.test(t);
}
/** Task 29 §A3: the brain turn produced while the offer note is pending
 *  (planted, not spoken) that does not ask the offer is killed ONCE and
 *  retried with fixedScriptOfferMissingReason. A turn that announces the
 *  move or calls advance_lesson closed the part itself (Task 26 I-2b) and is
 *  exempt; a turn after the one retry stands ('unmade'). */
export function transitionOfferValidatorDecision(input: {
  offerPending: boolean;
  text: string | null | undefined;
  announcedMove: boolean;
  calledAdvance: boolean;
  alreadyRetried: boolean;
  /** Task 30 §D1: sentences of this attempt the student already heard. */
  heardSentences?: number;
}): 'ok' | 'spoken' | 'continue' | 'kill' | 'unmade' {
  if (!input.offerPending) return 'ok';
  if (offerAsked(input.text)) return 'spoken';
  if (input.announcedMove || input.calledAdvance) return 'ok';
  if (input.alreadyRetried) return 'unmade';
  // Task 30 §D1 (GDI run 17, 746 s): a kill after heard sentences made the
  // retry repeat them — the attempt stands and the offer is asked by a
  // silent continuation instead. Fix round 1 (I-3): only when the attempt
  // asked the student NOTHING — a continuation after a question stacks a
  // second question; there the kill + retry (with the §D2 heard note) stays.
  return (input.heardSentences ?? 0) >= 1 && !attemptAsksStudent(input.text) ? 'continue' : 'kill';
}
/** Fix round 1 (I-3): some sentence of `text` asks the student — a "?", an
 *  imperative / inner ask (sentenceAsksStudent) or a repeat ask (a line the
 *  student is expected to say). Pure. */
export function attemptAsksStudent(text: string | null | undefined): boolean {
  const t = stripMarkdownEmphasis(text ?? '');
  if (!t.trim()) return false;
  if (splitSentences(t).some((x) => /[?？]/.test(x) || sentenceAsksStudent(x))) return true;
  return expectedRepeatFor(t, null, null) !== null;
}
/** Fix round 1 (I-3, smoke run 507–543 s: the scheduled offer continuation
 *  was dropped — "tutor still busy" — when the student answered first): on
 *  a student turn while the part's offer is made but still unspoken, the
 *  urgent offer note is re-planted for that turn, unless that turn already
 *  carries it. Pure. */
export function offerReplantDue(input: { offerMade: boolean; offerSpoken: boolean; studentTurn: boolean; noteAlreadyCarried: boolean }): boolean {
  return input.offerMade && !input.offerSpoken && input.studentTurn && !input.noteAlreadyCarried;
}
/** Task 30 §D1: the offer continuation's directive (via 'offer'). */
export const FIXED_SCRIPT_OFFER_CONTINUE_PREFIX = '[System note: Ask the student, in ONE sentence and nothing else, whether they want one more practice item on';
export function fixedScriptOfferContinueDirective(plan: LessonPlan | null | undefined, from: string, next: string): string {
  return withSilentClause(`${FIXED_SCRIPT_OFFER_CONTINUE_PREFIX} "${fixedScriptPartLabel(plan, from)}" or to move on to "${fixedScriptPartLabel(plan, next)}".]`);
}
/** Task 30 §B1 (GDI run 17, 499–504 s: "Yes, one more practice." was answered
 *  with "Look at the question on the board" — the question answered at
 *  279 s): the student's reply ACCEPTS the spoken offer — a more-word (one
 *  more / another / more practice / again / once more / もう一…), "yes /
 *  yeah / sure / ok" with one, or "practice"; a move-word anywhere ("move on",
 *  "next", "skip", "continue", 次 / 進) is a decline and wins. Pure. */
const OFFER_ACCEPT_MOVE_RE = /\b(?:move on|moving on|go on|next|skip|continue|summary)\b|次|進/i;
// Fix round 5 (S-3): the bare affirmative accepts only when the tutor's
// immediately preceding turn asked the offer itself — a "Yes" after a
// different question ("Is that clear?") answers that question.
export function offerAccepted(studentText: string | null | undefined, lastTutorText?: string | null): boolean {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  if (OFFER_ACCEPT_MOVE_RE.test(t)) return false;
  return OFFER_MORE_RE.test(t) || /\bpractice\b/i.test(t) || (isBareAffirmative(t) && offerAsked(lastTutorText));
}
/** Fix round 4 (R3-5, run r3 574–605 s / 837–858 s: a bare "Yes." to the
 *  offer was re-asked twice, then taken as either answer): a bare
 *  affirmative — yes / yeah / yep / sure / ok / okay / はい / うん, ≤ 2 words
 *  ("please" may ride along), no move-word — ACCEPTS the offer (the offer
 *  asks "one more, or move on?" and "yes" answers its first half). */
const BARE_AFFIRMATIVE_WORDS = new Set(['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'はい', 'うん']);
export function isBareAffirmative(studentText: string | null | undefined): boolean {
  const words = (studentText ?? '').toLowerCase().replace(/[.,!?。、！？…]+/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 2) return false;
  return words.some((w) => BARE_AFFIRMATIVE_WORDS.has(w)) && words.every((w) => BARE_AFFIRMATIVE_WORDS.has(w) || w === 'please');
}
/** Task 30 §B1: student turns the accepted offer holds the advance for — the
 *  accepting turn (the new item is asked) and the answer (corrected). */
export const FIXED_SCRIPT_OFFER_ACCEPTED_HOLD_TURNS = 2;
/** Task 30 §B1: the urgent directive on the accepting turn. */
export function fixedScriptOfferAcceptedNote(plan: LessonPlan | null | undefined, segId: string, next: string): string {
  return withSilentClause(`[runtime note — not from the student] The student wants ONE more item on "${fixedScriptPartLabel(plan, segId)}". Ask ONE new question on this point that you have not asked in this lesson — spoken in full and written with handwrite — not the question already on the board. When they have answered and you have corrected it, close the part in one sentence and move on to "${fixedScriptPartLabel(plan, next)}" (call advance_lesson) without offering again.]`);
}
/** Task 33 §A (GDI bot run r8, 415–504 s / 1220–1281 s: "Yes." accepted the
 *  offer, the accepted note rode ONE brain call, and the offer — or a "which
 *  do you mean?" clarification of its two options — was asked six more
 *  times). True ⇒ `text` asks the offer again: offerAsked, or a sentence that
 *  asks the student WHICH (which do you mean / which would you like / just
 *  tell me which / どちら / どっち) and names a side of the offer (a more-item
 *  or a strict move). "どちらが正しいですか" (no offer side) is no re-ask. Pure. */
const OFFER_CLARIFY_RE = /\bwhich(?: one)? (?:do you mean|would you like|do you want|is it)\b|\b(?:just )?tell me which(?: one)?\b|どちら|どっち/i;
export function offerReasked(text: string | null | undefined): boolean {
  if (offerAsked(text)) return true;
  return splitSentences(stripMarkdownEmphasis(text ?? '')).some((s) =>
    (/[?？]|か[。.]?\s*$/.test(s) || sentenceAsksStudent(s)) && OFFER_CLARIFY_RE.test(s)
    && (OFFER_MORE_ITEM_RE.test(s) || OFFER_STRICT_MOVE_RE.test(s) || OFFER_MORE_RE.test(s)));
}
/** Task 33 §A3: the summary / close offer ("continue with more practice, or
 *  stop for today?") follows the bare-affirmative rule — on the LAST part
 *  (no next segment) a reply that accepts (offerAccepted: a more-word, or a
 *  bare yes) to a tutor turn that asked the offer is "one more item", never a
 *  clarification. Pure. */
export function closeOfferAccepted(studentText: string | null | undefined, lastTutorText: string | null | undefined): boolean {
  return offerAsked(lastTutorText) && offerAccepted(studentText, lastTutorText);
}
/** Task 33 §A3: the urgent note on the turn that accepted the close offer. */
export const FIXED_SCRIPT_CLOSE_OFFER_ACCEPTED_NOTE = withSilentClause(
  "[runtime note — not from the student] The student wants ONE more practice item. Do not ask the choice again and do not ask which one they mean. Ask ONE new practice question on today's lesson now — spoken in full and written with handwrite. When they have answered and you have corrected it, close the lesson without offering again.]");
/** Task 33 §A1: the accepted offer — the state the re-ask validator reads. */
export interface OfferAcceptState { segId: string; studentTurns: number; at: number; itemAsked?: boolean; close?: boolean }
/** Task 33 §A1: a tutor turn after the acceptance asked the new item (some
 *  ask that is not the offer again) — the acceptance is served. Pure. */
export function offerItemAskedIn(text: string | null | undefined): boolean {
  return attemptAsksStudent(text) && !offerReasked(text);
}
/** Task 33 §A1: the validator offer_reasked_after_accept. 'same' ⇒ the offer
 *  was accepted in the current part and the attempt asks it again (before the
 *  new item was asked); 'moved' ⇒ the lesson has just left the part where it
 *  was accepted (current = its next part, not the last part, the current
 *  part's own offer not made) and the attempt asks the old choice again.
 *  Once per turn (`alreadyRetried`). Pure. */
export function offerReaskValidatorDecision(input: {
  accepted: OfferAcceptState | null | undefined;
  currentSegId: string | null | undefined;
  /** nextSegmentId(plan, accepted.segId) */
  acceptedNextSegId: string | null | undefined;
  currentIsLast: boolean;
  currentOfferMade: boolean;
  text: string | null | undefined;
  alreadyRetried: boolean;
}): 'ok' | 'same' | 'moved' {
  const a = input.accepted;
  if (!a || a.itemAsked || input.alreadyRetried || !input.currentSegId) return 'ok';
  if (!offerReasked(input.text)) return 'ok';
  if (a.segId === input.currentSegId) return 'same';
  if (input.acceptedNextSegId === input.currentSegId && !input.currentIsLast && !input.currentOfferMade) return 'moved';
  return 'ok';
}
/** Task 33 §A1: the retry directive of offer_reasked_after_accept. */
export const OFFER_REASKED_AFTER_ACCEPT_REASON = withRetryStyle(
  'The student already chose ONE more item. Do not ask the choice again. Ask ONE new practice question on this point now (spoken in full, written with handwrite).');
export function offerReaskedMovedReason(plan: LessonPlan | null | undefined, current: string): string {
  return withRetryStyle(`The student already answered that choice and the lesson has moved on to "${fixedScriptPartLabel(plan, current)}". Do not ask the choice again. Ask this part's question now (spoken in full).`);
}
/** Task 33 §A2: the accepted note is re-planted (first position) on a
 *  student turn while the acceptance is unserved and the previous tutor turn
 *  asked the offer again — the brain lost the note. Pure. */
export function offerAcceptedReplantDue(input: { accepted: OfferAcceptState | null | undefined; currentSegId: string | null | undefined; studentTurn: boolean; lastTutorText: string | null | undefined }): boolean {
  const a = input.accepted;
  // studentTurns < 0 ⇒ this very turn accepted (its own note rides it).
  return !!a && !a.itemAsked && a.studentTurns >= 0 && a.segId === input.currentSegId && input.studentTurn && offerReasked(input.lastTutorText);
}
/** The retry directive of transition_offer_missing (shared silent clause). */
export function fixedScriptOfferMissingReason(plan: LessonPlan | null | undefined, from: string, next: string): string {
  return withRetryStyle(`Reply to what the student just said in ONE sentence (answer a question or a correction first), then ask the student whether they want one more practice item on "${fixedScriptPartLabel(plan, from)}" or to move on to "${fixedScriptPartLabel(plan, next)}". End the turn with that question.`);
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

/** Task 27 §E2 (GDI run 14, 958 s: the pronunciation part opened with "Can
 *  you read the sentence on the board aloud?" over its choice menu): the
 *  extra clause of the advance lead when the new part's card is a choice
 *  menu (≥ 2 "1)" / "A)" markers, or hasChoices) — leading space; '' otherwise. */
export const FIXED_SCRIPT_CHOICE_MENU_CLAUSE =
  " The new part's card is a choice menu. Read the choices, ask the student to pick one, and wait for their choice. Nothing else is on the board yet.";
export function fixedScriptChoiceMenuClause(card: { statement?: string; hasChoices?: boolean } | string | null | undefined): string {
  const problem = typeof card === 'string' ? { statement: card } : card;
  return boardOffersChoices(problem) ? FIXED_SCRIPT_CHOICE_MENU_CLAUSE : '';
}

/** Task 31 §D (GDI run 18, 1118 s: the brain's own advance_lesson into the
 *  pronunciation part asked "Which sentence will you say first?" — the part's
 *  choice menu was never read, and no fixed-script note was ever delivered
 *  for that part): after a brain turn that moved the pointer itself, the next
 *  brain turn — whoever triggers it (the student, a continuation, a nudge) —
 *  carries this urgent entry note. A choice-menu card the advance turn did
 *  not read (menuReadInTurn) gets the menu instruction. Pure. */
export const FIXED_SCRIPT_ENTRY_MENU_CLAUSE =
  "Its card is a choice menu the student has not heard yet: read the choices from the card, ask the student to pick one, and wait for their choice. Nothing else.";
export function fixedScriptBrainAdvanceEntryNote(plan: LessonPlan | null | undefined, to: string, cardStatement: string, advanceTurnText: string): string {
  const menu = boardOffersChoices({ statement: cardStatement }) && !menuReadInTurn(cardStatement, advanceTurnText);
  return withSilentClause(`[runtime note — not from the student] Your last turn moved the lesson to "${fixedScriptPartLabel(plan, to)}"; that part's notes apply from now on. ${menu ? FIXED_SCRIPT_ENTRY_MENU_CLAUSE : "Reply to the student's last words, then continue that part from its notes."}]`);
}
/** True ⇒ the turn named at least two of the card's numbered choices (a
 *  content word of ≥ 4 letters of each). */
export function menuReadInTurn(cardStatement: string, turnText: string): boolean {
  const options = (cardStatement ?? '').split(/\b(?:[1-9]|[A-D])\)\s*/).slice(1);
  const said = (turnText ?? '').toLowerCase();
  const named = options.filter((o) => (o.toLowerCase().match(/[a-z]{4,}/g) ?? [])
    .filter((w) => !['with', 'your', 'more', 'than', 'that', 'this', 'from', 'and', 'continue'].includes(w))
    .some((w) => new RegExp(`\\b${w}\\b`).test(said)));
  return named.length >= 2;
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

/** Task 30 fix round 4 (R3-7a, run r3 1314–1348 s: the lesson was closed in
 *  the summary before its points and question were spoken): a
 *  close_session_notes call while the current part's requiredPhrases are
 *  still missing from what the tutor said in it is refused ONCE per part (kill
 *  + retry with CLOSE_BEFORE_REQUIRED_PHRASES_REASON); the second attempt is
 *  let through. Pure. */
export const CLOSE_REFUSAL_EXEMPT_REMAINING_MS = 90_000;
export function closeBeforeRequiredPhrasesDecision(input: {
  missing: readonly string[];
  alreadyRefused: boolean;
  /** Fix round 5 (S-2): the student asked to stop / leave (the lesson-close end signal). */
  studentStopRequest?: boolean;
  /** Fix round 5 (S-2): the time-box wrap / last-minute phase is active. */
  wrapPhase?: boolean;
  /** Fix round 5 (S-2): ms left before max_duration (undefined = no cap). */
  remainingMs?: number;
}): 'refuse' | 'allow' {
  if (input.studentStopRequest || input.wrapPhase) return 'allow';
  if (typeof input.remainingMs === 'number' && input.remainingMs <= CLOSE_REFUSAL_EXEMPT_REMAINING_MS) return 'allow';
  return input.missing.length > 0 && !input.alreadyRefused ? 'refuse' : 'allow';
}
export const CLOSE_BEFORE_REQUIRED_PHRASES_REASON = withRetryStyle(
  "Give the summary's points and ask its question first; close only after the student has answered.");

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
