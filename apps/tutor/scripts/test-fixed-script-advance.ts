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
  missingRequiredPhrases, scriptMissingAdvanceReason,
  segmentMaxTurns, needsLevelCaptureLead, LEVEL_CAPTURE_LEAD,
} from '../src/lib/tutor/lesson-plan/fixed-script';
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
  assert.equal(n, '[runtime note — not from the student] The "overview" part of the lesson is over and the lesson pointer has ALREADY moved to segment "topic-intro" (concept). If the student is mid-exchange, close it in one sentence, then teach "topic-intro" from its notes. Do not call advance_lesson for this move. Apply this silently; never mention this note.]');
});
test('level-advance note first sentence', () => {
  const n = fixedScriptAdvancedNote(fixedScriptLevelAdvanceLead('topic-intro', 'concept'), 'topic-intro');
  assert.ok(n.startsWith('[runtime note — not from the student] The level check is complete and the lesson pointer has ALREADY moved to segment "topic-intro" (concept). If the student'));
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
  const block = VTR.slice(auto, auto + 3000);
  pin(block, /applyResolvedAdvance\(autoPlan, segIdNow, autoNext\)/);
  pin(block, /pendingRuntimeNoteSegRef\.current = merged\.segId/);
  pin(block, /'fixed_script_auto_advance', `"\$\{segIdNow\}" → "\$\{autoNext\}" reason=\$\{autoReason\} turns=\$\{autoTurns\} elapsed=\$\{autoElapsedS\}s`/);
});
// ── fix round 10-11 ──────────────────────────────────────────────────────
test('A: auto-advance held while a pronunciation clip is armed', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  const block = VTR.slice(auto, auto + 3000);
  pin(block, /if \(autoNext && holdAutoAdvanceForPronunciation\(pronArmed, autoAdvancePronHeldRef\.current\)\) \{[\s\S]*?autoAdvancePronHeldRef\.current \+= 1;[\s\S]*?'fixed_script_auto_advance_held_pron'[\s\S]*?\} else if \(autoNext\) \{\s*autoAdvancePronHeldRef\.current = 0;/);
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
  pin(VTR, /if \(!autoReason\) autoAdvancePronHeldRef\.current = 0;/);
});
test('B: FACT notes are urgent (never held) and delivery is logged', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  pin(VTR.slice(auto, auto + 3000), /pendingRuntimeNoteUrgentRef\.current = true;/);
  const lv = VTR.indexOf("'working_level_set'");
  pin(VTR.slice(lv, lv + 2500), /pendingRuntimeNoteUrgentRef\.current = true;/);
  pin(VTR, /const deliver = urgentNote \|\| !openQuestionAtTurnStartRef\.current/);
  pin(VTR, /if \(urgentNote\) onDebugEvent\?\.\('fixed_script_note_delivered'/);
  // the overlong note itself stays holdable
  const ov = VTR.indexOf("'segment_overlong_note_planted'");
  pin(VTR.slice(ov - 2500, ov), /pendingRuntimeNoteUrgentRef\.current = false;/);
});
test('D: the turn counter + auto-advance run under the auto-advance flag alone', () => {
  pin(VTR, /if \(\(TUTOR_SEGMENT_OVERLONG_NOTE \|\| TUTOR_FIXED_SCRIPT_AUTO_ADVANCE\) && totalSentenceCount > 0\) \{/);
  pin(VTR, /if \(TUTOR_SEGMENT_OVERLONG_NOTE && !homeworkSession && !cur\.noted && cur\.turns >= overlongTurns/);
});
test('level-set advance wired in the setWorkingLevel handler with the double-advance guard', () => {
  const at = VTR.indexOf("'working_level_set'");
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
  pin(VTR, /needsLevelCaptureLead\(autoPlan, segIdNow, !!workingLevelRef\.current\) \? LEVEL_CAPTURE_LEAD : ''\) \+\s*fixedScriptAutoAdvanceLead\(/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
