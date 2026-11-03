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
import { isCorrectionTurn, expectedRepeatFor, NO_ATTEMPT_MOVE_ON_NOTE } from '../voice/correct-retry';
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
// Task 40 §C (bot run r28, 1230 s: the summary turn after a non-answer was
// "Haruto, the presentation sentence again, so let's stay on the question."
// — no model answer — and the engine then forced the close). When the
// no-attempt / neither move-on note and the close note land on the same
// turn, the move-on note's "move to the next step" would fight the close:
// both are replaced by MOVE_ON_THEN_CLOSE_NOTE first (the model answer,
// then the close), with the close note right after it. Pure.
const CLOSE_NOTE_HEAD = FIXED_SCRIPT_CLOSE_NOTE.slice(0, FIXED_SCRIPT_CLOSE_NOTE.indexOf(' If the student'));
export function isFixedScriptCloseNote(note: string | null | undefined): boolean {
  return !!note && note.includes(CLOSE_NOTE_HEAD);
}
export const MOVE_ON_THEN_CLOSE_NOTE = withSilentClause(
  "[runtime note — not from the student] The student has not answered your question twice. Do not ask it again. FIRST say the model answer yourself in one sentence (put it on the board with show_sentence). THEN close the lesson as the next note says: the closing summary and close_session_notes, with no new question.]");
export function moveOnThenCloseTranscript(runTranscript: string, closeNote: string): string {
  const rest = runTranscript.replace(`${NO_ATTEMPT_MOVE_ON_NOTE}\n\n`, '').replace(NO_ATTEMPT_MOVE_ON_NOTE, '').trim();
  return `${MOVE_ON_THEN_CLOSE_NOTE}\n\n${closeNote}\n\n${rest}`;
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

/** Task 33 §E (GDI bot run r8, 578 s): a stop request mid-lesson gets the
 *  refusal path's response in every part — a recap of what was covered and
 *  the choice: finish with the parts left, or stop now. The parts left are
 *  the non-extension segments after `current` (labels, in order). */
export function fixedScriptRemainingPartLabels(plan: LessonPlan | null | undefined, current: string | null | undefined, levelKnown: boolean): string[] {
  if (!plan || !current) return [];
  const out: string[] = [];
  let id: string | null = current;
  for (let guard = 0; guard < plan.segments.length && id; guard++) {
    id = nextSegmentId(plan, id, levelKnown);
    if (!id) break;
    const seg = plan.segments.find((s) => s.id === id);
    if (seg && (seg.kind ?? '').toLowerCase() !== 'extension') out.push(fixedScriptPartLabel(plan, id));
  }
  return out;
}
export function fixedScriptStopRequestNote(remaining: readonly string[]): string {
  const parts = remaining.length ? remaining.map((r) => `"${r}"`).join(' and ') : 'the summary';
  return withSilentClause(`[runtime note — not from the student] The student asked to stop. Do not continue the current question. In ONE or two sentences say what you have covered so far, then ask whether they want to do ${parts} before we end, or stop now. Do not say goodbye and do not call close_session_notes in this turn.]`);
}
/** Task 33 §E: the student repeated the stop after the choice — close now. */
export const FIXED_SCRIPT_STOP_CONFIRMED_NOTE = withSilentClause(
  "[runtime note — not from the student] The student chose to stop. Close the lesson in THIS turn: one sentence on what they practised, one goodbye, and call close_session_notes.]");
/** Task 33 §E: a fixed-script lesson before its closing part (the brain's
 *  close would be refused there) and not closed. Pure. */
export function fixedScriptMidLesson(plan: LessonPlan | null | undefined, segmentId: string | null | undefined, lessonClosed: boolean): boolean {
  return !lessonClosed && !!plan && isFixedScriptPlan(plan) && !!segmentId && !fixedScriptCloseAllowed(plan, segmentId);
}
/** Task 33 §E: what a student turn does with a stop request. Mid-lesson
 *  (fixed script, before the last part, not closed): the first request asks
 *  the choice; a stop request right after the choice was asked closes. Pure. */
// Fix round 1 (B-1): while the choice is pending only an EXPLICIT stop
// closes; a finish-word reply ("Let's finish.") continues ('finish').
export function stopRequestDecision(input: { stopRequest: boolean; midLesson: boolean; choicePending: boolean; explicitStop?: boolean; choosesFinish?: boolean }): 'ask-choice' | 'close' | 'finish' | 'none' {
  if (!input.midLesson) return 'none';
  if (input.choicePending) {
    if (input.explicitStop) return 'close';
    return input.choosesFinish || input.stopRequest ? 'finish' : 'none';
  }
  return input.stopRequest ? 'ask-choice' : 'none';
}
/** Fix round 1 (B-1): the student chose to finish the lesson's parts. */
export const FIXED_SCRIPT_STOP_DECLINED_NOTE = withSilentClause(
  "[runtime note — not from the student] The student wants to finish the lesson's remaining parts. Do not ask the choice again and do not say goodbye: continue the lesson now — finish the current item in one sentence if one is open, then go on with the next part.]");

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
  /** Task 38 fix round 1 (R24-1): an announced move on an offer part waits
   *  for the offer (absent ⇒ the Task 26 I-2b behaviour: it advances). */
  announcedOfferFirst?: boolean;
  /** R24-1: the offer was spoken on THIS turn (the retry / engine fallback). */
  offerSpokenThisTurn?: boolean;
  /** R24-1: the student declined the offer or ordered the move on this turn. */
  studentMovedOn?: boolean;
}): 'offer' | 'await-offer' | 'hold-offer' | 'advance' {
  // Task 38 fix round 1 (R24-1, bot run r24 472–509 s: "Let's move on to the
  // past simple now." on the present-perfect offer part advanced with the
  // offer never asked): on an offer part an announced move advances only
  // after the offer was asked on an earlier turn, or when the student
  // declined / ordered the move on.
  if (input.reason === 'announced') {
    if (!input.announcedOfferFirst || segmentTransitionKind(input.plan, input.segmentId) !== 'offer') return 'advance';
    if (input.studentMovedOn || input.offerDeclined) return 'advance';
    if (input.offerSpokenThisTurn) return 'hold-offer';
    if (input.offerSpoken) return 'advance';
    return input.offerMade ? 'await-offer' : 'offer';
  }
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
// Task 33 fix round 2 (R10-1, bot run r10 299 s: 「…はここまでです。 もう一文
// 練習しますか。 それとも「過去形」に進みますか。」): the Japanese item shapes
// もう一つ / 一文 / 一問 / 一回 / 一度 (+ 練習 / やって / 言って) count.
const OFFER_MORE_ITEM_RE = /\b(?:one more|another)\s+(?:[a-z]+\s+)?(?:practice|question|sentence|item|example|exercise|word|phrase|one|try|round)\b|\bmore practice\b|\bone more\s*[?？,]|もう(?:一|ひと)(?:つ|回|度|文|問)(?:だけ)?(?:練習|やって|言って)?/i;
const OFFER_STRICT_MOVE_RE = /\b(?:move on|moving on|go on to|carry on to|continue (?:to|with|on to)|(?:the )?next (?:part|section|topic|point|step|grammar point|lesson part))\b|\bor (?:shall we |should we |we can |to |would you (?:rather|like to) )?(?:go on|continue|carry on|stop)\b|次(?:に進|の(?:パート|部分|セクション|トピック))|進み|進む/i;
const OFFER_ONE_ITEM_RE = /\bone [a-z]+\b/i;
const OFFER_OR_RE = /\bor\b|それとも/i;
// R10-1: Japanese sentences are split at 。 / ？ too (the splitter keeps a
// Japanese run whole), and a Japanese ask ending (ますか / ですか / でしょうか)
// asks; the OR may open the asking sentence (それとも / Or …) with the MORE
// in the sentence before it.
const JA_ASK_END_RE = /(?:ますか|ですか|でしょうか|ませんか)[。？?]?\s*$/;
function offerSentences(text: string | null | undefined): string[] {
  return splitSentences(stripMarkdownEmphasis(text ?? '')).flatMap((s) => s.split(/(?<=[。！？])\s*/)).map((s) => s.trim()).filter(Boolean);
}
export function offerAsked(text: string | null | undefined): boolean {
  const sentences = offerSentences(text);
  return sentences.some((s, i) => {
    if (!(sentenceAsksStudent(s) || JA_ASK_END_RE.test(s)) || !OFFER_STRICT_MOVE_RE.test(s) || !OFFER_OR_RE.test(s)) return false;
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
  /** Task 38 fix round 1 (R24-1): an announced move is no exemption … */
  announcedOfferFirst?: boolean;
  /** … unless the student declined the offer / ordered the move on. */
  studentMovedOn?: boolean;
}): 'ok' | 'spoken' | 'continue' | 'kill' | 'unmade' {
  if (!input.offerPending) return 'ok';
  if (offerAsked(input.text)) return 'spoken';
  if (input.calledAdvance) return 'ok';
  if (input.announcedMove && (!input.announcedOfferFirst || input.studentMovedOn)) return 'ok';
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
/** Task 33 fix round 1 (R9-2, bot run r9 847–850 s: the transition_offer_
 *  missing retry narrated instead of offering — fixed_script_offer_unmade —
 *  and the part fell to the turn cap): when the one retry is still
 *  offer-less, the ENGINE speaks the offer itself as the turn's last
 *  sentence(s), composed from the offer note's labels; a Japanese line
 *  follows when the session's tutor languages include Japanese. Pure. */
export function fixedScriptEngineOfferLines(plan: LessonPlan | null | undefined, from: string, next: string, opts: { japanese: boolean }): string[] {
  const a = fixedScriptPartLabel(plan, from);
  const b = fixedScriptPartLabel(plan, next);
  const lines = [`Would you like one more practice item on "${a}", or shall we move on to "${b}"?`];
  if (opts.japanese) lines.push(`「${a}」をもう一つ練習しますか？それとも「${b}」に進みますか？`);
  return lines;
}
/** Fix round 2 (R10-1, bot run r10 322–327 s: the engine asked the offer
 *  right after the student had said "One more practice."): before the
 *  engine speaks the offer, a student turn that already accepts or declines
 *  it is the answer — the offer is recorded spoken AND answered instead. */
export function engineOfferFallbackAction(studentText: string | null | undefined, lastTutorText: string | null | undefined): 'accepted' | 'declined' | 'speak' {
  if (offerDeclined(studentText)) return 'declined';
  if (offerAccepted(studentText, lastTutorText)) return 'accepted';
  return 'speak';
}
/** R9-2: the validator's 'unmade' ⇒ the engine speaks the offer (flag on). */
export function offerEngineFallbackDue(decision: string, flagOn: boolean): boolean {
  return flagOn && decision === 'unmade';
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
  // Task 38 §G3: a recap the advancing turn already spoke is not given twice.
  const recapGiven = !menu && recapAlreadyGiven(plan?.segments.find((sg) => sg.id === to), advanceTurnText);
  return withSilentClause(`[runtime note — not from the student] Your last turn moved the lesson to "${fixedScriptPartLabel(plan, to)}"; that part's notes apply from now on. ${menu ? FIXED_SCRIPT_ENTRY_MENU_CLAUSE : recapGiven ? FIXED_SCRIPT_RECAP_GIVEN_CLAUSE : "Reply to the student's last words, then continue that part from its notes."}]`);
}
/** Task 38 §G3 (voice run 19, 1222 / 1296 s: the advancing turn spoke the
 *  recap, then the summary's next turn spoke it again): a recap part whose
 *  every mustRemember point (its head — the text before "(" / ":" / "—")
 *  was named in the given text has had its recap. Pure. */
export const FIXED_SCRIPT_RECAP_GIVEN_CLAUSE =
  "The recap was already given in that turn — do not repeat it. Reply to the student's last words, then go on to the part's next step (its feedback and check question).";
export function recapAlreadyGiven(seg: Segment | null | undefined, text: string | null | undefined): boolean {
  if (!seg || seg.kind !== 'recap') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (seg as any).mustRemember as unknown;
  if (!Array.isArray(items) || items.length === 0) return false;
  const t = (text ?? '').toLowerCase();
  if (!t.trim()) return false;
  // Fix round 1 (I-5): the recap SHAPE — each point named WITH its meaning:
  // after a mention of the head, in the same sentence (≤ 120 chars), at
  // least two of the point's meaning words (its text after ":" up to the
  // "—" example; 4-letter stems). Naming the points is not a recap.
  return items.every((it) => {
    const item = String(it ?? '');
    const head = item.split(/[(:—–]/)[0]!.trim().toLowerCase();
    if (head.length < 3) return false;
    const colon = item.indexOf(':');
    const meaning = (colon >= 0 ? item.slice(colon + 1) : item.slice(head.length)).split(/[—–]/)[0]!.toLowerCase();
    const stems = [...new Set((meaning.match(/\p{L}{4,}/gu) ?? []).filter((w) => !RECAP_MEANING_STOP.has(w)).map((w) => w.slice(0, 4)))];
    if (stems.length < 2) return t.includes(head);
    for (let at = t.indexOf(head); at >= 0; at = t.indexOf(head, at + 1)) {
      const after = t.slice(at + head.length, at + head.length + 120).split(/[.!?。！？]/)[0]!;
      const words = new Set((after.match(/\p{L}{4,}/gu) ?? []).map((w) => w.slice(0, 4)));
      if (stems.filter((x) => words.has(x)).length >= 2) return true;
    }
    return false;
  });
}
const RECAP_MEANING_STOP = new Set(['that', 'this', 'with', 'from', 'into', 'have', 'been', 'when', 'what', 'which', 'they', 'them', 'their', 'there', 'than', 'then', 'about', 'specific']);
/** Task 38 §G2 (voice run 19, 1222 / 1274 s: "Are you ready to close the
 *  lesson, or would you like to review anything first?" asked in the
 *  summary, and re-asked by the idle nudge): in a fixed-script plan's recap /
 *  closing part a readiness question is dropped — the part has its own
 *  script and check question. Pure. */
export function readinessAskDropDue(input: { plan: LessonPlan | null | undefined; segmentId: string | null | undefined; sentence: string; asksReadiness: (s: string) => boolean }): boolean {
  if (!isFixedScriptPlan(input.plan) || !input.segmentId || !input.plan) return false;
  const seg = input.plan.segments.find((sg) => sg.id === input.segmentId);
  const closing = seg?.kind === 'recap' || fixedScriptLastSegmentId(input.plan) === input.segmentId;
  return closing && /[?？]/.test(input.sentence ?? '') && input.asksReadiness(input.sentence ?? '');
}
/** Task 34 fix round 2 (R13-1, bot run r13 480 s: a TYPED move-on order
 *  advanced the part and the new part's entry note never came): every
 *  advance that is not the client's own auto-advance (whose FACT note
 *  carries the entry) plants the part's entry note for the next brain turn —
 *  the brain's advance_lesson (Task 31 §D), a typed move-on, the Skip
 *  button, the menu-cap advance. Pure. */
export type FixedScriptAdvanceVia = 'auto' | 'brain' | 'typed' | 'skip' | 'menu_unpicked' | 'lesson_time';
export function entryNoteDueAfterAdvance(input: { fixedScript: boolean; via: FixedScriptAdvanceVia; lessonClosed: boolean }): boolean {
  return input.fixedScript && !input.lessonClosed && input.via !== 'auto';
}
/** Task 36 §B (bot run r18: the 30-minute session cap hit the summary
 *  unclosed — parts ran 317–355 s against 3.5–5 min plans): a plan-level
 *  time guard for fixed scripts. Due when the lesson's elapsed time reaches
 *  (plan minutes − closing part minutes − 1). Then, unless the current part
 *  IS the closing part (never cut) or an optional part already in progress
 *  (it runs on; its own next advance is the close), the engine moves to the
 *  closing part. Plan minutes = the plan's estimatedMinutes, else the sum of
 *  its segments' minutes. Pure. */
export const LESSON_TIME_GUARD_MARGIN_MIN = 1;
export function lessonTimeGuardDecision(input: {
  plan: LessonPlan | null | undefined;
  segmentId: string | null | undefined;
  elapsedMs: number;
  alreadyFired: boolean;
}): { action: 'none' } | { action: 'advance'; to: string } {
  const { plan, segmentId } = input;
  if (!plan || !segmentId || !isFixedScriptPlan(plan) || input.alreadyFired) return { action: 'none' };
  const closeId = fixedScriptLastSegmentId(plan);
  if (!closeId || segmentId === closeId) return { action: 'none' };
  const seg = plan.segments.find((x) => x.id === segmentId);
  if (!seg || (seg.kind ?? '').toLowerCase() === 'recap') return { action: 'none' };
  const minutes = (x: { estimatedMinutes?: number } | undefined) => (typeof x?.estimatedMinutes === 'number' && Number.isFinite(x.estimatedMinutes) ? x.estimatedMinutes : 0);
  // Fix round 1 (review MINOR-1): the guard uses the segments' minutes —
  // a plan none of whose segments carries minutes is never guarded.
  if (!plan.segments.some((x) => minutes(x) > 0)) return { action: 'none' };
  const total = minutes(plan as { estimatedMinutes?: number }) || plan.segments.reduce((n, x) => n + minutes(x), 0);
  if (total <= 0) return { action: 'none' };
  const closeMin = minutes(plan.segments.find((x) => x.id === closeId));
  const dueMs = Math.max(0, total - closeMin - LESSON_TIME_GUARD_MARGIN_MIN) * 60_000;
  if (input.elapsedMs < dueMs) return { action: 'none' };
  // An optional part (metadata.optional) already in progress runs on.
  if ((seg.metadata as { optional?: unknown } | undefined)?.optional === true) return { action: 'none' };
  return { action: 'advance', to: closeId };
}
/** Task 36 §B: the advance lead of a time-guard move. */
export function lessonTimeGuardLead(from: string, to: string): string {
  return `Time is short — the "${from}" part ends here and the lesson pointer has ALREADY moved to "${to}" (any parts in between are skipped today). Keep the summary to its key points and close.`;
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
// Task 38 §C (voice run 19, 854–869 s: the one hold was spent on the
// previous ask, the next turn asked again and the advance abandoned it): a
// second hold is allowed.
export const FIXED_SCRIPT_AUTO_ADVANCE_MAX_ASK_HELD_TURNS = 2;
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

/** Task 35 §B (bot run r14, 693–737 s: the required_phrase_missing retry made
 *  the summary restate itself and re-ask its contrast question, answered at
 *  715 s): the retry directive names the part's questions the student has
 *  already answered (newest last, ≤ 3) — say the missing point(s) only. */
export function answeredQuestionsClause(answered: readonly string[] | null | undefined): string {
  const qs = [...new Set((answered ?? []).map((q) => q.trim()).filter(Boolean))].slice(-3);
  if (!qs.length) return '';
  return ` The student has already answered: ${qs.map((q) => `"${q.replace(/"/g, "'")}"`).join('; ')} — do not ask it again; say the missing point(s) only.`;
}
export function requiredPhraseMissingReason(segId: string, missing: readonly string[], answered?: readonly string[] | null): string {
  return withSilentClause(
    `Your narration for segment "${segId}" is missing required phrase(s): ${missing.map((m) => `"${m}"`).join(', ')}. ` +
    `This segment pins specific narrative parameters (target values, example inputs, etc.) that you must reference verbatim — substituting a different value mid-segment desynchronizes the lesson from the board/segment-card and the student's tracking. ` +
    `Re-emit your response with each required phrase appearing at least once in the spoken narration.${answeredQuestionsClause(answered)}`);
}
/** Task 35 §B: the summary part's running note once one of its questions is
 *  answered (planted on each student turn there). '' when none. */
export function answeredInPartNote(answered: readonly string[] | null | undefined): string {
  const qs = [...new Set((answered ?? []).map((q) => q.trim()).filter(Boolean))].slice(-3);
  if (!qs.length) return '';
  return withSilentClause(`[runtime note — not from the student] Already asked and answered in this part — do not ask again: ${qs.map((q) => `"${q.replace(/"/g, "'")}"`).join('; ')}.]`);
}
/** Task 35 §B: the part whose answered questions are guarded — the closing
 *  (last non-extension) part or a recap part of a fixed script. Pure. */
export function answeredGuardPart(plan: LessonPlan | null | undefined, segmentId: string | null | undefined): boolean {
  if (!plan || !segmentId || !isFixedScriptPlan(plan)) return false;
  const seg = plan.segments.find((s) => s.id === segmentId);
  return !!seg && ((seg.kind ?? '').toLowerCase() === 'recap' || fixedScriptLastSegmentId(plan) === segmentId);
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

/** Task 39 §D (voice run 20, 1127 s: one retry turn read the pronunciation
 *  part's entry menu AND then wrapped the lesson up — "Here are the points so
 *  far: … Would you like to continue, or stop for today?"): once the current
 *  part's choice menu has been spoken in the attempt, a wrap-up / stop-choice
 *  sentence after it is dropped — the menu is the authored step. A wrap-up
 *  sentence: a stop choice ("continue … or stop", "stop for today / now"), a
 *  recap lead ("Here are the points so far", "To sum up", "Let's review what
 *  we did today") or a wrap-up plan ("I'll wrap up …"). Pure, generic. */
const WRAP_UP_SENTENCE_RE = /\b(?:continue|go on|keep going|carry on|do the summary)\b[^.!?]{0,60}\bor\b[^.!?]{0,30}\bstop\b|\bstop (?:for today|here|now)\b[^.!?]*[?？]|^\s*(?:(?:so|okay|now|ok),?\s+)?(?:here (?:are|is)|these are) (?:the |our |today['’]s )?(?:main |key )?points\b(?: (?:so far|from today|we covered))?|^\s*(?:(?:so|okay|now|ok),?\s+)?(?:to sum up|to wrap up|in summary|let['’]s (?:review|recap|sum up) (?:what|everything)\b)|\bI['’]ll (?:now |just )?wrap (?:things |the lesson |it )?up\b|\bwrap up (?:instead|the lesson|for today)\b/i;
export function isWrapUpSentence(sentence: string | null | undefined): boolean {
  return WRAP_UP_SENTENCE_RE.test(sentence ?? '');
}
export function wrapUpAfterMenuDropDue(input: {
  enabled: boolean;
  fixedScript: boolean;
  /** the current part's card statement */
  card: string | null | undefined;
  /** the text this attempt has spoken so far (kept sentences) */
  spokenSoFar: string;
  sentence: string;
}): boolean {
  if (!input.enabled || !input.fixedScript || !input.card) return false;
  if (!boardOffersChoices({ statement: input.card })) return false;
  if (!menuReadInTurn(input.card, input.spokenSoFar)) return false;
  return isWrapUpSentence(input.sentence);
}

/** Task 39 §E (voice run 20, 788–794 s: "one more practice sentence." →
 *  "Let's do one more on the past simple. Let's move on." — no item, and a
 *  contradiction): on the turn the offer was accepted, an attempt that asks
 *  nothing is killed once and retried with OFFER_ACCEPTED_NO_ASK_REASON; a
 *  bare "Let's move on." on that turn is dropped (and the engine's R9-3
 *  move-on line is not spoken). Pure. */
export const OFFER_ACCEPTED_NO_ASK_REASON = withRetryStyle(
  'The student chose ONE more practice item. Ask ONE new practice question on this point now (spoken in full, written with handwrite) — one you have not asked before. Do not say you are moving on.');
export function offerAcceptedNoAskDue(input: {
  enabled: boolean;
  accepted: OfferAcceptState | null | undefined;
  /** the acceptance was recorded at this turn's start */
  acceptedThisTurn: boolean;
  currentSegId: string | null | undefined;
  /** the attempt's kept text */
  text: string | null | undefined;
  alreadyRetried: boolean;
  runtimeTurn: boolean;
}): boolean {
  const a = input.accepted;
  if (!input.enabled || !a || !input.acceptedThisTurn || a.itemAsked || input.alreadyRetried || input.runtimeTurn) return false;
  if (!input.currentSegId || a.segId !== input.currentSegId) return false;
  return !attemptAsksStudent(input.text);
}
const BARE_MOVE_ON_RE = /^\s*(?:(?:okay|ok|so|now|alright|all right|right|good|great),?\s+)?let['’]?s (?:move on|keep going|go on)(?: now)?[.!]?\s*$/i;
export function isBareMoveOn(sentence: string | null | undefined): boolean {
  return BARE_MOVE_ON_RE.test(sentence ?? '');
}

/** Task 39 fix round 1 (I-3): the "advance already applied this turn" marker
 *  (VTR inferredAdvanceThisTurnRef) after a killed attempt — the pointer moved
 *  this turn (the brain's own advance_lesson in the killed attempt) and no
 *  marker was set (the kill re-arm did not catch it: the page break was not
 *  in the dropped buffer) ⇒ the moved-to segment; otherwise unchanged. The
 *  retry's re-emitted advance_lesson({to:"next"}) is then satisfied by it,
 *  client and route alike. Pure. */
export function appliedAdvanceMarkerAfterKill(input: { killed: boolean; currentSegId: string | null | undefined; turnStartSegId: string | null | undefined; marker: string }): string {
  if (input.marker || !input.killed) return input.marker;
  const cur = input.currentSegId ?? '';
  if (!cur || cur === (input.turnStartSegId ?? '')) return input.marker;
  return cur;
}

/** Task 39 fix round 1 (R26-2, bot run r26 398 s: on the present-perfect
 *  offer part — offer planted, never asked — the brain announced the move in
 *  Japanese AND called advance_lesson; the part advanced with no offer, since
 *  a called advance is exempt from the offer validator). With
 *  TUTOR_ANNOUNCED_OFFER_FIRST, the brain's own advance_lesson({to:"next"})
 *  off a part whose offer is pending (made, not asked) is refused once per
 *  student turn — unless this attempt asked the offer, the student declined /
 *  ordered the move on, or the turn is runtime-triggered. The refusal's retry
 *  is told to ask the offer (fixedScriptOfferMissingReason); the R24-1 kill +
 *  engine offer then cover a retry that still does not. Pure. */
export function brainAdvanceOfferFirstRefused(input: {
  enabled: boolean;
  fixedScript: boolean;
  to: string;
  offerPending: boolean;
  offerAskedInAttempt: boolean;
  studentMovedOn: boolean;
  runtimeTurn: boolean;
  alreadyRefusedThisTurn: boolean;
}): boolean {
  if (!input.enabled || !input.fixedScript || input.to !== 'next') return false;
  if (!input.offerPending || input.offerAskedInAttempt || input.studentMovedOn || input.runtimeTurn || input.alreadyRefusedThisTurn) return false;
  return true;
}

/** Task 39 fix round 1 (R26-3, bot run r26 1032–1048 s: "…would you like one
 *  more word, or shall we move on to the summary?" → "Yes." → 「「はい」だけでは、
 *  どちらか分かりません。」): the lone-yes rule (Task 33 §A3 — a bare yes takes
 *  the choice's first half, one more) covers ANY "one more X, or move on?"
 *  choice the last tutor turn asked (offerAsked), planted or brain-made, when
 *  no planted-offer acceptance handled it. The urgent note orders the one
 *  more item, never "which do you mean?". Pure. */
export const LONE_YES_CHOICE_NOTE = withSilentClause(
  "[runtime note — not from the student] The student answered your \"one more, or move on?\" question with yes — that means ONE more of the same kind. Do not ask which one they mean and do not ask the choice again. Give ONE new item now (spoken in full; written with handwrite when it is a question).]");
export function loneYesChoiceNoteDue(input: { enabled: boolean; fixedScript: boolean; studentText: string | null | undefined; lastTutorText: string | null | undefined; acceptanceHandled: boolean }): boolean {
  if (!input.enabled || !input.fixedScript || input.acceptanceHandled) return false;
  const t = (input.studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  return isBareAffirmative(t) && offerAsked(input.lastTutorText);
}
