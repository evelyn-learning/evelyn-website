/**
 * Fixed-script segments advance on the CLIENT (GDI trial live run 1,
 * 2026-10-29: the brain never called advance_lesson in a conversation
 * lesson; the cursor sat on the first segment for 15 minutes).
 *   - fixedScriptAutoAdvanceReason decides "due": 'turns' at overlong + 2,
 *     'time' at max(120 s, minutes × 1.5), null for any other plan or the
 *     last on-topic segment;
 *   - levelSetAdvanceTarget: set_working_level on a level-check segment ⇒
 *     the next segment;
 *   - the planted note is a FACT, and a pending note about the segment just
 *     left is replaced rather than kept;
 *   - VoiceTutorRealtime wires both moves (source pins).
 *
 * Run: npx tsx scripts/test-fixed-script-advance.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  fixedScriptAutoAdvanceReason, overlongTurnThreshold, levelSetAdvanceTarget,
  fixedScriptAdvancedNote, fixedScriptAutoAdvanceLead, fixedScriptLevelAdvanceLead, mergePendingRuntimeNote,
  FIXED_SCRIPT_AUTO_ADVANCE_EXTRA_TURNS, FIXED_SCRIPT_AUTO_ADVANCE_TIME_FACTOR, FIXED_SCRIPT_AUTO_ADVANCE_MIN_MS,
  FIXED_SCRIPT_AUTO_ADVANCE_MAX_HELD_TURNS, holdAutoAdvanceForPronunciation,
  FIXED_SCRIPT_AUTO_ADVANCE_MAX_ASK_HELD_TURNS, holdAutoAdvanceForPendingAsk,
  missingRequiredPhrases, scriptMissingAdvanceReason,
  segmentMaxTurns, needsLevelCaptureLead, LEVEL_CAPTURE_LEAD, FIXED_SCRIPT_LEVEL_MISSING_REASON,
  fixedScriptCloseReason, fixedScriptCloseForced, FIXED_SCRIPT_CLOSE_NOTE, FIXED_SCRIPT_CLOSE_GRACE_TURNS,
  segmentNeedsAutoCard, problemStatementOnBoard, PROBLEM_CARD_TOOLS,
} from '../src/lib/tutor/lesson-plan/fixed-script';
import { fixedScriptAnnouncedAdvanceLead, FIXED_SCRIPT_MORE_OF_PART_LEAD, fixedScriptContinueDirective, FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE, isFixedScriptContinueDirective, fixedScriptChoiceMenuClause, FIXED_SCRIPT_CHOICE_MENU_CLAUSE } from '../src/lib/tutor/lesson-plan/fixed-script';
import {
  segmentTransitionKind, fixedScriptPartLabel, fixedScriptTransitionDecision, fixedScriptOfferNote, fixedScriptBridgeClause,
  holdAutoAdvanceForOffer, FIXED_SCRIPT_AUTO_ADVANCE_MAX_OFFER_HELD_TURNS, FIXED_SCRIPT_OFFER_HELD_AT_PLANT, overlongNoteYieldsToOffer,
  offerAsked, offerDeclined, transitionOfferValidatorDecision, fixedScriptOfferMissingReason,
  FIXED_SCRIPT_OFFER_MAX_WAIT_MS, offerWaitExpired,
  offerAccepted, fixedScriptOfferAcceptedNote, FIXED_SCRIPT_OFFER_ACCEPTED_HOLD_TURNS, closeBeforeRequiredPhrasesDecision, CLOSE_BEFORE_REQUIRED_PHRASES_REASON, CLOSE_REFUSAL_EXEMPT_REMAINING_MS,
  fixedScriptOfferContinueDirective, FIXED_SCRIPT_OFFER_CONTINUE_PREFIX, attemptAsksStudent, offerReplantDue,
} from '../src/lib/tutor/lesson-plan/fixed-script';
import {
  FIXED_SCRIPT_CLOSE_RECAP_GRACE_TURNS, FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE, FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS, FIXED_SCRIPT_CLOSE_WRAP_MAX_MS,
} from '../src/lib/tutor/lesson-plan/fixed-script';
import { fixedScriptCloseForcedAction, closeWrapPollDecision } from '../src/lib/tutor/lesson-plan/announced-move';
import { turnEndsWithAsk } from '../src/lib/tutor/question-gist-text';
import { askOffNewPart } from '../src/lib/tutor/lesson-plan/transition-ask';
import { buildRailModel, secondTutorLanguage, fixedScriptPartTitle, fixedScriptOutlineTable, authoredSegmentLabel, displayedSegmentId, displayedCompletedSegments } from '../src/lib/tutor/lesson-plan/rail-labels';
import { extractCommandTitle, catalogItemTitle } from '../src/lib/tutor/whiteboard/catalog';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);

const RAW = {
  id: 'test.fixed-script-advance',
  title: 'Fixed script',
  curriculum: 'test',
  grade: 'adult',
  subject: 'languages',
  estimatedMinutes: 10,
  metadata: { fixedScript: true },
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2 },
    { id: 'level-check', kind: 'misconception_check', question: 'Tell me about your work.', misconception: 'n/a', metadata: { skipWhenLevelKnown: true } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'], estimatedMinutes: 1 },
    { id: 'no-minutes', kind: 'concept', goal: 'Teach more', keyIdeas: ['b'] },
    { id: 'recap', kind: 'recap', mustRemember: ['a'], estimatedMinutes: 2 },
  ],
};
const fixed: LessonPlan = parseLessonPlan(RAW);
const ordinary: LessonPlan = { ...fixed, metadata: {} };
const base = { plan: fixed, segmentId: 'overview', turns: 0, overlongTurns: 6, elapsedMs: 0, levelKnown: false };

test('constants', () => {
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_EXTRA_TURNS, 2);
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_TIME_FACTOR, 1.5);
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_MIN_MS, 120_000);
});
test('parser keeps segment estimatedMinutes (overview 2 min ⇒ overlong 6)', () => {
  assert.equal(fixed.segments[0].estimatedMinutes, 2);
  assert.equal(overlongTurnThreshold(fixed, 'overview', 6), 6);
});
test('non-fixed plan → null at any value', () => {
  for (const turns of [0, 8, 100]) for (const elapsedMs of [0, 180_000, 10_000_000]) {
    assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: ordinary, turns, elapsedMs }), null);
  }
});
test('missing plan / segment / unknown segment → null', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: null, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: undefined, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: null, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: '', turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: 'nope', turns: 99 }), null);
});
test('overview: turns 7 → null, turns 8 → turns', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 7 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 8 }), 'turns');
});
test('overview: turns 3, elapsed 179_999 → null, 180_000 → time', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 3, elapsedMs: 179_999 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 3, elapsedMs: 180_000 }), 'time');
});
test('turns checked before time', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 8, elapsedMs: 999_999 }), 'turns');
});
test('1-minute segment uses the 120 s floor', () => {
  const b = { ...base, segmentId: 'topic-intro', turns: 1 };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, elapsedMs: 119_999 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, elapsedMs: 120_000 }), 'time');
});
test('segment without minutes never advances on time (turns still do)', () => {
  const b = { ...base, segmentId: 'no-minutes', turns: 1 };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, elapsedMs: 10_000_000 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 8 }), 'turns');
});
test('last segment → null', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: 'recap', turns: 99, elapsedMs: 10_000_000 }), null);
});
test('levelKnown: successor skipped for known level, a later segment exists ⇒ still due', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, levelKnown: true, turns: 8 }), 'turns');
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, levelKnown: true, turns: 3, elapsedMs: 180_000 }), 'time');
});
test('levelKnown: only remaining successor skipped ⇒ null', () => {
  const p: LessonPlan = { ...fixed, segments: [fixed.segments[0], fixed.segments[1]] };
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: p, levelKnown: true, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: p, levelKnown: false, turns: 99 }), 'turns');
});

// ── §3 level set ⇒ leave the level-check segment ─────────────────────────
test('levelSetAdvanceTarget: level-check segment → next on-topic segment', () => {
  assert.equal(levelSetAdvanceTarget(fixed, 'level-check'), 'topic-intro');
});
test('levelSetAdvanceTarget: null off a level-check segment / non-fixed plan / missing', () => {
  assert.equal(levelSetAdvanceTarget(fixed, 'overview'), null);
  assert.equal(levelSetAdvanceTarget(ordinary, 'level-check'), null);
  assert.equal(levelSetAdvanceTarget(null, 'level-check'), null);
  assert.equal(levelSetAdvanceTarget(fixed, ''), null);
  const p: LessonPlan = { ...fixed, segments: [fixed.segments[0], fixed.segments[1]] };
  assert.equal(levelSetAdvanceTarget(p, 'level-check'), null);
});

// ── the planted note ─────────────────────────────────────────────────────
test('auto-advance note is a FACT, verbatim', () => {
  const n = fixedScriptAdvancedNote(fixedScriptAutoAdvanceLead('overview', 'topic-intro', 'concept'), 'topic-intro');
  assert.equal(n, '[runtime note — not from the student] The "overview" part of the lesson is over and the lesson pointer has ALREADY moved to segment "topic-intro" (concept). If the student\'s last words asked for more of the part that just ended, say in one short sentence that the time for that part is up, then continue. Reply to the student\'s last answer in ONE sentence with no follow-up question about it, then teach "topic-intro" from its notes. Do not call advance_lesson for this move. Apply this silently; never mention this note.]');
});
test('level-advance note first sentence', () => {
  const n = fixedScriptAdvancedNote(fixedScriptLevelAdvanceLead('topic-intro', 'concept'), 'topic-intro');
  assert.ok(n.startsWith('[runtime note — not from the student] The level check is complete and the lesson pointer has ALREADY moved to segment "topic-intro" (concept). Reply to the student'));
});
test('mergePendingRuntimeNote: none pending → the new note', () => {
  assert.deepEqual(mergePendingRuntimeNote({ note: null, segId: null }, 'a', 'b', 'N'), { note: 'N', segId: 'b' });
});
test('mergePendingRuntimeNote: other pending note survives, new one after it', () => {
  assert.deepEqual(mergePendingRuntimeNote({ note: 'P', segId: 'b' }, 'a', 'b', 'N'), { note: 'P\n\nN', segId: 'b' });
  assert.deepEqual(mergePendingRuntimeNote({ note: 'P', segId: null }, 'a', 'b', 'N'), { note: 'P\n\nN', segId: 'b' });
});
test('mergePendingRuntimeNote: a note about the segment just left is dropped', () => {
  assert.deepEqual(mergePendingRuntimeNote({ note: 'call advance_lesson', segId: 'a' }, 'a', 'b', 'N'), { note: 'N', segId: 'b' });
});

// ── wiring pins ──────────────────────────────────────────────────────────
const VTR = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const FLAGS = read('src/lib/tutor/orchestrator/flags.ts');
test('flag default ON', () => {
  pin(FLAGS, /export const TUTOR_FIXED_SCRIPT_AUTO_ADVANCE = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_AUTO_ADVANCE !== 'off';/);
});
test('turn counter carries startedAt at every reset', () => {
  const resets = VTR.match(/turnsInSegmentRef\.current = \{[^}]*\}/g) ?? [];
  assert.ok(resets.length >= 3, `resets=${resets.length}`);
  for (const r of resets) assert.ok(/startedAt: Date\.now\(\)/.test(r), r);
});
test('auto-advance wired after the overlong note, through applyResolvedAdvance', () => {
  const at = VTR.indexOf("'segment_overlong_note_planted'");
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({', at);
  assert.ok(at > 0 && auto > at, 'auto-advance must follow the overlong note');
  const block = VTR.slice(auto, auto + 14500  /* Task 26: the offer branches; Task 27 §E2: the menu clause; Task 29 §A2: the spoken offer; Task 30 §A2: the wait cap */);
  pin(block, /applyResolvedAdvance\(autoPlan, segIdNow, autoNext\)/);
  pin(block, /pendingRuntimeNoteSegRef\.current = merged\.segId/);
  pin(block, /'fixed_script_auto_advance', `"\$\{segIdNow\}" → "\$\{autoNext\}" reason=\$\{advanceReason\} turns=\$\{autoTurns\} elapsed=\$\{autoElapsedS\}s`/);
});
// ── fix round 10-11 ──────────────────────────────────────────────────────
test('A: auto-advance held while a pronunciation clip is armed', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  const block = VTR.slice(auto, auto + 11500);
  pin(block, /if \(autoNext && !offerMadeHere && holdAutoAdvanceForPronunciation\(pronArmed, autoAdvancePronHeldRef\.current\)\) \{[\s\S]*?autoAdvancePronHeldRef\.current \+= 1;[\s\S]*?'fixed_script_auto_advance_held_pron'[\s\S]*?\} else if \(autoNext\) \{\s*autoAdvancePronHeldRef\.current = 0;/);
  pin(block, /const pronArmed = !!clipCaptureRef\.current\?\.isArmed\(\);/);
  assert.ok(block.indexOf('isArmed()') < block.indexOf('applyResolvedAdvance(autoPlan'), 'hold check precedes the advance');
});
test('C: the pronunciation hold is capped at 3 consecutive turns; the 4th advances', () => {
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_MAX_HELD_TURNS, 3);
  assert.equal(holdAutoAdvanceForPronunciation(true, 0), true);
  assert.equal(holdAutoAdvanceForPronunciation(true, 2), true);
  assert.equal(holdAutoAdvanceForPronunciation(true, 3), false);
  assert.equal(holdAutoAdvanceForPronunciation(false, 0), false);
  // the held count resets when nothing is due (a new segment) and on the advance
  pin(VTR, /if \(!advanceReason\) \{ autoAdvancePronHeldRef\.current = 0; autoAdvanceAskHeldRef\.current = 0; \}/);
});
test('B: FACT notes are urgent (never held) and delivery is logged', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  pin(VTR.slice(auto, auto + 11500), /pendingRuntimeNoteUrgentRef\.current = true;/);
  // Task 14 §G: the tool path's level apply moved into applyWorkingLevelRef.
  const lv = VTR.indexOf("applyWorkingLevelRef.current(wl.level, wl.evidence ?? '', 'tool')");
  assert.ok(lv > 0);
  pin(VTR.slice(lv, lv + 2500), /pendingRuntimeNoteUrgentRef\.current = true;/);
  pin(VTR, /const deliver = urgentNote \|\| !openQuestionAtTurnStartRef\.current/);
  pin(VTR, /if \(urgentNote\) \{\n\s*fixedScriptNoteDeliveredThisTurnRef\.current = true;\n\s*onDebugEvent\?\.\('fixed_script_note_delivered'/);
  // the overlong note itself stays holdable
  const ov = VTR.indexOf("'segment_overlong_note_planted'");
  pin(VTR.slice(ov - 2500, ov), /pendingRuntimeNoteUrgentRef\.current = false;/);
});
test('D: the turn counter + auto-advance run under the auto-advance flag alone', () => {
  pin(VTR, /if \(\(TUTOR_SEGMENT_OVERLONG_NOTE \|\| TUTOR_FIXED_SCRIPT_AUTO_ADVANCE\) && totalSentenceCount > 0\) \{/);
  pin(VTR, /if \(TUTOR_SEGMENT_OVERLONG_NOTE && !homeworkSession && !cur\.noted && cur\.turns >= overlongTurns/);
});
test('level-set advance wired in the setWorkingLevel handler with the double-advance guard', () => {
  const at = VTR.indexOf("applyWorkingLevelRef.current(wl.level, wl.evidence ?? '', 'tool')");
  assert.ok(at > 0);
  const block = VTR.slice(at, at + 2000);
  pin(block, /levelSetAdvanceTarget\(lvPlan, lvFrom\)/);
  pin(block, /applyResolvedAdvance\(lvPlan, lvFrom, lvNext\)/);
  pin(block, /inferredAdvanceThisTurnRef\.current = lvNext/);
  pin(block, /'fixed_script_level_advance'/);
});
test('applyResolvedAdvance disarms a pending pronunciation arm', () => {
  const at = VTR.indexOf('const applyResolvedAdvance = useCallback(');
  pin(VTR.slice(at, at + 8000), /disarmPronunciationOnSegmentAdvanceRef\.current\(currentSegmentIdRef\.current, next\)/);
});

// ── run 2 (10-29): a fixed-script segment is not left before its script was said ──
const OVERVIEW = { requiredPhrases: ['present perfect', 'past simple'] };
test('missingRequiredPhrases: both present → []', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, ['Today we compare the present perfect', 'with the past simple.']), []);
});
test('missingRequiredPhrases: one missing → [that one]', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, ['Today we look at the present perfect.']), ['past simple']);
});
test('missingRequiredPhrases: case-insensitive', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, ['PRESENT PERFECT and Past Simple.']), []);
});
test('missingRequiredPhrases: empty narration → all', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, []), ['present perfect', 'past simple']);
});
test('missingRequiredPhrases: no requiredPhrases → []', () => {
  assert.deepEqual(missingRequiredPhrases({}, []), []);
  assert.deepEqual(missingRequiredPhrases(undefined, []), []);
  assert.deepEqual(missingRequiredPhrases({ requiredPhrases: [] }, ['x']), []);
});
test('scriptMissingAdvanceReason names every missing phrase and says "this turn"', () => {
  const r = scriptMissingAdvanceReason(['present perfect', 'past simple']);
  assert.ok(r.includes('"present perfect", "past simple"') && /Say it in this turn/.test(r), r);
});
test('VTR: advance_lesson guard refuses before the homework guard, without moving the cursor', () => {
  const at = VTR.indexOf("'fixed_script_advance_refused_script_missing'");
  assert.ok(at > 0, 'event');
  const block = VTR.slice(at - 1800, at + 400);
  pin(block, /TUTOR_FIXED_SCRIPT_ADVANCE_GUARD && next && isFixedScriptPlan\(plan\)/);
  pin(block, /missingRequiredPhrases\(/);
  pin(block, /\.\.\.turnNarrationRef\.current/);
  pin(block, /rejected\.push\(\{ action: 'advance_lesson', reason: scriptMissingAdvanceReason\(missing\) \}\);\s*continue;/);
  pin(block, /scriptAdvanceRefusedSegRef\.current = curSegId/);
  assert.ok(at < VTR.indexOf('const hwAdvance = next && TUTOR_HOMEWORK_ADVANCE_GUARD'), 'before the homework guard / any applyResolvedAdvance');
});
test('VTR: mark_segment_complete of the current fixed-script segment is skipped while its script is missing', () => {
  const at = VTR.indexOf("'fixed_script_mark_refused_script_missing'");
  assert.ok(at > 0, 'event');
  const block = VTR.slice(at - 1400, at + 200);
  pin(block, /c\.segmentId === currentSegmentIdRef\.current/);
  pin(VTR.slice(at, at + 200), /continue;/);
});
test('VTR: a refused advance does not defer the required-phrase check', () => {
  const at = VTR.indexOf('const advancedIntoSegmentThisTurn =');
  const block = VTR.slice(at - 600, at + 200);
  pin(block, /scriptAdvanceRefusedSegRef\.current === segIdForPhrases/);
  pin(block, /advancedIntoSegmentThisTurn = !advanceRefusedHere &&/);
  pin(VTR, /turnNarrationRef\.current = \[\];\n\s*scriptAdvanceRefusedSegRef\.current = '';/);
});

// ── Task 13 §A: authored pacing (metadata.maxTurns) ──
const MT_RAW = {
  ...RAW,
  id: 'test.fixed-script-maxturns',
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2, metadata: { maxTurns: 2 } },
    { id: 'level-check', kind: 'misconception_check', question: 'Tell me about your work.', misconception: 'n/a', metadata: { skipWhenLevelKnown: true, maxTurns: 5 } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'], estimatedMinutes: 1 },
    { id: 'bad', kind: 'concept', goal: 'Teach', keyIdeas: ['b'], estimatedMinutes: 1, metadata: { maxTurns: 2.5 } },
    { id: 'recap', kind: 'recap', mustRemember: ['a'], estimatedMinutes: 2 },
  ],
};
const mt: LessonPlan = parseLessonPlan(MT_RAW);
test('A: segmentMaxTurns reads a positive integer on a fixed script only', () => {
  assert.equal(segmentMaxTurns(mt, 'overview'), 2);
  assert.equal(segmentMaxTurns(mt, 'topic-intro'), undefined);
  assert.equal(segmentMaxTurns(mt, 'bad'), undefined);
  assert.equal(segmentMaxTurns({ ...mt, metadata: {} }, 'overview'), undefined);
  assert.equal(segmentMaxTurns(mt, 'nope'), undefined);
});
test('A: maxTurns 2 → null at 1, turns at 2', () => {
  const b = { plan: mt, segmentId: 'overview', overlongTurns: 1, elapsedMs: 0, levelKnown: false };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 1 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 2 }), 'turns');
});
test('A: a segment with maxTurns ignores the 1.5× time rule', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ plan: mt, segmentId: 'overview', turns: 1, overlongTurns: 1, elapsedMs: 10 * 60_000, levelKnown: false }), null);
});
test('A: a segment without maxTurns keeps the old rules', () => {
  const b = { plan: mt, segmentId: 'topic-intro', overlongTurns: 6, levelKnown: false };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 7, elapsedMs: 0 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 8, elapsedMs: 0 }), 'turns');
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 1, elapsedMs: 120_000 }), 'time');
});
test('A: overlong threshold = maxTurns − 1 (min 1); otherwise unchanged', () => {
  assert.equal(overlongTurnThreshold(mt, 'overview', 6), 1);
  assert.equal(overlongTurnThreshold(mt, 'level-check', 6), 4);
  assert.equal(overlongTurnThreshold(mt, 'topic-intro', 6), 6);
  const one = parseLessonPlan({ ...MT_RAW, segments: [{ ...MT_RAW.segments[0], metadata: { maxTurns: 1 } }, MT_RAW.segments[4]] });
  assert.equal(overlongTurnThreshold(one, 'overview', 6), 1);
});
test('A: level-capture lead only when leaving a level check with no level', () => {
  assert.equal(needsLevelCaptureLead(mt, 'level-check', false), true);
  assert.equal(needsLevelCaptureLead(mt, 'level-check', true), false);
  assert.equal(needsLevelCaptureLead(mt, 'overview', false), false);
  assert.equal(needsLevelCaptureLead({ ...mt, metadata: {} }, 'level-check', false), false);
  assert.equal(LEVEL_CAPTURE_LEAD, 'Before anything else this turn, call set_working_level with the level you heard in the level check. ');
});
test('VTR: auto-advance note prepends the level-capture lead', () => {
  pin(VTR, /needsLevelCaptureLead\(autoPlan, segIdNow, !!workingLevelRef\.current\) \? LEVEL_CAPTURE_LEAD : ''\) \+\s*\(advanceReason === 'announced'\s*\? fixedScriptAnnouncedAdvanceLead\(segIdNow, autoNext, autoKind\)\s*: fixedScriptAutoAdvanceLead\(/);
});

// ── Task 13 §B: authored labels → rail, page titles, outline ──
const LB_RAW = {
  ...RAW,
  id: 'test.fixed-script-labels',
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2, metadata: { label: 'Overview', labelLocalized: { ja: '概要' } } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'], estimatedMinutes: 4, metadata: { label: 'Your job' } },
    { id: 'pron', kind: 'concept', goal: 'Sounds', keyIdeas: ['b'], estimatedMinutes: 3, metadata: { label: 'Pronunciation', labelLocalized: { ja: '発音' }, optional: true } },
    { id: 'recap', kind: 'recap', mustRemember: ['a'], estimatedMinutes: 2 },
  ],
};
const lb: LessonPlan = parseLessonPlan(LB_RAW);
test('B: secondTutorLanguage = first non-English code', () => {
  assert.equal(secondTutorLanguage(['en', 'ja']), 'ja');
  assert.equal(secondTutorLanguage(['en']), undefined);
  assert.equal(secondTutorLanguage(undefined), undefined);
});
test('B: rail uses the authored label (before Hook/Recap words), localized when a second language matches', () => {
  const en = buildRailModel(lb, 'overview', new Set(), { 'topic-intro': 'Generated thing' })!;
  assert.deepEqual(en.items.map((i) => i.label), ['Overview', 'Your job', 'Pronunciation', 'Recap']);
  const ja = buildRailModel(lb, 'overview', new Set(), null, 'ja')!;
  assert.deepEqual(ja.items.map((i) => i.label), ['Overview · 概要', 'Your job', 'Pronunciation · 発音', 'Recap']);
});
test('B: plans without labels keep their rail', () => {
  const m = buildRailModel(fixed, 'overview', new Set(), null, 'ja')!;
  assert.equal(m.items[0].label, 'Hook');
  assert.equal(authoredSegmentLabel(fixed.segments[0], 'ja'), null);
});
test('B: advance page title "Part <n> · <label>[ · <localized>]" on a fixed script only', () => {
  assert.equal(fixedScriptPartTitle(lb, 'topic-intro'), 'Part 2 · Your job');
  assert.equal(fixedScriptPartTitle(lb, 'pron', 'ja'), 'Part 3 · Pronunciation · 発音');
  assert.equal(fixedScriptPartTitle(lb, 'recap'), null);
  assert.equal(fixedScriptPartTitle({ ...lb, metadata: {} }, 'topic-intro'), null);
});
test('B: outline table — plan title, #/Part/Minutes, (optional), localized column', () => {
  const t = fixedScriptOutlineTable(lb)!;
  assert.equal(t.title, 'Fixed script');
  assert.deepEqual(t.headers, ['#', 'Part', 'Minutes']);
  assert.deepEqual(t.rows[2], ['3', 'Pronunciation (optional)', '3']);
  assert.deepEqual(t.rows[3], ['4', 'Recap', '2']);
  const tj = fixedScriptOutlineTable(lb, 'ja')!;
  assert.deepEqual(tj.headers, ['#', 'Part', 'Part (ja)', 'Minutes']);
  assert.deepEqual(tj.rows[0], ['1', 'Overview', '概要', '2']);
  assert.equal(fixedScriptOutlineTable({ ...lb, metadata: {} }), null);
});
test('B: a sentence never titles a page; the catalog item still names it', () => {
  const cmd = { action: 'showSentence', sentence: 'I have worked here for ten years.' };
  assert.equal(extractCommandTitle(cmd), undefined);
  assert.equal(catalogItemTitle(cmd), 'I have worked here for ten years.');
  assert.equal(catalogItemTitle({ action: 'showTable', title: 'Outline', headers: [], rows: [] }), 'Outline');
});
test('VTR: advance page title, outline card wiring, rail language', () => {
  pin(VTR, /const authoredPartTitle = fixedScriptPartTitle\(plan, next, secondTutorLanguageRef\.current\);\s*const newPageTitle = authoredPartTitle/);
  pin(VTR, /TUTOR_FIXED_SCRIPT_OUTLINE && openingTurnPendingRef\.current && !opts\?\.prefetchOnly && !fixedScriptOutlineShownRef\.current/);
  pin(VTR, /handleWhiteboardCommand\(\[cmd\], \{ anchorSentence: 0 \}\)/);
  pin(VTR, /'fixed_script_outline_card', `rows=\$\{outline\.rows\.length\}/);
  assert.ok(!/extractCommandTitle/.test(VTR), 'catalog appends use catalogItemTitle');
  pin(read('src/app/tutor/components/session/TutorSession.tsx'), /segmentLabels, secondTutorLanguage\(tutorLanguages\)\)/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /TUTOR_FIXED_SCRIPT_OUTLINE = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_OUTLINE !== 'off'/);
});

// ── Task 13 fix round 1 (I-4): leaving the level check without a level ──
test('I-4: the overlong note carries the level-capture lead before the advance hint', () => {
  pin(VTR, /const levelLead = needsLevelCaptureLead\(plan, segIdNow, !!workingLevelRef\.current\) \? LEVEL_CAPTURE_LEAD : '';/);
  pin(VTR, /`\$\{OVERLONG_FINISH_FIRST\}\$\{levelLead\}\$\{nextHint\} `/);
});
test('I-4: a brain advance off the level check with no level (and no set_working_level in the batch) is refused', () => {
  assert.equal(FIXED_SCRIPT_LEVEL_MISSING_REASON, 'Set the working level first: call set_working_level({level}) with the level you heard in this check, then advance.');
  const at = VTR.indexOf("'fixed_script_advance_refused_level_missing'");
  assert.ok(at > 0, 'event');
  const block = VTR.slice(at - 700, at + 300);
  pin(block, /levelCheckActive\s*&& needsLevelCaptureLead\(plan, curSegId, !!workingLevelRef\.current\)\s*&& !processed\.some\(\(c\) => \(c\.action as string\) === 'setWorkingLevel'\)/);
  pin(block, /rejected\.push\(\{ action: 'advance_lesson', reason: FIXED_SCRIPT_LEVEL_MISSING_REASON \}\);\s*continue;/);
  assert.ok(at < VTR.indexOf('const hwAdvance = next && TUTOR_HOMEWORK_ADVANCE_GUARD'), 'before any applyResolvedAdvance');
});

// ── Task 14 §J: page titles visible in the embed ──
test('J: the embed board shows the current page title as a one-line header', () => {
  const WB = read('src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx');
  pin(WB, /const headerTitle = chrome === 'minimal' && pageTitleHeader \? stripLatexForTitle\(currentPage\.title\)\.trim\(\) : '';/);
  pin(WB, /\{headerTitle && \(\s*\/\/[^\n]*\n\s*<div className="shrink-0 [^"]*truncate" data-wb-page-title="1"/);
  pin(WB, /pageTitleHeader = false,/);
  const TS = read('src/app/tutor/components/session/TutorSession.tsx');
  pin(TS, /pageTitleHeader=\{TUTOR_PAGE_TITLE_HEADER && !!embedded && isFixedScriptPlan\(lessonProgress\.plan\)\}/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_PAGE_TITLE_HEADER = process\.env\.NEXT_PUBLIC_TUTOR_PAGE_TITLE_HEADER !== 'off';/);
});

// ── Task 14 §H: the last part closes the lesson ──
test('H: the last on-topic fixed-script part is due to CLOSE at its maxTurns; auto-advance stays null there', () => {
  const plan: LessonPlan = { ...fixed, segments: fixed.segments.map((sg) => (sg.id === 'recap' ? { ...sg, metadata: { maxTurns: 4 } } : sg)) as LessonPlan['segments'] };
  const base = { plan, segmentId: 'recap', overlongTurns: 3, elapsedMs: 0, levelKnown: false };
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 4 }), null);
  assert.equal(fixedScriptCloseReason({ ...base, turns: 3 }), null);
  assert.equal(fixedScriptCloseReason({ ...base, turns: 4 }), 'turns');
  assert.equal(fixedScriptCloseReason({ ...base, segmentId: 'topic-intro', turns: 99 }), null, 'not the last part');
  assert.equal(fixedScriptCloseReason({ ...base, plan: { ...plan, metadata: {} } as LessonPlan, turns: 9 }), null, 'not a fixed script');
});
test('H: the close note is the brief\'s FACT; forced after two tutor turns unless the lesson closed', () => {
  assert.ok(FIXED_SCRIPT_CLOSE_NOTE.includes("The lesson is complete. If the student's last answer was wrong or incomplete, give the correct answer in one sentence (no question). Then give the closing summary in two or three sentences and call close_session_notes in this turn; do not ask another question."));
  // Task 22 §I (GDI run 10, 1238 s): an open wrong answer is answered, not probed
  assert.ok(FIXED_SCRIPT_CLOSE_NOTE.includes('give the correct answer in one sentence'));
  assert.equal(FIXED_SCRIPT_CLOSE_GRACE_TURNS, 2);
  assert.equal(fixedScriptCloseForced(1, false), false);
  assert.equal(fixedScriptCloseForced(2, false), true);
  assert.equal(fixedScriptCloseForced(2, true), false);
});
test('H: VTR plants the close note (urgent) and force-closes through the normal close path', () => {
  pin(VTR, /pendingRuntimeNoteRef\.current = FIXED_SCRIPT_CLOSE_NOTE;\s*pendingRuntimeNoteSegRef\.current = segIdNow;\s*pendingRuntimeNoteUrgentRef\.current = true;/);
  pin(VTR, /onDebugEvent\?\.\('fixed_script_close_requested'/);
  pin(VTR, /\} else if \(closeAction === 'force'\) \{\s*lessonClosedRef\.current = true;\s*onDebugEvent\?\.\('fixed_script_close_forced'[^\n]*\n\s*noteLessonClosed\('fixed-script close forced'\);[\s\S]{0,600}?void endSessionNowRef\.current\(\{ farewell: goodbyeLine\(studentName\) \}\);/);
  // the same farewell + end call the time-box hard stop makes
  pin(VTR, /void endSessionNowRef\.current\(\{ farewell: line, reason: 'time_limit' \}\);/);
});

// ── Task 15 §D: the required-phrase kill defers on a CLIENT auto-advance transition turn ──
test('D: fixedScriptNoteDeliveredThisTurnRef — set at the FACT-note emit, reset per brain turn, read by the deferral', () => {
  pin(VTR, /const fixedScriptNoteDeliveredThisTurnRef = useRef\(false\);/);
  pin(VTR, /verdictPrecheckKillUsedRef\.current = false;\n\s*fixedScriptNoteDeliveredThisTurnRef\.current = false;/);
  pin(VTR, /if \(urgentNote\) \{\n\s*fixedScriptNoteDeliveredThisTurnRef\.current = true;\n\s*onDebugEvent\?\.\('fixed_script_note_delivered'/);
  pin(VTR, /const clientAdvanceTransition = fixedScriptNoteDeliveredThisTurnRef\.current;/);
  pin(VTR, /const deferPhraseCheck = advancedIntoSegmentThisTurn \|\| clientAdvanceTransition;/);
  pin(VTR, /\(client auto-advance transition turn\)/);
  // the check itself runs only when not deferred, and the deferral does not mark the segment checked
  pin(VTR, /segIdForPhrases &&\n\s*!deferPhraseCheck &&\n\s*!segmentRequiredPhrasesCheckedRef\.current\.has\(segIdForPhrases\)/);
  const at = VTR.indexOf('const deferPhraseCheck');
  const deferBlock = VTR.slice(at, VTR.indexOf('!deferPhraseCheck', at));
  assert.ok(!deferBlock.includes('segmentRequiredPhrasesCheckedRef.current.add'), 'deferral must not mark the segment checked');
  // reset happens before the note can be delivered in the same turn
  assert.ok(VTR.indexOf('fixedScriptNoteDeliveredThisTurnRef.current = false;') < VTR.indexOf('fixedScriptNoteDeliveredThisTurnRef.current = true;'));
});

// ── Task 18 §B: the authored card opens a part when the brain's first turn did not put it up ──
test('B: segmentNeedsAutoCard — the live level-check case and every refusal', () => {
  const live = { fixedScript: true, openingTurn: false, counterForSegment: true, turnsInSegment: 1, hasAuthoredCard: true, renderedProblemThisTurn: false, alreadyOnBoard: false, completed: false };
  assert.equal(segmentNeedsAutoCard(live), true);
  assert.equal(segmentNeedsAutoCard({ ...live, fixedScript: false }), false, 'not a fixed script');
  assert.equal(segmentNeedsAutoCard({ ...live, openingTurn: true }), false, 'opening turn');
  assert.equal(segmentNeedsAutoCard({ ...live, turnsInSegment: 2 }), false, 'second turn');
  assert.equal(segmentNeedsAutoCard({ ...live, turnsInSegment: 0 }), false, 'advanced away this turn');
  assert.equal(segmentNeedsAutoCard({ ...live, counterForSegment: false }), false, 'counter of another segment');
  assert.equal(segmentNeedsAutoCard({ ...live, hasAuthoredCard: false }), false, 'overview / concept / summary');
  assert.equal(segmentNeedsAutoCard({ ...live, renderedProblemThisTurn: true }), false, 'brain put a card up');
  assert.equal(segmentNeedsAutoCard({ ...live, alreadyOnBoard: true }), false, 'already on the board');
  assert.equal(segmentNeedsAutoCard({ ...live, completed: true }), false, 'completed');
  assert.ok(PROBLEM_CARD_TOOLS.has('show_segment_card') && PROBLEM_CARD_TOOLS.has('show_problem') && !PROBLEM_CARD_TOOLS.has('show_sentence'));
});

test('B: problemStatementOnBoard — case/punctuation-blind, a clear wipes its page, earlier pages count', () => {
  const q = '1. Can you tell me a little about your job? What do you do?';
  const card = { action: 'showProblem', problem: { statement: q } };
  assert.equal(problemStatementOnBoard([card], '1. can you tell me a little about your job what do you do'), true);
  assert.equal(problemStatementOnBoard([card, { action: 'clear' }], q), false);
  assert.equal(problemStatementOnBoard([card, { action: 'newPage' }, { action: 'showSentence', sentence: 'x y z' }], q), true);
  assert.equal(problemStatementOnBoard([{ action: 'showProblem', problem: { statement: 'Question 2' } }], q), false);
  assert.equal(problemStatementOnBoard([], ''), false);
});

test('B: VoiceTutorRealtime wires segment_card_auto (pin)', () => {
  pin(VTR, /if \(TUTOR_SEGMENT_CARD_AUTO && !opts\?\.prefetchOnly && totalSentenceCount > 0\)/);
  pin(VTR, /segmentNeedsAutoCard\(\{\n\s*fixedScript: isFixedScriptPlan\(acPlan\),\n\s*openingTurn: openingTurnPendingRef\.current,/);
  pin(VTR, /renderedProblemThisTurn: totalToolNamesSeen\.some\(\(n\) => PROBLEM_CARD_TOOLS\.has\(n\)\)/);
  pin(VTR, /alreadyOnBoard: problemStatementOnBoard\(whiteboardCommandsRef\.current/);
  pin(VTR, /catalogRef\.current\.setCurrentSegment\(acSegId\);/);
  pin(VTR, /await handleWhiteboardCommand\(\[cmd\], \{ anchorSentence: 0 \}\);\n\s*onDebugEvent\?\.\('segment_card_auto'/);
  // before the sentence board, so the part's card leads its page
  assert.ok(VTR.indexOf("onDebugEvent?.('segment_card_auto'") < VTR.indexOf("onDebugEvent?.('sentence_board_auto'"));
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_SEGMENT_CARD_AUTO = process\.env\.NEXT_PUBLIC_TUTOR_SEGMENT_CARD_AUTO !== 'off';/);
});

// ── Task 22 §A (GDI run 10, 574 s / 882 s) ───────────────────────────────
test('22A: a due budget advance on a turn ending with an ask is held one turn', () => {
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_MAX_ASK_HELD_TURNS, 1);
  assert.equal(holdAutoAdvanceForPendingAsk(true, 0), true);   // due + ends with ask + held 0 → hold
  assert.equal(holdAutoAdvanceForPendingAsk(true, 1), false);  // held 1 → advance
  assert.equal(holdAutoAdvanceForPendingAsk(false, 0), false); // no ask → advance
});
test('22A: turnEndsWithAsk — the run-10 turns', () => {
  assert.equal(turnEndsWithAsk('The robotics event introduced you to companies in China, so the past simple is right there. Could you say that in one clean sentence: "The event introduced me to…"?'), true);
  assert.equal(turnEndsWithAsk('That\'s a clear sentence, and the "about how" part is natural. Now let\'s go a step further. Could you tell me one result of that talk with the customer? Start with "As a result, the customer…".'), true);
  assert.equal(turnEndsWithAsk('Did the robotics event give you any useful contacts?'), true);
  assert.equal(turnEndsWithAsk('Good work on the past simple. That was a clear sentence.'), false);
  assert.equal(turnEndsWithAsk('Could you tell me more? Good. That is all for this part. Well done today.'), false);
  assert.equal(turnEndsWithAsk(''), false);
});
test('22A: VTR holds a due non-announced advance on an ask (pin)', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  const block = VTR.slice(auto, auto + 11500);
  pin(block, /const askPending = advanceReason !== 'announced' && turnEndsWithAsk\(fullText\);/);
  pin(block, /'fixed_script_auto_advance_held_pron'[\s\S]*?\} else if \(autoNext && holdAutoAdvanceForPendingAsk\(askPending, autoAdvanceAskHeldRef\.current\)\) \{\s*autoAdvanceAskHeldRef\.current \+= 1;\s*onDebugEvent\?\.\('fixed_script_auto_advance_held_ask', `"\$\{segIdNow\}" \$\{autoAdvanceAskHeldRef\.current\}\/\$\{FIXED_SCRIPT_AUTO_ADVANCE_MAX_ASK_HELD_TURNS\}`\);\s*\} else if \(autoNext\) \{\s*autoAdvancePronHeldRef\.current = 0;\s*autoAdvanceAskHeldRef\.current = 0;/);
});

test('22D2: the budget advance lead acknowledges a "more of this part" request; the announced lead does not', () => {
  const line = "If the student's last words asked for more of the part that just ended, say in one short sentence that the time for that part is up, then continue.";
  assert.equal(FIXED_SCRIPT_MORE_OF_PART_LEAD, line);
  assert.ok(fixedScriptAutoAdvanceLead('pronunciation', 'summary', 'recap').includes(line));
  assert.ok(!fixedScriptAnnouncedAdvanceLead('pronunciation', 'summary', 'recap').includes(line));
});

// ── Task 26 §A (GDI run 13, 475 s): part transitions — offer / bridge ──
const TR_RAW = {
  ...RAW,
  id: 'test.fixed-script-transitions',
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', metadata: { label: 'Overview', maxTurns: 2 } },
    { id: 'level-check', kind: 'misconception_check', question: 'Tell me about your work.', misconception: 'n/a', metadata: { label: 'Level check', skipWhenLevelKnown: true, maxTurns: 5, transition: { kind: 'bridge' } } },
    { id: 'part-a', kind: 'concept', goal: 'Practise A', keyIdeas: ['a'], estimatedMinutes: 2, metadata: { label: 'Part A', maxTurns: 8, transition: { kind: 'offer' } } },
    { id: 'part-b', kind: 'concept', goal: 'Practise B', keyIdeas: ['b'], estimatedMinutes: 2, metadata: { label: 'Part B', transition: { kind: 'offer' } } },
    { id: 'chat', kind: 'concept', goal: 'Talk', keyIdeas: ['c'], metadata: { label: 'Conversation', maxTurns: 4, transition: { kind: 'nope' } } },
    { id: 'recap', kind: 'recap', mustRemember: ['a'], metadata: { label: 'Summary', maxTurns: 4 } },
  ],
};
const tr: LessonPlan = parseLessonPlan(TR_RAW);
test('26A1: segmentTransitionKind — offer / bridge from metadata; absent, unknown or not a fixed script ⇒ null', () => {
  assert.equal(segmentTransitionKind(tr, 'part-a'), 'offer');
  assert.equal(segmentTransitionKind(tr, 'level-check'), 'bridge');
  assert.equal(segmentTransitionKind(tr, 'overview'), null);
  assert.equal(segmentTransitionKind(tr, 'chat'), null, 'unknown kind');
  assert.equal(segmentTransitionKind(tr, 'missing'), null);
  assert.equal(segmentTransitionKind({ ...tr, metadata: {} }, 'part-a'), null, 'not a fixed script');
  assert.equal(fixedScriptPartLabel(tr, 'part-a'), 'Part A');
  assert.equal(fixedScriptPartLabel(tr, 'missing'), 'missing');
});
test('26A2: offer part at its turn budget, no offer made ⇒ offer (no advance); the note carries both labels', () => {
  const b = { plan: tr, segmentId: 'part-a', overlongTurns: 7, elapsedMs: 0, levelKnown: true };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 8 }), 'turns');
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'turns', offerMade: false, offerHeldTurns: 0 }), 'offer');
  const note = fixedScriptOfferNote(tr, 'part-a', 'part-b');
  assert.ok(note.startsWith('[runtime note — not from the student] '));
  assert.ok(note.includes('This part ("Part A") is complete. Close it in one sentence, then ask the student whether they want ONE more practice sentence on it or to move on to "Part B". If they want one more, give exactly one and then move on; if they want to move on, or do not answer the question, move on now (call advance_lesson).'));
  assert.ok(note.endsWith('Apply this silently; never mention this note.]'));
  // generic: no grammar point / lesson named beyond the plan's own labels
  assert.ok(!/present perfect|past simple/i.test(note));
});
test('26A2: after the offer — held 2 turns (offer turn + one practice turn), then the advance; one offer per segment', () => {
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_MAX_OFFER_HELD_TURNS, 2);
  const d = (offerHeldTurns: number, reason: 'turns' | 'time' | 'announced' = 'turns') => fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason, offerMade: true, offerHeldTurns });
  assert.equal(d(0), 'hold-offer');
  assert.equal(d(1), 'hold-offer');
  assert.equal(d(2), 'advance');
  assert.equal(d(3), 'advance');
  assert.equal(holdAutoAdvanceForOffer(true, 1), true);
  assert.equal(holdAutoAdvanceForOffer(true, 2), false);
  assert.equal(holdAutoAdvanceForOffer(false, 0), false);
  // the brain's own announced move is never offered or held
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'announced', offerMade: false, offerHeldTurns: 0 }), 'advance');
  assert.equal(d(0, 'announced'), 'advance');
});
test('26A2: a time-based budget behaves the same as turns', () => {
  const b = { plan: tr, segmentId: 'part-b', overlongTurns: 6, levelKnown: true };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 2, elapsedMs: 180_000 }), 'time');
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-b', reason: 'time', offerMade: false, offerHeldTurns: 0 }), 'offer');
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-b', reason: 'time', offerMade: true, offerHeldTurns: 1 }), 'hold-offer');
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-b', reason: 'time', offerMade: true, offerHeldTurns: 2 }), 'advance');
});
test('26A2: bridge part ⇒ advance (no hold) with the bridge clause in the lead; no transition ⇒ unchanged', () => {
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'level-check', reason: 'turns', offerMade: false, offerHeldTurns: 0 }), 'advance');
  const clause = fixedScriptBridgeClause(tr, 'level-check', 'part-a');
  assert.equal(clause, ' Before the new part\'s first question, say in one sentence what you learned about the student in "Level check" (their level / their job / their answers — whatever that part gathered), then start "Part A".');
  const note = fixedScriptAdvancedNote(fixedScriptAutoAdvanceLead('level-check', 'part-a', 'try_yourself') + clause, 'part-a');
  assert.ok(note.includes('(try_yourself). ' + FIXED_SCRIPT_MORE_OF_PART_LEAD + clause + ' Reply to the student\'s last answer'));
  // no transition / offer part / not a fixed script ⇒ no clause, decision 'advance'
  assert.equal(fixedScriptBridgeClause(tr, 'overview', 'level-check'), '');
  assert.equal(fixedScriptBridgeClause(tr, 'part-a', 'part-b'), '');
  assert.equal(fixedScriptBridgeClause({ ...tr, metadata: {} }, 'level-check', 'part-a'), '');
  for (const seg of ['overview', 'chat']) {
    assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: seg, reason: 'turns', offerMade: false, offerHeldTurns: 0 }), 'advance');
  }
  assert.equal(fixedScriptTransitionDecision({ plan: { ...tr, metadata: {} }, segmentId: 'part-a', reason: 'turns', offerMade: false, offerHeldTurns: 0 }), 'advance');
});
test('26A: VTR wiring — offer planted (urgent FACT) instead of the advance, held n/2, bridge clause on both advance leads (pins)', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  const block = VTR.slice(auto, auto + 15000);
  pin(block, /const transition = TUTOR_FIXED_SCRIPT_TRANSITIONS\s*\? fixedScriptTransitionDecision\(\{\s*plan: autoPlan, segmentId: segIdNow, reason: advanceReason,\s*offerMade: transitionOfferMadeRef\.current\.has\(segIdNow \?\? ''\),\s*offerHeldTurns: autoAdvanceOfferHeldRef\.current,/);
  // order: pronunciation hold → offer → offer hold → ask hold → advance
  pin(block, /'fixed_script_auto_advance_held_pron'[\s\S]{0,900}?\} else if \(autoNext && segIdNow && transition === 'offer'\) \{\s*\/\/ The offer note replaces[\s\S]*?transitionOfferMadeRef\.current\.add\(segIdNow\);\s*\/\/[^\n]*\n\s*autoAdvanceOfferHeldRef\.current = FIXED_SCRIPT_OFFER_HELD_AT_PLANT;[\s\S]*?fixedScriptOfferNote\(autoPlan, segIdNow, autoNext\),\s*\);\s*pendingRuntimeNoteRef\.current = merged\.note;\s*pendingRuntimeNoteSegRef\.current = merged\.segId;\s*pendingRuntimeNoteUrgentRef\.current = true;\s*runtimeNoteHeldTurnsRef\.current = 0;\s*onDebugEvent\?\.\('fixed_script_offer_planted', `"\$\{segIdNow\}" → "\$\{autoNext\}"`\);\s*\} else if \(autoNext && transition === 'await-offer'\) \{[\s\S]*?\} else if \(autoNext && transition === 'hold-offer'\) \{\s*\/\/[^\n]*\n\s*if \(!offerSpokenThisTurn && !offerRuntimeTurn\) autoAdvanceOfferHeldRef\.current \+= 1;\s*onDebugEvent\?\.\('fixed_script_offer_hold', `"\$\{segIdNow\}" \$\{autoAdvanceOfferHeldRef\.current\}\/\$\{FIXED_SCRIPT_AUTO_ADVANCE_MAX_OFFER_HELD_TURNS\}`\);\s*\} else if \(autoNext && holdAutoAdvanceForPendingAsk\(/);
  pin(block, /autoAdvanceAskHeldRef\.current = 0;\s*autoAdvanceOfferHeldRef\.current = 0;\s*const autoTurns = cur\.turns;/);
  pin(block, /: fixedScriptAutoAdvanceLead\(segIdNow, autoNext, autoKind\)\) \+[^\n]*\n\s*\/\/[^\n]*\n\s*\(TUTOR_FIXED_SCRIPT_TRANSITIONS \? fixedScriptBridgeClause\(autoPlan, segIdNow, autoNext\) : ''\) \+\s*\/\/[^\n]*\n\s*\(TUTOR_TRANSITION_ASK_EVERY_ADVANCE \? fixedScriptChoiceMenuClause\(segmentCardStatement\(autoPlan, autoNext\)\) : ''\),\s*autoNext,/);
  pin(VTR, /fixedScriptAdvancedNote\(fixedScriptLevelAdvanceLead\(lvNext, lvKind\) \+ \(TUTOR_FIXED_SCRIPT_TRANSITIONS \? fixedScriptBridgeClause\(lvPlan, lvFrom, lvNext\) : ''\) \+ \(TUTOR_TRANSITION_ASK_EVERY_ADVANCE \? fixedScriptChoiceMenuClause\(segmentCardStatement\(lvPlan, lvNext\)\) : ''\), lvNext\),/);
  // the offer counter resets when the turn counter moves to a new segment
  pin(VTR, /if \(st\.segId !== segIdNow\) \{ turnsInSegmentRef\.current = \{ segId: segIdNow, turns: 0, noted: false, startedAt: Date\.now\(\) \}; autoAdvanceOfferHeldRef\.current = 0; \}/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_FIXED_SCRIPT_TRANSITIONS = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_TRANSITIONS !== 'off';/);
  // the new events are persisted for embed sessions by the 'fixed_script_' prefix
  pin(read('src/app/tutor-portal/embed/page.tsx'), /'fixed_script_',/);
});
test('26A3: the GDI plan carries the four transitions; the other parts none', () => {
  const plan = JSON.parse(readFileSync(join(__dirname, '..', '..', '..', 'docs/whitelabel/gdi/plans/gdi-work-projects-v1.json'), 'utf8')) as { segments: Array<{ id: string; metadata?: { transition?: { kind: string } } }> };
  const kinds = Object.fromEntries(plan.segments.map((sg) => [sg.id, sg.metadata?.transition?.kind ?? null]));
  assert.deepEqual(kinds, {
    overview: null, 'level-check': 'bridge', 'topic-intro': 'bridge', 'present-perfect': 'offer', 'past-simple': 'offer',
    'open-conversation': null, pronunciation: null, summary: null,
  });
});

// ── Task 26 §B (GDI run 13, 1338–1435 s): a softer forced close ──
test('26B2: fixedScriptCloseForced — recap waits 3 tutor turns; other kinds 2', () => {
  assert.equal(FIXED_SCRIPT_CLOSE_RECAP_GRACE_TURNS, 3);
  assert.equal(fixedScriptCloseForced(2, false, 'recap'), false);
  assert.equal(fixedScriptCloseForced(3, false, 'recap'), true);
  assert.equal(fixedScriptCloseForced(3, true, 'recap'), false);
  assert.equal(fixedScriptCloseForced(2, false, 'Recap'), false);
  for (const k of ['concept', 'extension', 'try_yourself', '']) assert.equal(fixedScriptCloseForced(2, false, k), true, k);
  assert.equal(fixedScriptCloseForced(1, false, 'concept'), false);
});
test('26B1: fixedScriptCloseForcedAction — a question ⇒ wrap-turn; no question ⇒ force; wrap already run ⇒ force; not due ⇒ none', () => {
  const q = 'Great. Now, can you say which of the two sentences means you still work there?';
  const b = { turnsSince: 3, lessonClosed: false, kind: 'recap', wrapRun: false };
  assert.equal(fixedScriptCloseForcedAction({ ...b, tutorText: q }), 'wrap-turn');
  assert.equal(fixedScriptCloseForcedAction({ ...b, tutorText: 'Tell me one thing you did last week.' }), 'wrap-turn', 'an imperative ask');
  assert.equal(fixedScriptCloseForcedAction({ ...b, tutorText: 'Well done today. You used both tenses clearly.' }), 'force');
  assert.equal(fixedScriptCloseForcedAction({ ...b, tutorText: '' }), 'force');
  assert.equal(fixedScriptCloseForcedAction({ ...b, tutorText: q, wrapRun: true }), 'force');
  assert.equal(fixedScriptCloseForcedAction({ ...b, turnsSince: 2, tutorText: q }), 'none', 'recap: not due at 2');
  assert.equal(fixedScriptCloseForcedAction({ ...b, kind: 'concept', turnsSince: 2, tutorText: q }), 'wrap-turn');
  assert.equal(fixedScriptCloseForcedAction({ ...b, lessonClosed: true, tutorText: q }), 'none');
});
test('26B1: the wrap directive (brief text) and the poll — carried by the next turn, fired after the quiet window; the 45 s bound overrides only a stale speech state', () => {
  assert.equal(FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE, "[Wrap now — not from the student] Reply to the student's last answer in one sentence, then say goodbye in one sentence and call close_session_notes. No new question. Apply this silently; never mention this note.");
  assert.equal(FIXED_SCRIPT_CLOSE_WRAP_MAX_MS, 45_000);
  assert.ok(FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS <= 30_000 && FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS < FIXED_SCRIPT_CLOSE_WRAP_MAX_MS);
  const p = { elapsedMs: 1000, quietMs: 1000, ended: false, turnSeqChanged: false, brainBusy: false, studentActive: false, suspended: false };
  assert.equal(closeWrapPollDecision(p), 'wait');
  assert.equal(closeWrapPollDecision({ ...p, turnSeqChanged: true }), 'carried');
  assert.equal(closeWrapPollDecision({ ...p, ended: true, turnSeqChanged: true }), 'drop');
  assert.equal(closeWrapPollDecision({ ...p, quietMs: FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS, elapsedMs: FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS }), 'fire');
  assert.equal(closeWrapPollDecision({ ...p, quietMs: FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS, studentActive: true }), 'wait');
  assert.equal(closeWrapPollDecision({ ...p, quietMs: FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS, suspended: true }), 'wait');
  assert.equal(closeWrapPollDecision({ ...p, quietMs: 0, elapsedMs: 45_000 }), 'fire', 'the bound');
  assert.equal(closeWrapPollDecision({ ...p, quietMs: 0, elapsedMs: 45_000, brainBusy: true }), 'wait');
});
test('26B: VTR wiring — the close check passes the kind and the turn text; wrap arms the note + poller; force unchanged (pins)', () => {
  pin(VTR, /const closeKind = \(lessonPlanRef\.current\?\.segments\.find\(\(sg\) => sg\.id === fc\.segId\)\?\.kind \?\? ''\)\.toLowerCase\(\);\s*const closeAction = fixedScriptCloseForcedAction\(\{\s*turnsSince: fc\.turnsSince,\s*lessonClosed: lessonClosedRef\.current,\s*kind: closeKind,\s*tutorText: fullText,\s*wrapRun: !TUTOR_FIXED_SCRIPT_CLOSE_WRAP \|\| fc\.wrapRun === true,\s*\}\);/);
  pin(VTR, /if \(closeAction === 'wrap-turn'\) \{\s*fc\.wrapRun = true;[\s\S]{0,200}?FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE\}`\s*: FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE;\s*pendingRuntimeNoteSegRef\.current = fc\.segId;\s*pendingRuntimeNoteUrgentRef\.current = true;\s*runtimeNoteHeldTurnsRef\.current = 0;\s*onDebugEvent\?\.\('fixed_script_close_wrap_armed'[^\n]*\n\s*scheduleFixedScriptCloseWrapRef\.current\(fc\.segId\);\s*\} else if \(closeAction === 'force'\) \{/);
  // the poller: quiet window ⇒ the note becomes the synthetic turn; a turn first ⇒ carried
  pin(VTR, /if \(decision === 'carried'\) \{ onDebugEvent\?\.\('fixed_script_close_wrap_turn', `"\$\{segId\}" via=next turn/);
  pin(VTR, /onDebugEvent\?\.\('fixed_script_close_wrap_turn', `"\$\{segId\}" via=silence waited=\$\{now - armedAt\}ms`\);\s*void handleStudentTranscriptForBrainRef\.current\?\.\(FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE, \{ silent: true, bypassPerceptionDedupe: true \}\);/);
  pin(VTR, /if \(pendingRuntimeNoteRef\.current === FIXED_SCRIPT_CLOSE_WRAP_DIRECTIVE\) \{\s*pendingRuntimeNoteRef\.current = null;/);
  pin(VTR, /\/\/ Task 26 §B1: the close wrap-turn poller\.\s*if \(closeWrapTimerRef\.current\) \{\s*clearTimeout\(closeWrapTimerRef\.current\);/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_FIXED_SCRIPT_CLOSE_WRAP = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_CLOSE_WRAP !== 'off';/);
  // B3: the time-box hard stop is untouched
  pin(VTR, /void endSessionNowRef\.current\(\{ farewell: line, reason: 'time_limit' \}\);/);
});

// ── Task 26 fix round 1 ──
// Walks the VTR branch order for one due segment, turn by turn, with the
// component's counter rules (plant ⇒ FIXED_SCRIPT_OFFER_HELD_AT_PLANT,
// hold ⇒ +1). Returns the decision at the end of each tutor turn.
function walkOffer(turns: number, reason: 'turns' | 'time' = 'turns'): string[] {
  let offerMade = false;
  let held = 0;
  const out: string[] = [];
  for (let t = 0; t < turns; t++) {
    const d = fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason, offerMade, offerHeldTurns: held });
    out.push(d);
    if (d === 'offer') { offerMade = true; held = FIXED_SCRIPT_OFFER_HELD_AT_PLANT; }
    else if (d === 'hold-offer') held += 1;
    else break;
  }
  return out;
}
test('26 I-1: plant → offer turn (held) → practice turn ⇒ advance — two tutor turns after the plant', () => {
  assert.equal(FIXED_SCRIPT_OFFER_HELD_AT_PLANT, 1);
  assert.deepEqual(walkOffer(6), ['offer', 'hold-offer', 'advance']);
  assert.deepEqual(walkOffer(6, 'time'), ['offer', 'hold-offer', 'advance']);
  // the VTR events read n/2: the one hold event shows 2/2
});

test('26 I-2a: the overlong note yields to an offer part with no offer made (helper + VTR pin, before the plant)', () => {
  assert.equal(overlongNoteYieldsToOffer(tr, 'part-a', false), true);
  assert.equal(overlongNoteYieldsToOffer(tr, 'part-a', true), false);
  assert.equal(overlongNoteYieldsToOffer(tr, 'level-check', false), false, 'bridge part');
  assert.equal(overlongNoteYieldsToOffer(tr, 'overview', false), false);
  assert.equal(overlongNoteYieldsToOffer({ ...tr, metadata: {} }, 'part-a', false), false, 'not a fixed script');
  pin(VTR, /if \(TUTOR_SEGMENT_OVERLONG_NOTE && TUTOR_FIXED_SCRIPT_TRANSITIONS && !cur\.noted && cur\.turns >= overlongTurns\s*&& overlongNoteYieldsToOffer\(lessonPlanRef\.current, segIdNow, transitionOfferMadeRef\.current\.has\(segIdNow \?\? ''\)\)\) \{\s*cur\.noted = true;\s*onDebugEvent\?\.\('segment_overlong_note_skipped_offer'/);
  assert.ok(VTR.indexOf("'segment_overlong_note_skipped_offer'") < VTR.indexOf("'segment_overlong_note_planted'"));
  // persisted for embed sessions by the 'segment_overlong' prefix
  pin(read('src/app/tutor-portal/embed/page.tsx'), /'segment_overlong',/);
});
test('26 I-2b: a move announced on the budget turn of an offer part advances with no offer', () => {
  // VTR: the announced target is consulted on a due offer part, and wins
  pin(VTR, /const offerPartDue = !!autoReason && TUTOR_FIXED_SCRIPT_TRANSITIONS && segmentTransitionKind\(autoPlan, segIdNow\) === 'offer';/);
  pin(VTR, /const advanceReason: 'turns' \| 'time' \| 'announced' \| null = \(offerPartDue && announcedNext \? 'announced' : autoReason\)/);
  // …and an 'announced' reason is never offered (budget turn: no offer made yet)
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'announced', offerMade: false, offerHeldTurns: 0 }), 'advance');
});

test('26 m-1: the pronunciation hold does not stack on a made offer (pin)', () => {
  pin(VTR, /const offerMadeHere = TUTOR_FIXED_SCRIPT_TRANSITIONS && transitionOfferMadeRef\.current\.has\(segIdNow \?\? ''\);\s*if \(autoNext && !offerMadeHere && holdAutoAdvanceForPronunciation\(/);
});

// Task 27 §I (Task 26 concern 2): leaving a bridge part, the level continuation carries the bridge, not "do not recap".
test('27I: level continuation — bridge segment ⇒ the bridge wording, no "do not recap"; no transition ⇒ unchanged', () => {
  const b = fixedScriptContinueDirective({ via: 'level', plan: tr, from: 'level-check', next: 'part-a' });
  assert.equal(b.kind, 'bridge');
  assert.equal(b.directive, '[System note: the level check is complete and the lesson pointer has moved to the next part; begin that part now from its notes — say one sentence on what you learned about the student in "Level check", then start "Part A" with its first question or card. Apply this silently; never mention this note.]');
  assert.ok(!/do not recap/i.test(b.directive));
  assert.ok(isFixedScriptContinueDirective(b.directive), 'the continuation does not cancel itself');
  for (const from of ['overview', 'part-a']) {
    const u = fixedScriptContinueDirective({ via: 'level', plan: tr, from, next: 'part-b' });
    assert.equal(u.directive, FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE, from);
    assert.equal(u.kind, 'level');
  }
  assert.equal(fixedScriptContinueDirective({ via: 'level', plan: null, from: 'level-check', next: 'part-a' }).directive, FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE, 'transitions flag off ⇒ no plan');
  assert.equal(fixedScriptContinueDirective({ via: 'level', plan: { ...tr, metadata: {} }, from: 'level-check', next: 'part-a' }).directive, FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE, 'not a fixed script');
  pin(VTR, /levelAdvanceThisTurnRef\.current = lvNext;\s*levelAdvanceFromThisTurnRef\.current = lvFrom;/);
  pin(VTR, /const lvFromForCont = levelAdvanceFromThisTurnRef\.current;/);
});

// Task 27 §C (GDI run 14, Image 47): the chip strip follows the displayed part page, not the pointer.
test('27C: displayedSegmentId — pending page ⇒ the previous part; after the flush ⇒ the pointer; no pending page ⇒ the pointer', () => {
  assert.equal(displayedSegmentId({ pointer: 'open-conversation', pendingPageFor: 'open-conversation', flushed: false, previous: 'past-simple' }), 'past-simple');
  assert.equal(displayedSegmentId({ pointer: 'open-conversation', pendingPageFor: 'open-conversation', flushed: true, previous: 'past-simple' }), 'open-conversation');
  assert.equal(displayedSegmentId({ pointer: 'open-conversation', pendingPageFor: null, flushed: false, previous: 'past-simple' }), 'open-conversation');
  assert.equal(displayedSegmentId({ pointer: 'summary', pendingPageFor: 'open-conversation', flushed: false, previous: 'past-simple' }), 'summary', 'the pointer moved past the pending page');
  assert.equal(displayedSegmentId({ pointer: 'open-conversation', pendingPageFor: 'open-conversation', flushed: false, previous: '' }), 'open-conversation', 'nothing displayed before');
  assert.deepEqual(displayedCompletedSegments(['level-check', 'past-simple'], 'past-simple', 'open-conversation'), ['level-check']);
  assert.deepEqual(displayedCompletedSegments(['level-check', 'past-simple'], 'open-conversation', 'open-conversation'), ['level-check', 'past-simple']);
  const rail = buildRailModel(fixed, displayedSegmentId({ pointer: 'topic-intro', pendingPageFor: 'topic-intro', flushed: false, previous: 'level-check' }), new Set(displayedCompletedSegments(['overview', 'level-check'], 'level-check', 'topic-intro')), null);
  assert.ok(rail && rail.items.some((it) => it.current && it.segIds.includes('level-check') && !it.done), JSON.stringify(rail?.items));
  // wiring: held at the deferred advance, released when the break paints; the chips read the displayed segment
  pin(VTR, /if \(TUTOR_RAIL_FOLLOWS_PAGE && segShownBefore && segShownBefore !== next\) \{/);
  pin(VTR, /if \(displayHoldBreakRef\.current && commands\.includes\(displayHoldBreakRef\.current\)\) releaseDisplayHoldRef\.current\('its page painted'\);/);
  pin(VTR, /displayHoldBreakRef\.current = segmentBreakCmd;/);
  pin(VTR, /displayHoldBreakRef\.current = pageCmds\[0\]!;\s*onWhiteboardCommand\(pageCmds\);/);
  pin(VTR, /displayedSegmentId: displayedSegmentId\(\{ pointer: activeSegmentId, pendingPageFor: displayHold\?\.forSeg \?\? null, flushed: !displayHold, previous: displayHold\?\.shown \?\? '' \}\),/);
  const TS = read('src/app/tutor/components/session/TutorSession.tsx');
  pin(TS, /const chipSegmentId = lessonProgress\.displayedSegmentId \?\? lessonProgress\.currentSegmentId \?\? '';/);
  pin(TS, /buildRailModel\(lessonProgress\.plan, chipSegmentId,\s*new Set\(chipCompletedIds\)/);
});

// Task 27 §E2 (GDI run 14, 958 s): the advance lead into a choice-menu part says so.
test('27E2: choice-menu card → the menu clause in the lead; a plain question card → absent', () => {
  const MENU = 'Would you like to practice your pronunciation? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.';
  assert.equal(FIXED_SCRIPT_CHOICE_MENU_CLAUSE, " The new part's card is a choice menu. Read the choices, ask the student to pick one, and wait for their choice. Nothing else is on the board yet.");
  assert.equal(fixedScriptChoiceMenuClause(MENU), FIXED_SCRIPT_CHOICE_MENU_CLAUSE);
  assert.equal(fixedScriptChoiceMenuClause({ statement: 'Pick one.', hasChoices: true }), FIXED_SCRIPT_CHOICE_MENU_CLAUSE);
  assert.equal(fixedScriptChoiceMenuClause('Did you attend any business events last year?'), '');
  assert.equal(fixedScriptChoiceMenuClause(''), '');
  const lead = fixedScriptAutoAdvanceLead('open-conversation', 'pronunciation', 'try_yourself') + fixedScriptChoiceMenuClause(MENU);
  assert.ok(fixedScriptAdvancedNote(lead, 'pronunciation').includes('Nothing else is on the board yet. Reply to the student'));
});

// ── Task 29 §A: the offer is actually made ──────────────────────────────
test('29A1: offerAsked — an ask naming one-more AND the move; a bare repeat ask or a statement is no offer', () => {
  assert.equal(offerAsked('Great job. Would you like one more practice sentence on it, or move on to the past simple?'), true);
  assert.equal(offerAsked('Nice work. Do you want one more practice sentence on it, or shall we move on to "Part B"?'), true);
  assert.equal(offerAsked('Can you say that once more?'), false, 'repeat ask, no move');
  assert.equal(offerAsked("Let's move on to the past simple."), false, 'no ask');
  assert.equal(offerAsked('We can do another one or go on next time.'), false, 'statement');
  assert.equal(offerAsked('もう一つ練習しますか、それとも次に進みますか？'), true);
  assert.equal(offerAsked(''), false);
});
test('29A2: decision — planted-not-spoken ⇒ await-offer; spoken + held < 2 ⇒ hold-offer; spoken + 2 ⇒ advance', () => {
  const d = (offerSpoken: boolean, offerHeldTurns: number, offerDeclined = false) =>
    fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'turns', offerMade: true, offerHeldTurns, offerSpoken, offerDeclined });
  assert.equal(d(false, 0), 'await-offer');
  assert.equal(d(false, 5), 'await-offer', 'the hold has not started');
  assert.equal(d(true, FIXED_SCRIPT_OFFER_HELD_AT_PLANT), 'hold-offer', 'the spoken turn is hold turn 1');
  assert.equal(d(true, 2), 'advance');
  // not made yet ⇒ offer; announced ⇒ advance; offerSpoken absent ⇒ pre-Task-29 behaviour
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'turns', offerMade: false, offerHeldTurns: 0, offerSpoken: false }), 'offer');
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'announced', offerMade: true, offerHeldTurns: 0, offerSpoken: false }), 'advance');
  assert.equal(fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'turns', offerMade: true, offerHeldTurns: 1 }), 'hold-offer');
});
test('29A4: after the spoken offer — a decline / move-on order ⇒ advance at the next turn end; "one more / yes" ⇒ the 2-turn hold (one practice turn)', () => {
  const d = (offerHeldTurns: number, student: string) =>
    fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'turns', offerMade: true, offerHeldTurns, offerSpoken: true, offerDeclined: offerDeclined(student) });
  for (const no of ['No.', 'No, thanks.', "That's enough.", 'Skip.', "Let's move on.", 'Um, no thank you.', 'Next part, please.', "I'm fine."]) {
    assert.equal(offerDeclined(no), true, no);
    assert.equal(d(1, no), 'advance', no);
  }
  for (const more of ['One more, please.', 'Yes.', 'Yes, one more.', 'No, one more please.', 'Sure, another one.']) {
    assert.equal(offerDeclined(more), false, more);
    assert.equal(d(1, more), 'hold-offer', more);
  }
  assert.equal(d(2, 'Yes.'), 'advance', 'the practice turn spent ⇒ advance');
  assert.equal(offerDeclined('No, I think the answer is "have been".'), false, 'an answer, not a decline');
  assert.equal(offerDeclined('[runtime: the student is silent]'), false);
});
test('29A3: validator decision — offer pending + no offer + not announced / no advance ⇒ kill once, then unmade', () => {
  const base = { offerPending: true, text: 'Yes, you have presented at an international meeting.', announcedMove: false, calledAdvance: false, alreadyRetried: false };
  assert.equal(transitionOfferValidatorDecision(base), 'kill');
  assert.equal(transitionOfferValidatorDecision({ ...base, alreadyRetried: true }), 'unmade');
  assert.equal(transitionOfferValidatorDecision({ ...base, announcedMove: true }), 'ok');
  assert.equal(transitionOfferValidatorDecision({ ...base, calledAdvance: true }), 'ok');
  assert.equal(transitionOfferValidatorDecision({ ...base, offerPending: false }), 'ok');
  assert.equal(transitionOfferValidatorDecision({ ...base, text: 'Good. Would you like one more practice sentence, or move on to "Part B"?' }), 'spoken');
  const reason = fixedScriptOfferMissingReason(tr, 'part-a', 'part-b');
  assert.ok(reason.startsWith('Reply to what the student just said in ONE sentence (answer a question or a correction first), then ask the student whether they want one more practice item on "Part A" or to move on to "Part B". End the turn with that question.'));
  assert.ok(reason.endsWith('Apply this silently; never mention this note.'));
});
test('29A: VTR wiring — validator kill + retry, spoken event, hold from the spoken offer, await branch (pins)', () => {
  assert.ok(VTR.includes("rejectionsThisAttempt.push({ action: 'transition_offer_missing', reason: fixedScriptOfferMissingReason(toPlan, toSeg, toNext) });"));
  assert.ok(VTR.includes("onDebugEvent?.('transition_offer_missing', `\"${attemptText.slice(0, 60)}\"`);"));
  assert.ok(VTR.includes("onDebugEvent?.('fixed_script_offer_unmade',"));
  assert.ok(VTR.includes("onDebugEvent?.('fixed_script_offer_spoken', `\"${offerSeg}\"`);"));
  assert.ok(VTR.includes('if (!offerSpokenThisTurn && !offerRuntimeTurn) autoAdvanceOfferHeldRef.current += 1;'));
  assert.ok(VTR.includes("} else if (autoNext && transition === 'await-offer') {"));
  assert.ok(VTR.includes('offerDeclined: !offerSpokenThisTurn && offerDeclined(transcript),'));
  assert.ok(readFileSync(join(__dirname, '..', 'src/app/tutor-portal/embed/page.tsx'), 'utf8').includes("'transition_offer_missing',"));
});

test('29 r1 I-1: transition_ask_off_part skips the offer turn (pointer unchanged + offer planted, or the attempt offers)', () => {
  const offer = 'Good. Would you like one more practice sentence on "Present perfect", or to move on to "Past simple"?';
  // why: the canonical offer is "off" the old part's card by the token rule
  assert.equal(askOffNewPart(offer, 'Have you worked for your current company for a long time?'), true);
  assert.equal(offerAsked(offer), true);
  assert.ok(VTR.includes("const taOfferTurn = TUTOR_TRANSITION_OFFER_SPOKEN && currentSegmentIdRef.current === turnStartSegmentId\n          && (transitionOfferMadeRef.current.has(turnStartSegmentId ?? '') || offerAsked(attemptText));"));
  assert.ok(VTR.includes('if (!attemptKilled && !transitionAskRejected && attemptText && !taOfferTurn'));
});
test('29 r1 I-2: an offer on the budget turn itself is SPOKEN at once — no note planted', () => {
  assert.equal(offerAsked('Nice. Would you like one more practice sentence, or move on to the past simple?'), true);
  pin(VTR, /\} else if \(autoNext && segIdNow && transition === 'offer' && TUTOR_TRANSITION_OFFER_SPOKEN && offerAsked\(fullText\)\) \{[\s\S]{0,400}?transitionOfferMadeRef\.current\.add\(segIdNow\);\s*transitionOfferSpokenRef\.current\.add\(segIdNow\);\s*transitionOfferSpokenAtRef\.current\.set\(segIdNow, Date\.now\(\)\);\s*autoAdvanceOfferHeldRef\.current = FIXED_SCRIPT_OFFER_HELD_AT_PLANT;\s*onDebugEvent\?\.\('fixed_script_offer_spoken', `"\$\{segIdNow\}" \(on the budget turn\)`\);\s*\} else if \(autoNext && segIdNow && transition === 'offer'\) \{/);
});

// ── Task 30 §A2: the hold runs on student turns; a wait cap ─────────────
test('30A2: held 2 + runtime turn ⇒ hold-offer; held 2 + student turn ⇒ advance; spoken 160 s ago ⇒ advance', () => {
  const now = 10_000_000;
  const d = (offerHeldTurns: number, studentTurn: boolean, spokenAgoMs: number) =>
    fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'turns', offerMade: true, offerHeldTurns, offerSpoken: true, offerDeclined: false, studentTurn, offerSpokenAtMs: now - spokenAgoMs, nowMs: now });
  assert.equal(d(2, false, 40_000), 'hold-offer', 'a nudge / nag turn never spends the hold');
  assert.equal(d(2, true, 40_000), 'advance');
  assert.equal(d(1, true, 40_000), 'hold-offer');
  assert.equal(d(2, false, 160_000), 'advance', 'the wait cap');
  assert.equal(d(1, false, 160_000), 'advance', 'the cap wins over the held turns');
  assert.equal(FIXED_SCRIPT_OFFER_MAX_WAIT_MS, 150_000);
  assert.equal(offerWaitExpired(now - 150_000, now), true);
  assert.equal(offerWaitExpired(now - 149_999, now), false);
  assert.equal(offerWaitExpired(null, now), false);
});
test('30A2: VTR wiring — runtime turns do not count; spoken-at stamped; the expiry event (pins)', () => {
  assert.ok(VTR.includes("const offerRuntimeTurn = /^\\s*\\[/.test(transcript);"));
  assert.ok(VTR.includes('studentTurn: !offerRuntimeTurn,'));
  assert.ok(VTR.includes("offerSpokenAtMs: offerAccept?.at ?? transitionOfferSpokenAtRef.current.get(segIdNow ?? '') ?? null,"));
  assert.equal((VTR.match(/transitionOfferSpokenAtRef\.current\.set\(/g) ?? []).length >= 3, true);
  assert.ok(VTR.includes("onDebugEvent?.('fixed_script_offer_wait_expired',"));
});

// ── Task 30 §B1: "one more" accepted ⇒ one NEW item, then the move ──────
test('30B1: offerAccepted — one more / もう一回 accept; a move-on wins', () => {
  assert.equal(offerAccepted('Yes, one more practice.'), true);
  assert.equal(offerAccepted("Let's move on"), false);
  assert.equal(offerAccepted('one more, then move on'), false, 'decline wins');
  assert.equal(offerAccepted('もう一回'), true);
  assert.equal(offerAccepted('Practice, please.'), true);
  assert.equal(offerAccepted('Summary.'), false);
  assert.equal(offerAccepted('[runtime note] one more'), false);
});
// ── Task 30 fix round 4 R3-5: a bare affirmative accepts the offer ──────
test('R3-5: offerAccepted — a bare "Yes." accepts; "Yes, let\'s move on." and "No." decline', () => {
  assert.equal(offerAccepted('Yes.'), true);
  assert.equal(offerAccepted("Yes, let's move on."), false);
  assert.equal(offerAccepted('No.'), false);
  for (const yes of ['Yeah', 'OK', 'Okay.', 'Sure!', 'Yep.', 'はい。', 'うん', 'Yes, please.', 'OK, sure.']) assert.equal(offerAccepted(yes), true, yes);
  for (const no of ['Yes, next.', 'OK, I see what you mean.', 'I see.', 'Yes I think so too.']) assert.equal(offerAccepted(no), false, no);
});
test('30B1: the accepting turn and the next student turn hold; the turn after advances', () => {
  const d = (offerAcceptedStudentTurns: number | null, offerHeldTurns = 2) =>
    fixedScriptTransitionDecision({ plan: tr, segmentId: 'part-a', reason: 'turns', offerMade: true, offerHeldTurns, offerSpoken: true, offerDeclined: false, studentTurn: true, offerAcceptedStudentTurns });
  assert.equal(FIXED_SCRIPT_OFFER_ACCEPTED_HOLD_TURNS, 2);
  assert.equal(d(0), 'hold-offer', 'the accepting turn');
  assert.equal(d(1), 'hold-offer', 'the answer to the new item');
  assert.equal(d(2), 'advance');
  assert.equal(d(null), 'advance', 'not accepted ⇒ as before');
});
test('30B1: the accepted note (pin) and the VTR wiring', () => {
  assert.equal(fixedScriptOfferAcceptedNote(tr, 'part-a', 'part-b'),
    '[runtime note — not from the student] The student wants ONE more item on "Part A". Ask ONE new question on this point that you have not asked in this lesson — spoken in full and written with handwrite — not the question already on the board. When they have answered and you have corrected it, close the part in one sentence and move on to "Part B" (call advance_lesson) without offering again. Apply this silently; never mention this note.]');
  assert.ok(VTR.includes('runTranscript = `${fixedScriptOfferAcceptedNote(oaPlan, oaSeg, oaNext)}\\n\\n${runTranscript}`;'));
  assert.ok(VTR.includes("onDebugEvent?.('fixed_script_offer_accepted',"));
  assert.ok(VTR.includes('if (offerAccept && !offerRuntimeTurn && !opts?.prefetchOnly) offerAccept.studentTurns += 1;'));
  assert.ok(VTR.includes('offerAcceptedStudentTurns: offerAccept ? offerAccept.studentTurns : null,'));
});

// ── Task 30 §D1: a missing offer after heard sentences ⇒ a continuation, not a kill ──
test('30D1: validator decision — heard ≥ 1 ⇒ continue; heard 0 ⇒ kill; after the retry ⇒ unmade', () => {
  const d = (heardSentences: number, alreadyRetried = false) => transitionOfferValidatorDecision({
    offerPending: true, text: 'Met the suppliers from China, nice. "I met the suppliers from China" is correct.', announcedMove: false, calledAdvance: false, alreadyRetried, heardSentences,
  });
  // fix round 1 (I-3): an attempt that asked the student something ⇒ kill + retry, never a stacked continuation
  const dAsk = (text: string) => transitionOfferValidatorDecision({ offerPending: true, text, announcedMove: false, calledAdvance: false, alreadyRetried: false, heardSentences: 3 });
  assert.equal(dAsk('Good, that is correct past simple. Tell me one more thing about a past event: what did you do on your last trip?'), 'kill');
  assert.equal(dAsk('Nice. Please say it once more: "I met the suppliers from China."'), 'kill');
  assert.equal(dAsk('Good, that is correct past simple for a finished trip.'), 'continue');
  assert.equal(attemptAsksStudent('Tell me about your trip.'), true);
  assert.equal(attemptAsksStudent('That is correct.'), false);
  assert.equal(d(3), 'continue');
  assert.equal(d(1), 'continue');
  assert.equal(d(0), 'kill');
  assert.equal(d(3, true), 'unmade');
  assert.equal(transitionOfferValidatorDecision({ offerPending: true, text: 'Would you like one more practice item, or shall we move on?', announcedMove: false, calledAdvance: false, alreadyRetried: false, heardSentences: 2 }), 'spoken');
});
test('30D1: the offer continuation directive (pin), recognised as a continuation; via offer', () => {
  const dir = fixedScriptOfferContinueDirective(tr, 'part-a', 'part-b');
  assert.equal(dir, '[System note: Ask the student, in ONE sentence and nothing else, whether they want one more practice item on "Part A" or to move on to "Part B". Apply this silently; never mention this note.]');
  assert.ok(dir.startsWith(FIXED_SCRIPT_OFFER_CONTINUE_PREFIX));
  assert.equal(isFixedScriptContinueDirective(dir), true);
  assert.deepEqual(fixedScriptContinueDirective({ via: 'offer', plan: tr, from: 'part-a', next: 'part-b' }), { directive: dir, kind: 'offer' });
});
test('30D1: VTR wiring — continue instead of kill, scheduled at turn end, the continuation counts as spoken (pins)', () => {
  assert.ok(VTR.includes('heardSentences: turnNarrationRef.current.length - attemptNarrationStart,'));
  assert.ok(VTR.includes("if (toDecision === 'continue' && toNext) {"));
  assert.ok(VTR.includes("scheduleFixedScriptContinueRef.current(ocSeg, 'offer', fixedScriptContinueDirective({ via: 'offer', plan: ocPlan, from: ocSeg, next: ocNext }));"));
  assert.ok(VTR.includes("via === 'offer' ? 'fixed_script_offer_continue' :"));
  assert.ok(VTR.includes("onDebugEvent?.('fixed_script_offer_spoken', `\"${offerSeg}\" (continuation)`);"));
  // the offer continuation is scheduled before the no-ask check (which skips when a continuation is pending)
  assert.ok(VTR.indexOf("scheduleFixedScriptContinueRef.current(ocSeg, 'offer'") < VTR.indexOf("if (noaskSeg) scheduleFixedScriptContinueRef.current(noaskSeg, 'noask'"));
});

test('30 r1 I-3: offerReplantDue — made, unspoken, a student turn, not already carried ⇒ re-plant', () => {
  const r = (o: Partial<{ offerMade: boolean; offerSpoken: boolean; studentTurn: boolean; noteAlreadyCarried: boolean }>) =>
    offerReplantDue({ offerMade: true, offerSpoken: false, studentTurn: true, noteAlreadyCarried: false, ...o });
  assert.equal(r({}), true);
  assert.equal(r({ offerSpoken: true }), false);
  assert.equal(r({ offerMade: false }), false);
  assert.equal(r({ studentTurn: false }), false, 'a nudge / continuation turn');
  assert.equal(r({ noteAlreadyCarried: true }), false, 'the planted note is delivered on this turn already');
  assert.ok(VTR.includes("onDebugEvent?.('fixed_script_offer_replanted', `\"${orSeg}\"`);"));
  assert.ok(VTR.includes('runTranscript = `${orNote}\\n\\n${runTranscript}`;'));
  assert.ok(VTR.includes("if (!opts?.prefetchOnly) offerContinueSegRef.current = '';"));
});

// ── Task 30 fix round 4 R3-7a: no close before the part's required phrases ──
test('R3-7a: close_session_notes with required phrases unsaid is refused once; the second attempt is let through', () => {
  const sumSeg = { requiredPhrases: ['one thing you did well'] };
  const said = ['Present perfect for experience, like "I have worked here for five years."', 'Take a look at the summary card.'];
  const missing = missingRequiredPhrases(sumSeg, said);
  assert.deepEqual(missing, ['one thing you did well']);
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing, alreadyRefused: false }), 'refuse');
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing, alreadyRefused: true }), 'allow', 'second attempt let through');
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing: missingRequiredPhrases(sumSeg, [...said, 'Tell me one thing you did well today.']), alreadyRefused: false }), 'allow');
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing: missingRequiredPhrases({}, said), alreadyRefused: false }), 'allow', 'no required phrases');
  assert.ok(CLOSE_BEFORE_REQUIRED_PHRASES_REASON.startsWith("Give the summary's points and ask its question first; close only after the student has answered."));
  assert.ok(CLOSE_BEFORE_REQUIRED_PHRASES_REASON.endsWith('Apply this silently; never mention this note.'));
  assert.ok(VTR.includes("rejected.push({ action: 'close_before_required_phrases', reason: CLOSE_BEFORE_REQUIRED_PHRASES_REASON });"));
  assert.ok(VTR.includes("onDebugEvent?.('close_before_required_phrases',"));
});

// ── Task 30 fix round 5 S-2: no close refusal on a stop request, in the wrap, or near max_duration ──
test('S-2: the R3-7a refusal stands down for a stop request, the wrap phase and the last 90 s', () => {
  const missing = ['one thing you did well'];
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing, alreadyRefused: false }), 'refuse');
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing, alreadyRefused: false, studentStopRequest: true }), 'allow', 'stop request');
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing, alreadyRefused: false, wrapPhase: true }), 'allow', 'wrap phase');
  assert.equal(CLOSE_REFUSAL_EXEMPT_REMAINING_MS, 90_000);
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing, alreadyRefused: false, remainingMs: 90_000 }), 'allow', 'within 90 s');
  assert.equal(closeBeforeRequiredPhrasesDecision({ missing, alreadyRefused: false, remainingMs: 91_000 }), 'refuse');
  assert.ok(VTR.includes('studentStopRequest: studentEndSignalRef.current || !!lastStudentVerificationRef.current?.isSessionEndSignal,'));
  assert.ok(VTR.includes('remainingMs: maxDurationExplicit && cbStartedAt != null ? sessionMaxMinutes * 60000 - cbElapsedMs : undefined,'));
});
if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');

